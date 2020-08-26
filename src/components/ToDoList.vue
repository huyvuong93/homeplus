<template>
  <div id="app">
      <navigation></navigation>
    <h2>List</h2>
    <div v-if="role ==='mama'" >
      <input type="text" v-model="newTodoName">
      <input type="number" v-model="newTodoPoint">
      <button type="submit" v-on:click="createTodo()">Add</button>
    </div>
    <ul class="local-nav">
      <li><button type="submit" v-on:click="showTodoType = 'all'">All</button></li>
      <li><button type="submit" v-on:click="showTodoType = 'active'">Incomplete</button></li>
      <li><button type="submit" v-on:click="showTodoType = 'complete'">Completed</button></li>
    </ul>
    <ul v-for="(todo, key) in filteredTodos" :key='todo.name'>
      <li><input type="checkbox" v-model="todo.isComplete" v-on:click="updateIsCompleteTodo(todo, key)">{{ todo.name }} {{todo.point}}pt {{todo.completeUser}}</li>
      <div v-if="role ==='mama'">  
      <button type="submit"  v-on:click="deleteTodo(key)">Delete</button>
      </div>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase'
import navigation from '@/components/NavBar.vue'

export default {
  name: 'App',
  data () {
    return {
      database: null,
      todosRef: null,
      newTodoName: '',
      newTodoPoint:'',
      showTodoType: 'all',
      user:null,
      role:'',
      completeUser:'',
      todos: [],
      myPoint:''
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
    createTodo: function() {
      if (this.newTodoName == "" && this.newTodoPoint == "") {
           return;
            }
        this.todosRef.push({
        name: this.newTodoName,
        point: this.newTodoPoint,
        isComplete: false,
        completeUser: this.completeUser
      })
      this.newTodoName = "";
      this.newTodoPoint = "";
      this.completeUser = ""
    },
    updateIsCompleteTodo: function (todo, key) {
      todo.isComplete = !todo.isComplete;
      todo.completeUser = firebase.auth().currentUser.email; 
      var _this = this
      this.database.ref('users/' + firebase.auth().currentUser.uid).on("value", snap =>{
        _this.myPoint = snap.val().point*1;
        _this.name = snap.val().name,
          console.log(_this.myPoint)
      })
      this.database.ref('/users/'+ firebase.auth().currentUser.uid).update({
        point:this.myPoint + todo.point*1
      }) 
      var updates = {};
      updates['/todos/' + key ] = todo;
      this.database.ref().update(updates);
      
    },
    deleteTodo: function (key) {
      this.database.ref('todos').child(key).remove();
    },
  },
}
</script>

<style>
    .local-nav{
        display: flex;
        justify-content: space-between;
    }
</style>