<template>
    <v-container>
        <v-row class="ma-0">
            <v-col cols="4" class="mb-6" v-for="(ticket, index) in tickets" :key="index" @click="openDialog(ticket)">
                <v-card>
                    <v-card-title>Ticket #<strong style="font-size:30px;" class="ml-2">{{ticket.id}}</strong></v-card-title>
                    <v-card-title class="py-0 my-0">{{ticket.company.attributes.name}}</v-card-title>
                    <v-card-subtitle class="py-0 my-0">{{ticket.company.attributes.razon_social}}</v-card-subtitle>
                    <v-card-subtitle class="py-0 my-0">{{ticket.company.attributes.rfc}}</v-card-subtitle>
                    <v-card-subtitle class="py-0 my-0">ID MACRO: {{ticket.company.attributes.macro}}</v-card-subtitle>
                    <v-card-text style="text-align:right;">Atendió: {{ticket.created_by_user_id.name + ' ' + ticket.created_by_user_id.last}}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" fullscreen>
            <ferreteria v-bind:selected_ticket="selected_ticket" @closeDialog="closeDialog"/>
        </v-dialog>
    </v-container>
</template>

<script>
import Ferreteria from "../ferreteria/dialog"
import axios from "axios"
export default {
    components: {
        'ferreteria':Ferreteria
    },
    data(){
        return{
            selected_ticket:{},
            tickets:[],
            total_tickets:0,
            loading:false,
            dialog:false
        }
    },
    created(){
        this.getDataFromApi()
    },
    methods:{
        closeDialog: function(id) {
            if(id!='close'){
                var index = this.tickets.indexOf(this.tickets.filter(ticket=>ticket.id == id)[0])
                this.tickets.splice(index, 1)
            }
            this.selected_ticket = {}
            this.dialog = false
        },
        openDialog(ticket){
            this.selected_ticket = ticket
            this.dialog = true
        },
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.total_tickets = data.total
                this.tickets = data.items
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                var items = []
                var total = 0
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?itemsPerPage=50").then(response => {
                    items = response.data.data
                    total = response.data.meta.total
                    resolve({
                        items,
                        total,
                    })
                })
            })
        }
    },
    mounted() {
        Echo.channel('test').listen('Test', (e) => {
            this.tickets.concat(e)
        })
    },
}
</script>