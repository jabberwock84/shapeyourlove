export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name1, name2, jewelry_type, material, price, email, paypal_order_id,
          shipping_name, shipping_address1, shipping_address2, shipping_city, shipping_postal, shipping_country } = req.body;

  const RESEND_KEY = 're_78R4rzBd_EA9fE9Qgjurp3HKahSMKKA8i';
  const ARTIST_EMAIL = 'madtparty@gmail.com';
  const FROM = 'Shape of Your Love <hello@shapeofyourlove.com>';

  const shippingBlock = `
    <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
      <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;vertical-align:top;">Ship to</td>
      <td style="padding:.6rem 0;text-align:right;font-size:.85rem;line-height:1.7;">
        ${shipping_name}<br>
        ${shipping_address1}${shipping_address2 ? '<br>' + shipping_address2 : ''}<br>
        ${shipping_city}${shipping_postal ? ' ' + shipping_postal : ''}<br>
        ${shipping_country}
      </td>
    </tr>`;

  try {
    // 1. Notify artist
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: ARTIST_EMAIL,
        subject: `✦ New order — ${name1} & ${name2}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:2rem;background:#F7F3EE;color:#1C1A17;">
            <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A8895A;margin-bottom:1.5rem;">New Order Received</div>
            <h1 style="font-size:2rem;font-weight:300;margin:0 0 1.5rem;line-height:1.2;">${name1} <span style="color:#A8895A;">&</span> ${name2}</h1>
            <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Names</td>
                <td style="padding:.6rem 0;text-align:right;">${name1} & ${name2}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Jewelry type</td>
                <td style="padding:.6rem 0;text-align:right;">${jewelry_type}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Material</td>
                <td style="padding:.6rem 0;text-align:right;">${material}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Amount paid</td>
                <td style="padding:.6rem 0;text-align:right;font-size:1.2rem;color:#A8895A;">$${price}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Customer email</td>
                <td style="padding:.6rem 0;text-align:right;color:#3A5A8B;">${email}</td>
              </tr>
              ${shippingBlock}
              <tr>
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">PayPal ID</td>
                <td style="padding:.6rem 0;text-align:right;font-size:.75rem;opacity:.5;">${paypal_order_id}</td>
              </tr>
            </table>
            <a href="https://shapeofyourlove.com/dashboard.html" style="display:inline-block;background:#1C1A17;color:#F7F3EE;text-decoration:none;padding:.9rem 2rem;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;">View in Dashboard →</a>
            <p style="margin-top:2rem;font-family:Arial,sans-serif;font-size:11px;color:#4A4540;opacity:.6;">Shape of Your Love · shapeofyourlove.com</p>
          </div>`
      })
    });

    // 2. Confirm to customer
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: email,
        subject: `Your order is placed — ${name1} & ${name2}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:2rem;background:#F7F3EE;color:#1C1A17;">
            <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A8895A;margin-bottom:1.5rem;">Shape of Your Love</div>
            <h1 style="font-size:2rem;font-weight:300;margin:0 0 .5rem;line-height:1.2;">Your order<br>is <em style="color:#A8895A;">placed.</em></h1>
            <p style="font-family:Arial,sans-serif;font-size:.85rem;color:#4A4540;line-height:1.8;margin:1.5rem 0;">Thank you. We've received your order for <strong>${name1} & ${name2}</strong> and our artist is already thinking about your shape.</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:1.5rem;">
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Names</td>
                <td style="padding:.6rem 0;text-align:right;">${name1} & ${name2}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Jewelry type</td>
                <td style="padding:.6rem 0;text-align:right;">${jewelry_type}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Material</td>
                <td style="padding:.6rem 0;text-align:right;">${material}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;">Total paid</td>
                <td style="padding:.6rem 0;text-align:right;color:#A8895A;">$${price}</td>
              </tr>
              <tr>
                <td style="padding:.6rem 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#4A4540;vertical-align:top;">Shipping to</td>
                <td style="padding:.6rem 0;text-align:right;font-size:.85rem;line-height:1.7;">
                  ${shipping_name}<br>
                  ${shipping_address1}${shipping_address2 ? '<br>' + shipping_address2 : ''}<br>
                  ${shipping_city}${shipping_postal ? ' ' + shipping_postal : ''}<br>
                  ${shipping_country}
                </td>
              </tr>
            </table>
            <div style="background:#EDE6DB;padding:1.5rem;margin-bottom:1.5rem;border-left:3px solid #A8895A;">
              <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A8895A;margin-bottom:1rem;">What happens next</div>
              <table style="width:100%;border-collapse:collapse;">
                <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                  <td style="padding:.5rem 0;font-family:Georgia,serif;color:#A8895A;font-size:1rem;width:4rem;vertical-align:top;">Now</td>
                  <td style="padding:.5rem 0;font-family:Arial,sans-serif;font-size:.8rem;color:#4A4540;line-height:1.6;">Order confirmed. Your names are with our artist.</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                  <td style="padding:.5rem 0;font-family:Georgia,serif;color:#A8895A;font-size:1rem;vertical-align:top;">Day 3–5</td>
                  <td style="padding:.5rem 0;font-family:Arial,sans-serif;font-size:.8rem;color:#4A4540;line-height:1.6;">We email you three hand-drawn shape variations. You choose your favourite.</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(28,26,23,0.12);">
                  <td style="padding:.5rem 0;font-family:Georgia,serif;color:#A8895A;font-size:1rem;vertical-align:top;">Day 5–7</td>
                  <td style="padding:.5rem 0;font-family:Arial,sans-serif;font-size:.8rem;color:#4A4540;line-height:1.6;">Your shape is cast in ${material.toLowerCase()} and polished by hand.</td>
                </tr>
                <tr>
                  <td style="padding:.5rem 0;font-family:Georgia,serif;color:#A8895A;font-size:1rem;vertical-align:top;">Day 7</td>
                  <td style="padding:.5rem 0;font-family:Arial,sans-serif;font-size:.8rem;color:#4A4540;line-height:1.6;">Your piece ships to ${shipping_city}, ${shipping_country}. Tracking details sent to this email.</td>
                </tr>
              </table>
            </div>
            <p style="font-family:Arial,sans-serif;font-size:.8rem;color:#4A4540;line-height:1.8;">Questions? Reply to this email and we'll get back to you.</p>
            <p style="margin-top:2rem;font-family:Arial,sans-serif;font-size:11px;color:#4A4540;opacity:.6;">Shape of Your Love · shapeofyourlove.com</p>
          </div>`
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Email send failed' });
  }
}
