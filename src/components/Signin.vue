<template>
    <div>
        <h2>Login</h2>
        <input type="text" placeholder="Username" v-model="mail"><br>
        <input type="password" placeholder="Password" v-model="password"><br>
        <button @click='signIn'>Sign in</button>
        <p>Don't have a account ?</p>
        <router-link to="/signup">Sign up</router-link>
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