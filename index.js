const admin = require('firebase-admin');
const { initializeApp } = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

admin.initializeApp();

const collectionName = 'some_collection';
const webConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const getAuth = async () => {
  const uid = 'customauth:1';
  const claims = {
    access_map: {
      id_1: 1,
      id_2: 2,
    },
  };
  const customToken = await admin.auth().createCustomToken(uid, claims);

  return customToken;
};

const setTestData = async () => {
  const db = admin.firestore();
  const testDocs = [
    {
      listOfIds: ['id_1'],
      filterValue: 'test1',
    },
    {
      listOfIds: ['id_2'],
      filterValue: 'test2',
    },
  ];
  const promises = testDocs.map(data => {
    return db
      .collection(collectionName)
      .doc(data.filterValue)
      .set(data);
  });
  await Promise.all(promises);
};

const readFirestoreTestData = async app => {
  const token = await getAuth();
  const authRes = await app.auth().signInWithCustomToken(token);
  if (authRes.user === null) {
    console.error('auth error');
    process.exit(1);
  }
  const db = app.firestore();
  const pathToDoc = `${collectionName}/test1`;

  try {
    const docSnap = await db.doc(pathToDoc).get();
    console.log(`got doc`, docSnap.data());
  } catch (e) {
    console.log(`read from ${pathToDoc} failed`, e);
  }
  try {
    const query = db
      .collection(collectionName)
      .where('filterValue', '==', 'test1');
    const snap = await query.get();
    console.log(`got snapshot - empty: ${snap.empty}`);
    const res = snap.map(s => s.data());
    console.log(`got data`, res);
  } catch (e) {
    console.log(
      `read from some_collection query "where filterValue == test1" failed`,
      e
    );
  }
};

(async () => {
  await setTestData();

  const app = initializeApp(webConfig);
  await readFirestoreTestData(app);
  process.exit(0);
})();

// export GOOGLE_APPLICATION_CREDENTIALS=~/credentials/serviceaccount.json && node index.js
