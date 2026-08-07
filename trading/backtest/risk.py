"""
Position sizing, correlation-bucket caps and drawdown governors.

Implements 03-RISK.md. This module does more to determine the outcome than the
signal module does -- most retail account failures are sizing failures.
"""

from __future__ import annotations

from dataclasses import dataclass, field


# Which correlation bucket each symbol belongs to. Six USD pairs is one dollar
# bet in six costumes; the caps below are what stop that from becoming 3x the
# intended risk. Base symbol names -- suffixes are stripped before lookup.
BUCKETS: dict[str, str] = {
    "EURUSD": "usd", "GBPUSD": "usd", "AUDUSD": "usd",
    "NZDUSD": "usd", "USDCHF": "usd", "USDCAD": "usd", "USDJPY": "usd",
    "XAUUSD": "metals", "XAGUSD": "metals",
    "US500": "equity", "USTEC": "equity", "DE40": "equity", "UK100": "equity",
}

# Sign of each symbol's exposure to a *stronger dollar*, used to net offsetting
# positions (long EURUSD and long USDCHF are approximately the same bet).
USD_QUOTE_SIGN: dict[str, int] = {
    "EURUSD": -1, "GBPUSD": -1, "AUDUSD": -1, "NZDUSD": -1,
    "USDCHF": +1, "USDCAD": +1, "USDJPY": +1,
}


@dataclass
class RiskParams:
    risk_per_trade: float = 0.005        # 0.5% of equity per trade
    bucket_caps: dict[str, float] = field(
        default_factory=lambda: {"usd": 0.015, "metals": 0.010, "equity": 0.010}
    )
    total_cap: float = 0.030             # 3% aggregate open risk

    # Drawdown governors (fractions of peak equity)
    dd_halve_risk: float = 0.05
    dd_stop_trading: float = 0.10
    daily_loss_limit: float = 0.03

    # Portfolio volatility targeting
    target_vol: float = 0.10             # 10% annualised
    vol_scalar_min: float = 0.5
    vol_scalar_max: float = 1.5


def base_symbol(symbol: str) -> str:
    """
    Strip an Exness account-type suffix ('EURUSDm' -> 'EURUSD').

    Kept deliberately simple: uppercase the name and take the longest known base
    that it starts with, so we never mangle a symbol we don't recognise.
    """
    s = symbol.upper()
    for known in sorted(BUCKETS, key=len, reverse=True):
        if s.startswith(known):
            return known
    return s


def bucket_of(symbol: str) -> str:
    return BUCKETS.get(base_symbol(symbol), "other")


def position_size(
    equity: float,
    risk_per_trade: float,
    stop_distance: float,
    point_value: float,
    volume_min: float = 0.01,
    volume_max: float = 100.0,
    volume_step: float = 0.01,
    vol_scalar: float = 1.0,
) -> float:
    """
    Risk-based lot sizing.

    stop_distance : distance to stop in price units
    point_value   : account-currency P&L per 1.0 lot per 1.0 of price movement

    Returns 0.0 when the correctly-sized position is below the broker minimum.
    Rounding *up* to volume_min in that case would silently overshoot risk on
    exactly the volatile instruments where it hurts most, so we skip instead.
    """
    if stop_distance <= 0 or point_value <= 0 or equity <= 0:
        return 0.0

    risk_amount = equity * risk_per_trade * vol_scalar
    raw_lots = risk_amount / (stop_distance * point_value)

    # Round DOWN to the volume step -- never up.
    steps = int(raw_lots / volume_step)
    lots = steps * volume_step

    if lots < volume_min:
        return 0.0
    return min(lots, volume_max)


def min_equity_for(
    stop_distance: float,
    point_value: float,
    risk_per_trade: float,
    volume_min: float = 0.01,
) -> float:
    """
    Smallest equity at which one minimum-size lot still fits the risk budget.

    Below this, every signal on the symbol is correctly skipped -- the symbol is
    simply unaffordable, and the account is not diversified the way the trader
    thinks it is. Worth checking before a backtest rather than discovering it in
    a rejection tally.
    """
    if risk_per_trade <= 0:
        return float("inf")
    return (stop_distance * point_value * volume_min) / risk_per_trade


def net_bucket_risk(open_risk: dict[str, tuple[str, int, float]], bucket: str) -> float:
    """
    Aggregate risk for one bucket, netting offsetting directional exposure.

    open_risk maps symbol -> (bucket, direction, risk_fraction).

    For the USD bucket we net by dollar-direction so that a genuinely hedged pair
    (long EURUSD + long USDCHF) isn't wrongly counted as double exposure. Other
    buckets are summed gross, which is the conservative choice.
    """
    entries = [(sym, d, r) for sym, (b, d, r) in open_risk.items() if b == bucket]
    if not entries:
        return 0.0

    if bucket == "usd":
        net = 0.0
        for sym, direction, risk in entries:
            sign = USD_QUOTE_SIGN.get(base_symbol(sym), -1)
            # direction * sign = +1 when the position is long the dollar
            net += direction * sign * risk
        return abs(net)

    return sum(r for _, _, r in entries)


def can_open(
    symbol: str,
    direction: int,
    new_risk: float,
    open_risk: dict[str, tuple[str, int, float]],
    rp: RiskParams,
) -> tuple[bool, str]:
    """
    Check bucket and total caps before opening. Returns (allowed, reason).

    On breach we skip the new trade rather than shrinking existing positions --
    resizing open trades in response to unrelated signals makes exit behaviour a
    function of the whole portfolio and is very hard to debug.
    """
    bucket = bucket_of(symbol)

    total = sum(r for _, _, r in open_risk.values()) + new_risk
    if total > rp.total_cap:
        return False, f"total cap: {total:.3%} > {rp.total_cap:.3%}"

    prospective = dict(open_risk)
    prospective[symbol] = (bucket, direction, new_risk)
    cap = rp.bucket_caps.get(bucket, rp.total_cap)
    bucket_risk = net_bucket_risk(prospective, bucket)
    if bucket_risk > cap:
        return False, f"bucket '{bucket}' cap: {bucket_risk:.3%} > {cap:.3%}"

    return True, "ok"


@dataclass
class DrawdownGovernor:
    """
    Mechanical, no-discretion drawdown control (03-RISK.md section 3).

    Deliberately has no override: at -10% every instinct says size up to recover
    faster, and that instinct is what turns a recoverable drawdown into a
    terminal one.
    """

    peak_equity: float = 0.0
    trading_halted: bool = False
    risk_multiplier: float = 1.0
    day_start_equity: float = 0.0
    day_halted: bool = False

    def start_day(self, equity: float) -> None:
        self.day_start_equity = equity
        self.day_halted = False

    def update(self, equity: float) -> None:
        self.peak_equity = max(self.peak_equity, equity)
        if self.peak_equity <= 0:
            return

        dd = 1.0 - equity / self.peak_equity

        if dd >= 0.10:
            self.trading_halted = True
            self.risk_multiplier = 0.0
        elif dd >= 0.05:
            self.risk_multiplier = 0.5
        elif equity >= self.peak_equity:
            # Restore full risk only on a new peak, never on a partial bounce.
            self.risk_multiplier = 1.0

        if self.day_start_equity > 0:
            day_loss = 1.0 - equity / self.day_start_equity
            if day_loss >= 0.03:
                self.day_halted = True

    @property
    def can_trade(self) -> bool:
        return not self.trading_halted and not self.day_halted
