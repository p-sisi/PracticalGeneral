//登录等接口信息

import request from '../request';

/**
 * 用户登录
 */
export function fetchLoginIn(params: any) {
    return request.post('/user/login', params);
}

/**
 * 是否登录
 */
export function fetchIsLoginIn(params: any) {
    return request.get('/user/isLogin', params);
}
