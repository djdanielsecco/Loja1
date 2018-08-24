<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="name"
      :rules="nameRules"
      :counter="50"
      label="Name"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      
      
      required
    ></v-text-field>
    <v-select
      v-model="select"
      :items="items"
      :rules="[v => !!v || 'Item is required']"
      label="Item"
      required
    ></v-select>
    <v-checkbox
      v-model="checkbox"
      :rules="[v => !!v || 'You must agree to continue!']"
      label="Do you agree?"
      required
    ></v-checkbox>

    <v-btn
      :disabled="!valid"
      @click="submit"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
</template>
<script>
 import {
  mapActions, mapGetters
} from 'vuex';
import { ref, firebaseAuth, LetAuth } from '../../config/firebaseConfig';
  export default {
    data: () => ({
		uid:'',
      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 50) || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false
    }),
  computed: {
    ...mapGetters(['isLoggedIn',  'currentUser']),
	   userEmail() {
      return this.isLoggedIn ? this.currentUser.email : ''
    }
	
  },
	  mounted (){
	  this.email = this.currentUser.email;
		  this.name = this.currentUser.displayName;
		  this.uid = this.currentUser.uid;
  },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
         /* axios.post('/api/submit', {
            name: this.name,
            email: this.email,
            select: this.select,
            checkbox: this.checkbox
          })*/
			
	
			
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>