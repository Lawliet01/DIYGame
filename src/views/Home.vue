<template>
  <div id="home">
    <section class="introduction">
      <div class="logoContainer">
        <img class="logo" src="@/pic/home/DIYGAMElogo.png" alt="DIYGAME">
      </div>
      <div class="introductionText">
        <div class="introductionTitle">DIYGAME</div>
        <p class="introductionBody">是一款自主游戏设计平台，允许使用者在没有任何技术背景的情况下打造个人专属的冒险游戏。</p>
        <div class="startBtn">
          <router-link to="/" class="preview">预览</router-link>
          <router-link to="/entireGame" class="startDesign">开始设计</router-link>
        </div>
      </div>
      <div class="useCaseContainer">
        <div class="useCase">
          <div class="useCaseIcon">
            <font-awesome-icon icon="birthday-cake"/>
          </div>
          <div class="useCaseText">朋友生日最有创意的礼物</div>
        </div>
        <div class="useCase">
          <div class="useCaseIcon">
            <font-awesome-icon icon="heartbeat"/>
          </div>
          <div class="useCaseText">情人节里的定情信物</div>
        </div>
        <div class="useCase">
          <div class="useCaseIcon">
            <font-awesome-icon icon="lightbulb"/>
          </div>
          <div class="useCaseText">激发孩子创造力的玩具</div>
        </div>
      </div>
    </section>
    <section class="functionsIntro">
      <h1>三大功能</h1>
      <div class="firstFunction">
        <span class="caption">①角色形象设计</span>
      </div>
      <div class="explanation">
        <div>
          <p>导入图片，把自己或他人的头像刻在游戏角色的身体上，宛如身临其境游戏当中。</p>
        </div>
      </div>

      <div class="secondFunction">
        <span class="caption">②关卡结构设计</span>
      </div>
      <div class="explanation">
        <div>
          <p>根据自己的构想设计游戏关卡，按照自己的意愿在关卡里面添加金币、熔浆、怪物等元素， 还可以发挥创造力作出各种有意义的图案。</p>
        </div>
      </div>
      <div class="thirdFunction">
        <span class="caption">③游戏结束动画设计</span>
      </div>
      <div class="explanation">
        <div>
          <p>通关后，设计一段游戏结束的文字动画，如一段真诚的生日祝福，如一封深情的情书。</p>
        </div>
      </div>
    </section>
    <footer class='footer'>
      <pre>
        联系作者：
        邮箱：cxz40901993@qq.com
      </pre>
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  //name: 'home',
  components: {}
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
        padding: 10px 20px;
        border: 1px solid lightblue;
        text-decoration: none;
        margin-right: 20px;
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
  }
}

.useCaseContainer {
  padding-bottom: 40px;
  .useCase {
    display: inline-block;
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
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("../pic/home/firstPoster.png");
    min-height: 600px;
    background-color: rgb(95, 173, 228);

    .caption {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      background-color: #111;
      color: #fff;
      padding: 18px;
      font-size: 25px;
      letter-spacing: 10px;
      border-radius: 10px;
    }
  }

  .secondFunction {
    @extend .firstFunction;
    background-image: url("../pic/home/secondPoster.png");
    min-height: 500px;
    background-color: rgb(40, 46, 52);
  }

  .thirdFunction {
    @extend .firstFunction;
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

.footer{
  background-color:#f6f6f6
}
</style>




