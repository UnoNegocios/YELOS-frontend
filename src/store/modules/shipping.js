import axios from "axios";
const state = {
    shippings:[],
    reports:[]
};
const getters = {};

const actions = {
    getShippings( {commit} ){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/shipping/all")
        .then(response => {
            commit('setShippings', response.data);
        });
    },
    getReports( {commit}, dates ){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/shippings?filter[date_between]=" + dates)
        .then(response => { 
            var records = response.data.data.map(id=>{
                return{
                    weight: actions.calcWeight(id.shipping_details),
                    route:id.route
                }
            })
            var total = {
                route:0,
                weight:0
            }
            for(var i=0; i<records.length; i++){
                total.route = total.route + (records[i].route*1)
                total.weight = total.weight + (records[i].weight*1)
            }
            var avg = {
                route: total.route/response.data.data.length,
                weight: total.weight/response.data.data.length
            }
            commit('setReports', [{'label':'Recorrido', 'total':total.route, 'avg':avg.route}, {'label':'Peso', 'total':total.weight, 'avg':avg.weight},]);
        })
    },
    calcWeight(details){
        var sum = 0
        for(var i=0; i<details.length; i++){
            if(details[i].sale!=undefined){
                sum = sum + details[i].sale.sale_weight
            }
        }
        return sum
    },
};

const mutations = {
    setShippings(state, data){
        state.shippings = data;
    },
    setReports(state, data){
        console.log(data)
        state.reports = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}