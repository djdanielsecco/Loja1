import Router from 'vue-router'
import store from '@/store/store'


import Store from '../components/Store.vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import ProductDetails from '../components/ProductDetails.vue';
import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';
import Foto from '../components/VTOG/FotoTry.vue';
import Mirror from '../components/VTOG/MirrorTry.vue';
import NewP from '../components/admin/NewProducts.vue';
import Ordens from '../components/admin/Ordens.vue';
import ProfileUser from '../components/users/ProfileUser.vue';

export const routes = [
	{path: '/', component: Store, name: 'mainpage'},
	{path: '/product/:id', component: ProductDetails, name: 'product'},
	{path: '/cart', component: ShoppingCart, name: 'shoppingcart'},
	{path: '/foto', component: Foto, name: 'foto', meta: {
        requiresAuth: true
      }},
	{path: '/user-profile', component: ProfileUser, name: 'user-profile', meta: {
        requiresAuth: true
      }},
	{path: '/mirror', component: Mirror, name: 'mirror'},
	{path: '/ordens', component: Ordens, name: 'ordens'},
	{path: '/newp', component: NewP, name: 'newp',onlyAdmin: true, meta: {
        requiresAuth: true
      }},
	{path: '/login', component: Login, name: 'login', onlyGuest: true },
	{path: '/register', component: Register, name: 'register', onlyGuest: true},
	{path: '*', redirect: '/' }
];

