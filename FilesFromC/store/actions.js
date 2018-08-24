import { TokenAuth, ref, firebaseAuth, LetAuth } from '../config/firebaseConfig';

export const updateCart = ({
  commit
}, {item, quantity, isAdd}) => {
  // TODO: Call service
  commit('UPDATE_CART', {item, quantity, isAdd});
  if (isAdd) {
    let message_obj = {
      message: `Add ${item.title} to cart successfully`,
      messageClass: "success",
      autoClose: true
    }
    commit('ADD_MESSAGE', message_obj);
  }
}
export const updateTransactions = ({
  commit
}, {item, quantity, isAdd}) => {
  // TODO: Call service
  commit('UPDATE_TRANSACTIONS', {item, quantity, isAdd});
  if (isAdd) {
    let message_obj = {
      message: `Add ${item.title} to cart successfully`,
      messageClass: "success",
      autoClose: true
    }
    commit('ADD_MESSAGE', message_obj);
  }
}

export const removeItemInCart = ({commit}, {item}) => {
	commit('REMOVE_CART_ITEM', {item});
}
export const removeItemInTransactions = ({commit}, {item}) => {
	commit('REMOVE_TRANSACTIONS_ITEM', {item});
}
 export const setMewGuser =({commit}, {item}) =>  {
        commit('AUTH_STATUS_GOOGLE', {item});
    }
export const registerByEmail = (_, {email, password}) => {
	return firebaseAuth().createUserWithEmailAndPassword(email, password);
}
 export const adminVerifier =({commit}, item) =>  {
        commit('ADM_VRF', item);
    }


export const logout = ({commit}) => {
  commit('SET_CART', []); // clear current cart
  return firebaseAuth().signOut();
}

export function loginWithEmail (_, {email, password}) {
	//firebaseAuth().setPersistence(firebaseAuth.Auth.Persistence.NONE);
  return firebaseAuth().signInWithEmailAndPassword(email, password);
}
export function loginWithToken (_, {TokenAuth}) {
  return LetAuth.auth().signInWithCustomToken(TokenAuth).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
}

export function listenToProductList({commit}) {
	return ref.child("products").on('value', (products) => {
		commit('UPDATE_PRODUCT_LIST', products.val());
	});
}

export function listenToTransactionsList({commit}) {
	return ref.child("transactions/").on('value', (products) => {
		console.log(products.val());
		commit('UPDATE_TRANSACTIONS', products.val());
	});
}

export function getShoppingTransactions({commit}, {currentTransactions}) {
	
		return ref.child("transactions/").once('value').then((transactions) => {
			 console.log(transactions.val());
				commit('SET_TRANSACTIONS', transactions.val());
			if (transactions.val() && (!currentTransactions || currentTransactions.length == 0)) {
			}
		});
	
}
/*
export function getShoppingTransactions({commit}, {uid, currentTransactions}) {
	if (uid) {
		return ref.child("transactions/" + uid).once('value').then((transactions) => {
			 console.log(transactions.val());
			if (transactions.val() && (!currentTransactions || currentTransactions.length == 0)) {
				commit('SET_TRANSACTIONS', transactions.val());
			}
		});
	} else {
		// console.log("User has not logged in");
	}
}
*/
export function getShoppingCart({commit}, {uid, currentCart}) {
	if (uid) {
		return ref.child("cart/" + uid).once('value').then((cart) => {
			// console.log(cart.val());
			if (cart.val() && (!currentCart || currentCart.length == 0)) {
				commit('SET_CART', cart.val());
			}
		});
	} else {
		// console.log("User has not logged in");
	}
}

export function saveShoppingCart(_, {uid, cartItemList}) {
	// console.log("ACTIONS saveShoppingCart");
	console.log("CART DATA", cartItemList);
	console.log("CART USER", firebaseAuth().currentUser.email);
	//cartItemList.append(firebaseAuth().currentUser.email);
	return ref.child("cart/" + uid).set(cartItemList);
}


export function writeUserData(_,{userId, name, email, imageUrl, userMeta}) {
					return ref.child('users/' + userId).set({
						username: name,
						email: email,
						profile_picture: imageUrl,
						user: userMeta
					});
				}


export function saveToTransaction(_, {uid, user, cartItemList}) {
	let newTransactionKey = ref.child("transactions").push().key;
	
	var newTransaction = {}
	
	newTransaction['/transactions/' + uid + '/' + newTransactionKey] = cartItemList;
	
	
	ref.child("transactionsList/").once("value")
  .then(function(snapshot) {
 var indexT = snapshot.val().length;

	let newTransactionKeyList = ref.child("transactionsList").push().key;	
	var newTransactionList = {}	;
	console.log(indexT);
	newTransactionList['/transactionsList/' + indexT +  '/' + uid  ] = cartItemList;
	return  ref.update(newTransactionList);
  });
	
	return ref.update(newTransaction);
}
