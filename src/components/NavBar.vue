<template>

        <div class="nav-wrapper">

                <div v-show="!user">
                    <router-link to="/signin">Login</router-link>
                </div>
                <div v-show="user">
                    <router-link to="/todolist">To Do</router-link>
                </div>
                <div v-show="user">
                    <router-link to="/profile">Profile</router-link>
                </div>
                <div v-show="user">
                    <router-link to="/reward">Reward</router-link>
                </div>
                <div v-show="user">
                    <a @click="signoutButtonPressed">Logout</a>
                </div>
        </div>
</template>

<script>
import firebase from "firebase";

export default {
    data() {
        return {
            user: null
        };
    },
    created() {
        firebase.auth().onAuthStateChanged(user => {
            this.user = user;
        });
    },
    methods: {
        signoutButtonPressed(e) {
            e.stopPropagation();
            firebase.auth().signOut();
            this.$router.push({ name: "Signin" });
        }
    }
};
</script>
<style>
    .nav-wrapper{
        display: flex;
        justify-content: space-around;
    }
</style>

