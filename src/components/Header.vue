<template>
  <div class="justify-end align-content-center d-flex">
    <!-- Brand and toggle get grouped for better mobile display -->
  	<v-toolbar-items class="hidden-xs-only justify-end align-content-center pa-0 ma-0">
    <v-btn id='conf'></v-btn>
      <v-btn class="caption" v-if="isLoggedInAD">AD: {{isLoggedInAD}} </v-btn>
      <v-btn class="caption" v-if="isLoggedInAD">U: {{isLoggedIn}} </v-btn>
      <v-btn v-if="isLoggedIn" class="caption li-pointer"  @click="logout">Logout {{ userEmail }}</v-btn>
      <v-btn class="caption" to="/" >Online Store</v-btn>
      <v-btn class="caption" to="/register"  v-if="false"  ><a>Register</a></v-btn>
      <v-btn class="caption" to="/foto"   v-if="isLoggedInAD"><a>foto</a></v-btn>
      <v-btn class="caption" :to="'/mirror/'+  us "  ><a>mirror</a></v-btn>
      <v-btn class="caption" to="/ordens"  v-if="isLoggedInAD"><a>ordens</a></v-btn>
        <v-btn class="caption" to="/cart">
          Checkout <span  class="badge caption" >{{ numItems }} ($ {{ cartValue }})</span>
        </v-btn>
      <v-btn class="caption" to="/login" v-if="!isLoggedIn"><a>Login</a></v-btn>
	</v-toolbar-items>
  </div>
  <!-- /.container -->
</template>
<script>
	import {
		mapActions,
		mapGetters
	} from 'vuex';
	export default {
		props: {
		 Usr: {
     // type: String,
      default: 'gest'
		 }
    },
		data() {
			return {}
		},
		computed: {
			...mapGetters(['isLoggedIn', 'isLoggedInAD', 'cartValue', 'currentUser', 'cartItemList']),
			numItems() {
				return this.cartItemList.reduce((total, item) => {
					total += item.quantity;
					return total
				}, 0);
			},
			userEmail() {
				return this.isLoggedIn ? this.currentUser.email : ''
			},
				us(){
					
					return this.isLoggedIn ? this.currentUser.displayName : this.Usr
				}
		},
		 watch: {
    '$route' (to, from) {
		//this.Usr = this.currentUser.displayName
		//return
      // react to route changes...
    }
  },	
		methods: {
			...mapActions(['logout'])
		},
	}

</script>
<style scoped lange="sass">
	.navbar-btn a {
		color: white;
	}

	.li-pointer {
		cursor: pointer;
	}

	.li-pointer:hover {
		cursor: pointer;
	}

	nav {}

</style>
