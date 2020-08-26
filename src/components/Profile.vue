<template>
    <section>
        <navigation></navigation>
        <h5 align='center'>Profile</h5>

        <div class="card horizontal" style="max-width:400px;margin:0 auto;">
            <div class="card-stacked">
                <div class="card-content">
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
            </div>
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
                console.log(snap.val(),uid)
            })
        }
    }
}
    
</script>
