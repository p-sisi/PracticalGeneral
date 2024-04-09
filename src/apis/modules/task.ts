//公告相关接口请求

import request from '../request';

/**
 * 学生端---获取课程作业列表
 */
export function fetchGetAllCourseTask(params: any) {
    return request.get('/homework/stuGetAllHomework',params);
}

/**
 * 学生端---提交作业
 */
export function fetchSubmitTask(params: any) {
    return request.post('/homework/commitHomework',params);
}

/**
 * 学生端---获取作业历史提交记录
 */
export function fetchGetTaskHistory(params: any) {
    return request.get('/homework/stuGetCommitHistory',params);
}

/**
 * 下载作业
 */
export function fetchDownloadTask(params: any) {
    return request.get('/file/download',params);
}