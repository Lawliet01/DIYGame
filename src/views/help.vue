<template>
  <div id="helpPage">
    <div class="link">
      <div class="helpTitle">-{{lang === 1 ?"帮助":"Guide"}}</div>
      <div @click="page='entireGame'" class="pageLink">&nbsp;&nbsp;{{lang === 1 ?"首次使用":"Introduction"}}</div>
      <div @click="page='playerFigure'" class="pageLink">&nbsp;&nbsp;{{lang === 1?"角色设计":"Player Design"}}</div>
      <div @click="page='gameDesign'" class="pageLink">&nbsp;&nbsp;{{lang === 1 ?"游戏设计":"Level Design"}}</div>
      <div @click="page='faceDesign'" class="pageLink">&nbsp;&nbsp;{{lang === 1 ?"界面设计":"Interface Design"}}</div>
    </div>
    <div class="page">
      <help-for-Entire-Game v-if="page=='entireGame'" v-on:change-page="changePage($event)"></help-for-Entire-Game>
      <help-for-player-figure v-else-if="page=='playerFigure'"></help-for-player-figure>
      <help-for-game-Design v-else-if="page=='gameDesign'"></help-for-game-Design>
      <help-for-Face-Design v-else></help-for-Face-Design>
    </div>
  </div>
</template>

<script>
import helpForPlayerFigure from "@/components/helpPage/helpForPlayerFigure";
import helpForGameDesign from "@/components/helpPage/helpForGameDesign";
import helpForFaceDesign from "@/components/helpPage/helpForFaceDesign";
import helpForEntireGame from "@/components/helpPage/helpForEntireGame";

export default {
  components: {
    helpForPlayerFigure,
    helpForGameDesign,
    helpForFaceDesign,
    helpForEntireGame
  },
  data() {
    return {
      page: "entireGame"
    };
  },
  methods:{
     changePage(pageName){
        this.page = pageName;
        window.scrollTo(0,0);
     }
  },
  computed:{
    lang(){
      return this.$store.state.lang
    }
  },

};
</script>

<style scoped lang='scss'>
#helpPage {
  padding-top: 50px;
  display: flex;
  flex-wrap: wrap;
}

.link {
  position: fixed;
  flex: 0 0 200px;
  width:200px;
  .helpTitle {
    padding: 5px 5px 5px 50px;
    text-align: left;
    font-size: 20px;
    color: black;
  }
  .pageLink {
    padding: 5px 5px 5px 50px;
    text-align: left;
    &:hover {
      cursor: pointer;
      background-color: #f1f1f1;
    }
  }
}

.page {
  flex: 80%;
  padding-left: 200px;
}

@media screen and (max-width: 800px) {
  .link {
    position:static;
    flex: 20%;
    width:auto;
    .helpTitle{
       padding:5px 5px 5px 20%;
    }
    .pageLink{
       padding: 5px 5px 5px 20%;
    }
  }
  .page {
    flex: 80%;
    padding-left:0;
  }
}

@media screen and (max-width: 600px) {
   #helpPage{
      padding-top:0px;
   }
  .link {
    flex: 100%;
    padding-left: 0;
    background-color:#bebfb9;
    .helpTitle {
      text-align: center;
      padding:5px;
    }
    .pageLink {
      text-align: center;
      padding: 5px;
    }
  }
  .page {
   margin-top:0px;
    flex: 100%;
  }
}
</style>

