<template>
  <v-card class="px-7 pt-4 pb-6" style="background:#efefef;" v-if="show">

    <v-row class="pl-3 ma-0">
        <v-col cols="5" class="px-0">
            <v-card-title style="font-size:21px;" class="pb-4 pl-0"><v-icon class="mr-2">mdi-note-text-outline</v-icon>{{ticket.issue}}</v-card-title>
            <v-card-subtitle class="pb-0 pl-8">
                en la lista de prioridad <v-chip x-small dark :color="priorityColor(ticket.priority)"><strong>{{ticket.priority}}</strong></v-chip>
            </v-card-subtitle>
            <v-card-subtitle class="py-0 ml-4 mt-2">
                Modulo: <v-chip small>{{ticket.module}}</v-chip>
            </v-card-subtitle>
            <v-card-subtitle class="py-0 ml-4 mt-2">
                Acción: <v-chip small>{{ticket.action}}</v-chip>
            </v-card-subtitle>
        </v-col>
        <v-col cols="6" class="px-0">
            <v-row class="ma-0 px-5">
                <v-col class="pt-0">
                    <v-card-subtitle class="pl-0"><strong>Atendido por:</strong></v-card-subtitle>
                    <v-avatar v-if="ticket.user!=undefined">
                        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-avatar>
                    <strong v-if="ticket.user!=undefined" class="ml-4">{{ticket.user.name}}</strong>
                </v-col>
                <v-col class="pt-0">
                    <v-card-subtitle class="pl-0"><strong>Status:</strong></v-card-subtitle>
                    <v-chip class="px-6 py-5"><strong>{{ticket.status}}</strong></v-chip>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="1" class="px-0">
            <v-row class="ma-0">
                <v-spacer/>
                <v-btn @click="close()" icon><v-icon>mdi-close</v-icon></v-btn>
            </v-row>
        </v-col>
    </v-row>
    <v-row class="px-3 ma-0 pb-3 mt-3 mb-1" style="background:#eaeaea;">
        <v-card-title style="font-size:18px;" class="pb-1 pl-0"><v-icon class="mr-2">mdi-format-align-left</v-icon>Descripción</v-card-title>
        <v-card-text class="px-8">
            {{ticket.description}}
        </v-card-text>
        <v-chip-group>

            <v-menu top offset-x :close-on-content-click="false">
                <template v-slot:activator="{ on, attrs }">
                    <v-chip text v-bind="attrs" v-on="on" :color="colorFile" dark small><v-icon class="mr-2" small>mdi-attachment</v-icon> Adjuntar archivo</v-chip>
                </template>
                <div style="background:white" class="pa-2">
                    <vue-dropzone v-if="show_drop_zone" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
                    <v-btn v-if="fileName!=''" @click="newFile" lass="elevation-0" dark x-small><v-icon small>mdi-attachment</v-icon>Adjuntar Otro</v-btn>
                </div>
            </v-menu>

            <v-chip v-for="(file, index) in ticket.attached_files" small v-bind:key="index" @click="showImage(file.url, file.extension)">
                <v-icon class="mr-1" small v-if="file.extension=='png'||file.extension=='jpg'||file.extension=='jpeg'||file.extension=='webp'||file.extension=='svg'">mdi-file-image</v-icon>
                <v-icon class="mr-1" small v-else-if="file.extension=='mp4'||file.extension=='mov'">mdi-file-video</v-icon>
                <v-icon class="mr-1" small v-else-if="file.extension=='doc'||file.extension=='docx'">mdi-file-word</v-icon>
                <v-icon class="mr-1" small v-else-if="file.extension=='pdf'">mdi-file-pdf-box</v-icon>
                <v-icon class="mr-1" small v-else-if="file.extension=='ppt'||file.extension=='pptx'">mdi-file-powerpoint</v-icon>
                <v-icon class="mr-1" small v-else-if="file.extension=='xls'||file.extension=='csv'||file.extension=='xlsx'">mdi-file-excel</v-icon>
                <v-icon class="mr-1" small v-else>mdi-attachment</v-icon>
                <strong>Adjunto {{index+1}}</strong>
            </v-chip>

        </v-chip-group>
    </v-row>
    <div class="px-3 ma-0">
        <v-card-title style="font-size:18px;" class="pb-1 pl-0"><v-icon class="mr-2">mdi-comment-text-multiple-outline</v-icon>Comentarios</v-card-title>
        <v-textarea rows="1" auto-grow label="Escriba un comentario..." id="comment" hide-details :value="comment" v-model="comment" outlined class="mt-3 mb-6"></v-textarea>
        <v-row class="mx-3 mb-4" v-if="comment!=''">
            <v-btn class="elevation-0" @click="save()" dark x-small>Guardar</v-btn>
            <v-spacer/>
            <v-btn class="elevation-0" dark x-small><v-icon small>mdi-attachment</v-icon>Adjuntar Archivo</v-btn>
        </v-row>
        <template v-for="(comment, index) in ticket.comments">
            <v-row class="mx-0 my-1" v-bind:key="index">
                <v-col cols="1">
                    <v-avatar><!--v-if="commentSide(comment)=='left'"-->
                        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-avatar>
                </v-col>
                <v-col cols="11">
                    <div><!--:style="'text-align:' + commentSide(comment) + ';'"-->
                        <strong class="ml-4">{{commentUser(comment).name}}</strong><span style="font-size:14px;" class="ml-2">{{date(comment)}}</span>
                    </div>
                    <v-card :style="'background:' + colorComment(commentSide(comment)) + ';'" outlined class="elevation-0 px-4 py-2" style="font-size:14px;">
                        {{comment.content}}
                    </v-card>
                </v-col>
                <!--v-col cols="1" v-if="commentSide(comment)=='right'">
                    <v-avatar>
                        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                    </v-avatar>
                </v-col-->
            </v-row>
        </template>
    </div>
    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
        {{ snackbar.message }}
    </v-snackbar>
    <v-dialog v-model="show_image" width="80vw">
        <v-img max-height="80vh" max-width="80vw" :src="image"></v-img>
    </v-dialog>
    <v-dialog v-model="show_video" width="80vw">
        <video max-height="80vh" max-width="80vw" controls>
            <source :src="video.url" :type="'video/'+video.type">
        </video>
    </v-dialog>
  </v-card>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from 'axios'
