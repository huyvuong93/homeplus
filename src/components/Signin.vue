<template>
    <div class="singin">
        <h2 class="app-title">HOME PLUS +</h2>
        <img class="logo" src="../assets/logo.png" alt="homeplus-logo">
        <h3>ログイン</h3>
        <p class="sub-title">メールアドレス</p>
        <input class="input" type="text" placeholder="" v-model="mail"><br>
        <p class="sub-title">パスワード</p>
        <input class="input" type="password" placeholder="" v-model="password"><br>
        <button class="btn" @click='signIn'>ログイン</button>
        <p>アカウントをお持ちでない方</p>
        <router-link class="link" to="/signup">新規登録</router-link>
    </div>
</template>
<script>
import firebase from 'firebase'

export default {
    name:'Signin',
    data(){
        return {
            mail:'',
            password:''
        }
    },
    methods:{
        signIn: function(){
            firebase.auth().signInWithEmailAndPassword(this.mail, this.password)
            .then( user => {
                alert('Welcome back',user.email)
                this.$router.push('/profile')
            })
            err => {
                alert(err.message)
            }
        }
    }
}
</script>
<style scoped>

    .app-title{
        position: relative;
        width: 200px;
        height: 40px;
        border-radius:15px;
        background-color: #fff;
        margin:50px auto 20px;
    }
    .app-title::before{
        content:'';
        position: absolute;
        content: "";
        display: inline-block;
        position: absolute;
        top: 40px; 
        left: 85px;
        border: 8px solid transparent;
        border-right: 18px solid #fff;
        -webkit-transform: rotate(70deg);
        transform: rotate(-110deg);

    }
    .input{
        width: 90%;
        height: 40px;
        margin-bottom: 50px;
        border-style:inherit;
    }
    .btn{
        width: 80%;
        height: 50px;
        border-radius: 25px;
        border-style:none ;
        background-color: #F79208;
    }
    .link{
        display:block;
        margin: auto;
        padding: 10px 0;
        width: 80%;
        border-radius: 25px;
        border-style:none ;
        background-color: #F79208;
        text-decoration: none;
    }
    .btn, .link{
        color: #fff;
        font-size: 21px;
    }
    .sub-title{
        width: 90%;
        margin: auto;
        text-align: start;
    }
</style>