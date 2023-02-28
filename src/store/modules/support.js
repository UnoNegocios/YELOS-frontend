import axios from "axios";
const state = {
    tickets:[],
    loader:true,
    total:0
};
const getters = {};

const actions = {
    getSupportTickets( {commit, state}, props){
        state.loader = true
        return new Promise((resolve, reject) => {
            const { sortBy, sortDesc, page, itemsPerPage } = props.options
            var link = ''
            if(sortBy.length === 1){
                if(sortDesc[0]){
                    link = link + "sort=-" + sortBy[0] + '&'
                }else{
                    link = link + "sort=" + sortBy[0] + '&'
                }
            }
            if(props.search!=''){
                link = link + 'filter[description]=' + props.search + '&'
            }
            if(props.user.id!=1 && props.user.job_position=='Dirección'){
                link = link + 'filter[issuer_info.id]=' + props.user.id
            }
            axios.get(process.env.VUE_APP_SUPPORT_ROUTE + "api/v1/support_tickets?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                commit('setTotalTickets', response.data.meta.total);
                commit('setSupportTickets', response.data.data);
            }).finally(() => (state.loader = false))
        })
    },
    createSupporTicket( { commit }, ticket){
        return new Promise((resolve, reject) => {
            axios.post(process.env.VUE_APP_SUPPORT_ROUTE  + 'api/v1/support_tickets', ticket).then(response=>{
                commit('addSupportTickets', response.data.data);
                resolve({ticket, type:'success'})
            }).catch(error=>{
                resolve({error, type:'error'})
            })
        })
    }
};

const mutations = {
    setSupportTickets(state, data){
        state.tickets = data;
    },
    setTotalTickets(state, data){
        state.total = data;
    },
    addSupportTickets(state, data){
        state.tickets.push(data);
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}