/*
 * @Author: chenxiaoxuan
 * @Date: 2023-05-08 17:22:04
 * @LastEditTime: 2023-05-08 17:26:22
 * @LastEditors: chenxiaoxuan
 * @Description:
 */
import request from '@/utils/axios';
const Api = 'https://www.jianshu.com/p/d8c02373fc31';
const getTest = () => {
  return request({
    url: Api,
    method: 'get'
  });
};
export { getTest };