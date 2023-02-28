<template>
    <v-container >
        <v-row class="ma-0 mt-2 pl-5">
            <strong>cart ({{cartCount}})</strong>
        </v-row>
        <v-row  id="scroll-target" style="height: 80vh;  overflow-x:hidden;" class="overflow-y-auto">
            <v-list class="pb-0" style="max-width: 250px;">
                <v-list-item v-for="(item,index) in StoreCart" :key="index" style="border-bottom:1px solid #e0e0e0; margin-left:5px">
                    <v-list-item-content style="padding-top: 10px!important;">
                        <div style="font-size: 15px!important; font-weight:500;"> {{item.product.name}}</div>
                        <div style="font-size: 14px!important;">c/u = {{(item.product.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</div>
                        <!--div style="font-size: 14px!important;">subtotal = {{(item.product.price * item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</div-->
                        <v-row class="ma-0 px-2" style="background: #ecedf3; padding-top: 4px; border-radius: 5px; margin-top: 4px!important;">
                            <v-btn style="margin-top:-4px;" class="mr-4" icon small @click="downItem(index)">
                                <v-icon small>  mdi-minus </v-icon>
                            </v-btn>
                            ({{item.quantity}})
                            <v-btn style="margin-top:-4px;" class="ml-4" icon small @click="upItem(item.product.id, index)">
                                <v-icon small>  mdi-plus </v-icon>
                            </v-btn>
                            <v-spacer/>
                            <v-btn style="margin-top:-4px;" icon small @click="removeItem(index)">
                                <v-icon small>  mdi-delete </v-icon>
                            </v-btn>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>   
            </v-list>
        </v-row>
        <v-row>
            <v-col class="total pa-0">
                <v-card tile class="pa-6 pt-2">
                    <v-switch v-model="ticket.type" inset label="Factura" ></v-switch>
                    <strong>Sub-Total:</strong> {{subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br>
                    <strong>IVA:</strong> {{iva.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br>
                    <strong>Total:</strong> {{((subtotal*1)+(iva*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </v-card>
                <v-card tile color="primary"><!-- # d71182 -->
                    <v-list-item link @click="save()" dark>
                        <v-list-item-content style="color:white;"><!-- #32241c -->
                            <strong>PAGAR</strong>
                        </v-list-item-content>
                    </v-list-item>    
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialogo ticket -->
        <v-dialog v-model="dialogTicket" max-width="350px">
            <ticket @cerrar="cerrarTicket" v-bind:ticket="ticket"></ticket>
        </v-dialog> 
    </v-container>
</template>

<script>
import axios from "axios";
import Ticket from "../pos/Ticket"
export default {
    props:{
        cliente:String,
    },
    components: {
        'ticket':Ticket,
    },
    data:()=>({
        rebajo:'',
        dialogPago:false,
        dialogTicket:false,
        menu:false,
        menu2:false,
        menu3:false,
        ticket:{
            company_id:null,
            user_id:'',
            note:'',
            items:[{
                quantity:1,
                item:'',
                price:''
            }],
            status:'vendido',
            bar:true,
            subtotal:'',
            date:'',
            type:'',
            iva:'',
            total:'',
            invoice:'',
            created_by_user_id:'',
            last_updated_by_user_id:'',
        },

    }),
    computed: {
        methodList:{
            get(){
                var response = this.$store.state.payment_method.payment_methods
                if(process.env.VUE_APP_BACKEND_ROUTE == "https://backend.ferreteriaenlinea.com/"){
                    return response.filter(method=>method.method != 'Tarjeta')
                }else{
                    return response
                }
                
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        StoreCart() {
            return this.$store.state.cart.carts
        },
        cartCount() {
            var sum = 0
            for(var i=0; i<this.StoreCart.length; i++){
                sum = sum + this.StoreCart[i].quantity
            }
            return sum
        },
        subtotal: function(){
            var sum = 0;
            this.StoreCart.forEach(e => {
                sum += (Number(e.quantity*e.product.price)/1.16);
            });
            return sum
        },
        iva: function(){
            var sum = 0;
            this.StoreCart.forEach(e => {
                sum += ((Number(e.quantity*e.product.price))/1.16)*.16;
            });
            return sum
        },
    },
    created(){
        this.$store.dispatch('currentUser/getUser')
    },
    methods: {
        add(index) {
            this.ticket.methods.push({ id: '', amount: '' });
        },
        remove(index) {
            this.ticket.methods.splice(index, 1);
        },
        removeItem(index) {
            this.$store.dispatch('cart/removeItem', index);
        },
        downItem(index) {
            this.$store.dispatch('cart/downItem', index);
        },
        upItem(id, index) {
            this.$store.dispatch('cart/upItem', {'id':id, 'index':index});
        },
        save(){
            var serie = ''
            if(this.ticket.type){
                serie = 'Serie A'
            }else{
                serie = 'Serie B'
            }
            this.ticket = {
                company_id:this.$store.state.cart.client.id,
                user_id:this.currentUser.id,
                note:'',
                items:this.StoreCart.map(id=>{return{
                    quantity:id.quantity,
                    item:id.product.id,
                    price:id.product.price,
                    cost:id.product.cost,
                    value:id.product.price,
                }}),
                status:'vendido',
                bar:true,
                subtotal:this.subtotal,
                iva:this.iva,
                total:(this.subtotal*1) + (this.iva*1),
                date:new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10),
                created_by_user_id:this.currentUser.id,
                last_updated_by_user_id:this.currentUser.id,
                id:'',
                type:serie
            },
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sales', this.ticket).then(reponse => {
                console.log(reponse.data)
                this.ticket.id = reponse.data//repsonse
                this.dialogTicket=true;
            })
        },
        cerrarTicket: function(params) {
            this.dialogTicket=false;
            location.reload();
        },
    },
};
</script>

<style>
.total{
    position:absolute!important; 
    bottom:0!important;
}
</style>


precio mostrador -> 3
precio mayoreo -> 1


permiso venta precio menor que costo y producto en $0.00


Todos los productos son con iva en ferreteria y en efi sin iva