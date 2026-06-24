export default function MaintenancePage() {
  return (
    <div style={{
      margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      background: '#0a0a0a', display: 'flex', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', textAlign: 'center'
    }}>
      <div style={{ padding: '3rem 2rem', maxWidth: '480px' }}>
        <div style={{ fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '4px' }}>
          L<span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#00c97a', transform: 'rotate(45deg)', margin: '0 2px', verticalAlign: 'middle' }}></span>
          <span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#00c97a', transform: 'rotate(45deg)', margin: '0 2px', verticalAlign: 'middle' }}></span>TS
        </div>
        <div style={{ fontSize: '11px', color: '#444', letterSpacing: '5px', marginBottom: '2rem' }}>SPORTS</div>
        <div style={{ width: '50px', height: '2px', background: '#00c97a', margin: '0 auto 2rem', borderRadius: '2px' }}></div>
        <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#fff', marginBottom: '0.75rem' }}>We're upgrading your experience</h1>
        <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.7, marginBottom: '2rem' }}>
          Leets Sports is undergoing scheduled maintenance. We'll be back shortly — bigger and better than ever.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,201,122,0.1)', border: '1px solid rgba(0,201,122,0.25)', color: '#00c97a', fontSize: '13px', padding: '7px 18px', borderRadius: '100px' }}>
          <div style={{ width: '6px', height: '6px', background: '#00c97a', borderRadius: '50%' }}></div>
          Back soon
        </div>
      </div>
    </div>
  )
}
