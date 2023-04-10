import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue3 from 'bootstrap-vue-3';
import vClickOutside from "click-outside-vue3";
import VueApexCharts from "vue3-apexcharts";
import store from "./state/store";
import axios from 'axios';

import '@/assets/scss/config/default/app.scss';
import '@/assets/scss/mermaid.min.css';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';

const test = localStorage.getItem('token');
axios.defaults.baseURL = 'https://traffigaze.info/api/';
axios.defaults.headers['Authorization'] = `Bearer `+test;

createApp(App)
    .use(store)
    .use(router)
    .use(BootstrapVue3)
    .use(VueApexCharts)
    .use(vClickOutside).mount('#app');
