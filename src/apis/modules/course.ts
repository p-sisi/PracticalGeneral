//课程相关接口

import request from '../request';

/**
 * 学生端---获取全部课程
 */
export function fetchGetAllCourseStudent() {
    return request.get('/course/stuGetAllCourse');
}

/**
 * 教师端---获取全部课程
 */
export function fetchGetAllCourseTeacher() {
    return request.get('/course/tchGetAllCourse');
}

/**
 * 管理员端---获取全部课程
 */
export function fetchGetAllCourseAdmin() {
    return request.get('/course/getAllCourse');
}

/**
 * 加课码加入课程
 * @params addCode: 加课码
 */
export function fetchAddCourse(params: object) {
    return request.get('/course/stuJoinCourse',params);
}

/**
 * 学生自主退出课程
 * @params courseId 课程id 
 */
export function fetchExitCourseByStudent(params: any) {
    return request.get('/course/stuExitCourse',params);
}
