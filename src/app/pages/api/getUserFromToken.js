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
        .then(async user => {
            const db = admin.firestore()
            const userDataCollection = db.collection('userData')
            userDataCollection.doc(user.uid).get()
                .then(doc => {
                    const userData = {...user, ...doc.data()}
                    return res.status(200).json({ user: userData });
                })
        })
        .catch(error => {
            res.json({ error: error });
        });
};