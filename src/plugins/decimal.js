import Vue from 'vue';
import Decimal from 'decimal.js';

function plugin(Vue) {

    if (plugin.installed) {
        return
    }
    plugin.installed = true;

    Vue.Decimal = Decimal;
    Object.defineProperties(Vue.prototype, {
        decimal: {
            get(num) {
                if(num){
                    return new Decimal(num);
                }
                return Decimal;
            }
        },

    })
};

Vue.use(plugin);


