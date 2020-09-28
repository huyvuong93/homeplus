<template>
  <div id="app">
    <h2>ご褒美リスト</h2>
    <transition name="modal">
      <div v-if="isOpen" >
        <div class="overlay" v-on:click.self="isOpen = false">
          <div class="modal">
            <p>ご褒美</p>
              <input class="reward-title-modal" type="text" placeholder="" v-model="newRewardName">
            <p>ポイント</p>
              <input class="reward-point-modal" type="number" v-model="newRewardPoint">
            <div><button class="addreward-btn" type="submit" v-on:click="createReward()">追加</button></div>
          </div>
        </div>
      </div>
    </transition>
    <button v-if="role ==='mama'" class="modal-btn" v-on:click="isOpen=!isOpen">+</button>
    <table>
    <tr v-for="(reward, key) in rewards" :key='reward.name'>
      <td class="reward-point">{{reward.point}}pt</td>
      <td>{{ reward.name }}</td>
      <td v-if="role !== 'mama'"><input type="button" class="btn" value="Get" v-if="userPoint >= reward.point" v-on:click="getReward(reward, key)"></td>
      <td v-if="role === 'mama'">
      <button class="btn" type="submit" v-on:click="deleteReward(key)"><font-awesome-icon class="icon" :icon="['fas', 'trash-alt']" /></button>
      </td>
    </tr>
    </table>
    <div class="navigation">
        <navigation></navigation> 
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import navigation from '@/components/NavBar.vue'

export default {
  name: 'App',
  data () {
    return {
      isOpen:false,
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
      this.isOpen = false;
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
      alert("交換ができました!!!") 
    },
    deleteReward(key) {
      this.database.ref('rewards').child(key).remove();
    },
  },
}
</script>

<style scoped>
    table{
      margin: 0 auto;
      width: 90%;
    }
    tr{
      background-color: #fff;
    }
    td{
      padding: 10px;
    }
    .reward-point{
      color: #ee7009;
    }
    .btn{
      width: 30px;
      height: 30px;
      color: #ee7009;
      background-color: inherit;
      border:none;
    }


    .modal {
    width: 80vw;
    margin: 0px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 2px;
    transition: all 0.2s ease-in;
  }
  .modal p{
    margin:10px 0;
    text-align: left;
    font-weight:bold ;
  }
  .addreward-btn{
    width: 100px;
    height: 40px;
    border: none;
    border-radius:50px ;
    background-color:#ee7009;
    color:#fff;
    margin: 15px;
  }
  .reward-title-modal,.reward-point-modal{
    width: 90%;
    height: 30px;
    margin: 10px 0;
    border: solid 1px #ee7009;
  }
  .reward-details-modal{
    width: 90%;
    height: 120px;
    margin: 10px 0;
    border: solid 1px #ee7009;
  }
  .fadeIn-enter {
    opacity: 0;
  }

  .fadeIn-leave-active {
    opacity: 0;
    transition: all 0.2s step-end;
  }

  .fadeIn-enter .modal,
  .fadeIn-leave-active.modal {
    transform: scale(1.1);
  }
  .modal-btn {
    width: 50px;
    height: 50px;
    background-color:#D25645;
    color: white;
    border: none;
    border-radius:50% ;
    position: absolute;
    right: 20px;
    bottom: 100px;
    font-size: 40px;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #00000094;
    z-index: 999;
    transition: opacity 0.2s ease;
  }
</style>