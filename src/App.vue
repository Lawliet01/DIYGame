<template>
  <div id="app">
    <nav>
      <span>DIYGAME</span>
      <router-link to="/">帮助</router-link>
      <router-link to="/entireGame">开始设计</router-link>
      <router-link to="/previewPage">预览</router-link>
      <router-link to="/">主页</router-link>
    </nav>
    <transition name='pageTransition'>
      <router-view/>
    </transition>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

//动画效果
.pageTransition-enter-active{
  transition: all .06s
}
.pageTransition-enter{
  transform: scale(0)
}

html {
  background-color: #f8f9fa;
}
body {
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  text-align: left;
  $navHeight: 50px;
  padding: 10px;
  span {
    line-height: $navHeight;
    font-weight: bold;
    font-size: 30px;
    padding: 0px 20px;
  }

  a {
    text-decoration: none;
    float: right;
    line-height: $navHeight;
    font-size: 15px;
    margin: 0px 15px;
    color: #3eb0dd;
    &.router-link-exact-active {
      color: #2c3e50;
    }
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
