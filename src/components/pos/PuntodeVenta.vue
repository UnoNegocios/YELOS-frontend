<template>
    <v-container class="pl-9">
        <!-- carrito-->
        <v-navigation-drawer style="top:0!important; height:100vh; max-height:100vh;" right v-model="open_cart" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <cart/>
        </v-navigation-drawer>

         <v-row class="mt-0 ml-0">
            <v-text-field
            content-class="mt-0 py-0"
            rounded
            light
            append-icon="mdi-barcode"
            @click:append="scanner = true"
            class="mr-12"
            flat
            hide-details
            placeholder="Buscar Producto"
            prepend-inner-icon="mdi-magnify"
            background-color=#f5f6fa
            outlined
            filled
            dense
            v-model="searchInput"
            @keydown.enter="search()"
            ></v-text-field>
         </v-row>

        <v-row class="ma-0 pa-4">
            <v-autocomplete @keydown.enter="filter()" v-model="client_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" hide-no-data item-value="id" item-text="name" label="Cliente" placeholder="Escribe para buscar" attach>
                <template v-slot:item="{item, attrs, on}">
                    <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-content>
                            <v-list-item-title v-if="item.name!=null">
                                <span v-if="item.macro!=null">{{item.macro}}</span>{{item.name}}
                                <div v-if="item.razon_social!=null">
                                    <span style="font-size:12px;">{{item.razon_social}}</span>
                                </div>
                            </v-list-item-title>
                            <v-list-item-title v-else-if="item.razon_social!=null">
                                {{item.razon_social}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template> 
            </v-autocomplete>
            
            <v-btn class="ml-12 mt-4 elevation-0" rounded color="primary" @click="createDialog = true">Agrgar Cliente</v-btn>
        </v-row>

        <v-row justify="center" class="ma-0">
            <v-col class="my-4 mx-0" v-for="(product,k) in products" :key="k" cols="4">
                <v-card :disabled="!(product.price!=undefined && product.price>0)" @click="addToCart(product)"><!--:disabled="product.inventory>0"-->
                    <!--v-img height="150px" width="19vw" v-bind:src="liga + 'files/' + product.image"></v-img-->
                    <v-card-subtitle class="pb-0">SKU:{{product.code_one}} | {{product.name}}</v-card-subtitle>
                    <v-card-text class="text--primary">
                        <div v-if="product.price!=undefined && product.price>0">{{product.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-divider class="my-6 mx-12"></v-divider>
                <button @click="limit = limit+12">Ver Más</button>
            <v-divider  class="my-6 mx-12"></v-divider>
        </v-row>
        <!-- Crear Cliente -->
        <v-dialog v-model="createDialog" max-width="700px">
          <create @closeCreateDialogClient="closeCreateDialogClient"/>
        </v-dialog>

        <!-- Dialogo scanner -->
    <v-dialog v-model="scanner" max-width="350px">
        <v-quagga v-if="scanner==true" 
        :onDetected="logIt" 
        :readerTypes="['ean_reader']"
        :readerSize="readerSize"
        :aspectRatio="aspectRatio"
        ></v-quagga>
    </v-dialog> 

    </v-container>    
</template>
<script>
import axios from "axios";
import Cart from "../pos/Cart"
import Create from "../clients/companies/create"
export default {
    components: {
        'cart':Cart,
        'create':Create,
    },
    data:()=>({ 
        readerSize: {
            width: 640,
            height: 480
        },
        aspectRatio: { min: 1, max: 2 },
        searchInput:'',
        createDialog:false,
        client_id:'',
        open_cart:true,
        limit:12,
        entries:{
            companies: []
        },
        isLoadingCompany: false,
        searchCompanies: null,
        scanner:false,
    }),
    computed:{
        companyLists(){
            return this.entries.companies.map(id=>{
                return{
                    id:id.id,
                    name:id.attributes.name,
                    macro:id.attributes.macro,
                    razon_social:id.attributes.razon_social,
                    price_list:id.attributes.price_list
                }
            })
        },
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        cart() {
            return this.$store.state.cart.carts
        },
        products(){
            return this.$store.state.product.products.map(id=>{
                return{
                    id:id.id,
                    name:id.name,
                    price:this.productPrice(id),
                    cost:id.cost,
                    code_one:id.code_one
                }
            })
        },
        client(){
            return this.$store.state.cart.client
        }
    },
    methods:{
        search(){
            this.$store.commit('product/setSearchInput',this.searchInput) 
            this.$store.dispatch('product/getProducts', 12) 
        },
        logIt (data) {
            //console.log('detected', data.codeResult.code)
            this.searchInput=data.codeResult.code
            this.scanner=false
        },
        closeCreateDialogClient: function(params) {
            this.createDialog = false;
        },
        addToCart(id) {
            this.$store.dispatch("cart/addItem", id);
        },
        productPrice(product){
            console.log(product)
            if(this.client_id!=''){
                var price = this.priceList(this.companyLists.filter(company=>company.id == this.client_id)[0].price_list.name)
                return product[price]*1
            }else{
                return product.price
            }
        },
        priceList(price){
            switch(price){
                case 'Precio 1': return 'price' 
                case 'Precio 2': return 'price_two' 
                case 'Precio 3': return 'price_three' 
                case 'Precio 4': return 'price_four' 
            }
        }
    },
    created(){
        this.$store.dispatch('product/getProducts', this.limit)
        this.$emit("closeDrawer", false);
    },
    watch:{
        client_id:{
            handler(){
                var client = this.companyLists.filter(client=>client.id == this.client_id)[0]
                this.$store.dispatch("cart/selectClient", client);
            }, deep: true,
        },
        limit:{
            handler(){
                this.$store.dispatch('product/getProducts', this.limit) 
            }, deep:true
        },
        searchCompanies(val){
            //if (this.companyLists.length > 0) return
            if (this.isLoadingCompany) return
            this.isLoadingCompany = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/companies?filter[name]='+val)
            .then(res => {
                this.entries.companies = this.entries.companies.concat(res.data.data)
            }).finally(() => (this.isLoadingCompany = false))
        },
    }
}
</script>