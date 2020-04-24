import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";;
import clientCredentials from "../../credentials/client";
import dateTime from '../helpers/getDateTime'
import slugify from '../helpers/slugify'

export default async (req, res) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };

    const payload = await req.body;
    const slug = slugify(payload.name);
    const db = firebase.app().firestore();
    const blogCategoriesCollection = db.collection("blogCategories")
    payload.dateTime = dateTime();
    payload.slug = slug;
    await blogCategoriesCollection.doc(slug).set(payload)
    return res.status(200).json(payload);
}