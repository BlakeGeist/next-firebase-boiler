import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";;
import clientCredentials from "../../credentials/client";

export default async (req, res) => {
    const req2 = await req;

    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };
    const db = firebase.app().firestore();
    const productsCollection = db.collection("products").doc(await req2.body.slug)
    const productsResponse = await productsCollection.get()
    const product = productsResponse.data();
    return res.status(200).json(product);
}