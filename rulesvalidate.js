/*
var admin = require('firebase-admin');

var serviceAccount = require('./src/config/glassesstoresapp-firebase-adminsdk-cshyr-2e73cb7b10.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://glassesstoresapp.firebaseio.com'
});

var uid = "ZzlxsdOAUbWvkPU8yh2z42WfQCY2";
var db = admin.database();
var ref = db.ref("/users");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});

*/

var firebase = require("firebase/app");

// Add additional services that you want to use
require("firebase/auth");
require("firebase/database");


const config = {
	apiKey: "AIzaSyB3c1YXXavozX9_jtQILHBqTu2fn08qClE",
	authDomain: "glassesstoresapp.firebaseapp.com",
	databaseURL: "https://glassesstoresapp.firebaseio.com",
	projectId: "glassesstoresapp",
	storageBucket: "glassesstoresapp.appspot.com",
	messagingSenderId: "553956023845"
};

firebase.initializeApp(config);
var email = "jojo@jo.com"
var password = "1qazxsw2"
/*firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});*/
var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTUzNDgzNjI0MCwiZXhwIjoxNTM0ODM5ODQwLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1jc2h5ckBnbGFzc2Vzc3RvcmVzYXBwLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstY3NoeXJAZ2xhc3Nlc3N0b3Jlc2FwcC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6Ilp6bHhzZE9BVWJXdmtQVTh5aDJ6NDJXZlFDWTIifQ.Kw3K6cS8Yi9a7ELv2pxEPMaNZnm_4UPisXxVIW7jh79c345_iq7WBh1IFvamhUdRrhfwJ98UsNSataP5NRzX27ehcCVg5iF_fXXzi1OozvRxYjiB5qm_jN4wuo941-4Szjsi9HfpLzG0wdI23RvUJRzt6p725pbdLgaenMst0h7KUsZuqO0ZiIcazsaYGHnC4VBvozcit-D8Xz_AIEQC0sY5FlF5J3SwzOnaWm6m2izzBMLzQF09UEiU1CEuGE35aG2Y_s26jQKtddJlxMcv3FjzKH7gwkdQQUoxCselS3sxc47NJxsNjV-S8CHEo06KMFxqHZ-8tlJqmOqhAN6m4w'

/*
firebase.auth().signInWithCustomToken(token).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/invalid-custom-token') {
    console.log('The token you provided is not valid.');
  } else {
    console.error(error);
  }
});
*/
/*var user = firebase.auth().currentUser;

user.updateProfile({
  displayName: "Jane Q. User",
  photoURL: "https://example.com/jane-q-user/profile.jpg"
}).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});

var newPassword = getASecureRandomPassword();

user.updatePassword(newPassword).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});*/

const provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithCustomToken(token).then((result) => {
	console.log('result>>>>>', result.user.getIdToken())
  // User is signed in. Get the ID token.
  return result.user.getIdToken();
})
.then((idToken) => {
  // Pass the ID token to the server.
	console.log('idtoken>>>>>', idToken)
 
  
}).catch((error) => {
  console.log(error);
});



      firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          // User is signed in.
 console.log('user>>>>>', user.uid);
			var db = firebase.database();
/*var ref = db.ref("/users/" + user.uid );
ref.once("value", function(snapshot) {
  console.log('///////////]>', snapshot.val());
});*/
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
         console.log('no user');
            // [END_EXCLUDE]
        }
      });