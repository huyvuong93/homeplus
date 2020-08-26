import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "AIzaSyDVc_PTN8xZ_J767_b8N_hoJLbFMnjd3lc",
  authDomain: "authentication-233b6.firebaseapp.com",
  databaseURL: "https://authentication-233b6.firebaseio.com",
  projectId: "authentication-233b6",
  storageBucket: "authentication-233b6.appspot.com",
  messagingSenderId: "32540955468",
  appId: "1:32540955468:web:1496122b0d47f3988675e9",
  measurementId: "G-77L5ST1RSS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
