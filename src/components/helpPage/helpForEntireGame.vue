<template>
  <div class="note-wrapper">
    <h1>帮助：首次使用</h1>
    <hr>
    <br>
    <br>
    <p>DIYGAME是一款自主游戏设计平台，允许使用者在没有任何技术背景的情况下打造个人专属的冒险游戏。</p>
    <br>
    <br>
    <br>
    <br>
    <br>
    <h2>1. 进入游戏设计总台</h2>
    <br>
    <p>
      <img src="@/pic/helpPage/enterEntireGame.png">
    </p>
    <ul>
      <li>
        在DIYGAME的首页点击
        <u>开始设计</u> 或
        <u>设计总台</u> ，即可进入游戏设计总台。
      </li>
    </ul>
    <br>
    <p>
      <img src="@/pic/helpPage/entireGamePanelIntro.png">
    </p>
    <br>
    <p>① 返回主页。</p>
    <p>② 查看设计实例。</p>
    <p>③ 设计总台。</p>
    <p>④ 查看帮助。</p>
    <p>⑤ 设计总台的游戏，实时反映游戏设计成果。</p>
    <p>⑥ 设计按钮，点击不同的按钮进入不同的游戏设计界面。</p>
    <p>
      ⑦ 用于操作
      <u>⑤</u> 中的游戏。
    </p>
    <p>⑧ 保存按钮。</p>
    <p>⑨ 恢复按钮。</p>
    <p>⑩ 下载该游戏。</p>
    <br>
    <br>
    <br>
    <br>
    <h2>2. 游戏设计</h2>
    <ul>
      <li>DIYGAME提供了三个方面来设计游戏</li>
    </ul>
    <blockquote>
      <p>
        <a @click="$emit('change-page','playerFigure')">1.角色设计</a>
      </p>
      <p>
        <a @click="$emit('change-page','gameDesign')">2.游戏设计</a>
      </p>
      <p>
        <a @click="$emit('change-page','faceDesign')">3.界面设计</a>
      </p>
    </blockquote>
    <ul>
      <li>
        点击
        <u>⑥ 设计按钮</u> 中不同的按钮就会进入不同的设计界面。
      </li>
      <li>
        所有的设计都会实时反映在
        <u>⑤ 设计总台的游戏</u> 里。
      </li>
    </ul>
    <br>
    <br>
    <br>
    <br>
    <h2>3. 游戏的保存与恢复</h2>
    <ul>
      <li>
        点击
        <u>⑧ 保存按钮</u>，即可保存当前游戏的设计内容。
      </li>
      <li>
        点击
        <u>⑨ 恢复按钮</u>，即可恢复上一次保存的内容。
      </li>
    </ul>
    <br>
    <br>
    <br>
    <br>
    <h2>4. 游戏的下载</h2>
    <ul>
      <li>
        点击
        <u>⑩ 下载按钮</u> 即可下载游戏。游戏本身是一个HTML文件，在浏览器打开即可。
      </li>
    </ul>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  name: "helpForEntireGame"
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