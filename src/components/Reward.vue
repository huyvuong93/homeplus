<template>
  <div id="app">
      <navigation></navigation>
    <h2>List</h2>
    <div v-if="role === 'mama'">
      <input type="text" v-model="newRewardName">
      <input type="number" v-model="newRewardPoint">
      <button type="submit" v-on:click="createReward()">Add</button>
    </div>
    <ul v-for="(reward, key) in rewards" :key='reward.name'>
      <li><input type="button" value="Get" v-on:click="getReward(reward, key)">{{ reward.name }} {{reward.point}}pt</li>
      <div v-if="role === 'mama'">
      <button type="submit" v-on:click="deleteReward(key)">Delete</button>
      </div>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase'
import navigation from '@/components/NavBar.vue'

export default {
  name: 'App',
  data () {
    return {
      database: null,
      rewardsRef: null,
      newRewardName: '',
      newRewardPoint:'',
      role:'',
      user:'',
      rewards: [],
      myPoint:''
    }
  },
  components:{
      navigation
  },
  created() {
    var _this = this;
    this.database = firebase.database();
    this.rewardsRef = this.database.ref('rewards/');
    firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getUserData(user)
            }          
        })
        function getUserData(uid){
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).once("value", snap =>{
                _this.role = snap.val().role;
                console.log(uid)
            })
        }
    
    this.rewardsRef.on('value', function(snapshot) {
      _this.rewards = snapshot.val();
    });
  },
  methods: {
    createReward() {
      if (this.newRewardName == "" && this.newRewardPoint == "") {
           return;
            }
        this.rewardsRef.push({
        name: this.newRewardName,
        point: this.newRewardPoint,
        user: this.user
      })
      this.newRewardName = "";
      this.newRewardPoint = "";
      this.user = "";
    },
    getReward(reward, key) {
      reward.user = firebase.auth().currentUser.uid;
      var _this = this
      this.database.ref('users/' + firebase.auth().currentUser.uid).on("value", snap =>{
        _this.myPoint = snap.val().point*1;
          console.log(_this.myPoint)
      })
      this.database.ref('/users/'+ firebase.auth().currentUser.uid).update({
        point:this.myPoint - reward.point*1,
      })
      this.database.ref('/users'+ firebase.auth().currentUser.uid).child('rewards').push({
        reward
      })
      var updates = {};
      updates['/rewards/' + key ] = reward;
      this.database.ref().update(updates);   
    },
    deleteReward(key) {
      this.database.ref('rewards').child(key).remove();
    },
  },
}
</script>

<style>
    .local-nav{
        display: flex;
        justify-content: space-between;
    }
</style>