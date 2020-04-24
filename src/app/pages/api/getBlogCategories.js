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
    const blogCategoriesCollection = db.collection("blogCategories")
    const categoriesResponse = await blogCategoriesCollection.get()
    const categories = categoriesResponse.docs.map(d => {
        return {
            [d.id]: d.data()
        };
    });
    console.log(categories)
    return res.status(200).json(categories);
}