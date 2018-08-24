<template>

  <div class="justify-end align-content-center d-flex">
   
    <!-- Brand and toggle get grouped for better mobile display -->
    
    
      


  	<v-toolbar-items class="hidden-md-and-down justify-end align-content-center pa-0 ma-0">
    <v-btn id='conf'></v-btn>
      <v-btn v-if="isLoggedIn" class="li-pointer"  @click="logout">Logout {{ userEmail }}</v-btn>
  
      <v-btn to="/" >Online Store</v-btn>
     
      <v-btn to="/register"  v-if="!isLoggedIn"  ><a>Register</a></v-btn>
      <v-btn to="/foto"   ><a>foto</a></v-btn>
      <v-btn to="/mirror"  ><a>mirror</a></v-btn>
      <v-btn to="/ordens"  ><a>ordens</a></v-btn>
     
        <v-btn to="/cart">
          Checkout <span class="badge" >{{ numItems }} ($ {{ cartValue }})</span>
        </v-btn>
       
      <v-btn to="/login" v-if="!isLoggedIn"><a>Login</a></v-btn>

	</v-toolbar-items>



  </div>
  <!-- /.container -->

</template>

<script>
import {
  mapActions, mapGetters
} from 'vuex';
	
export default {
	data () {
    return {
		
      
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'cartValue', 'currentUser', 'cartItemList']),
    numItems() {
      return this.cartItemList.reduce((total, item) => {
        total += item.quantity;
        return total
      }, 0);
    },
    userEmail() {
      return this.isLoggedIn ? this.currentUser.email : ''
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
	
	nav{
		
	}
</style>
