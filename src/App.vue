<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
#app {
  font-family: 'Noto Sans JP', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
body{
  margin: 0;
  background-color: #F8F1E1;
}
.navigation{
  position: fixed;
  bottom: 0;
  left:0;
  z-index: 1;
  width: 100%;
  height: 65px;
  background-color: #fff;
}
input[type="text"],
input[type="password"]{
  font-size: 20px;
}
</style>
