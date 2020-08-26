<template>
  <div id="app">
      <navigation></navigation>
    <h2>List</h2>
    <div v-if="role === 'mama'">
      <input type="text" v-model="newRewardName">
      <input type="number" v-model="newRewardPoint">
      <button type="submit" v-on:click="createReward()">Add</button>
    </div>
    <table>
    <tr v-for="(reward, key) in rewards" :key='reward.name'>
      <td>{{ reward.name }}</td>
      <td>{{reward.point}}pt</td>
      <td><input type="button" value="Get" v-if="userPoint >= reward.point" v-on:click="getReward(reward, key)"></td>
      <td v-if="role === 'mama'">
      <button type="submit" v-on:click="deleteReward(key)">Delete</button>
      </td>
    </tr>
    </table>
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
      userPoint:'',
      getRewardUser:'',
      rewards: [],
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
                _this.userPoint = snap.val().point;
                console.log(uid)
            })
        }
    
    this.rewardsRef.on('value',snap => {
      _this.rewards = snap.val();
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
        getRewardUser: this.getRewardUser
      })
      this.newRewardName = "";
      this.newRewardPoint = "";
      this.getRewardUser = "";
    },
    getReward(reward, key) {
      reward.getRewardUser = firebase.auth().currentUser.uid;
      this.database.ref('/users/'+ firebase.auth().currentUser.uid).update({
        point:this.userPoint*1 - reward.point*1,
      })
      this.database.ref('/users/'+ firebase.auth().currentUser.uid).child("rewards").push(
        reward.name
      )
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