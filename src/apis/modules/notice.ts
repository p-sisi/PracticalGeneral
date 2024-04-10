//公告相关接口请求

import request from '../request';

/**
 * 获取所有课程公告
 */
export function fetchGetAllCourseNotice() {
    return request.get('/notice/getAllCourseNotice');
}

/**
 * 获取所单个课程公告--学生端

 */
export function fetchGetCourseNoticeStudent(params: object) {
    return request.get('/notice/getOneCourseNotice', params);
}

/**
 * 获取所单个课程公告--教师端

 */
export function fetchGetCourseNoticeTeacher(params: object) {
    return request.get('/notice/tchGetCourseNotice', params);
}

/**
 * 获取所有系统公告
 */
export function fetchGetAllSysNotice() {
    return request.get('/notice/getSysNotice');
}

/**
 * 设置已读
 */
export function fetchReadNotice(params: object) {
    return request.get('/notice/setNoticeIsRead',params);
}

/**
 * 删除公告
 */
export function fetchDeleteNotice(params: object) {
    return request.get('/notice/deleteNotice', params);
}


/**
 * 编辑公告
 */
export function fetchEditNotice(params: object) {
    return request.post('/notice/updateNotice', params);
}

/**
 * 新增课程公告
 */
export function fetchNewCourseNotice(params: object) {
    return request.post('/notice/newCourseNotice', params);
}

/**
 * 置顶公告
 */
export function fetchTopNotice(params: object) {
    return request.get('/notice/setTopNotice', params);
}


/**
 * 取消置顶公告
 */
export function fetchCancelTopNotice(params: object) {
    return request.get('/notice/cancelTopNotice', params);
}