<template>
    <v-container style="max-width:100vw;">
        <!--header-->
        <v-toolbar flat class="px-4 py-3">
            <v-toolbar-title>
                Soporte
            </v-toolbar-title>
            <v-spacer/>
            <v-btn icon v-if="!show_search_input" @click="show_search_input=true">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-text-field class="mt-4" v-model="search_input" v-if="show_search_input" label="Buscador"></v-text-field>
            <v-btn v-if="show_search_input" icon @click="closeSearchInput()">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-data-table 
        height="500"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, totalTickets]}"
        :headers="headers" 
        :items="tickets"
        class="elevation-0 px-12 pb-2"
        :options.sync="options"
        :server-items-length="totalTickets"
        :loading="loading"
        :item-class="itemRowBackground + ' cursor-detail'"
        @click:row="handleClick">
            <template v-slot:[`item.priority`]="{ item }">
                <v-chip small :style="
                'background:'
                + priorityColor(item.priority) +
                '; font-weight:600; border:solid 2px '
                + priorityColor(item.priority) +
                '; color:'
                + priorityColor(item.priority) +
                '; background-image: radial-gradient(rgb(255 255 255 / 90%),rgb(255 255 255 / 90%))'
                ">{{item.priority}}</v-chip>
            </template>
            <template v-slot:[`item.created_at`]="{ item }">
                {{date(item)}}
            </template>
        </v-data-table>
        <!-- create ticket -->
        <v-dialog v-model="detail_dialog" max-width="900px">
          <detail v-bind:ticket="ticket" @closeDetailDialog="closeDetailDialog"/>
        </v-dialog>
        <!-- detalle ticket -->
        <v-dialog v-model="create_dialog" max-width="1200px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:ticket="edited_ticket" @closeCreateDialog="closeCreateDialog"/>
        </v-dialog>
    </v-container>
</template>

<script>
import Create from "../support/create"
import Detail from "../support/detail"
export default {
    components: {
        'create':Create,
        'detail':Detail
    }, 
    data: () => ({
        ticket:{},
        edited_ticket:{},
        show_search_input:false,
        search_input:'',
        create_dialog:false,
        detail_dialog:false,
        headers:[
            { text: 'Folio', value: 'id' },
            { text: 'Asunto', value: 'issue' },
            { text: 'Modulo', value: 'module' },
            { text: 'Acción', value: 'action' },
            { text: 'Prioridad', value: 'priority' },
            { text: 'Fecha', value: 'created_at' },
            { value: 'actions', sortable: false, align: 'end' }
        ],
        options:{}
    }),
    watch: {
        currentUser: {
            handler () {
                this.$store.dispatch('support/getSupportTickets', {options: this.options, search:this.search_input, user:this.currentUser})
            },
            deep: true,
        },
        options: {
            handler () {
                this.$store.dispatch('support/getSupportTickets', {options: this.options, search:this.search_input, user:this.currentUser})
            },
            deep: true,
        },
        search_input: {
            handler () {
                this.$store.dispatch('support/getSupportTickets', {options: this.options, search:this.search_input, user:this.currentUser})
            },
            deep: true,
        },
    },
    computed:{
        totalTickets(){
            return this.$store.state.support.total
        },
        tickets(){
            return this.$store.state.support.tickets
        },
        loading(){
            return this.$store.state.support.loader
        },
        currentUser(){
            return this.$store.state.currentUser.user
        }
    },
    methods:{
        date(item){
            if(item.created_at.for_humans.includes('día')){
                return item.created_at.date_format
            }else{
                return item.created_at.for_humans
            }
        },
        handleClick(row){
            this.ticket = row
            this.detail_dialog = true
        },
        priorityColor(priority){
            switch(priority){
                case 'Baja': return 'green'
                case 'Media': return 'blue'
                case 'Alta': return 'orange'
                case 'Urgente': return 'red'
            }
        },
        closeSearchInput(){
            this.search_input = ''
            this.show_search_input = false
        },
        closeCreateDialog: function(params) {
            this.create_dialog = false;
            
        },
        closeDetailDialog: function(param) {
            this.detail_dialog = param;
        },
        itemRowBackground: function (item) {
            return item.status == 'pending' ? 'pending' : 'normal'
        },
    }
}
</script>

<style>
    .pending {
        background-color: #fff5d7
    }
    .cursor-detail{
        cursor: pointer;
    }
</style>