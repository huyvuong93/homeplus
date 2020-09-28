<template>
    <div class='signup'>
        <div class="upload">
            <input type="file" id="uploadfile" class="uploadfile" @change="chooseFile">
                <label for="uploadfile">
                    <figure class="file-bg"><p>写真追加<br>+</p></figure>
                </label>
        </div>
        <p class="sub-title">お名前</p>
        <input class="input" type="text" placeholder="" v-model="name"><br>
        <p class="sub-title">誕生日</p>
        <input class="input" type="date" placeholder="" v-model="birthday"><br>
        <p class="sub-title">好きなもの</p>
        <input class="input" type="text" placeholder="" v-model="hobby"><br>
        <p class="sub-title">あなたは</p>
        <input type="radio" id="mama" value="mama" v-model="role">
        <label class="role-input-label" for="mama">ママ</label>
        <input type="radio" id="papa" value="papa" v-model="role">
        <label class="role-input-label" for="papa">パパ</label>
        <input type="radio" id="child" value="child" v-model="role">
        <label class="role-input-label" for="child">子供</label>
        <p class="sub-title">メールアドレス</p>
        <input class="input" type="text" placeholder="" v-model="username"><br>
        <p class="sub-title">パスワード</p>
        <input class="input" type="password" placeholder="" v-model="password"><br>
        <button class="btn" @click='signUp'>登録</button>
        <p>アカウントをお持ちの方</p>
        <router-link class="link" to="/signin">ログイン</router-link>
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
            role:'',
            file:null

        }
    },
    methods:{
        chooseFile(e){
            this.file = e.target.files[0];
        },
        signUp () {
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(() => {
                firebase.auth().createUserWithEmailAndPassword(this.username, this.password).then(() => {
                    firebase.storage().ref('users/' + firebase.auth().currentUser.uid + "/profile.jpg").put(this.file)
                    .then(()=>{
                        console.log(this.file)
                        console.log('upload success')
                    });
                    firebase.database().ref('users/' + firebase.auth().currentUser.uid).set({
                        userUID: firebase.auth().currentUser.uid,
                        email: firebase.auth().currentUser.email,
                        name: this.name,
                        hobby:this.hobby,
                        role:this.role,
                        birthday: this.birthday,
                        rewards:'',
                        point:0,
                    });
                    
                    this.$router.push('/signin')
                    alert("登録ができました");
                })
            });
        },
    },
}
</script>
<style scoped>
    .input{
        width: 90%;
        height: 40px;
        margin-bottom: 20px;
        border-style:inherit;
    }
    .sub-title{
        width: 90%;
        margin: auto;
        text-align: start;
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
    .uploadfile{
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
    }
    .file-bg{
        margin: 0 auto;
        width: 90px;
        height: 90px;
        border-radius: 50px;
        background-color: #fff;
    }
    .file-bg p{
        margin: 0;
        padding-top:15px
    }
    .role-input-label{
        margin-right: 30px;
    }
</style>