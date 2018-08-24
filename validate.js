var admin = require('firebase-admin');

var serviceAccount = require('./src/config/glassesstoresapp-firebase-adminsdk-cshyr-2e73cb7b10.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://glassesstoresapp.firebaseio.com'
});

var uid = "ZzlxsdOAUbWvkPU8yh2z42WfQCY2";


/*admin.auth().setCustomUserClaims(uid, {admin: true, ower: true, premiumAccount: true }).then(() => {
// The new custom claims will propagate to the user's ID token the
// next time a new one is issued.
	console.log('ok');
}).catch(function(error) {
    console.log("Error creating custom token:", error);
  });*/

admin.auth().createCustomToken(uid)
  .then(function(customToken) {
   console.log(customToken);
  })
  .catch(function(error) {
    console.log("Error creating custom token:", error);
  });