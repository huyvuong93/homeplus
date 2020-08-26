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
      <li v-if="role ==='mama'"><button type="submit" v-on:click="showTodoType = 'all'">All</button></li>
      <li><button type="submit" v-on:click="showTodoType = 'active'">Incomplete</button></li>
      <li><button type="submit" v-on:click="showTodoType = 'complete'">Completed</button></li>
    </ul>
    <tr v-for="(todo, key) in filteredTodos" :key='todo.name'>
      <td><input type="checkbox" v-if="role !=='mama'" v-model="todo.isComplete" v-on:click="updateIsCompleteTodo(todo, key)"></td>
        <td>{{ todo.name }}</td>
        <td>{{todo.point}}pt</td>
        <td>{{todo.completeUser}}</td>
        <td v-if="role ==='mama'">  
          <button type="submit"  v-on:click="deleteTodo(key)">Delete</button>
        </td>
    </tr>
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
      todo.completeUser = this.name; 
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
    .local-nav li{
      list-style: none;
    }
</style>