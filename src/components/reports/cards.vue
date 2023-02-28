<template>
    <v-container>
        <v-toolbar class="elevation-0">
            <v-toolbar-title>Reportes </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y :close-on-content-click="closeDatePicker(dates)">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on" class="ml-4">mdi-calendar-search</v-icon>
                    {{dates[0]}} - {{dates[1]}}
                </template>
                <v-date-picker v-model="dates" range></v-date-picker>
            </v-menu>
        </v-toolbar>

        <div>
            <v-toolbar-title class="ml-2 mt-4"><strong>Ventas</strong></v-toolbar-title>
            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                        <span style="font-size:12px;"><strong>Subtotal</strong></span>
                        <br/>{{(totals.sum_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>IVA</strong></span>
                        <br/>{{(totals.sum_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Total</strong></span>
                        <br/>{{(totals.sum_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#33a952" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Cobranza de Ventas</strong></span>
                        <br/>{{(totals.sum_payments*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_payments*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#fbbc04" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Cuentas por Cobrar</strong></span>
                        <br/>{{(totals.sum_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Cobranza Vencida</strong></span>
                        <br/>{{(totals.sum_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#2fc5ff" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Utilidad de Ventas</strong></span>
                        <br/>{{(totals.sum_utilities*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_utilities*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#9c27b0" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Kilos Vendidos</strong></span>
                        <br/>{{(totals.sum_weights*1).toFixed(2)}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_weights*1).toFixed(2)}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>En Credito</strong></span>
                        <br/>{{(totals.sum_credit*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(totals.avg_credit*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
            </v-row>

            <v-toolbar-title class="ml-2 mt-4"><strong>Cobranza </strong> </v-toolbar-title>

            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2" v-for="(total, index) in collection_totals" v-bind:key="index">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-row class="ma-0 my-2">
                            <v-icon x-small :color="colors[index]" class="mr-1">mdi-circle</v-icon> 
                            <span style="font-size:12px;"><strong>{{total.method}}</strong></span>
                            <v-spacer></v-spacer>
                            <span style="font-size:12px; color:grey;">Total:<strong>{{(total.total).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                        </v-row>
                        <span style="font-size:13px;">Serie A: </span>
                        <strong>{{(total.sum_serie_a).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        <br/>
                        <span style="font-size:13px;">Serie B: </span>
                        <strong>{{(total.sum_serie_b).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </v-card>
                </v-col>
            </v-row>

            <v-toolbar-title class="ml-2 mt-4"><strong>Inventario</strong></v-toolbar-title>

            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-4 px-4 elevation-0" v-if="inventory_loader">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            class="ma-0"
                        ></v-progress-circular>
                    </v-card>
                    <v-card class="py-2 px-4 elevation-0" v-else>
                        <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Costo</strong></span>
                        <br/><span>{{inventory_totals.total_inventory_cost}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{inventory_totals.avg_inventory_cost}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-4 px-4 elevation-0" v-if="inventory_loader">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            class="ma-0"
                        ></v-progress-circular>
                    </v-card>
                    <v-card class="py-2 px-4 elevation-0" v-else>
                        <v-icon x-small color="#47bdc6" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Kilos</strong></span>
                        <br/><span>{{inventory_totals.total_inventory}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{inventory_totals.avg_inventory}}</strong></span>
                    </v-card>
                </v-col>
            </v-row>

            <v-toolbar-title class="ml-2 mt-4"><strong>Gastos</strong></v-toolbar-title>

            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Total</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/>
                        <span style="font-size:12px;">Serie A: </span>
                        <strong style="font-size:13px;">{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        <br/>
                        <span style="font-size:12px;">Serie B: </span>
                        <strong style="font-size:13px;">{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Pagado</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/>
                        <span style="font-size:12px;">Serie A: </span>
                        <strong style="font-size:13px;">{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        <br/>
                        <span style="font-size:12px;">Serie B: </span>
                        <strong style="font-size:13px;">{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#ea4435" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Pendiente</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/>
                        <span style="font-size:12px;">Serie A: </span>
                        <strong style="font-size:13px;">{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        <br/>
                        <span style="font-size:12px;">Serie B: </span>
                        <strong style="font-size:13px;">{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </v-card>
                </v-col>
            </v-row>

            <v-toolbar-title class="ml-2 mt-4"><strong>Compras</strong></v-toolbar-title>

            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                        <span style="font-size:12px;"><strong>Subtotal</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>IVA</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#ff6d00" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>ISR</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Total</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Pagado</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0" disabled>
                        <v-icon x-small color="#4385f3" class="mr-1">mdi-circle</v-icon> 
                        <span style="font-size:12px;"><strong>Pendiente</strong></span>
                        <br/><span>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
            </v-row>

            <v-toolbar-title class="ml-2 mt-4"><strong>Envíos</strong></v-toolbar-title>

            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                        <span style="font-size:12px;"><strong>{{shipping_totals[0].label}}</strong></span>
                        <br/>{{(shipping_totals[0].total*1).toFixed(2)}} Kms
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(shipping_totals[0].avg*1).toFixed(2)}} Kms</strong></span>
                    </v-card>
                </v-col>
                <v-col md="4" sm="6" class="px-2">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                        <span style="font-size:12px;"><strong>{{shipping_totals[1].label}}</strong></span>
                        <br/>{{(shipping_totals[1].total*1).toFixed(2)}} Kgs
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(shipping_totals[1].avg*1).toFixed(2)}} Kgs</strong></span>
                    </v-card>
                </v-col>
            </v-row>

            <v-toolbar-title class="ml-2 mt-4"><strong>Nominas</strong></v-toolbar-title>

            <v-row class="ma-0">
                <v-col md="4" sm="6" class="px-2" v-for="(total, index) in payroll_totals" v-bind:key="index">
                    <v-card class="py-2 px-4 elevation-0">
                        <v-icon x-small color="#47bdc6" class="mr-1">mdi-record</v-icon> 
                        <span style="font-size:12px;"><strong>{{total.label}}</strong></span>
                        <br/>{{(total.sum*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/><span style="font-size:12px; color:grey;">Promedio:<strong>{{(total.avg*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong></span>
                    </v-card>
                </v-col>
            </v-row>

        </div>
    </v-container>
</template>

<script>

export default {
    props:{
        company:String
    },
    data: () => ({
        colors:['#47bdc6', '#ff6d00', '#4385f3', '#33a952'],
        dates:[]
    }),
    watch:{
        dates:{
            handler(){
                if(this.dates.length==2){
                    this.$store.dispatch('quotation/getReports', this.dates)
                    this.$store.dispatch('collection/getReports', this.dates)
                    this.$store.dispatch('payroll/getReports', this.dates)
                    this.$store.dispatch('items/getReports', this.dates)
                    this.$store.dispatch('shopping/getReports', this.dates)
                    this.$store.dispatch('expense/getReports', this.dates)
                    this.$store.dispatch('shipping/getReports', this.dates)
                }
            },deep:true,
        }
    },
    created(){
        var date_between = []
        var date = new Date()
        date_between[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        date_between[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)

        this.$store.dispatch('quotation/getReports', date_between)
        this.$store.dispatch('collection/getReports', date_between)
        this.$store.dispatch('payroll/getReports', date_between)
        this.$store.dispatch('expense/getReports', date_between)
        this.$store.dispatch('shipping/getReports', date_between)
    },
    computed:{
        payroll_totals(){
            return this.$store.state.payroll.reports
        },
        totals(){
            return this.$store.state.quotation.reports
        },
        collection_totals(){
            return this.$store.state.collection.reports
        },
        inventory_totals(){
            return this.$store.state.item.reports
        },
        inventory_loader(){
            return this.$store.state.item.loader
        },
        shopping_totals(){
            return this.$store.state.shopping.reports
        },
        expense_totals(){
            return this.$store.state.expense.reports
        },
        shipping_totals(){
            return this.$store.state.shipping.reports
        },
    },
    methods:{
        closeDatePicker(dates){
            if(dates!=undefined && dates.length==2){
                return true
            }else{
                return false
            }
        },     
    }
}
</script>
<style>
.botonPerron {
    background: white;
    border-radius: 5px;
    height: 25px!important;
    margin-bottom: -17px;
    width: 90px!important;
}
</style>