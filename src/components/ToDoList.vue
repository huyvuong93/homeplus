<template>
  <div id="app">
    <h2>家事リスト</h2>
    <transition name="modal">
      <div v-if="isOpen">
        <div class="overlay" v-on:click.self="isOpen = false">
          <div class="modal">
            <p>家事ネーム</p>
              <input class="todo-title-modal" type="text" placeholder="買い物、掃除、..." v-model="newTodoName">
            <p>詳細</p>
              <textarea class="todo-details-modal" v-model="newTodoDetails"></textarea>
            <p>ポイント</p>
              <input class="todo-point-modal" type="number" v-model="newTodoPoint">

            <div><button class="addtodo-btn" type="submit" v-on:click="createTodo()">追加</button></div>
          </div>
        </div>
      </div>
    </transition>
    <button v-if="role ==='mama'" class="modal-btn" v-on:click="isOpen=!isOpen">+</button>
    <ul class="local-nav">
      <li v-if="role ==='mama'"><button type="submit" class="tab" v-on:click="showTodoType = 'all'">全て</button></li>
      <li><button type="submit" class="tab" v-on:click="showTodoType = 'active'">未完成</button></li>
      <li><button type="submit" class="tab" v-on:click="showTodoType = 'complete'">完成</button></li>
    </ul>
      <div class="todo-list" v-for="(todo, key) in filteredTodos" :key='todo.name'>
        <div class="todo-title">
          <p class="todo-name">{{ todo.name }}</p>
          <p class="todo-point">{{todo.point}}pt</p>
          <p v-if="role ==='mama'">  
            <button type="submit" class="del-btn" v-on:click="deleteTodo(key)"><font-awesome-icon class="icon" :icon="['fas', 'trash-alt']" /></button>
          </p>
        </div>
        <div class="todo-body">
          <p><input type="checkbox" class="regular-checkbox"
          v-model="todo.isComplete" 
          v-on:click="updateIsCompleteTodo(todo, key)"></p>
          <p>{{todo.details}}</p>
          <p>{{todo.completeUser}}</p>
        </div>
      </div>
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
      todosRef: null,
      newTodoName: '',
      newTodoPoint:'',
      newTodoDetails:'',
      showTodoType: 'active',
      user:null,
      role:'',
      completeUser:'',
      todos: [],
      myPoint:'',
      name:''
    }
  },
  components:{
      navigation
  },
  created() {
    var _this = this;
    firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getUserData(user)
            }          
        })
        function getUserData(uid){
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).once("value", snap =>{
                _this.user = snap.val();
                _this.role = snap.val().role;
                _this.myPoint = snap.val().point*1;
                _this.name = snap.val().name,
                console.log(snap.val(),uid)
            })
        }
    this.database = firebase.database();
    this.todosRef = this.database.ref('todos/');
    this.todosRef.on('value', function(snapshot) {
      _this.todos = snapshot.val();
    });
  },
  computed: {
    filteredTodos: function () {
      if (this.showTodoType == 'all') {
        return this.todos;
      } else {
        var showIsComplete = false;
        if (this.showTodoType == 'complete') { 
          showIsComplete = true 
          }
        var filterTodos = {};
        for (var key in this.todos) {
          var todo = this.todos[key];
          if (todo.isComplete == showIsComplete) { 
            filterTodos[key] = todo;
          }
        }
        return filterTodos;
      }
    }
  },
  methods: {
    createTodo() {
      if (this.newTodoName == "" && this.newTodoPoint == "") {
           return;
            }
        this.todosRef.push({
        name: this.newTodoName,
        point: this.newTodoPoint,
        details: this.newTodoDetails,
        isComplete: false,
        completeUser: this.completeUser
      })
      this.newTodoName = "";
      this.newTodoPoint = "";
      this.completeUser = "";
      this.newTodoDetails = "";
      this.isOpen = false;
    },
    updateIsCompleteTodo(todo, key) {
      todo.isComplete = !todo.isComplete;
      todo.completeUser = this.name; 
      this.database.ref('/users/'+ firebase.auth().currentUser.uid).update({
        point:this.myPoint + todo.point*1
      }) 
      var updates = {};
      updates['/todos/' + key ] = todo;
      this.database.ref().update(updates);
      
    },
    deleteTodo(key) {
      this.database.ref('todos').child(key).remove();
    },
  },
}
</script>

<style scoped>
  .local-nav{
    width:95vw;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding:0;
  }
  .local-nav li{
    list-style: none;
  }
  
  .todo-list{
    background-color: #fff;
    border:solid 1px #F8DEAA;
    width: 95vw;
    margin: 20px auto;
    box-shadow: 2px 4px 3px #bebebe;
  }
  .todo-list p{
    margin: 15px;
  }
  .todo-title,.todo-body{
    display: flex;
    justify-content: space-between;
  }
  .tab{
    background-color: #fff;
    border: none;
    width: 100px;
    height: 45px;
    color: #ee7009;
    font-size: 20px;
    font-family: 'Noto Sans JP', sans-serif;
  }
  .tab:focus{
    color:#fff;
    background-color: #ee7009;
  }
  .todo-point{
    color: #ee7009;
  }
  .todo-name{
    font-weight: bold;
  }
  .del-btn{
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
  .addtodo-btn{
    width: 100px;
    height: 40px;
    border: none;
    border-radius:50px ;
    background-color:#ee7009;
    color:#fff;
    margin: 15px;
  }
  .todo-title-modal,.todo-point-modal{
    width: 90%;
    height: 30px;
    margin: 10px 0;
    border: solid 1px #ee7009;
  }
  .todo-details-modal{
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


  .regular-checkbox {
    width: 30px;
    height: 30px;
    -webkit-appearance: none;
    background-color: #fff;
    border: 1px solid #ee7009;
    padding: 9px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
  }
  .regular-checkbox:checked {
    background-color: #ee7009;
    border: none;
    color: #fff;
  }
  .regular-checkbox:checked:after {
    content: '\2714';
    font-size: 20px;
    position: absolute;
    top: 2px;
    left: 7px;
    color: #fff;
  }
  .regular-checkbox:checked:after > .todo-list{
    border-color:#ee7009 ;
  }

  
  </style>