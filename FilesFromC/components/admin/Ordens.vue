<template>
 <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Edit Products</v-toolbar-title>
      <v-divider
        class="mx-2"
        inset
        vertical
      ></v-divider>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.thumbnail_url" label="thumbnail_url"></v-text-field>
                </v-flex>
                 <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.mask_url" label="mask_url"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.title" label="title"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.description" label="description"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.id" label="id"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.price" label="price"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.quantity" label="quantity"></v-text-field>
                </v-flex>
              
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="desserts"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.id }}</td>
        <td class="text-xs-left"><v-card color="blue-grey darken-2" class="white--text ">
      <v-card-media class="img-responsive elevation-20" :src="props.item.thumbnail_url" alt=""  height="50px"></v-card-media>
</v-card></td>
         <td class="text-xs-left"><v-card color="blue-grey darken-2" class="white--text">
      <v-card-media class="img-responsive elevation-20" :src="props.item.mask_url" alt=""  height="50px"></v-card-media>
</v-card></td>
      
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.price }}</td>
        <td class="text-xs-left">{{ props.item.quantity }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
	import { ref, firebaseAuth } from '../../config/firebaseConfig';
	export default {
    data: () => ({
		idz:'',
      dialog: false,
      headers: [
        {
          text: 'Item Name',
          align: 'left',
          sortable: false,
          value: 'title'
        },
        { text: 'Id', value: 'id' },
        { text: 'image', value: 'thumbnail_url' },
        { text: 'Mask', value: 'mask_url' },
        /*{ text: 'tile', value: 'title' },*/
        { text: 'Description', value: 'description' },
        { text: 'Price', value: 'price' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        description:'',
        id:0,
        price:0,
        quantity:0,
        thumbnail_url:'',
        title:'',
		  mask_url:''
      },
      defaultItem: {
        name: '',
         description:'',
        id:0,
        price:0,
        quantity:0,
        thumbnail_url:'',
        title:'',
		    mask_url:''
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
		 this.desserts = this.$store.getters.transactionsItemList;
      this.initialize()
    },

    methods: {
      initialize () {
        this.desserts = this.$store.getters.transactionsItemList
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1);
		  return ref.child("products/"+ index + '/').remove();
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
			var jk = {};
			var ix = this.editedIndex;
		jk = this.editedItem;	
 confirm('Are you sure you want to UPDATE this item?') &&  Object.assign(this.desserts[this.editedIndex], this.editedItem);
ref.child("products/").once("value")
  .then(function(snapshot) {
  var idz = snapshot.val().length; // {first:"Ada",last:"Lovelace"}
   // var firstName = snapshot.child("name/first").val(); // "Ada"
   // var lastName = snapshot.child("name").child("last").val(); // "Lovelace"
   // var age = snapshot.child("age").val(); // null
	console.log(idz);
	
	return ref.child("products/"+ ix + '/').update(jk);
  });

        } else {
          this.desserts.push(this.editedItem)
		var jj = {};
		jj = this.editedItem;	
ref.child("products/").once("value")
  .then(function(snapshot) {
   var idz = snapshot.val().length; // {first:"Ada",last:"Lovelace"}
   // var firstName = snapshot.child("name/first").val(); // "Ada"
   // var lastName = snapshot.child("name").child("last").val(); // "Lovelace"
   // var age = snapshot.child("age").val(); // null
	console.log(idz);
	
	return ref.child("products/"+ idz + '/').set(jj);
  });

        }
        this.close()
      }
    }
  }
	
	/*function saveToTransaction(_, {uid, cartItemList}) {
	let newTransactionKey = ref.child("transactions").push().key;
	var newTransaction = {}
	newTransaction['/transactions/' + uid + '/' + newTransactionKey] = cartItemList;
	return ref.update(newTransaction);*/
</script>

<style>


</style>
