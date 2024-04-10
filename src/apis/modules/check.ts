//签到信息

import request from '../request';

/**
 * 学生端----获取全部签到列表
 */
export function fetchGetAllCheck(params: any) {
    return request.get('/sign/stuGetAll', params);
}

/**
 * 学生端----签到
 */
export function fetchCheck(params: any) {
    return request.get('/sign/signIn', params);
}