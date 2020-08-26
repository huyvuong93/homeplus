<template>
    <div class='signup'>
        <p>お名前</p>
        <input type="text" placeholder="" v-model="name"><br>
        <p>誕生日</p>
        <input type="datetime" placeholder="" v-model="birthday"><br>
        <p>好きなもの</p>
        <input type="text" placeholder="" v-model="hobby"><br>
        <p>メールアドレス</p>
        <input type="text" placeholder="" v-model="username"><br>
        <p>パスワード</p>
        <input type="password" placeholder="" v-model="password"><br>
        <v-btn @click='signUp'>登録</v-btn>
        <p>アカウントをお持ちの方</p>
        <v-btn to="/signin">ログイン</v-btn>
    </div>
</template>
<script>
import firebase from 'firebase'

export default {
    name:'Signup',
    data(){
        return {
            name:'',
            hobby:'',
            username:'',
            password:'',
            birthday:'',

        }
    },
    methods:{
        signUp () {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
                firebase.auth().createUserWithEmailAndPassword(this.username, this.password).then(() => {
                    firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
                        userUID: firebase.auth().currentUser.uid,
                        email: firebase.auth().currentUser.email,
                        name: this.name,
                        hobby:this.hobby,
                        birthday: this.birthday,
                        point:0,
                    });
                    alert("登録ができました");
                })
            });
        },
    },
}
</script>
<style>
    .signup{
        margin: 50px;
    };
    button{
        text-align: center;
        width: 60%;
        border-radius:50%;
        background-color: #f79208;
    }

</style>