import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";;
import clientCredentials from "../../credentials/client";
import dateTime from '../../helpers/_getDateTime'
export default async (req, res) => {

    const payload = await req.body;
    payload.dateTime = dateTime();
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };
    const db = firebase.app().firestore();
    const messagesCollection = db.collection("messages")
    await messagesCollection.doc().set(payload)
    return res.status(200).json(payload);
}