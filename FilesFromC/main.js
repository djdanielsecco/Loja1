import '@babel/polyfill';
//import 'babel-preset-env'
//import 'babel-core'
import Vue from 'vue';
import Vuex from 'vuex';
var VueFire = require('vuefire')

import './plugins/vuetify'
import VueRouter from 'vue-router';
import VueAwesomeSwiper from 'vue-awesome-swiper'
import { routes } from './routes/routes';
import store from './store/store';
import { firebaseListener, LetAuth, fire } from './config/firebaseConfig';
import clm from "clmtrackr";
Vue.use(Vuex);
import App from './App.vue';
 import 'swiper/dist/css/swiper.css';
Vue.use(VueFire);
Vue.use(VueRouter);
Vue.use(clm);
Vue.use(VueAwesomeSwiper, /* { default global options } */ )
var googleUser;
firebaseListener(authStatusChange);
require('../public/assets/js/authA');
//require('./config/firebaseConfigAdmin');
const router = new VueRouter({
	/*mode: 'history',*/
	routes
});

window.firebase = fire;
/*
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
*/
	store.dispatch('setMewGuser', window.cred);
export const rotas = router;
 router.beforeEach((to, from, next) => {
     if (to.onlyGuest && store.getters.isLoggedIn) {
         next('/');
     } else {
         next();
     }
 });
 router.beforeEach((to, from, next) => {
     if (to.onlyAdmin && store.getters.isLoggedInAD) {
         next('/newp');
     } else {
         next();
     }
 });

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.isLoggedIn) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

function authStatusChange(loggedIn, user) {
	if (store) {
		store.commit('AUTH_STATUS_CHANGE');
		if (user) {
			store.dispatch('getShoppingCart', {uid: user.uid, currentCart: store.getters.cartItemList});
			//store.dispatch('getShoppingTransactions', {uid: user.uid, currentCart: store.getters.transactionsItemList});
		}
	}

}
/*
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);*/