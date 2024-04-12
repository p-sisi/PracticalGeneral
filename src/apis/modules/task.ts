//公告相关接口请求

import request from '../request';

/**
 * 学生端---获取课程作业列表
 */
export function fetchGetAllCourseTask(params: any) {
    return request.get('/homework/stuGetAllHomework',params);
}

/**
 * 教师端---获取课程作业列表
 */
export function fetchGetAllCourseTaskTech(params: any) {
    return request.get('/homework/tchGetAllHomework',params);
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

/**
 * 教师端--获取某个作业的学生提交数据
 */
export function fetchTaskSubmitList(params: any) {
    return request.get('/homework/getAllStuCommitStatus',params);
}


/**
 * 教师端--删除作业
 */
export function fetchDeleteTask(params: any) {
    return request.get('/homework/delete',params);
}

/**
 * 教师端--编辑作业
 */
export function fetchEditTask(params: any) {
    return request.post('/homework/update',params);
}

/**
 * 教师端--发布作业
 */
export function fetchNewTask(params: any) {
    return request.post('/homework/newHomework',params);
}

/**
 * 教师端--评分
 */
export function fetchMarkTask(params: any) {
    return request.get('/homework/correctHomework',params);
}

/**
 * 教师端--获取某个学生在某个作业中的最新提交记录
 */
export function fetchStudentTaskNew(params: any) {
    return request.get('/homework/getNewCommit',params);
}

/**
 * 教师端--获取某个学生在某个作业中的历史提交记录
 */
export function fetchStudentTaskHistory(params: any) {
    return request.get('/homework/getCommitHistory',params);
}