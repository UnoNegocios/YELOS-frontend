<template>
  <v-container style="max-width:100vw;">
    <v-card class="elevation-0 pa-6">
        <v-row class="ma-0">
            <v-col cols="6" class="pt-3">
                <v-autocomplete v-if="newProduct==''" v-model="product_id" :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" item-text="name" item-value="id" label="Producto" placeholder="Escribe para buscar o crear">
                    <template slot="no-data">
                        <div class="px-6 pt-3" v-if="searchProducts!=null && !isLoadingProducts"><!--@keydown.enter="search=true"  ----  &&!isLoadingProducts&&!search-->
                            No existen productos relacionados.
                            <v-text-field v-model="searchProducts" label="Crear Producto" append-icon="mdi-plus" @click:append="newProduct=searchProducts"></v-text-field>
                        </div>
                        <div class="px-6 pt-3" v-else>
                            Escribe para buscar o crear
                        </div>
                    </template>
                </v-autocomplete>
                <span v-else>{{newProduct}}</span>
            </v-col>
            <v-col cols="3">
                <div v-if="product.provider!=''">
                    <span>Proveedor Actual:</span>
                    <br/>
                    <v-chip :to="{ path: '/providers/'+ product.provider.id}" small class="mt-1" color="#e4e4e4" style="font-weight:500;">{{product.provider.name}}</v-chip>
                </div>
                <v-autocomplete v-else :items="providers" :search-input.sync="createProvider.name" label="Proveedor" item-text="name" item-value="id" v-model="provider_id">
                    <template slot="no-data">
                        <div class="px-6 pt-3">
                            No existen proveedores relacionados.
                            <v-text-field v-model="createProvider.name" label="Crear Proveedor" append-icon="mdi-plus" @click:append="saveProvider()"></v-text-field>
                        </div>
                    </template>
                </v-autocomplete>
            </v-col>
            <v-col cols="3">
                <v-row class="ma-0">
                <v-btn class="mt-3 elevation-0" color="primary" @click="saveProduct">Guardar</v-btn>
                <v-spacer/>

                <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" class="mt-3 elevation-0" color="primary" text>
                            Importar
                            <v-icon>mdi-upload</v-icon>
                        </v-btn>
                    </template>
                    <import-products @closeImportDialog="closeImportDialog"/>
                </v-dialog>

                </v-row>
            </v-col>
        </v-row>
        <v-row class="ma-0">
            <v-col cols="6">
                <v-row class="ma-0 justify-center" style="border:solid 1px grey;">
                    <v-col cols="4" class="px-0">
                        <div class="tabla"></div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 1</span>
                        </div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 2</span>
                        </div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 3</span>
                        </div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 4</span>
                        </div>
                    </v-col>
                    <v-col cols="4" class="px-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <span style="margin:auto; font-weight:500;">
                                SIN IVA
                            </span>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" class="mx-6" v-model="product.price"></v-text-field>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" class="mx-6" v-model="product.price_two"></v-text-field>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" class="mx-6" v-model="product.price_three"></v-text-field>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" class="mx-6" v-model="product.price_four"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="4" class="px-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <span style="margin:auto; font-weight:500;">
                                CON IVA
                            </span>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" v-model="iva.price" class="mx-6"></v-text-field>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" v-model="iva.price_two" class="mx-6"></v-text-field>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" v-model="iva.price_three" class="mx-6"></v-text-field>
                        </div>
                        <div class="tabla">
                            <v-text-field style="margin:auto;" prefix="$" v-model="iva.price_four" class="mx-6"></v-text-field>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-row class="ma-0" style="border:solid 1px grey;">
                    <v-col cols="5" class="pa-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <span style="margin:auto; font-weight:500;">COSTO</span>
                        </div>
                        <div class="tabla" style="height:360px!important;">
                            <v-text-field style="margin:auto;" v-model="product.cost" prefix="$" class="mx-6"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="7" class="pa-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <span style="margin:auto; font-weight:500;">UTILIDAD</span>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span>{{((product.price*1)-(product.cost*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <v-chip color="#e4e4e4" style="font-weight:500">{{((100/product.price)*((product.price*1)-(product.cost*1))).toFixed(2)}}%</v-chip>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span>{{((product.price_two*1)-(product.cost*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <v-chip color="#e4e4e4" style="font-weight:500">{{((100/product.price_two)*((product.price_two*1)-(product.cost*1))).toFixed(2)}}%</v-chip>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span>{{((product.price_three*1)-(product.cost)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <v-chip color="#e4e4e4" style="font-weight:500">{{((100/product.price_three)*((product.price_three*1)-(product.cost*1))).toFixed(2)}}%</v-chip>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span>{{((product.price_four*1)-(product.cost*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <v-chip color="#e4e4e4" style="font-weight:500">{{((100/product.price_four)*((product.price_four*1)-(product.cost*1))).toFixed(2)}}%</v-chip>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <!-- Tabla -->
        <v-data-table
        v-if="product.item_shopping_details!=undefined"
        class="pa-4"
        :items="product.item_shopping_details" 
        :headers="header"
        :loading="isLoadingProducts">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Historial de Compras</v-toolbar-title>
                </v-toolbar>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de compras para este producto
            </template>
            <!-- Proveedor -->
            <template v-slot:[`item.shopping.provider`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/providers/'+ item.shopping.provider.id}">{{item.shopping.provider.name}}</v-list-item>
            </template>
            <!-- Compra -->
            <template v-slot:[`item.shopping.id`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/shoppings/'+ item.shopping.id}">{{item.shopping.id}}</v-list-item>
            </template>
            <!-- Costo -->
            <template v-slot:[`item.unit_cost`]="{ item }">
                {{(item.unit_cost*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <!-- Total -->
            <template v-slot:[`item.total`]="{ item }">
                {{(item.unit_cost*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
        </v-data-table>
        
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import importProducts from "../products/import.vue"
export default {
    components:{
        'import-products': importProducts
    },
    data:()=>({
        dialog:false,
        search:false,
        provider_id:'',
        newProduct:'',
        product_id:'',
        product:{
            id:'',
            name:'',
            code_one:'',
            code_two:'',
            code_three:'',
            price:0,
            price_two:0,
            price_three:0,
            price_four:0,
            sat_key_code:'',
            provider:'',
            item_shopping_details:undefined,
            cost:0
        },
        iva:{
            price:0,
            price_two:0,
            price_three:0,
            price_four:0
        },
        entries:{
            products: []
        },
        isLoadingProducts: false,
        searchProducts: null,
        createProvider:{
            name:'',
        },
        iva_pause:false,
        no_iva_pause:false,
    }),
    watch: {
        product_id:{
            handler(){
                this.product = this.productsList.filter(product=>product.id == this.product_id)[0]
            }, deep:true
        },
        searchProducts(val){
            //if (this.companyLists.length > 0) return
            //if(this.search){
                if (this.isLoadingProducts) return
                this.isLoadingProducts = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]='+val)
                .then(res => {
                    this.entries.products = res.data.data
                }).finally(() => (this.isLoadingProducts = false, this.search = false))
            //}
            
        },
        price:{
            handler: function (val, oldVal) {
                if(val.iva!=oldVal.iva){
                    this.no_iva_pause = true
                }else if(val.price!=oldVal.price){
                    this.iva_pause = true
                }
                if(!this.no_iva_pause){
                    this.iva_pause = true
                    this.iva.price = (this.product.price*1.16).toFixed(2)
                }else{
                    this.no_iva_pause = false
                }
                if(!this.iva_pause){
                    this.no_iva_pause = true
                    this.product.price = (this.iva.price/1.16).toFixed(2)
                }else{
                    this.iva_pause = false
                }
            },deep:true,
        },
    },
    computed: {
        header(){ return [
            { text: 'Fecha', value: 'shopping.date' },
            { text: 'Cantidad', value: 'quantity' },
            { text: 'Costo Unitario', value: 'unit_cost' },
            { text: 'Total', value: 'total' },
            { text: 'Proveedor', value: 'shopping.provider' },
            { text: 'Compra', value: 'shopping.id' },
        ]},
        price(){
            return {price:this.product.price, iva:this.iva.price}
        },
        productsList(){
            return this.entries.products.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                    code_one:id.code_one,
                    code_two:id.code_two,
                    code_three:id.code_three,
                    price:id.price,
                    price_two:id.price_two,
                    price_three:id.price_three,
                    price_four:id.price_four,
                    sat_key_code:id.sat_key_code,
                    provider:this.provider(id.latestShopping),
                    item_shopping_details:id.item_shopping_details,
                    cost:this.cost(id.cost, id.latestShopping),
                }
            })
        },
        providers:{
            get(){
                return this.$store.state.provider.providers;
            }
        },
    },
    methods:{
        

        cost(cost, latest){
            if(latest!=undefined){
                return latest.unit_cost
            }else{
                return cost
            }
        },
        provider(latestShopping){
            if(latestShopping!=undefined){
                return latestShopping.shopping.provider
            }else{
                return ''
            }
        },
        saveProvider(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/item/pos",Object.assign(this.createProvider)).then(response=>{
                this.$store.dispatch('provider/getProviders')
            }) 
        },
        saveProduct(){
            var new_product = [this.product].map(id=>{return{
                name:this.newProduct,
                code_one:id.code_one,
                code_two:id.code_two,
                code_three:id.code_three,
                price:id.price,
                price_two:id.price_two,
                price_three:id.price_three,
                price_four:id.price_four,
                sat_key_code:id.sat_key_code,
                provider_id:this.provider_id,
                cost:id.cost
            }})[0]
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/item/create", new_product).then(response=>{
                this.$store.dispatch('provider/getProviders')
            }) 
        },
        modifyProduct(){
            if(this.provider_id!=''){
                this.product.provider_id = this.provider_id
            }
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/item/pos", this.product).then(response=>{
                this.$store.dispatch('provider/getProviders')
            }) 
        },
        closeImportDialog: function(params) {
            this.dialog = params;
        },
    }
}
</script>

<style>
.tabla{
    border: solid 1px grey!important;
    border-radius: 0px!important;
    height:90px;
    display: flex!important;
}
</style>