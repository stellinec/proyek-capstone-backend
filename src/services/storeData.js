const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();

async function storeDataUser(id, data) {   
    const userCollection = db.collection('user');
    return userCollection.doc(id).set(data);
}

async function storeRequest(id, data) {   
    const requestCollection = db.collection('request');
    return requestCollection.doc(id).set(data);
}

module.exports = {
    storeDataUser,
    storeRequest
};