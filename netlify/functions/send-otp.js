// Netlify Function: send-otp
// Sends an SMS using Twilio REST API. Expects JSON body: { phone, message }
// Required environment variables (set in Netlify site settings):
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const { phone, message } = body;

    if (!phone || !message) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'phone and message required' }) };
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Twilio not configured' }) };
    }

    // Normalize phone to E.164-like format (very basic)
    let clean = String(phone).replace(/\D/g, '');
    if (clean.length === 10) {
      // assume Indian numbers if 10 digits
      clean = '+91' + clean;
    } else if (!clean.startsWith('+')) {
      clean = '+' + clean;
    }

    const params = new URLSearchParams();
    params.append('To', clean);
    params.append('From', fromNumber);
    params.append('Body', message);

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(accountSid + ':' + authToken).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await resp.json();

    if (resp.ok) {
      return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
    }

    return { statusCode: 502, body: JSON.stringify({ success: false, message: 'Twilio API error', data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: err.message || 'Internal error' }) };
  }
};
