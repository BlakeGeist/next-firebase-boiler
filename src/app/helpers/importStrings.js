const AWS = require("aws-sdk");
const admin = require("firebase-admin");
if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(require("../credentials/server"))
    });
}
const db = admin.firestore();
const cors = require("cors")({
    origin: true
});
const stringsCollection = db.collection("strings");

//takes a string(text) and a (slug)
//check the database for if the slug already exists
//if it does, this should prolly be an update function
//if the string does not exist, run the createString funciton
exports.handler = (req, res) => {
    cors(req, res, async () => {
        const { slug, text, scope } = req.body;
        try {
            var existingDoc = stringsCollection.doc(slug).get();
            var docExists = existingDoc.exists;
            if(docExists){
                //// TODO: create update strings function
            } else {
                const strings = await createStrings(text, slug, scope);
                res.status(200).send(strings);
            }
        }
        catch (error){
            res.status(500).send(error);
        }
    });
};

//takes a string(text) and a (slug)
//check the database for if the slug already exists
//if it does, this should prolly be an update function
//if the string does not exist, run the createString funciton
async function createStrings(stringText, slug, scope){
    const object = {
        ar: await getTranslatedString(stringText, "ar"),
        da: await getTranslatedString(stringText, "da"),
        de: await getTranslatedString(stringText, "de"),
        en: await getTranslatedString(stringText, "en"),
        es: await getTranslatedString(stringText, "es"),
        fr: await getTranslatedString(stringText, "fr"),
        it: await getTranslatedString(stringText, "it"),
        jp: await getTranslatedString(stringText, "ja"),
        ko: await getTranslatedString(stringText, "ko"),
        pt: await getTranslatedString(stringText, "pt"),
        ru: await getTranslatedString(stringText, "ru")
    };
    stringsCollection.doc(scope).collection("strings").doc(slug).set(object)
        .then(()=>{
            return object;
        })
        .catch((e)=>{
        });
    return object;
}

//takes a string and a target language, sends it to AWS translate, and returns the result
async function getTranslatedString(string, targetLang){
    AWS.config.region = "us-east-1";
    var ep = new AWS.Endpoint("https://translate.us-east-1.amazonaws.com");
    AWS.config.credentials = new AWS.Credentials("AKIAJQLVBELRL5AAMZOA", "Kl0ArGHFySw+iBEdGXZDrTch2V5VAaDbSs+EKKEZ");
    var translate = new AWS.Translate();
    translate.endpoint = ep;
    var params = {
        Text: string,
        SourceLanguageCode: "en",
        TargetLanguageCode: targetLang
    };
    var promise = new Promise((resolve, reject)=>{
        translate.translateText(params, (err, data)=>{
            if (err) return reject(err);
            else {
                return resolve(data);
            }
        });
    });
    var result = await promise;
    return result.TranslatedText;
}