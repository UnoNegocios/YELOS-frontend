<template>
    <v-container class="pa-0">
        <v-card class="pa-4">
            <v-card-title class="pb-0 pt-1"> 
                {{type}} de Ticket de Soporte
                <v-spacer/>
                <v-select v-if="currentUser.job_position=='Dirección'||currentUser.id==1" v-model="editedItem.priority" label="Prioridad" :items="priorities"></v-select> 
            </v-card-title>
            <v-form class="mx-4 mt-6">
                <v-row class="ma-0">
                    <v-col cols="6">
                        <v-autocomplete v-model="editedItem.module" label="Modulo" :items="modules">
                            <template slot="no-data" class="pa-2"><span class="px-4">No existen modulos relacionados.</span></template>           
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="editedItem.action" label="Acción" :items="actions"></v-select>
                    </v-col>
                </v-row>
                <v-text-field class="px-3" label="Asunto" v-model="editedItem.issue"></v-text-field>
                <v-textarea class="px-3" label="Descripción del Problema" v-model="editedItem.description"></v-textarea>
            </v-form>
            <v-card-actions>
                <v-spacer/>
                <v-btn @click="close()" text>Cancelar</v-btn>
                <v-btn @click="save()" text color="primary">Guardar</v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>

export default {
    props:{
        ticket:Object
    },   
    data: () => ({
        editedItem:{
            description:'',
            module:'',
            action:'',
            issuer_info:'',
            priority:'Baja',
            issue:''
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        block_button:false,
        type:'Creación',
        actions:['Creación', 'Edición', 'Eliminar', 'Ver', 'Función Nueva'],
        priorities:['Baja', 'Media', 'Alta', 'Urgente'],
        modules:['Actividades', 'Calendario', 'Clientes', 'Prospectos', 'Cotizaciones', 'Ventas', 'Cancelaciones', 'Cobranza', 'Reportes', 'Ferretería', 'Envíos', 'Pedidos por Surtir', 'Envíos', 'Gastos', 'Compras', 'Pagos a Proveedores', 'Proveedores', 'Producción', 'Productos', 'Inventario de Productos', 'Ajuste de Inventario de Productos', 'Inventario Físico de Productos', 'Movimientos de Intentario de Productos', 'Nominas', 'Utilidades', 'Bitacora']
    }),
    computed:{
        currentUser(){
            return this.$store.state.currentUser.user
        }
    },
    watch:{
        ticket:{
            handler(){
                if(this.ticket!=''){
                    this.type = 'Edición'
                    this.editedItem = this.ticket
                }
            }, deep:true
        }
    },
    methods:{
        close(ticket){
            this.editedItem = Object.assign({}, this.defaultItem)
            this.block_button = false
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", ticket);
            })
        },
        save(){
            this.block_button = true
            this.editedItem.issuer_info = {
                name:this.currentUser.name + ' ' + this.currentUser.last,
                email: this.currentUser.email,
                id: this.currentUser.id,
                job_position: this.currentUser.job_position,
                sub_job_position: this.currentUser.sub_job_position
            }
            this.$store.dispatch('support/createSupporTicket', this.editedItem).then(response=>{
                if(response.type=='success'){
                    this.close(response)
                }
                else if(response.type=='error'){
                    this.snackbar = {
                        message: response.error,
                        color: 'error',
                        show: true
                    }
                    this.block_button = false
                }
            })
        }
    }
}
</script>

<style>

</style>