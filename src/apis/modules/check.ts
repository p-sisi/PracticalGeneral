//签到信息

import request from '../request';

/**
 * 学生端----获取全部签到列表
 */
export function fetchGetAllCheck(params: any) {
    return request.get('/sign/stuGetAll', params);
}

/**
 * 学生端----获取全部签到列表
 */
export function fetchGetAllCheckTech(params: any) {
    return request.get('/sign/tchGetAll', params);
}

/**
 * 教师端----发布签到
 */
export function fetchNewCheck(params: any) {
    return request.post('/sign/newOne', params);
}

/**
 * 教师端----停止签到
 */
export function fetchStopCheck(params: any) {
    return request.get('/sign/stopSign', params);
}

/**
 * 教师端----延迟签到
 */
export function fetchDelayCheck(params: any) {
    return request.get('/sign/delaySign', params);
}

/**
 * 教师端---获取学生某个签到的签到情况
 */
export function fetchCheckStatusList(params: any) {
    return request.get('/sign/getAllStuStatus', params);
}

/**
 * 教师端---修改学生某个签到的签到状态
 */
export function fetchEditCheckStatus(params: any) {
    return request.get('/sign/updateSignStatus', params);
}

/**
 * 学生端----签到
 */
export function fetchCheck(params: any) {
    return request.get('/sign/signIn', params);
}