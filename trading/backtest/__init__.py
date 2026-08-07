"""Research harness for the Donchian trend strategy (see ../02-STRATEGY.md)."""

from .data import load_mt5_csv, load_universe, synthetic_ohlc
from .engine import BacktestResult, CostModel, Trade, run_backtest
from .metrics import Metrics, compute_metrics, regime_breakdown, walk_forward
from .risk import DrawdownGovernor, RiskParams, can_open, position_size
from .strategy import Position, StrategyParams, compute_indicators, entry_signal

__all__ = [
    "BacktestResult", "CostModel", "DrawdownGovernor", "Metrics", "Position",
    "RiskParams", "StrategyParams", "Trade", "can_open", "compute_indicators",
    "compute_metrics", "entry_signal", "load_mt5_csv", "load_universe",
    "position_size", "regime_breakdown", "run_backtest", "synthetic_ohlc",
    "walk_forward",
]
