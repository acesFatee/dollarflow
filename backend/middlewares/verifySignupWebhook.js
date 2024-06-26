require('dotenv').config();
const { Webhook } = require('svix');

function verifySignupWebhook(req, res, next) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'No Webhook secret provided' });
  }

  const headers = req.headers;
  const svix_id = headers['svix-id'];
  const svix_timestamp = headers['svix-timestamp'];
  const svix_signature = headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'No svix headers' });
  }

  const payload = req.body;
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event;

  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: 'Error verifying webhook' });
  }

  next();
}

module.exports = verifySignupWebhook;
