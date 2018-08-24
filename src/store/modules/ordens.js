
const state = {
	transactionsItemList: []
}

const mutations = {
	'UPDATE_TRANSACTIONS' (state, item) {
	state.transactionsItemList = item;
	},
	'SET_TRANSACTIONS' (state, {item}) {
		if (item) {
			state.transactionsItemList = item;
		}
	},
	'REMOVE_TRANSACTIONS_ITEM' (state, {item}) {
		const record = state.transactionsItemList.find(element => element.id == item.id);
		state.transactionsItemList.splice(state.transactionsItemList.indexOf(record), 1);
	}
}

const actions = {
	clearTransactions: ({commit}) => {
		commit('SET_TRANSACTIONS', []);
	}
}

const getters = {
	transactionsItemList: (state) => {
		return state.transactionsItemList;
	},
	
}

export default {
	state,
	mutations,
	actions,
	getters
}
