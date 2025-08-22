// Netlify Function: send-otp
// Sends an SMS using Twilio REST API. Expects JSON body: { phone, message }
// Required environment variables (set in Netlify site settings):
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER

exports.handler = async (event) => {
  try {
  console.log('send-otp invoked', { method: event.httpMethod });
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
    }

    const body = event.body ? JSON.parse(event.body) : {};
  console.log('request body:', body);
    const { phone, message } = body;

    if (!phone || !message) {
      return { statusCode: 400, body: JSON.stringify({ success: false, message: 'phone and message required' }) };
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    // Log presence of env vars (do not log secret values)
    console.log('env presence', {
      hasAccountSid: !!accountSid,
      hasAuthToken: !!authToken,
      hasFromNumber: !!fromNumber
    });

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('Twilio not configured - missing env vars');
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

    let data;
    try {
      data = await resp.json();
    } catch (e) {
      data = await resp.text().catch(() => null);
    }

    console.log('twilio response', { status: resp.status, ok: resp.ok, data });

    // Return Twilio response body and status for debugging. Remove this in production.
    return { statusCode: resp.status >= 200 && resp.status < 600 ? resp.status : 502, body: JSON.stringify({ success: resp.ok, status: resp.status, data }) };
  } catch (err) {
    console.error('send-otp handler error', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: err.message || 'Internal error' }) };
  }
};
