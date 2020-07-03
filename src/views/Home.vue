<template>
  <div id="home">
    <section class="introduction">
      <div class="logoContainer">
        <img class="logo" src="@/pic/home/DIYGAMElogo.png" alt="DIYGAME">
      </div>
      <div class="introductionText">
        <div class="introductionTitle">DIYGAME</div>
        <p class="introductionBody" v-if="lang === 1">是一个自主游戏设计平台，你可以在<strong>不写任何代码</strong>的情况写，打造一款<strong>具有个人印记</strong>的冒险游戏。</p>
        <p class="introductionBody" v-else>is a game design application. You can make your own platform game <strong>without any coding</strong> here.</p>
        <div class="startBtn">
          <router-link to="/previewPage" class="preview">{{lang === 2?"EXAMPLE":"实例"}}</router-link>
          <router-link to="/entireGame" class="startDesign">{{lang === 2?"TRY NOW !":"开始设计"}}</router-link>
        </div>
      </div>
      <div class="useCaseTitle">
        {{lang===2?"Use Cases":"使用场景"}}
      </div>
      <div class="useCaseContainer">
        <div class="useCase">
          <div class="useCaseIcon">
            <font-awesome-icon icon="birthday-cake"/>
          </div>
          <div class="useCaseText">{{lang === 2 ? "Memorable birthday gift":"亲友生日上最有创意的礼物"}}</div>
        </div>
        <div class="useCase">
          <div class="useCaseIcon">
            <font-awesome-icon icon="heartbeat"/>
          </div>
          <div class="useCaseText">{{lang === 2?"Token of love":"情人节的定情信物"}}</div>
        </div>
        <div class="useCase">
          <div class="useCaseIcon">
            <font-awesome-icon icon="lightbulb"/>
          </div>
          <div class="useCaseText">{{lang===2?"Game that inspire children's creativity":"激发孩子创造力的玩具"}}</div>
        </div>
      </div>
    </section>
    <section class="functionsIntro">
      <h1>{{lang===2?"FEATURES":"主要特性"}}</h1>
      <div class="firstFunction" v-bind:style="backgroundStyle">
        <span class="caption">①{{lang === 2 ? "Customized player character":"角色形象设计"}}</span>
      </div>
      <div class="explanation">
        <div>
          <p v-if="lang===1">一款自主设计的游戏，必不可少的是富有个人特色的游戏角色。DIYGAME允许您按照自己的想法，设计独一无二的角色形象。</p>
          <p v-else>A homemade player character is essential for a homemade game. You can design your own player character with the assistance of DIYGAME.</p>
        </div>
      </div>

      <div class="secondFunction" v-bind:style="backgroundStyle">
        <span class="caption">②{{lang === 2 ? "Customized game level":"游戏关卡设计"}}</span>
      </div>
      <div class="explanation">
        <div>
          <p v-if="lang === 1">您可以根据自己的意愿设置任意数量的关卡，并按照自己的构想给每个关卡添加金币、熔浆、怪物等各种元素。您的想象力与创造力将在这里得到施展。</p>
          <p v-else>You can set up any number of levels and add elements(coin, lava, monster and so on ) to each level base on your idea.</p>
        </div>
      </div>
      <div class="thirdFunction" v-bind:style="backgroundStyle">
        <span class="caption">③{{lang === 2 ?"Customized start and end interface":"游戏开始与结束界面设计"}}</span>
      </div>
      <div class="explanation">
        <div>
          <p v-if="lang === 1">您可以设计游戏的开始与结束界面。结束界面还允许您设计一段流动的文字动画，来表达您想说的话。这部分的设计不仅增加了游戏的独特性，还能有效地传达您的设计意图。</p>
          <p v-else>You can also design start and end interface of the game. On the end interface, you can design a flow of text, conveying what you want to say.</p>
        </div>
      </div>
    </section>
    <footer class="footer">
      <pre>
        {{lang===1?"联系方式：":"Contact information"}}
        {{lang===1?"邮箱：":"Email: "}}cxz40901993@qq.com
      </pre>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  computed:{
    lang(){
      return this.$store.state.lang
    }
  },
  mounted() {
    if (!is_touch_device()) {
      this.backgroundStyle.backgroundAttachment = "fixed";
    }
    function is_touch_device() {
      return (
        "ontouchstart" in window ||
        navigator.MaxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
      );
    }
  },
  data: function() {
    return {
      backgroundStyle: {
        backgroundAttachment: "none"
      }
    };
  }
};
</script>

