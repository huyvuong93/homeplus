<template>
    <div class="nav-wrapper">
        <router-link class="link-a home" to="/todolist"><font-awesome-icon class="icon" :icon="['fas', 'broom']" /><br><span>家事</span></router-link>
        <router-link class="link-a" to="/profile"><font-awesome-icon class="icon"  :icon="['fas', 'user-circle']" /><br><span>プロフィール</span></router-link>
        <router-link class="link-a" to="/reward"><font-awesome-icon class="icon"  :icon="['fas', 'award']" /><br><span>ご褒美</span></router-link>
        <a class="link-a" @click="signoutButtonPressed"><font-awesome-icon class="icon"  :icon="['fas', 'sign-out-alt']" /><br><span>ログアウト</span></a>
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
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
    .link-a{
        text-decoration: none;
        font-size: 12px;
        color: #444444;
        padding-top:15px
    }
    .icon{
        font-size: 26px;
    }
    .link-a.router-link-exact-active {
        color: #ee7009;
    }
</style>

