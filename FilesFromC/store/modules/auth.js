import { firebaseAuth, LetAuth, UserProfile } from '../../config/firebaseConfig';
const state = {
	isLoggedIn: firebaseAuth().currentUser != null,
	user: firebaseAuth().currentUser,
	AdminLog: {},
	ploc: {},
	ploca: {},
	isAdmin: false,
	isNewUser:false
}
const mutations = {
	'AUTH_STATUS_CHANGE' (state) {
		state.isLoggedIn = firebaseAuth().currentUser != null;
		//state.isAdmin = firebaseAuth().currentUser != null;
		state.user = firebaseAuth().currentUser;
	},
	'AUTH_STATUS_GOOGLE' (state, {item}) {
		console.log(item);
       state.isLoggedIn = firebaseAuth().currentUser != null;
		state.user = firebaseAuth().currentUser;
		state.AdminLog = item;
    },
	'ADM_VRF' (state, item) {
		state.isAdmin = item;
		console.log(item);
	}
}
const actions = {
}
const getters = {
	isLoggedIn: (state) => {
		return state.isLoggedIn;
	},
	isLoggedInAD: (state) => {
		return state.isAdmin;
	},
	currentUser: (state) => {
		if (state && state.user) {
			return {
				email: state.user.email,
				emailVerified: state.user.emailVerified,
				uid: state.user.uid,
				displayName: state.user.displayName,
				metadata: state.user.metadata,
				phoneNumber: state.user.phoneNumber,
				photoURL: state.user.photoURL,
				providerData: state.user.providerData,
				providerId: state.user.providerId
			}
		} else {
			return {};
		}
	},
	currentUserData: (state) => {
		if (state && state.user) {
			return {
				email: state.user.email,
				admin: state.isAdmin,
				uid: state.user.uid,
				displayName: state.user.displayName,
				phoneNumber: state.user.phoneNumber,
				photoURL: state.user.photoURL,
			}
		} else {
			return {};
		}
	}
}
export default {
	state,
	mutations,
	actions,
	getters
}
