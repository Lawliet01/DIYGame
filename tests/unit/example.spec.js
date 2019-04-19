import store from '../../src/store';
import {createLocalVue} from '@vue/test-utils';
import Vuex from 'vuex';


describe('storeTest',()=>{
  const localVue = createLocalVue();
  localVue.use(Vuex);
  it('uploadData',()=>{
    expect(store.state.playerFigure.imgData).toBe(null);
    store.commit('playerFigure/uploadImgData', {imgData:123,width:10,height:20,x:5,y:5});
    expect(store.state.playerFigure.imgData).toBe(123);
    expect(store.state.playerFigure.width).toBe(10)
    expect(store.state.playerFigure.height).toBe(20);
    expect(store.state.playerFigure.x).toBe(5);
    expect(store.state.playerFigure.y).toBe(5);
  })
})