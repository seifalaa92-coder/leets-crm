import { NextResponse } from 'next/server'

export function middleware(request) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Leets Sports — Back Soon</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;background:#0a0a0a;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center}.logo{font-size:36px;font-weight:800;color:#fff;letter-spacing:4px}.d{display:inline-block;width:10px;height:10px;background:#00c97a;transform:rotate(45deg);margin:0 2px;vertical-align:middle}.sub{font-size:11px;color:#444;letter-spacing:5px;margin-bottom:2rem}.line{width:50px;height:2px;background:#00c97a;margin:1rem auto 2rem;border-radius:2px}h1{font-size:22px;font-weight:500;color:#fff;margin-bottom:.75rem}p{font-size:15px;color:#666;line-height:1.7;margin-bottom:2rem;max-width:400px}.badge{display:inline-flex;align-items:center;gap:8px;background:rgba(0,201,122,.1);border:1px solid rgba(0,201,122,.25);color:#00c97a;font-size:13px;padding:7px 18px;border-radius:100px}.dot{width:6px;height:6px;background:#00c97a;border-radius:50%;animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}</style>
</head><body><div><div class="logo">L<span class="d"></span><span class="d"></span>TS</div>
<div class="sub">SPORTS</div><div class="line"></div>
<h1>We're upgrading your experience</h1>
<p>Leets Sports is undergoing scheduled maintenance.<br>We'll be back shortly — bigger and better than ever.</p>
<div class="badge"><div class="dot"></div>Back soon</div></div></body></html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  })
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|public).*)'],
}

