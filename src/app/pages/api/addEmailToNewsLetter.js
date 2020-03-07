const admin = require("firebase-admin");
export default async (req, res) => {
    if(!admin.apps.length)
        admin.initializeApp({
            credential: admin.credential.cert(require("../../credentials/server"))
        });
    const req2 = await req;
    if (!req2.body.email) return res.json({ status: 400 });
    const { email } = req2.body;
    const db = admin.firestore();
    const stringsCollection = db.collection("newsLetterEmails");
    await stringsCollection.doc(email).set({ email })
        .then(()=>{
            return res.status(200).json({ message: `You added ${email} to the newsletter list` });
        })
        .catch((e)=>{
            res.json({ error: e });
        });     
};