export default {
    props:{
        ticket:Object
    }, 
    components: {
        vueDropzone: vue2Dropzone
    }, 
    data: () => ({
        show_image: false,
        image: '',
        video:{
            type:'',
            url:''
        },
        show_video:false,
        show_drop_zone: true,
        comment:'',
        show:true,
        colorFile: 'black',
        fileName:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed:{
        dropzoneOptions(){
            return {
                url: process.env.VUE_APP_SUPPORT_ROUTE + "api/v1/support_tickets/" + this.ticket.id + '/file',
                addRemoveLinks: true,
                maxFiles: 1
            }
        },
        currentUser(){
            return this.$store.state.currentUser.user
        }
    },
    watch:{
        handler:{
            ticket(){
                this.show = false
                this.$nextTick(() => {
                    this.show = true
                })
            }
        }
    },
    methods:{
        showImage(url, extension){
            if(extension=='png'||extension=='jpg'||extension=='jpeg'||extension=='webp'||extension=='svg'){
                this.image = url
                this.show_image = true
            }else if(extension=='mp4'||extension=='mov'){
                this.video = url
                this.show_video = true
            }else{
                window.open(url, '_blank');
            }
        },
        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileName = response.file;
            //this.collection.pdf = this.fileName;
            this.colorFile = 'primary'
        },
        uploadError(file, message) {
            this.snackbar = {
                message: 'No se puedo cargar el archivo',
                color: 'error',
                show: true
            }
            this.colorFile = 'error'
        },
        fileRemoved() {
            
        },
        newFile(){
            this.$refs.myVueDropzone.removeFile(this.fileName)
            this.show_drop_zone = false
            this.fileName = ''
            this.colorFile = 'black'
            this.$nextTick(() => {
                this.show_drop_zone = true
            })
        },
        close(){
            this.$emit("closeDetailDialog", false);
        },
        save(){
            var item = {
                content: this.comment,
                issuer_info: {
                    name:this.currentUser.name + ' ' + this.currentUser.last,
                    email: this.currentUser.email,
                    id: this.currentUser.id,
                    job_position: this.currentUser.job_position,
                    sub_job_position: this.currentUser.sub_job_position
                },
                model_type: 'App\\Models\\SupportTicket',
                model_id: this.ticket.id,
            }
            axios.post(process.env.VUE_APP_SUPPORT_ROUTE + 'api/v1/comments', item).then(response=>{
                this.ticket.comments.unshift([item].map(id=>{
                    return {
                        content: id.content,
                        issuer_info: id.issuer_info,
                        model_id: this.ticket.id,
                        created_at:{
                            date_format: '',
                            for_humans: 'ahora',
                        },
                        user: null,
                    }
                })[0])
                this.comment = ''
            })
        },
        priorityColor(priority){
            switch(priority){
                case 'Baja': return 'green'
                case 'Media': return 'blue'
                case 'Alta': return 'orange'
                case 'Urgente': return 'red'
            }
        },
        date(comment){
            if(comment.created_at.for_humans.includes('día')){
                return comment.created_at.date_format
            }else{
                return comment.created_at.for_humans
            }
        },
        commentUser(comment){
            if(comment.issuer_info!=null){
                return comment.issuer_info
            }else if(comment.user!=null){
                return comment.user
            }
        },
        commentSide(comment){
            if(comment.issuer_info!=null){
                return 'right'
            }else if(comment.user!=null){
                return 'left'
            }
        },
        colorComment(side){
            if(side=='right'){
                return '#f0f0f0'
            }else{
                return '#eaeaea'
            }
        }
    }
}
</script>

<style>

</style>