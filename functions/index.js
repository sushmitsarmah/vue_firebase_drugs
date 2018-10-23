const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const Fuse = require('fuse.js');
const _ = require('lodash');
const cors = require('cors')({ origin: true });

let fuse_drug, fuse_mechanism, data;

const options_drug = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "namemain"
    ]
};

const options_mechanism = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    id: 'namemain',
    keys: [
        "MechanismsMolecular.Mechanism.text"
    ]
};

const getCollection = () => {
    return db.collection('drugdata').get()
        .then(snapshot => {
            let data = snapshot.docs.map(doc => doc.data());
            return data;
        });
};

getCollection()
.then( result => {
    data = result;
    console.log(data);
    fuse_drug = new Fuse(data, options_drug);
    fuse_mechanism = new Fuse(data, options_mechanism);
    return data;
})
.catch(err => {
    console.log(err);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors);

app.get('/search/:type/:selected', (req, res) => {
    const param = req.params.selected;
    const type = req.params.type;
    let result = {};
    if (type === 'drug') {
        result = fuse_drug.search(param);
    } else {
        result = fuse_mechanism.search(param);
    }
    res.json({
        result: result
    });
});

app.get('/suggestions', (req, res) => {
    const mainnames = _.map(data, 'namemain');

    const mechanisms = data.map(drug => {
        return _.map(drug.MechanismsMolecular.Mechanism, 'text');
    });

    res.json({
        mainnames: mainnames,
        mechanisms: _.flatten(mechanisms)
    });
});

exports.api = functions.https.onRequest(app);
