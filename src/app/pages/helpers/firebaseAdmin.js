const admin = require("firebase-admin");

const Admin = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(require("../../credentials/server"))
        });
    };    
    return admin
}

export default Admin

