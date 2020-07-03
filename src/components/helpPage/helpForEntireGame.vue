<template>
  <div class="note-wrapper">
    <h1 v-if="lang === 1">帮助：首次使用</h1>
    <h1 v-else>Introduction</h1>
    <hr>
    <br>
    <br>
    <p v-if="lang === 1">DIYGAME是一款自主游戏设计平台，你可以在<strong>不写任何代码</strong>的情况写，打造一款<strong>具有个人印记</strong>的冒险游戏。</p>
    <p v-else>DIYGAME is a game design application, you can make your own platform game <strong>without any coding</strong>here</p>
    <br>
    <br>
    <br>
    <br>
    <br>
    <h2 v-if="lang === 1">1. 进入游戏设计总台</h2>
    <h2 v-else>1. Enter the console.</h2>
    <br>
    <p>
      <img src="@/pic/helpPage/enterEntireGame.png">
    </p>
    <ul>
      <li>
        {{lang === 1 ?"在DIYGAME的首页点击" :"On the home page, click the "}}
        <u>{{lang === 1 ?"开始设计":"TRY NOW!"}}</u> {{lang === 1 ?"或":"or "}}
        <u>{{lang === 1 ?"设计总台":"console"}}</u> {{lang === 1 ?"，即可开始游戏设计之旅。":"button to start your tour of design"}}
      </li>
    </ul>
    <br>
    <p>
      <img src="@/pic/helpPage/entireGamePanelIntro.png">
    </p>
    <br>
    <div v-if="lang === 1">
    <p>① 返回主页。</p>
    <p>② 查看设计实例。</p>
    <p>③ 设计总台。</p>
    <p>④ 查看帮助。</p>
    <p>⑤ 当前正在设计的游戏，游戏的设置会实时反映在这里。</p>
    <p>⑥ 游戏不同部分的设计入口。</p>
    <p>
      ⑦ 用于提前结束游戏，主要用于方便测试游戏结束界面以及重置游戏。
    </p>
    <p>⑧ 保存按钮，保存您设计的游戏。</p>
    <p>⑨ 恢复按钮，会把游戏设计恢复到您上一次保存的位置。</p>
    <p>⑩ 下载该游戏。</p>
    <p>⑪ 跳转到github repo。</p>
    <p>⑫ 切换语言。</p>
    </div>
    <div v-else>
      <p>① Go back to the home page.</p>
      <p>② Example of a game made by DIYGAME.</p>
      <p>③ Console entrance.</p>
      <p>④ Check the Guide.</p>
      <p>⑤ The game that you are working on currently. All the operations you made will show here immediately.</p>
      <p>⑥ Entrances of design of different parts of the game.</p>
      <p>
        ⑦ Terminate the game right away.Just for convenience to test the game.
      </p>
      <p>⑧ Save your design.</p>
      <p>⑨ Restore your game. You have to save something before you can restore anything.</p>
      <p>⑩ Download your game.</p>
      <p>⑪ Visit github repo.</p>
      <p>⑫ Change Language.</p>
    </div>
    <br>
    <br>
    <br>
    <br>
    <h2 v-if="lang === 1">2. 游戏设计</h2>
    <h2 v-else>2. Game Design</h2>
    <ul>
      <li v-if="lang === 1">DIYGAME提供了三个方面来设计游戏</li>
      <li v-else>DIYGAME mainly offers </li>
    </ul>
    <blockquote>
      <p>
        <a @click="$emit('change-page','playerFigure')">1.{{lang === 1 ?"角色设计":"Player character design"}}</a>
      </p>
      <p>
        <a @click="$emit('change-page','gameDesign')">2.{{lang === 1 ?"游戏设计":"Game Level design"}}</a>
      </p>
      <p>
        <a @click="$emit('change-page','faceDesign')">3.{{lang === 1 ? "界面设计":"Game interface design"}}</a>
      </p>
    </blockquote>
    <ul v-if="lang === 1">
      <li>
        点击
        <u>⑥ 设计按钮</u> 中不同的按钮就会进入不同的设计界面。
      </li>
      <li>
        所有的设计都会实时反映在
        <u>⑤ 设计总台的游戏</u> 里。
      </li>
    </ul>
    <ul v-else>
      <li>
        Click the
        <u>⑥ Design buttons</u> to enter different parts of design.
      </li>
      <li>
        All the operations you made will show on
        <u>⑤ Console</u> immediately.
      </li>
    </ul>
    <br>
    <br>
    <br>
    <br>
    <h2>3. {{lang === 1 ?"游戏的保存与恢复":"Save and restore the game"}}</h2>
    <ul v-if="lang === 1">
      <li>
        点击
        <u>⑧ 保存按钮</u>，即可保存当前游戏的设计内容。
      </li>
      <li>
        点击
        <u>⑨ 恢复按钮</u>，即可恢复上一次保存的内容。
      </li>
    </ul>
    <ul v-else>
      <li>
        Click the
        <u>⑧ save button </u> to save your design。
      </li>
      <li>
        Click the
        <u>⑨ restore button </u> to restore what you saved last time.
      </li>
    </ul>
    <br>
    <br>
    <br>
    <br>
    <h2>4. {{lang === 1 ?"游戏的下载":"Download the game"}}</h2>
    <ul v-if="lang === 1">
      <li>
        点击
        <u>⑩ 下载按钮</u> 即可下载游戏。游戏本身是一个HTML文件，在浏览器打开即可。
      </li>
    </ul>
    <ul v-else>
      <li>
        Click the
        <u>⑩ download button </u> to download your game。Your game will be saved as an HTML file. You can open it in the browser.。
      </li>
    </ul>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  name: "helpForEntireGame",
  computed:{
    lang(){
      return this.$store.state.lang
    },
  }
};
</script>

<style lang="scss" scoped>
@import "./lib/_cssStyle.scss";
.note-wrapper {
  text-align: left;

  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  h1 {
    font-size: 50px;
  }
  @media screen and(max-width: 500px) {
    h1 {
      font-size: 40px;
    }
  }
}
</style>