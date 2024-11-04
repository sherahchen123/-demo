import { mount } from '@vue/test-utils';
import index from '@/views/home/index.vue';
 
describe('index', () => {
  test('navigates to the correct URL when button is clicked', async () => {
    const wrapper = mount(index);
    // 触发点击事件
    await wrapper.find('goCesium').trigger('click');
    // 预期页面会跳转到指定的URL
    expect(window.location.href).toEqual('http://localhost:5173/#/cesiumPage');
  });
});