<template>
    <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="close()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Importar Productos</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="save()" :disabled="filelist==undefined">
              Importar
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
        <div style="display: flex!important; min-height:calc(100vh - 100px);">

            <v-data-table
            style="margin:auto;"
            v-if="filelist!=undefined&&!dialog"
            class="pa-4"
            :items="insidents" 
            :headers="headers" >
                <template v-slot:top>
                    <v-card-title class="mb-4">Los siguientes productos no podran ser cargados</v-card-title>
                </template>
            </v-data-table>

            <input
                v-else
                style="margin:auto;"
                type="file"
                v-on:change="addfile($event)"
                placeholder="Upload file"
                accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            />
            <v-dialog v-model="dialog" width="700">
                <v-card class="pa-4">
                    <v-card-title class="mb-3">
                        Asignar campos del Excel a los productos
                    </v-card-title>
                    <v-card-subtitle>
                        Selecciona los campos de tu archivo excel para asignarlos a los campos de productos, o para ignorarlos durante la importación
                    </v-card-subtitle>
                    <v-row class="ma-0 px-6 mb-4">
                        <v-col cols="6">
                            <strong>Nombre de la columna</strong>
                        </v-col>
                        <v-col cols="6">
                            <strong>Asignar al campo</strong>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0 px-6" v-for="(header, index) in paired_headers" v-bind:key="index">
                        <v-col cols="6">
                            {{header.excel}}
                        </v-col>
                        <v-col cols="6">
                            <v-select value="value" item-text="text" v-model="header.server" :items="server_headers" label="Columna" dense outlined>
                                
                            </v-select>
                        </v-col>
                    </v-row>
                    <v-card-actions>
                        <v-spacer/>
                        <v-btn color="grey" text class="elevation-0" @click="close()">Cancelar</v-btn>
                        <v-btn color="primary" text class="elevation-0" @click="assign()">Asignar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
import * as XLSX from "xlsx";
export default {
    data:()=>({
        dialog:false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        overlay:false,
        file: File,
        arrayBuffer: null,
        filelist: null,
        excel_headers:[],
        server_headers:[
            { text: 'Nombre', value: 'name', type: 'string, number' },
            { text: 'Costo', value: 'cost', type: 'number' },
            { text: 'Existencia', value: 'inventory', type: 'number' },
            { text: 'Codigo 1', value: 'code_one', type: 'string, number' },
            { text: 'Codigo 2', value: 'code_two', type: 'string, number' },
            { text: 'Codigo 3', value: 'code_three', type: 'string, number' },
            { text: 'Precio 1', value: 'price', type: 'number' },
            { text: 'Precio 2', value: 'price_two', type: 'number' },
            { text: 'Precio 3', value: 'price_three', type: 'number' },
            { text: 'Precio 4', value: 'price_four', type: 'number' },
            { text: 'Codigo SAT', value: 'sat_key_code', type: 'string, number' }
        ],
        headers:[],
        paired_headers:[]
    }),
    computed:{
        insidents(){
            return this.filelist.filter(item=>item.incidents.length>0)
        }
    },
    methods:{
        assign(){
            this.headers = this.paired_headers.filter(header=>header.server!='').map(id=>{return{
                text: this.server_headers.filter(header=>header.value == id.server).map(header=>header.text)[0],
                value: id.server,
                excel: id.excel,
                type: this.server_headers.filter(header=>header.value == id.server).map(header=>header.type)[0],
            }})
            this.filelist = this.filelist.map(id=>{
                return this.checkElements(id)
            })
            this.dialog = false
        },
        checkElements(id){
            var myObj = new Object;
            myObj['incidents'] = []
            for(var i=0; i<this.headers.length; i++){
                var a = this.headers[i].value
                if(id[this.headers[i].excel] === 0){
                    myObj[a] = ''
                }else{
                    myObj[a] = id[this.headers[i].excel]
                }
                if(id[this.headers[i].excel]!=undefined && 
                    id[this.headers[i].excel]!=null && 
                    id[this.headers[i].excel]!='' && 
                    !this.headers[i].type.includes(typeof(id[this.headers[i].excel]))){
                    myObj.incidents.push({value:this.headers[i].value, incident:'valor no admitido'})
                }
            }
            return myObj
        },
        addfile(event) {
            this.file = event.target.files[0];
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(this.file);
            fileReader.onload = (e) => {
                this.arrayBuffer = fileReader.result;
                var data = new Uint8Array(this.arrayBuffer);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i)
                arr[i] = String.fromCharCode(data[i]);
                var bstr = arr.join("");
                var workbook = XLSX.read(bstr, { type: "binary" });
                var first_sheet_name = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet_name];
                //console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                this.filelist = arraylist;
                var keys = Object.keys(arraylist[0])
                //var headers = []
                for(var i=0; i<keys.length; i++){
                    //headers.push({ text: keys[i], value: keys[i] })
                    this.paired_headers.push({ excel: keys[i], server: '' })
                }
                this.dialog = true
            };
        },
        save(){
            this.overlay = true
            console.log(this.filelist)
            console.log(this.filelist)
            var objects = this.filelist.filter(item=>item.incidents.length===0)//.filter(item=>item.incidents.length===0)
            var sets = objects.length/100
            var start = 0
            var end = 100
            
            for(var i=0; i<sets;){
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/items/import', objects.slice(start, end))
                .then(response=>{
                    if(i == (sets - 1)){
                        this.close()
                    }else{
                        start = start + 101
                        end = end + 100
                        i=i+1
                    }
                })
                .catch(error => {
                    i = sets
                    this.overlay = false
                    this.$nextTick(() => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                })
            }
        },
        close(){
            this.dialog = false
            this.snackbar = {
                show: false,
                message: null,
                color: null
            },
            this.overlay = false
            this.file = File
            this.arrayBuffer = null
            this.filelist = null
            this.excel_headers = []
            this.paired_headers = []
            this.headers = []
            this.$nextTick(() => {
                this.$emit("closeImportDialog", false);
            })
        }
    },
}
</script>
