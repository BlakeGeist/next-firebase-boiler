import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import clientCredentials from "../credentials/client";

export default async (ctx) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(clientCredentials);
    };
    const db = firebase.app().firestore();
    const pathWithoutLang = ctx.asPath.replace(`/${ctx.query.lang}/`, "").replace("/","-");
    const usersRef = db.collection("strings").doc("global");
    await usersRef.get()
      .then(async (docSnapshot) => {
            if (docSnapshot.exists) {
            let pageStrings = db.collection("strings").doc(pathWithoutLang).collection("strings");
            await pageStrings.get()
                .then(snap =>{
                    pageStrings = snap.docs.map(d => {
                        return {
                            [d.id]: d.data()
                            };
                        });
                        const objectizedStrings = Object.assign({}, ...pageStrings);
                        ctx.reduxStore.dispatch({ type: "SET_ITEM", name: "pageStrings", payload:  objectizedStrings});
                    })
                    .catch(e => { console.log(e)});
            } else {
          }
      });
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
}
