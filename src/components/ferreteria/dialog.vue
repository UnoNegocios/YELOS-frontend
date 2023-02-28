<template>
    <v-container style="max-width:100vw;">

        <v-card class="elevation-0 px-12 py-6" style="min-height:100vh; background:white;">

            <v-row class="ma-0 mb-5"><v-btn icon @click="closeDialog('close')"><v-icon x-large>mdi-chevron-left</v-icon></v-btn></v-row>

            <v-row class="ma-0">
                <v-radio-group v-model="factura" class="mb-4">
                    <v-radio label="Remisión" color="primary" value="remission"></v-radio>
                    <v-radio label="Factura" color="primary" value="invoice"></v-radio>
                </v-radio-group>
                <v-spacer></v-spacer>

                <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on }">
                        <v-text-field rounded outlined class="mt-4" :rules="[v => !!v || 'Campo requerido']" clearable required v-model="editedItem.date" label="Fecha" prepend-inner-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="editedItem.date" @input="datePicker = false"></v-date-picker>
                </v-menu>

                 <!--v-spacer></v-spacer>

                <v-btn @click="type='Venta'" x-large class="elevation-0" color="success" inset v-show="type=='Cancelación'">Regresar a Venta</v-btn>
                <v-btn @click="type='Cancelación'" x-large class="elevation-0" color="error" inset v-show="type=='Venta'">Cancelación</v-btn-->
            </v-row>
            
            <div v-if="type=='Venta'">
                <!-- # factura o remisión-->
                <v-text-field v-model="editedItem.invoice" v-show="factura=='invoice'" label="Factura Macro" rounded outlined prefix="#"></v-text-field>
                <v-text-field v-model="editedItem.remission" v-show="factura=='remission'" label="Remisión Macro" rounded outlined prefix="#"></v-text-field>

                <!-- Moneto de Ticket -->
                <!--v-text-field v-model="editedItem.amount" label="Monto Ticket" rounded type="number" outlined prefix="$"></v-text-field-->

                <!-- Metodos de Pago e Importes -->
                <v-card class="elevation-0">
                    <!-- Titulo -->
                    <v-card-title class="mb-0">
                        <span class="headline">Metodo de Pago</span>
                    </v-card-title>
                    <v-card-text class="pb-0">
                        <v-container style="max-width:100%;">
                        <!-- Formulario -->
                            <v-row class="form-group py-2" v-for="(method,k) in editedItem.methods" :key="k">
                                
                                    <v-select :items="methodList" v-model="method.method" rounded outlined label="Metodo de Pago" item-text="method" item-value="id"></v-select>
                                    <v-text-field rounded outlined class="mx-6" v-model="method.recibido" prefix="$" type="number" label="Importe de Pago"></v-text-field>
                                    <v-btn icon class="mt-3" @click="remove(k)" v-show="k || ( !k && editedItem.methods.length > 1)"><v-icon large color="red">mdi-close</v-icon></v-btn>
                                    <v-btn icon class="mt-3" @click="add(k)" v-show="k == editedItem.methods.length-1"><v-icon large color="primary">mdi-plus</v-icon></v-btn>
                                
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>

            </div>
            <div v-else>
                <v-autocomplete v-model="editedItem.invoice" v-show="factura=='invoice'" label="Factura Macro" rounded outlined :items="invoices" item-text="invoice" item-value="invoice"></v-autocomplete>
                <v-autocomplete v-model="editedItem.remission" v-show="factura=='remission'" label="Remisión Macro" rounded outlined :items="remissions" item-text="remission" item-value="remission"></v-autocomplete>
            </div>

            <!-- Guardar -->

            <v-card-actions class="my-12">
                <v-btn block rounded color="primary" class="pa-12 elevation-0" :loading="gris" :disabled="gris" style="font-size:25px!important;" @click="save">Guardar</v-btn>
            </v-card-actions>


            <v-row class="ma-0 mt-4">

                
                <v-card-subtitle v-if="type=='Venta'" class="pa-12" style="font-size:30px!important; background:#f4f5fb!important;">
                    <strong>Por Pagar = {{(editedItem.amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>

                <v-spacer/>

                <v-card-subtitle v-if="type=='Venta'" class="pa-12" style="font-size:30px!important; background:#f4f5fb!important;">
                    <strong>Pagado = {{(pagado*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>

                <v-spacer/>

                <v-card-subtitle v-if="type=='Venta'" class="pa-12" style="font-size:30px!important; background:#f4f5fb!important;">
                    <strong v-if="cambio>0">Cambio = {{(cambio*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    <strong v-else>Faltan = {{(cambio*-1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>
            </v-row>


        </v-card>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    props:{
        selected_ticket:Object
    },
    data () {
        return {
            datePicker:'',
            type:'Venta',
            factura:'',
            editedItem: {
                serie:'',
                macro:true,
                date:new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10),
                payment_method_id:'',
                amount:'',
                invoice:'',
                note:'',
                pdf:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
                user_id:'',
                company_id:'',
                remission:'',
                salesID:[],
                methods:[{
                    method:'',
                    amount:'',
                    recibido:''
                }]
            },
            gris:false,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
        }
    },
    created(){
        this.editedItem.amount = this.selected_ticket.subtotal*1
        this.editedItem.salesID=[this.selected_ticket]
        if(this.selected_ticket.type == 'Serie A'){
            this.factura = 'invoice'
        }else if(this.selected_ticket.type == 'Serie B'){
            this.factura = 'remission'
        }
        this.editedItem.date = new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
    },
    watch:{
        selected_ticket:{
            handler(){
                this.editedItem.amount = this.selected_ticket.subtotal
                this.editedItem.salesID=[this.selected_ticket].map(id=>{ return{
                    amount: id.total,
                    due: id.total,
                    newDue: ((id.total*1) - (this.editedItem.amount*1)),
                    id: id.id
                }})
                if(this.selected_ticket.type == 'Serie A'){
                    this.factura = 'invoice'
                }else if(this.selected_ticket.type == 'Serie B'){
                    this.factura = 'remission'
                }
            }, deep: true
        }
    },
    computed:{
        remissions(){
            return this.$store.state.collection.collections.filter(collection=>collection.remission!=undefined)
        },
        invoices(){
            return this.$store.state.collection.collections.filter(collection=>collection.invoice!=undefined)
        },
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
        cambio(){
            return  this.pagado - (this.editedItem.amount*1)
        },
        pagado(){
            var sum = 0
            this.editedItem.methods.forEach(e => {
                sum += (Number(e.recibido));
            });
            return  sum
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        }
    },
    methods: {
        closeDialog (ticket_id) {
            this.editedItem = {
                serie:'',
                macro:true,
                date:new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10),
                payment_method_id:'',
                amount:'',
                invoice:'',
                note:'',
                pdf:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
                user_id:'',
                company_id:'',
                remission:'',
                salesID:[],
                methods:[{
                    method:'',
                    amount:'',
                    recibido:''
                }]
            },
            this.$nextTick(() => {
                this.$emit("closeDialog", ticket_id);
            })
        },
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        paymentMethod(id){
            return this.$store.state.payment_method.payment_methods.filter(method=>method.id == id).map(method=>method.method)[0]
        },
        add(index) {
            var sum = 0
            var resultado = 0
            resultado = this.cambio*-1
            this.editedItem.methods.push({ method: '', recibido: resultado.toFixed(2) });
        },
        remove(index) {
            this.editedItem.methods.splice(index, 1);
        },
        save(){
            this.editedItem.payment_method_id = this.editedItem.methods[0].method
            this.gris = true
            this.editedItem.created_by_user_id = this.currentUser.id
            this.editedItem.last_updated_by_user_id = this.currentUser.id
            this.editedItem.user_id = this.currentUser.id
            if(this.factura == 'invoice'){
                this.editedItem.remission = ''
                this.editedItem.serie = 'Serie A'
            }else if(this.factura == 'remission'){
                this.editedItem.invoice = ''
                this.editedItem.serie = 'Serie B'
            }
            if(this.type == 'Venta'){
                for(var i=0; i<this.editedItem.methods.length; i++){
                    if(this.lowerCase(this.paymentMethod(this.editedItem.methods[i].method)) == 'efectivo'){
                        this.editedItem.methods[i].amount = (this.editedItem.methods[i].recibido*1) - (this.cambio*1)
                    }else{
                        this.editedItem.methods[i].amount = this.editedItem.methods[i].recibido
                    }
                }
            }else if(this.type == 'Cancelación'){
                if(this.factura == 'remission'){
                    var oldCollection = this.$store.state.collection.collections.filter(collection=>collection.remission==this.editedItem.remission)[0]
                }
                else if(this.factura == 'invoice'){
                    var oldCollection = this.$store.state.collection.collections.filter(collection=>collection.invoice==this.editedItem.invoice)[0]   
                }
                this.editedItem.amount = oldCollection.amount*(-1)
                this.editedItem.methods = oldCollection.methods

                for(var j=0; j<this.editedItem.methods.length; j++){
                    this.editedItem.methods[j].amount = this.editedItem.methods[j].amount*(-1)
                }
            }
            this.editedItem.salesID = this.editedItem.salesID.map(id=>{ return{
                amount: id.total,
                due: id.total,
                newDue: ((id.total*1) - (this.editedItem.amount*1)),
                id: id.id,
                invoice: this.editedItem.invoice,
                invoice_date : this.editedItem.date
            }})
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/collection/create",Object.assign(this.editedItem)).then(response=>{
                    this.closeDialog(this.selected_ticket.id)
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                })
            })
        },
    }
}
</script>

<style>
.v-label, .v-input {
    font-size: 23px!important;
}
</style>