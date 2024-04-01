//公告相关接口请求

import request from '../request';

/**
 * 获取所有课程公告
 */
export function fetchGetAllCourseNotice() {
    return request.get('/notice/getAllCourseNotice');
}

/**
 * 获取所有系统公告
 */
export function fetchGetAllSysNotice() {
    return request.get('/notice/getSysNotice');
}