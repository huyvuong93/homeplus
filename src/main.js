import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faAward, faBroom, faSignOutAlt, faTrashAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './registerServiceWorker'

library.add(faBroom,faUserCircle,faAward,faSignOutAlt,faTrashAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)



Vue.config.productionTip = false;

var firebaseConfig = {
    apiKey: "AIzaSyBRIbxP43Lg9TR-F7MooA4f2XVtvFCowU0",
    authDomain: "homeplus-dff98.firebaseapp.com",
    databaseURL: "https://homeplus-dff98.firebaseio.com",
    projectId: "homeplus-dff98",
    storageBucket: "homeplus-dff98.appspot.com",
    messagingSenderId: "816043383930",
    appId: "1:816043383930:web:94731a76b7833fc8292fc3",
    measurementId: "G-HDK6XS2HWN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();

messaging.usePublicVapidKey("BJ3l6vcjWbqqwlADARRTCtmOA5UUUoL1NqKZbcNItx9FYTQEax6TiL-6cI4pt7SOD5-FA7T5Lg7RVM4KZRbIoRM"); // 1で取得した鍵ペア

// 通知の受信許可
messaging.requestPermission().then(() => {
  console.log('Notification permission granted.');

  // トークン取得
  messaging.getToken().then((token) => {
    console.log(token)
  })
}).catch((err) => {
  console.log('Unable to get permission to notify.', err);
});

new Vue({
  router,
  components: { App },
  render: h => h(App)
}).$mount('#app')
