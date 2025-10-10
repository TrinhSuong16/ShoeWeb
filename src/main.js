import "@/assets/css/base.css";
import "@/assets/css/main.css";
import "@/assets/css/reset.css";
import "@/assets/css/responsive.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBox, faDollarSign, faReceipt,faSearch,  faBoxOpen,faHome, faChartBar, faSignOutAlt,faUser, faShoppingCart, faTachometerAlt, faShoePrints, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import Vue Router
const app = createApp(App);
library.add( faBox, faDollarSign, faReceipt,faShoppingCart, faSearch,faBoxOpen,faHome, faChartBar, faSignOutAlt,faUser, faShoppingCart, faTachometerAlt, faShoePrints, faUsersCog);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');