var credential={};
		window.cred = {};
window.isUserEqual;
window.fbuser;
function onSignIn(googleUser) {
	var fireProfile={};
	
	 var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); 
	// This is null if the 'email' scope is not present.
	 console.table(profile);
	  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
 
	var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
		
				 isUserEqual = function(googleUser, firebaseUser)  {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}
			if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
    
		
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(cred).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });

		
    }
		
		
		if (firebaseUser) {
      // console.log("User log in success", user);
		firebaseUser.providerData.forEach(function (data) {
    console.log("Sign-in provider: " + data.providerId);
    console.log("  Provider-specific UID: " + data.uid);
    console.log("  Name: " + data.displayName);
    console.log("  Email: " +data.email);
    console.log("  uid: " + firebaseUser.uid);
    console.log("  Photo URL: " +data.photoURL);
			console.table(data);
			return fireProfile = data;
  });	 
	
      //func(true, firebaseUser)
    } 
  
  }, function(error) {
    console.log(error)
  });
	
 	 credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);	
			 // Check if we are already signed-in Firebase with the correct user.
     
			  
			console.log(credential);
		function zzz (credential){
			var ee= credential;
			cred = ee;
			console.log('oiee',cred);
				return cred ;
			
		}
		zzz(credential);


	  //isUserEqual(googleUser, firebaseUser);
}


//export default