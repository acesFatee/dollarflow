const crypto = require('crypto')
require('dotenv').config()

function verifyWebhook (req, res, next){
    const signature = req.headers['clerk-signature'];
    const payload = JSON.stringify(req.body);
    const expectedSignature = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    if (signature !== expectedSignature) {
        return res.status(400).send('Invalid signature');
    }else{
        next();
    }
}

module.exports = verifyWebhook;