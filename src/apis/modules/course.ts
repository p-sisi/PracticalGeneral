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
 * 管理员端---新建课程（不包括导入学生）
 */
export function fetchNewCourse(params: any) {
    return request.post('/course/newOne',params);
}

/**
 * 管理员端---编辑课程信息课程（不包括导入学生信息）
 */
export function fetchEditCourse(params: any) {
    return request.post('/course/updateCourseInfo',params);
}

/**
 * 管理员端---批量导入学生信息至课堂
 */
export function fetchUploadStudentToCourse(params: any,courseId: number) {
    return request.post(`/course/insertAllStu?courseId=${courseId}`,params);
}

/**
 * 管理员端---批量注册学生信息并直接导入课堂
 */
export function fetchCreateAndUploadStudentToCourse(params: any,courseId: number) {
    return request.post(`/course/newStuAndInsert?courseId=${courseId}`,params);
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

/**
 * 获取课堂所有学生-----学生端
 */
export function fetchAllCourseStudent(params: any) {
    return request.get('/course/getAllStuInCourse',params);
}