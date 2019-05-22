<template>
  <div class="note-wrapper">
    <h1>帮助：界面设计</h1>
    <hr>
    <br>
    <p>界面设计包含两个部分：</p>
    <p>1.游戏开始界面</p>
    <p>2.游戏结束界面</p>
    <br>
    <br>
    <br>
    <br>
    <h2>1. 进入界面设计面板</h2>
    <p>
      <img src="@/pic/helpPage/selectFaceDesign.png">
    </p>
    <br>
    <ul>
      <li>
        在总控制面板中，点击
        <u>界面设计</u> ，进入游戏设计面板。
      </li>
    </ul>
    <br>
    <p>
      <img src="@/pic/helpPage/faceDesignPanelIntro.png">
    </p>
    <br>
    <p>①游戏开始界面与结束动画之间操作的切换。</p>
    <p>②添加文字按钮，给界面添加文字。</p>
    <p>③添加图片按钮，给界面添加图片。</p>
    <p>④修改背景按钮，修改界面背景的样式。</p>
    <p>⑤设置面板，点击不同的元素（如文字、图片等），会出现对应元素的设置。</p>
    <p>⑥开始游戏按钮，点击即可设置其属性。</p>
    <p>⑦完成按钮，完成界面设计，返回设计总台。</p>
    <br>
    <br>
    <br>
    <br>
    <h2>2. 操作元素</h2>
    <br>
    <ul>
      <li>在操作屏幕中点击元素，即可对该元素进行相关操作，如要删除，就在设置面板中点击删除按钮即可</li>
    </ul>
    <p>💡：开始界面的游戏开始按钮以及结束动面的文字流动画无法删除。</p>
    <br>
    <br>
    <br>
    <br>
    <h2>3. 结束界面动画</h2>
    <br>
    <p>
      <img src="@/pic/helpPage/endFaceAnimation.png">
    </p>
    <br>
    <ul>
      <li>在游戏结束动画界面的中，默认添加了一段黄色的文字。这段文字与其他文字元素不同，可以在设置一栏给其添加动画。</li>
    </ul>
    <br>
    <br>
    <br>
    <br>
    <h2>4. 完成与测试</h2>
    <br>
    <ul>
      <li>设计完毕后，点击完成按钮，页面会返回设计总台，即可查看设计成果。</li>
    </ul>
    <p>
      <img src="@/pic/helpPage/faceDesignResult.png">
    </p>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  name: "helpForFaceDesign"
};
</script>

<style lang="scss" scoped>
@import "./lib/_cssStyle.scss";
.note-wrapper {
  text-align: left;
  h1{
     font-size:50px;
  }
  @media screen and(max-width: 500px) {
    h1{
      font-size:40px;
    }
  }
}
</style>