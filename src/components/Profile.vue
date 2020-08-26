<template>
    <section>
        <navigation></navigation>
        <h5 align='center'>Profile</h5>

                <div class="information">
                    <p>
                        <strong>{{user.name}}</strong>
                        <br>
                        誕生日:<span>{{user.birthday}}</span>
                        <br>
                        好きなもの:<span>{{user.hobby}}</span>
                        <br>
                        <strong>{{user.point}}</strong>
                    </p>
                </div>
                <div class="rewarded">
                    <ul v-for="reward in rewards" :key='reward.id'>
                        <li>{{reward}}</li>
                    </ul>
                </div>
    </section>
</template>

<script>
import navigation from "@/components/NavBar.vue";
import firebase from "firebase";

export default {
    data() {
        return {
            user:'',
            rewards:[]
        };
    },
    components:{
        navigation,
    },
    created() {
        let _this = this;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getUserData(user)
            }          
        })
        function getUserData(uid){
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).once("value", snap =>{
                _this.user = snap.val();
                _this.rewards = snap.val().rewards;
                console.log(snap.val(),uid)
            })
        }
    }
}
    
</script>
