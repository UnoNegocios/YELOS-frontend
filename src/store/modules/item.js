import axios from "axios"
const state = {
    items:[],
    reports:{
        total_inventory_cost: '',
        total_inventory: '',
        avg_inventory_cost: '',
        avg_inventory: '',
    },
    loader:true
};

const getters = {};

const actions = {
    getItems( {commit, state} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/item/all")
        .then(response => {

            commit('setItems', response.data);

            //state.reports.total_inventory_cost = response.data.reduce((a, b) => (a*1) + ((b['cost'] || 0)*1), 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})

            //state.reports.total_inventory = response.data.reduce((a, b) => (a*1) + ((b['inventory'] || 0)*1), 0).toFixed(2) + ' kg'

            //state.reports.avg_inventory_cost = response.data.reduce((a, b) => (a*1) + ((b['cost'] || 0)*1), 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})

            //state.reports.avg_inventory = response.data.reduce((a, b) => (a*1) + ((b['inventory'] || 0)*1), 0).toFixed(2) + ' kg'

        });
    },
    getInventories( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/item/all")
        .then(response => {
            var items = {data: response.data.filter(item=>item.product_type != 'Variable')}
            axios
            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/all")
            .then(inventory => {
                for(var j=0; j<items.data.length; j++){
                    var movements = inventory.data.filter(inventory=>inventory.item_id == items.data[j].id)
                    var sum = 0
                    for(var i=0; i<movements.length; i++){
                        if(movements[i].type == 'Salida Producción' || movements[i].type == 'Salida Venta' || movements[i].type == 'Devolución'){
                            sum = sum - movements[i].quantity
                        }
                        else if(movements[i].type == 'Entrada Producción' || movements[i].type == 'Entrada Compra' || movements[i].type == 'Ajuste Manual' || movements[i].type == 'Creación de Producto' || movements[i].type == 'Ajuste Inventario Físico' || movements[i].type == 'Corte Ceros'){
                            sum = sum + movements[i].quantity
                        }
                    }
                    items.data[j].inventory = sum

                    if(j==(items.data.length-1)){
                        axios
                        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/shopping_detail/all")
                        .then(shoppings => {
                            for(var k=0; k<items.data.length; k++){
                                items.data.cost = shoppings.data.sort(function(a,b){
                                    return new Date(a.created_at) - new Date(b.created_at);
                                }).filter(shopping=>shopping.item_id == items.data[k].id).map(shopping=>shopping.unit_cost)[0]*1
                            
                                if(k==(items.data.length-1)){
                                    state.reports.total_inventory_cost = items.data.filter(item=>item.inventory>0).reduce((a, b) => (a*1) + (((b['cost']*b['inventory']) || 0)*1), 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})

                                    state.reports.total_inventory = items.data.filter(item=>item.inventory>0).reduce((a, b) => (a*1) + ((b['inventory'] || 0)*1), 0).toFixed(2) + ' kg'

                                    state.reports.avg_inventory_cost = ((items.data.filter(item=>item.inventory>0).reduce((a, b) => (a*1) + (((b['cost']*b['inventory']) || 0)*1), 0))/(items.data.filter(item=>item.inventory>0).length)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})

                                    state.reports.avg_inventory = ((items.data.filter(item=>item.inventory>0).reduce((a, b) => (a*1) + ((b['inventory'] || 0)*1), 0))/(items.data.filter(item=>item.inventory>0).length)).toFixed(2) + ' kg'
                                
                                    state.loader = false
                                }

                            }
                        });
                    }
                }
            });
        })
    },
};

const mutations = {
    setItems(state, data){
        state.items = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
