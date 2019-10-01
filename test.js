const { readFileSync } = require('fs');
const {
  assertSucceeds,
  initializeTestApp,
  loadFirestoreRules,
} = require('@firebase/testing');

const projectId = 'test';
const auth = {
  uid: 'customauth:user1',
  access_map: {
    id_1: 1,
    id_2: 2,
  },
};
const rules = readFileSync('./firestore.rules', 'utf8');
const app = initializeTestApp({
  projectId,
  auth,
});
const firestore = app.firestore();
const collectionName = 'some_collection';

describe('test hasIdInArray rule func', () => {
  before(async () => {
    await firestore.doc(`${collectionName}/doc1`).set({
      listOfIds: ['id_1'],
      filterValue: 'test1',
    });
    await firestore.doc(`${collectionName}/doc2`).set({
      listOfIds: ['id_2'],
      filterValue: 'test2',
    });

    await loadFirestoreRules({
      projectId,
      rules,
    });
  });

  it(`ref ${collectionName}/doc1 get will succeed`, async () => {
    const ref = firestore.collection(collectionName).doc('doc1');
    await assertSucceeds(ref.get());
  });

  it(`query 'where filterValue == test1' get will succeed`, async () => {
    const query = firestore
      .collection(collectionName)
      .where('filterValue', '==', 'test1');
    await assertSucceeds(query.get());
  });
});
