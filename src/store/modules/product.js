import axios from "axios"
const state = {
    products:[],
    search:''
};
const getters = {};

const actions = {
    getProducts( {commit, state}, ites_per_page ){
        var filter = '?filter[pos]=' + state.search + '&itemsPerPage=' + ites_per_page
        console.log(filter)
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos' + filter)
        .then(response => {
            commit('setProducts', response.data.data);
        });
    }
};

const mutations = {
    setProducts(state, data){
        state.products = data;
    },
    setSearchInput(state, search_input){
        console.log(search_input)
        state.search = search_input;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}