export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name1, name2, jewelry_type, material, email, variation, shape_url } = req.body;

  const RESEND_KEY = 're_78R4rzBd_EA9fE9Qgjurp3HKahSMKKA8i';
  const ARTIST_EMAIL = 'madtparty@gmail.com';
  const FROM = 'Shape of Your Love <hello@shapeofyourlove.com>';

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: ARTIST_EMAIL,
        subject: `✦ Shape chosen — ${name1} & ${name2} picked Variation ${variation}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:2rem;background:#F7F3EE;color:#1C1A17;">
            <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A8895A;margin-bottom:1.5rem;">Shape Selected — Ready to Cast</div>
            <h1 style="font-size:2rem;font-weight:300;margin:0 0 .5rem;line-height:1.2;">${name1} <span style="color:#A8895A;">&</span> ${name2}</h1>
            <p style="font-family:Arial,sans-serif;font-size:.9rem;color:#4A4540;margin:0 0 1.5rem;">chose <strong>Variation ${variation}</strong></p>
            ${shape_url ? `<img src="${shape_url}" style="width:100%;max-width:300px;display:block;margin:0 auto 1.5rem;border:1px solid rgba(28,26,23,0.12);padding:1rem;background:white;" alt="Chosen shape"/>` : ''}
            <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Jewelry type</td>
                <td style="padding:.6rem 0;text-align:right;">${jewelry_type}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Material</td>
                <td style="padding:.6rem 0;text-align:right;">${material}</td>
              </tr>
              <tr>
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Customer</td>
                <td style="padding:.6rem 0;text-align:right;color:#3A5A8B;">${email}</td>
              </tr>
            </table>
            <div style="background:#D4EDDA;border-left:3px solid #4A7C59;padding:1rem 1.25rem;margin-bottom:1.5rem;">
              <p style="font-family:Arial,sans-serif;font-size:.82rem;color:#155724;margin:0;">Time to cast. The customer is waiting.</p>
            </div>
            <a href="https://shapeofyourlove.com/dashboard.html" style="display:inline-block;background:#1C1A17;color:#F7F3EE;text-decoration:none;padding:.9rem 2rem;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">View in Dashboard →</a>
            <p style="margin-top:2rem;font-family:Arial,sans-serif;font-size:11px;color:#4A4540;opacity:.6;">Shape of Your Love · shapeofyourlove.com</p>
          </div>
        `
      })
    });

    // Also email customer confirming their choice
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: email,
        subject: `Your shape is confirmed — ${name1} & ${name2}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:2rem;background:#F7F3EE;color:#1C1A17;">
            <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A8895A;margin-bottom:1.5rem;">Shape of Your Love</div>
            <h1 style="font-size:2rem;font-weight:300;margin:0 0 .5rem;line-height:1.2;">Beautiful choice.<br><em style="color:#A8895A;">We're on it.</em></h1>
            <p style="font-family:Arial,sans-serif;font-size:.85rem;color:#4A4540;line-height:1.8;margin:1.5rem 0;">You've chosen <strong>Variation ${variation}</strong> for <strong>${name1} & ${name2}</strong>. We're now beginning the casting process.</p>
            ${shape_url ? `<img src="${shape_url}" style="width:100%;max-width:280px;display:block;margin:0 auto 1.5rem;border:1px solid rgba(28,26,23,0.12);padding:1rem;background:white;" alt="Your chosen shape"/>` : ''}
            <div style="background:#EDE6DB;padding:1.5rem;margin-bottom:1.5rem;border-left:3px solid #A8895A;">
              <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A8895A;margin-bottom:.75rem;">What happens next</div>
              <p style="font-family:Arial,sans-serif;font-size:.82rem;color:#4A4540;line-height:1.7;margin:0;">Your chosen shape is now being cast in <strong>${material}</strong> using the lost-wax method and polished by hand. We'll email you with tracking details when it ships — usually within 2–3 days.</p>
            </div>
            <p style="font-family:Arial,sans-serif;font-size:.8rem;color:#4A4540;line-height:1.8;">Questions? Reply to this email and we'll get back to you.</p>
            <p style="margin-top:2rem;font-family:Arial,sans-serif;font-size:11px;color:#4A4540;opacity:.6;">Shape of Your Love · shapeofyourlove.com</p>
          </div>`
      })
    });

    return res.status(200).json({ success: true });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'Email failed' });
  }
}
