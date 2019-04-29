<template>
  <div>
    entireGame
    <div class="gameContainer"></div>
    <button @click="goToPlayerFigureDesign()">playerFigureDesign</button>
    <button @click="goToGameDesign()">GameDesign</button>
    <button @click="downloadTheGame()">downloadTheGame</button>
  </div>
</template>

<script>
import Game from "../lib/pureGame";
import gameLevel from "../lib/gameLevel";
import { mapState } from "vuex";
import gameTemplate from "@/lib/gameTemplate";
import { constants } from "crypto";

let pics = {};
importAll(require.context("../pic/pureGame/", false, /\.png$/));
function importAll(r) {
  r.keys().forEach(key => (pics[key] = r(key)));
}

export default {
  name: "entrieGame",
  beforeRouteLeave(to, from, next) {
    this.runningGame.stopGame();
    next();
  },
  mounted: function() {
    let levelMap = this.$store.state.gameLevel.levelMap;
    levelMap = levelMap.length == 0 ? gameLevel : levelMap;
    this.runningGame = new Game(this.gameContainer);
    this.runningGame.runGame(
      levelMap,
      this.levelSetting,
      this.globalPlayerSetting
    );
  },
  data: function() {
    return {
      runningGame: null
    };
  },
  computed: {
    ...mapState("gameLevel", [
      "levelMap",
      "levelSetting",
      "currentLevel",
      "structureDesign",
      "globalPlayerSetting"
    ]),
    gameContainer() {
      return document.querySelector(".gameContainer");
    },
    playerFigure() {
      let src = this.$store.state.playerFigure.result;
      if (src == null) return null;
      let image = new Image();
      image.src = this.$store.state.playerFigure.result;
      return image;
    }
  },
  methods: {
    goToPlayerFigureDesign() {
      this.$router.push("/playerFigure/combine");
    },
    goToGameDesign() {
      this.$router.push("/gameDesign");
    },
    downloadTheGame() {
      let blob = new Blob(manipulateHTML(gameTemplate, this), {
        text: "text/plain"
      });
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "DIYGame.html");
      link.click();
      link.remove();

      function manipulateHTML(htmlFile, self) {
        let otherSprites = getImage("sprites.png", pics);
        let playerSprites = getImage("player.png", pics);
        let monsterSprites = getImage("Monster1.png", pics);
        let dragonSpritesSRC = getImage("dragon.png", pics, 10);
        let fireSpritesSRC = getImage("fire.png", pics, 4);
        let toFireSRC = getImage("tofire.png", pics, 8);

        htmlFile = replaceFile("spritesToBeReplaced", otherSprites);
        htmlFile = replaceFile("playerToBeReplaced", playerSprites);
        htmlFile = replaceFile("monsterToBeReplaced", monsterSprites);
        htmlFile = replaceFile("drgonToBeReplaced", dragonSpritesSRC);
        htmlFile = replaceFile("fileToBeReplaced", fireSpritesSRC);
        htmlFile = replaceFile("dragonToFireToBeReplaced", toFireSRC);

        htmlFile = htmlFile.replace(
          "gameLevelToBeReplaced",
          JSON.stringify(self.levelMap.length == 0 ? gameLevel : self.levelMap)
        );
        //传入src而不是image
        //let levelSetting = Object.assign({},self.levelSetting,)
        htmlFile = htmlFile.replace(
          "gameSettingsToBeReplaced",
          JSON.stringify(self.levelSetting)
        );
        htmlFile = htmlFile.replace(
          "globalSettingsToBeReplaced",
          JSON.stringify(self.globalPlayerSetting)
        );

        function getImage(name, requireContext, length) {
          //获得每个图的url
          if (length == undefined) {
            //先用canvas画出来，使用toDataURL获得url，然后最后去除canvas和image。
            let src = requireContext["./" + name];
            if (src == undefined) throw new Error("no such image");
            let image = new Image();
            image.src = src;
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let cx = canvas.getContext("2d");
            document.body.appendChild(canvas);
            cx.drawImage(image, 0, 0);
            let url = canvas.toDataURL();
            canvas.remove();
            image.remove()
            return url;
          } else {
            return Array.apply(null, { length: length }).map(function(
              _,
              index
            ) {
              let fileIndex = index + 1;
              let fileName = name.replace(/[.]/, fileIndex + ".");
              return getImage(fileName, requireContext);
            });
          }
        }
        function replaceFile(name, value) {
          return htmlFile.replace(name, JSON.stringify(value));
        }
        return [htmlFile];
      }
    }
  }
};
</script>

