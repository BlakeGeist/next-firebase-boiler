const admin = require("firebase-admin");

export default async (req, res) => {
    if(!admin.apps.length)
        admin.initializeApp({
            credential: admin.credential.cert(require("../../credentials/server"))
        });
    const req2 = await req;
    if (!req2.body.token) return res.json({ status: 400 });
    const { token } = req2.body;
    admin
        .auth()
        .verifyIdToken(token)
        .then(user => {
            return res.status(200).json({ user });
        })
        .catch(error => {
            res.json({ error: error });
        });
};