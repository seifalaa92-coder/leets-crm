const fs = require('fs');
const path = require('path');

function getBase64(relPath) {
  const full = path.resolve(__dirname, '..', relPath);
  const ext = path.extname(relPath).slice(1);
  const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'application/octet-stream';
  const data = fs.readFileSync(full).toString('base64');
  return `data:${mime};base64,${data}`;
}

const logoWhite = getBase64('public/leets-wordmark-white.png');
const logoDark = getBase64('public/leets-wordmark-dark.png');
const heroImg = getBase64('public/clubs/pyramids-park-view/hero-slides/slide-1.jpg');
const pyramidsPoster = getBase64('public/clubs/pyramids-park-view/poster.jpg');
const westmarkPoster = getBase64('public/clubs/westmark-mall/poster.jpg');
const padelAcePoster = getBase64('public/clubs/padel-ace/poster.jpg');
const kidsPromo = getBase64('public/images/kids-promo-2.webp');
const padelAction = getBase64('public/images/lifestyle/padel-action.webp');
const pilatesImg = getBase64('public/images/lifestyle/pilates-studio.webp');
const physioImg = getBase64('public/images/lifestyle/physio-recovery.webp');
const communityImg = getBase64('public/images/lifestyle/community-team.webp');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Leets Sports — Company Profile</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Tektur:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  @page {
    size: A4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: 'Tektur', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #F5F5F7;
    color: #111F35;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    max-height: 297mm;
    position: relative;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
    display: flex;
    flex-direction: column;
    background: #F5F5F7;
  }
  .page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* ── PAGE 1: COVER ── */
  .cover {
    background: radial-gradient(circle at 80% 20%, #1e3352 0%, #101D32 65%, #0B1321 100%);
    color: #FFFFFF;
    justify-content: space-between;
    padding: 24mm 22mm;
  }
  .cover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cover-badge {
    font-size: 8pt;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.18);
    padding: 6px 16px;
    border-radius: 9999px;
    color: #E2E8F0;
  }
  .cover-hero-img {
    width: 100%;
    height: 105mm;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    margin: 8mm 0;
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
  .cover-hero-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  .cover-title {
    font-size: 34pt;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -1.2px;
    margin-bottom: 5mm;
    color: #FFFFFF;
  }
  .cover-title em {
    font-style: normal;
    color: #8CA3C3;
  }
  .cover-sub {
    font-size: 11pt;
    color: #CBD5E1;
    line-height: 1.6;
    max-width: 145mm;
    font-weight: 400;
  }
  .cover-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid rgba(255,255,255,0.15);
    padding-top: 7mm;
    font-size: 8.5pt;
    color: #94A3B8;
    letter-spacing: 0.8px;
    font-weight: 500;
  }
  .cover-footer strong {
    color: #FFFFFF;
  }

  /* ── INNER PAGES ── */
  .inner-header {
    height: 20mm;
    padding: 7mm 22mm 0 22mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E7E8EC;
    background: #FAFAFC;
  }
  .inner-header-meta {
    font-size: 8pt;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #64748B;
  }
  .inner-content {
    flex: 1;
    padding: 11mm 22mm;
    display: flex;
    flex-direction: column;
  }
  .inner-footer {
    height: 15mm;
    padding: 0 22mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #E7E8EC;
    font-size: 8pt;
    color: #7B8797;
    background: #FAFAFC;
    font-weight: 500;
  }

  .section-tag {
    font-size: 8.5pt;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #172D4D;
    margin-bottom: 2mm;
    display: block;
  }
  .section-h1 {
    font-size: 25pt;
    font-weight: 700;
    line-height: 1.14;
    letter-spacing: -0.8px;
    color: #111F35;
    margin-bottom: 4mm;
  }
  .section-h1 em {
    font-style: normal;
    color: #61768D;
  }
  .lead-p {
    font-size: 10.5pt;
    line-height: 1.6;
    color: #556274;
    margin-bottom: 7mm;
  }

  /* Stat Strip */
  .stat-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4mm;
    background: #FFFFFF;
    border: 1px solid #E7E8EC;
    border-radius: 18px;
    padding: 5.5mm;
    margin-bottom: 7mm;
    box-shadow: 0 4px 12px rgba(17,31,53,0.03);
  }
  .stat-box {
    text-align: center;
    border-right: 1px solid #EAECEF;
  }
  .stat-box:last-child {
    border-right: none;
  }
  .stat-val {
    font-size: 22pt;
    font-weight: 700;
    color: #172D4D;
    line-height: 1.1;
  }
  .stat-lbl {
    font-size: 7.5pt;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #7B8797;
    margin-top: 1.5mm;
  }

  .card {
    background: #FFFFFF;
    border: 1px solid #E7E8EC;
    border-radius: 18px;
    padding: 6mm;
    box-shadow: 0 4px 14px rgba(17,31,53,0.03);
  }

  /* Grid Pillars */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5mm;
  }
  .pillar-card {
    background: #FFFFFF;
    border: 1px solid #E7E8EC;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(17,31,53,0.03);
  }
  .pillar-img {
    width: 100%;
    height: 38mm;
    overflow: hidden;
    position: relative;
  }
  .pillar-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .pillar-body {
    padding: 5mm;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .pillar-tag {
    font-size: 7pt;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: #172D4D;
  }
  .pillar-title {
    font-size: 11.5pt;
    font-weight: 700;
    color: #111F35;
    margin: 1.5mm 0 2mm 0;
    line-height: 1.25;
  }
  .pillar-desc {
    font-size: 8.5pt;
    line-height: 1.5;
    color: #556274;
  }

  /* Venues */
  .venue-main {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 5.5mm;
    margin-bottom: 6mm;
  }
  .venue-card-large {
    background: #FFFFFF;
    border: 1px solid #E7E8EC;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(17,31,53,0.04);
  }
  .venue-img-large {
    width: 100%;
    height: 52mm;
    overflow: hidden;
    position: relative;
  }
  .venue-img-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .venue-large-body {
    padding: 6mm;
  }
  .venue-stacked {
    display: flex;
    flex-direction: column;
    gap: 4.5mm;
  }
  .venue-item-small {
    background: #FFFFFF;
    border: 1px solid #E7E8EC;
    border-radius: 18px;
    padding: 4.5mm;
    display: flex;
    gap: 4mm;
    align-items: center;
    box-shadow: 0 4px 12px rgba(17,31,53,0.03);
  }
  .venue-thumb-small {
    width: 30mm;
    height: 26mm;
    border-radius: 12px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .venue-thumb-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .contact-box {
    background: radial-gradient(circle at 90% 10%, #254068 0%, #172D4D 70%, #101E33 100%);
    color: #FFFFFF;
    border-radius: 20px;
    padding: 8mm 11mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .contact-title {
    font-size: 16pt;
    font-weight: 700;
  }
  .contact-info {
    text-align: right;
    font-size: 9.5pt;
    line-height: 1.6;
    color: #D3DEEC;
  }
</style>
</head>
<body>

<!-- PAGE 1: COVER -->
<div class="page cover">
  <div class="cover-header">
    <img src="${logoWhite}" style="width: 116px; height: auto;" alt="Leets Sports">
    <span class="cover-badge">COMPANY PROFILE · 2026</span>
  </div>
  <div class="cover-hero-img">
    <img src="${heroImg}" alt="Pyramids Park View Padel">
  </div>
  <div>
    <h1 class="cover-title">Your complete world of<br><em>padel, clubs &amp; performance.</em></h1>
    <p class="cover-sub">From championship padel courts and high-performance gyms to boutique wellness spaces and certified academies. We build, manage, and operate it all end-to-end across Egypt and Saudi Arabia.</p>
  </div>
  <div class="cover-footer">
    <div><strong>LEETS SPORTS MANAGEMENT</strong><br>CAIRO, EGYPT · JEDDAH, KSA</div>
    <div style="text-align: right;">WWW.LEETSSPORTS.COM<br>INFO@LEETSSPORTS.COM</div>
  </div>
</div>

<!-- PAGE 2: EXECUTIVE SUMMARY & WHO WE ARE -->
<div class="page">
  <div class="inner-header">
    <img src="${logoDark}" style="width: 84px; height: auto;" alt="Leets Sports">
    <span class="inner-header-meta">01 · WHO WE ARE</span>
  </div>
  <div class="inner-content">
    <span class="section-tag">EXECUTIVE SUMMARY</span>
    <h1 class="section-h1">Pioneering sports management<br><em>with end-to-end mastery.</em></h1>
    <p class="lead-p">Leets Sports is a premier sports management and venue operations company. We conceptualize, build, program, and operate athletic destinations from the ground up — turning raw spaces into thriving commercial communities.</p>
    
    <div class="stat-strip">
      <div class="stat-box"><div class="stat-val">2019</div><div class="stat-lbl">Market Established</div></div>
      <div class="stat-box"><div class="stat-val">4</div><div class="stat-lbl">Venues Delivered</div></div>
      <div class="stat-box"><div class="stat-val">600+</div><div class="stat-lbl">Athletes Coached</div></div>
      <div class="stat-box"><div class="stat-val">2</div><div class="stat-lbl">Markets (Egypt &amp; KSA)</div></div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-bottom: 5mm;">
      <div class="card">
        <h3 style="font-size: 11pt; font-weight: 700; color: #172D4D; margin-bottom: 2mm;">END-TO-END VENUE DELIVERY</h3>
        <p style="font-size: 8.5pt; line-height: 1.6; color: #556274;">We handle master planning, architectural layout, precision court engineering, panoramic glass-turf installations, lighting rigs, locker rooms, pro-shops, and cafe lounges with turnkey excellence.</p>
      </div>
      <div class="card">
        <h3 style="font-size: 11pt; font-weight: 700; color: #172D4D; margin-bottom: 2mm;">COMMERCIAL OPERATIONS</h3>
        <p style="font-size: 8.5pt; line-height: 1.6; color: #556274;">Full operational management: automated booking platforms, certified international coaching programs, tournament leagues, high-retention membership clubs, and corporate activations.</p>
      </div>
    </div>

    <div style="height: 52mm; border-radius: 18px; overflow: hidden; border: 1px solid #E7E8EC; position: relative;">
      <img src="${communityImg}" style="width: 100%; height: 100%; object-fit: cover;" alt="Leets Community">
    </div>
  </div>
  <div class="inner-footer">
    <span>LEETS SPORTS · COMPANY PROFILE</span>
    <span>PAGE 02</span>
  </div>
</div>

<!-- PAGE 3: INTEGRATED DISCIPLINES -->
<div class="page">
  <div class="inner-header">
    <img src="${logoDark}" style="width: 84px; height: auto;" alt="Leets Sports">
    <span class="inner-header-meta">02 · INTEGRATED DISCIPLINES</span>
  </div>
  <div class="inner-content">
    <span class="section-tag">THE COMPLETE LIFESTYLE HUB</span>
    <h1 class="section-h1">Beyond standard courts:<br><em>A holistic sports ecosystem.</em></h1>
    <p class="lead-p">Leets sports facilities bring together performance racket sports, strength conditioning, motor skill development, and community recovery under one elevated brand standard.</p>
    
    <div class="pillars-grid">
      <div class="pillar-card">
        <div class="pillar-img"><img src="${padelAction}" alt="Padel Action"></div>
        <div class="pillar-body">
          <span class="pillar-tag">SIGNATURE SPORT</span>
          <h3 class="pillar-title">Championship Padel Courts</h3>
          <p class="pillar-desc">Panoramic tournament glass, WPT-certified coaching syllabi, match ratings, and social round-robins across all brackets.</p>
        </div>
      </div>
      <div class="pillar-card">
        <div class="pillar-img"><img src="${kidsPromo}" alt="Leets Kids Academy"></div>
        <div class="pillar-body">
          <span class="pillar-tag">YOUTH EXCELLENCE</span>
          <h3 class="pillar-title">Leets Kids Academy (Ages 5–13)</h3>
          <p class="pillar-desc">Small coaching cohorts (max 6 kids), specialized motor development, agility, and sportsmanship from accredited youth instructors.</p>
        </div>
      </div>
      <div class="pillar-card">
        <div class="pillar-img"><img src="${pilatesImg}" alt="Pilates Studio"></div>
        <div class="pillar-body">
          <span class="pillar-tag">STRENGTH &amp; TONE</span>
          <h3 class="pillar-title">Reformer Pilates &amp; Mobility Studio</h3>
          <p class="pillar-desc">State-of-the-art reformer studio engineered for core stabilization, rotational power, posture alignment, and injury mitigation.</p>
        </div>
      </div>
      <div class="pillar-card">
        <div class="pillar-img"><img src="${physioImg}" alt="Sports Physio"></div>
        <div class="pillar-body">
          <span class="pillar-tag">RECOVERY LAB</span>
          <h3 class="pillar-title">Sports Physio &amp; Cold Immersion</h3>
          <p class="pillar-desc">Specialized athletic physiotherapy, targeted soft-tissue release, ice baths, and guided recovery protocols keeping players game-ready.</p>
        </div>
      </div>
    </div>
  </div>
  <div class="inner-footer">
    <span>LEETS SPORTS · COMPANY PROFILE</span>
    <span>PAGE 03</span>
  </div>
</div>

<!-- PAGE 4: PORTFOLIO & TRACK RECORD -->
<div class="page">
  <div class="inner-header">
    <img src="${logoDark}" style="width: 84px; height: auto;" alt="Leets Sports">
    <span class="inner-header-meta">03 · VENUES &amp; TRACK RECORD</span>
  </div>
  <div class="inner-content">
    <span class="section-tag">DELIVERED FOOTPRINT</span>
    <h1 class="section-h1">Proven destinations,<br><em>built and managed by Leets.</em></h1>
    <p class="lead-p">Our track record spans flagship owner-operated clubs to commercial mall integrations and high-volume suburban sports centers across Cairo and Jeddah.</p>
    
    <div class="venue-main">
      <div class="venue-card-large">
        <div class="venue-img-large"><img src="${pyramidsPoster}" alt="Pyramids Park View"></div>
        <div class="venue-large-body">
          <span style="font-size: 7.5pt; font-weight: 600; color: #172D4D; text-transform: uppercase;">FLAGSHIP VENUE · SHEIKH ZAYED</span>
          <h3 style="font-size: 13pt; font-weight: 700; color: #111F35; margin: 1mm 0 2mm 0;">Pyramids Park View</h3>
          <p style="font-size: 8.5pt; color: #556274; line-height: 1.55;">Owned and operated end-to-end by Leets Sports. A landmark destination featuring premium courts, club swimming pool, gym facilities, and home of our junior academy.</p>
        </div>
      </div>
      <div class="venue-stacked">
        <div class="venue-item-small">
          <div class="venue-thumb-small"><img src="${westmarkPoster}" alt="Westmark Mall Club"></div>
          <div>
            <span style="font-size: 7pt; font-weight: 600; color: #172D4D; text-transform: uppercase;">DELIVERED · SHEIKH ZAYED</span>
            <h4 style="font-size: 10.5pt; font-weight: 700; color: #111F35;">Westmark Mall Club</h4>
            <p style="font-size: 7.5pt; color: #556274; line-height: 1.4; margin-top: 1mm;">Seamless commercial integration transforming retail footprint into an active padel hub.</p>
          </div>
        </div>
        <div class="venue-item-small">
          <div class="venue-thumb-small"><img src="${padelAcePoster}" alt="Padel Ace Club"></div>
          <div>
            <span style="font-size: 7pt; font-weight: 600; color: #172D4D; text-transform: uppercase;">DELIVERED · NEW CAIRO</span>
            <h4 style="font-size: 10.5pt; font-weight: 700; color: #111F35;">Padel Ace Club</h4>
            <p style="font-size: 7.5pt; color: #556274; line-height: 1.4; margin-top: 1mm;">East Cairo daily operations, player development pathways, and competitive leagues.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-box">
      <div>
        <h3 class="contact-title">Partner with Leets Sports</h3>
        <p style="font-size: 8.5pt; color: #D3DEEC; margin-top: 1.5mm;">Let us design, build, or operate your next sports venue.</p>
      </div>
      <div class="contact-info">
        <strong>EGYPT &amp; SAUDI ARABIA</strong><br>
        Email: info@leetssports.com<br>
        Web: www.leetssports.com
      </div>
    </div>
  </div>
  <div class="inner-footer">
    <span>LEETS SPORTS · COMPANY PROFILE</span>
    <span>PAGE 04</span>
  </div>
</div>

</body>
</html>
`;

fs.writeFileSync(path.resolve(__dirname, '..', 'public/company-profile.html'), html);
console.log('Successfully written public/company-profile.html');
