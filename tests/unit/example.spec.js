import store from '../../src/store';
import {createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';


describe('storeTest',()=>{
  const localVue = createLocalVue();
  localVue.use(Vuex);
  it('uploadData',()=>{
    expect(store.state.playerFigure.imgData).toBe(null);
    store.commit('playerFigure/uploadImgData',{data:123,width:10,height:20});
    expect(store.state.playerFigure.imgData.width).toBe(10);
    expect(store.state.playerFigure.imgData.height).toBe(20);
  })
})