<style lang="scss" scoped>
#home {
  text-align: left;
}

.introduction {
  .logoContainer {
    display: inline-block;
    width: 50%;
    padding: 30px;
    img {
      width: 400px;
      float: right;
    }

    @media screen and (max-width: 900px) {
      width: 100%;
      padding: 0;
      text-align: center;
      img {
        float: none;
      }
    }

    @media screen and (max-width: 400px) {
      width: 100%;
      padding: 0;
      text-align: center;
      img {
        float: none;
        width: 100%;
      }
    }
  }
  .introductionText {
    display: inline-block;
    width: 50%;
    vertical-align: top;
    .introductionTitle {
      font-size: 50px;
      padding-top: 60px;
      padding-left: 18px;
    }
    .introductionBody {
      width: 400px;
      padding: 5px 20px;
    }

    .startBtn {
      padding: 40px 20px;
      vertical-align: bottom;
      a {
        display: inline-block;
        padding: 10px 20px;
        border: 1px solid lightblue;
        text-decoration: none;
        margin-right: 20px;
        margin-bottom: 10px;
        border-radius: 5px;
        font-size: 40px;
        color: #e42e2e;
        transition: all 0.3s;
        &:hover {
          background-color: #e42e2e;
          color: white;
        }
      }
    }
    @media screen and (max-width: 900px) {
      width: 100%;
      text-align: center;
      .introductionTitle {
        padding-top: 0;
      }
      .introductionBody {
        margin: auto;
      }
      .startBtn a {
        margin: 10px;
      }
    }
    @media screen and (max-width: 400px) {
      width: 100%;
      text-align: center;
      .introductionTitle {
        padding: 0;
        width: 100%;
      }
      .introductionBody {
        width: 100%;
      }
      .startBtn a {
        padding: 5px 10px;
        font-size: 10vw;
      }
    }
  }
}

.useCaseTitle {
  text-align: center;
  margin-bottom: 30px;
  font-size: 30px;
}

.useCaseContainer {
  padding-bottom: 40px;
  .useCase {
    display: inline-block;
    vertical-align: top;
    width: 33.33%;
    text-align: center;
  }
  .useCaseIcon {
    font-size: 50px;
    padding-bottom: 20px;
  }

  @media screen and (max-width: 600px) {
    padding-bottom: 0;
    padding-top: 20px;
    .useCase {
      width: 100%;
      margin: 10px;
      &::after {
        content: "-------------";
        font-size: 20px;
      }
    }
    .useCaseIcon {
      padding-bottom: 0;
    }
  }
}

.functionsIntro {
  padding-top: 50px;
  text-align: center;
  h1 {
    font-size: 50px;
    background: #111;
    margin: 0;
    padding: 30px;
    color: #32b8d9;
  }

  .firstFunction {
    position: relative;
    //background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("../pic/home/firstPoster.png");
    min-height: 700px;
    background-color: rgb(95, 173, 228);

    .caption {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      background-color: rgba(17, 17, 17, 1);
      color: #fff;
      padding: 18px;
      font-size: 3vw;
      // letter-spacing: 10px;
      border-radius: 10px;
    }
    @media screen and (max-width: 500px) {
      .caption {
        padding: 5px;
        background-color: rgba(17, 17, 17, 0.6);
      }
    }
  }

  .secondFunction {
    @extend .firstFunction;
    background-image: url("../pic/home/secondPoster.png");
    min-height: 500px;
    background-color: rgb(52, 166, 251);
  }

  .thirdFunction {
    @extend .firstFunction;
    background-image: url("../pic/home/thirdPoster.jpg");
    min-height: 400px;
    background-color: #f7d10afc;
  }

  .explanation {
    position: relative;
    div {
      color: #ddd;
      background-color: #282e34;
      text-align: center;
      padding: 20px 80px;
      text-align: justify;
    }
  }
}

@media screen and (max-width: 900px) {
  .logoContainer {
    width: 100%;
    img {
      float: none;
    }
  }
  .introductionText {
    width: 100%;
  }
}

.footer {
  background-color: #f6f6f6;
}
</style>




