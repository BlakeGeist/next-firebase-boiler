import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import clientCredentials from "../credentials/client";

export default async (ctx) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };
    const db = firebase.app().firestore();
    const usersRef2 = db.collection("strings").doc("global");
    await usersRef2.get()
        .then(async (docSnapshot) => {
            if (docSnapshot.exists) {
                let strings = db.collection("strings").doc("global").collection("strings");
                await strings.get()
                    .then(snap =>{
                        strings = snap.docs.map(d => {
                            return {
                                [d.id]: d.data()
                            };
                        });
                        const objectizedStrings = Object.assign({}, ...strings);
                        ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "strings", payload:  objectizedStrings});
                    })
                    .catch(e => {
                    });
            } else {
            }
        });    
};
