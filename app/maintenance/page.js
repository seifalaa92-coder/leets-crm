app/maintenance/page.js
export default function MaintenancePage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        .container { text-align: center; padding: 3rem 2rem; max-width: 480px; }
        .logo { font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: 4px; margin-bottom: 4px; }
        .logo-sub { font-size: 11px; color: #444; letter-spacing: 5px; margin-bottom: 2rem; }
        .diamond { display: inline-block; width: 10px; height: 10px; background: #00c97a; transform: rotate(45deg); margin: 0 2px; vertical-align: middle; }
        .divider { width: 50px; height: 2px; background: #00c97a; margin: 0 auto 2rem; border-radius: 2px; }
        .headline { font-size: 22px; font-weight: 500; color: #ffffff; margin-bottom: 0.75rem; }
        .subtext { font-size: 15px; color: #666; line-height: 1.7; margin-bottom: 2rem; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,201,122,0.1); border: 1px solid rgba(0,201,122,0.25); color: #00c97a; font-size: 13px; padding: 7px 18px; border-radius: 100px; margin-bottom: 2.5rem; }
        .dot { width: 6px; height: 6px; background: #00c97a; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .social { display: flex; gap: 20px; justify-content: center; }
        .social a { font-size: 11px; color: #444; text-decoration: none; letter-spacing: 2px; transition: color 0.2s; }
        .social a:hover { color: #00c97a; }
        .sep { color: #222; }
      `}</style>
      <div className="container">
        <div className="logo">L<span className="diamond"></span><span className="diamond"></span>TS</div>
        <div className="logo-sub">SPORTS</div>
        <div className="divider"></div>
        <h1 className="headline">We're upgrading your experience</h1>
        <p className="subtext">Leets Sports is undergoing scheduled maintenance. We'll be back shortly — bigger and better than ever.</p>
        <div className="badge"><div className="dot"></div>Back soon</div>
        <div className="social">
          <a href="https://www.instagram.com/leetssports" target="_blank">INSTAGRAM</a>
          <span className="sep">·</span>
          <a href="https://www.snapchat.com/add/leetssports" target="_blank">SNAPCHAT</a>
          <span className="sep">·</span>
          <a href="https://wa.me/966" target="_blank">WHATSAPP</a>
        </div>
      </div>
    </>
  )
}
