<template>
    <div>
        <div class="profile">
            <img class="profile-img" :src="img" />
            <p class="username"><strong>{{user.name}}</strong></p>
            <div class="information">
                <p class="user-birthday">誕生日:<span>{{user.birthday}}</span></p>
                <p class="user-hobby">好きなもの:<span>{{user.hobby}}</span></p>
                <p class="point" v-if="user.role != 'mama'">{{user.point}}<span>pt</span></p>
                <div class="rewarded">
                    <h4>交換した物</h4>
                    <table>
                        <tr v-for="(reward,key) in rewards" :key='reward.name'>
                            <td>{{reward}}</td>
                            <td><input type="button" class="use-reward-btn" v-on:click="userReward(key)" value="Use"></td>
                        </tr>
                    </table>
                </div>
                <div class="partnerList">
                    <h4>家族のメンバー</h4>
                    <table>
                        <tr v-for="partner in partners" :key='partner.id'>
                            <td>{{partner.name}}</td>
                            <td>{{partner.point}}</td>
                            <td>{{partner.hobby}}</td>
                            <td>{{partner.birthday}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="navigation">
            <navigation></navigation> 
        </div>
    </div>
</template>

<script>
import navigation from "@/components/NavBar.vue";
import firebase from "firebase";

export default {
    data() {
        return {
            user:'',
            rewards:[],
            partners:[],
            img:null,
        };
    },
    components:{
        navigation,
    },
    created() {
        let _this = this;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getUserData(user);
                firebase
                .storage()
                .ref("users")
                .child(firebase.auth().currentUser.uid + "/profile.jpg")
                .getDownloadURL()
                .then(imgUrl => {
                    this.img = imgUrl;
                });
            }          
        })
        function getUserData(uid){
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).once("value", snap =>{
                _this.user = snap.val();
                _this.rewards = snap.val().rewards;
                console.log(uid)
            })
        }
        firebase.database().ref('users').on("value",snap =>{
            _this.partners = snap.val()
            console.log(snap.val())
        })
    },
    methods:{
        userReward(key){
            firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/rewards/').child(key).remove();
            alert("使いました！楽しんでくださいね！")     
        },
    }
}
    
</script>
<style scoped>
    .profile{
        background-color: #F5BF53;
    }
    .profile .username{
        font-size: 25px;
    }
    .profile-img{
        margin-top: 50px ;
        width: 120px;
        height: 120px;
        border-radius: 60px;
        border-style: none;
    }
    .information{
        height: 90vh;
        background-color: #fff;
        border-radius:56px 56px 0 0 ;
    }
    .user-birthday{
        padding-top: 20px;
    }
    .point{
        font-size: 100px;
        color:#EE7009 ;
        font-weight: lighter;
        margin: 0;
    }
    .point span{
        font-size: 30px;
    }
    table{
        margin: 0 auto;
        width: 90%;
    }
    .use-reward-btn{
        background-color: #EE7009;
        padding:5px 10px;
        border: none;
        border-radius: 3px;
        color:#fff;

    }
    .partnerList{
        margin-bottom: 60px;
    }
</style>
