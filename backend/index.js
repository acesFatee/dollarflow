const express = require("express")
const app = express();
const PORT = 5000;

app.post('/test-webhook', async (req, res) => {
    console.log(req.body)
    return res.status(201).json({success: "ok"})
})

app.listen(PORT, () => {
    console.log("App is up on port "+PORT)
})