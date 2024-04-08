//课程相关接口

import request from '../request';

/**
 * 学生获取全部课程
 */
export function fetchGetAllCourseStudent() {
    return request.get('/course/stuGetAllCourse');
}

/**
 * 加课码加入课程
 * @params addCode: 加课码
 */
export function fetchAddCourse(params: object) {
    return request.get('/course/stuJoinCourse',params);
}
