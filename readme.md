## Test in emulator
* start emulator ``firebase emulators:start --only firestore``
* run ``yarn test`` or ``npm run test``

## Test in production
* Pick a firebase project with firestore
* Deploy firestore rules
* Get serviceaccount credentials
* Get web config and set webConfig
* Run `export GOOGLE_APPLICATION_CREDENTIALS=~/path-to-credentials/serviceaccount.json && node index.js`

Result:

    got doc { filterValue: 'test1', listOfIds: [ 'id_1' ] }

    read from some_collection query "where filterValue == test1" failed { FirebaseError: Missing or insufficient permissions.
    ...