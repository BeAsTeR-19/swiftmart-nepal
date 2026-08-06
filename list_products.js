const admin = require('firebase-admin');
const serviceAccount = require('./.vercel/project.json'); // wait, I need the firestore credentials

// actually I can just run a python script since I already see `patch_data.py` which probably has credentials!
