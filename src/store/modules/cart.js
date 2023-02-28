
import Vue from "vue";
import axios from "axios";

import Vuex from "vuex";
Vue.use(Vuex);

const state = {
    carts:[],
    db_carts:[],
    client:{}
};
const getters = {
};
const actions = {
    addItem(context, id) {
        context.commit("ADD_Item", id);
    },
    removeItem(context, index) {
        context.commit("REMOVE_Item", index);
    },
    downItem(context, index) {
        context.commit("DOWN_Item", index);
    },
    upItem(context, props) {
        context.commit("UP_Item", props);
    },
    selectClient({commit}, client) {
        commit('setClient', client );
    },
};
const mutations = {
    setClient(state, data){
        state.client = data;
    },
    ADD_Item(state, item) {
        state.db_carts.push(item);
        if(state.carts.map(cart=>cart.product).includes(item)){
            state.carts.filter(cart=>cart.product.id == item.id)[0].quantity = state.carts.filter(cart=>cart.product.id == item.id)[0].quantity + 1;
        }else{
            state.carts.push({'quantity':1,'product':item});
        }
    },
    REMOVE_Item(state, index) {
        var id = state.carts[index].id
        state.db_carts.splice(state.db_carts.indexOf(id), 1);
        state.carts.splice(index, 1);
    },
    DOWN_Item(state, index) {
        var id = state.carts[index].id
        state.db_carts.splice(state.db_carts.indexOf(id), 1);

        if((state.carts[index].quantity - 1) > 0){
            state.carts[index].quantity = state.carts[index].quantity - 1;
        }else{
            state.carts.splice(index, 1);
        }
    },
    UP_Item(state, props) {
        state.db_carts.push(props.id);
        state.carts[props.index].quantity = state.carts[props.index].quantity + 1;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};