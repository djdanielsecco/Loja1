import firebase from '@firebase/app'
import '@firebase/auth'
import '@firebase/database'
import * as admin from 'firebase-admin';
import firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import store from '../store/store';
const config = {
	apiKey: "AIzaSyB3c1YXXavozX9_jtQILHBqTu2fn08qClE",
	authDomain: "glassesstoresapp.firebaseapp.com",
	databaseURL: "https://glassesstoresapp.firebaseio.com",
	projectId: "glassesstoresapp",
	storageBucket: "glassesstoresapp.appspot.com",
	messagingSenderId: "553956023845"
}
var GprofUser;
var tokenAD;
var DecodeProfile;
firebase.initializeApp(config);



var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
firebase.auth().languageCode = 'pt';
export function firebaseListener(func) {
	firebase.auth().onAuthStateChanged(function (user) {
			if (user) {
				var displayName = user.displayName;
				var email = user.email;
				var emailVerified = user.emailVerified;
				var photoURL = user.photoURL;
				var uid = user.uid;
				var phoneNumber = user.phoneNumber;
				var providerData = user.providerData;
				var metata = JSON.stringify(user, null, '  ');
					
				if (providerData) {
					// console.log("User log in success", user);
					user.providerData.forEach(function (profile) {
						console.table(profile);
						//console.log(this.newUser);
					});
				} else {
					console.log('opaaaa');
				}
				console.info(user);
				console.log(metata);
				console.table(providerData);
				user.getIdToken( /* forceRefresh */ true).then((idToken) => {
					
					user.getIdTokenResult()
						.then((idTokenResult) => {
						DecodeProfile = idTokenResult.claims ;
						var metato = JSON.stringify(DecodeProfile, null, '  ');
						console.log(metato);
						
						
							// Confirm the user is an Admin.
							if (!!idTokenResult.claims.admin) {
								// Show admin UI.
								console.log('idTokenResult as admin ', idTokenResult);
								console.info('idTokenResult.claims as admin ', idTokenResult.claims);
								store.dispatch('adminVerifier', true);
								writeUserData(uid, displayName, email, photoURL, store.getters.currentUserData);
							} else {
								// Show regular user UI.
								console.log('idTokenResult as user ', idTokenResult);
								console.info('idTokenResult.claims as user ', idTokenResult.claims);
								store.dispatch('adminVerifier', false);
								writeUserData(uid, displayName, email, photoURL, store.getters.currentUserData);
							}
						console.log('ffffffff', DecodeProfile);
						
					
						})
						.catch((error) => {
							console.log(error);
						});
					console.log(idToken);
				}).catch(function (error) {
					// Handle error
					console.log('opaaaa ', error);
				});
				/*admin.auth().createCustomToken(uid)
					.then(function (customToken) {
						console.log(customToken);
					})
					.catch(function (error) {
						console.log("Error creating custom token:", error);
					});
					admin.auth().verifyIdToken(idToken)
						.then(function (decodedToken) {
							var uid = decodedToken.uid;
							console.log('verify uid ', uid);
							console.table( decodedToken);
							console.table( decodedToken.firebase);
						}).catch(function (error) {
							// Handle error
						});
					*/
				function writeUserData(userId, name, email, imageUrl, userMeta) {
					firebase.database().ref('users/' + userId).set({
						username: name,
						email: email,
						profile_picture: imageUrl,
						user: userMeta
					});
				}
				// func(true, user)
				func(true, user)
				
			} else {
				// console.log("User log in failed", user);
				func(false)
			}
		},
		function (error) {
			console.log(error)
		});
}
export const ui = new firebaseui.auth.AuthUI(firebase.auth());
export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export const LetAuth = admin;
export const LetGprof = GprofUser;
export const TokenAuth = tokenAD;
export const fire = firebase;
export const UserProfile =  DecodeProfile;
