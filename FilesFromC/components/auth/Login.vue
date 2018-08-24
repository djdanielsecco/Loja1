<template>
<div class="row mt-5">
  <div class="col-md-6 col-md-offset-3 col-xs-10 col-xs-offset-1">
    <form id="login-form" role="form" style="display: none;">
      <h3 class="text-center">Login</h3>
     <div v-show="false">
     	
        <div class="form-group">
        <input type="email" name="email" id="email" class="form-control" placeholder="Email Address" v-model="email">
      </div>
      <div class="form-group">
        <input type="password" name="password" id="password" class="form-control" placeholder="Password" v-model="password">
      </div>
      <div class="form-group">
        <button class="btn btn-success" style="width: 100%" @click.prevent="loginWithEmailLocal" :disabled="isLoading">
            <i v-if="isLoading" class="fa fa-spinner fa-spin" />
						Log in
					</button>
      </div>
     </div>
        <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
<div id="firebaseui-auth-container"></div>
<div id="loader">Loading...</div>
        <div id="sign-in-status"></div>
    <div id="sign-in"></div>
    <div id="account-details"></div>
        <blockquote>
        </blockquote>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
      <div class="form-group">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <router-link   class="mdl-button mdl-js-button mdl-button--raised" to="/register"><a>Register</a></router-link>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
</template>
<script>
	import {
		firebaseAuth,
		ui,
		UserProfile
	} from "../../config/firebaseConfig.js";
	import {
		mapActions
	} from 'vuex';
	import store from '../../store/store';
	export default {
		data() {
			return {
				email: '',
				password: '',
				isLoading: false,
				token: '',
				newUser: false
			}
		},
		mounted() {
			this.startUI();
		},
		methods: {
			...mapActions(['addMessage', 'clearMessage', 'loginWithEmail', 'loginWithToken', 'setPloc']),
			loginToken() {
				this.token = this.$store.getters.products;
				this.loginWithToken()
			},
			loginWithEmailLocal() {
				this.isLoading = true
				let data = {
					email: this.email,
					password: this.password
				}
				this.loginWithEmail(data).then(() => {
					this.clearMessage();
					this.$router.push({
						name: 'mainpage'
					});
				}).catch((error) => {
					let message_obj = {
						message: error.message,
						messageClass: "danger",
						autoClose: true
					}
					this.addMessage(message_obj);
				}).then(() => {
					this.isLoading = false
				})
			},
			startUI() {
				var data = null;
				// Hold a reference to the anonymous current user.
				var anonymousUser = firebase.auth().currentUser;
				var uiConfig = {
					callbacks: {
						signInSuccessWithAuthResult: function(authResult, redirectUrl) {
							var user = authResult.user;
							var credential = authResult.credential;
							var isNewUser = authResult.additionalUserInfo.isNewUser;
							var providerId = authResult.additionalUserInfo.providerId;
							var operationType = authResult.operationType;
							//alert(isNewUser);
						
							//this.newUser = isNewUser;
							// User successfully signed in.
							// Return type determines whether we continue the redirect automatically
							// or whether we leave that to developer to handle.
							return true;
						},
						uiShown: function() {
							// The widget is rendered.
							// Hide the loader.
							document.getElementById('loader').style.display = 'none';
							document.getElementById('login-form').style.display = 'block';
							document.getElementById('firebaseui-auth-container').style.display = 'block';
						},
						signInFailure: function(error) {
							// For merge conflicts, the error.code will be
							// 'firebaseui/anonymous-upgrade-merge-conflict'.
							if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
								return Promise.resolve();
							}
							// The credential the user tried to sign in with.
							var cred = error.credential;
							// If using Firebase Realtime Database. The anonymous user data has to be
							// copied to the non-anonymous user.
							var app = firebase.app();
							// Save anonymous user data first.
							return app.database().ref('users/' + firebase.auth().currentUser.uid)
								.once('value')
								.then(function(snapshot) {
									data = snapshot.val();
									// This will trigger onAuthStateChanged listener which
									// could trigger a redirect to another page.
									// Ensure the upgrade flow is not interrupted by that callback
									// and that this is given enough time to complete before
									// redirection.
									return firebase.auth().signInWithCredential(cred);
								})
								.then(function(user) {
									// Original Anonymous Auth instance now has the new user.
									return app.database().ref('users/' + user.uid).set(data);
								})
								.then(function() {
									// Delete anonymnous user.
									return anonymousUser.delete();
								}).then(function() {
									// Clear data in case a new user signs in, and the state change
									// triggers.
									data = null;
									// FirebaseUI will reset and the UI cleared when this promise
									// resolves.
									// signInSuccessWithAuthResult will not run. Successful sign-in
									// logic has to be run explicitly.
									window.location.assign('/');
								});

						}
					},
					// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
					autoUpgradeAnonymousUsers: false,
					signInFlow: 'redirect',
					signInSuccessUrl: '/',
					signInOptions: [
						// Leave the lines as is for the providers you want to offer your users.
						{
							provider: firebaseAuth.GoogleAuthProvider.PROVIDER_ID,
							scopes: [
								'https://www.googleapis.com/auth/plus.login'
							],
							customParameters: {
								// Forces account selection even when one account
								// is available.
								prompt: 'select_account'
							}
						},
						firebaseAuth.FacebookAuthProvider.PROVIDER_ID,
						firebaseAuth.EmailAuthProvider.PROVIDER_ID,
						firebaseAuth.PhoneAuthProvider.PROVIDER_ID,
						firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
					],
					// Terms of service url.
					//tosUrl: '/About'
				};
				ui.start('#firebaseui-auth-container', uiConfig);
				//this.setPloc(uiConfig);
			}
		},
	}

</script>
