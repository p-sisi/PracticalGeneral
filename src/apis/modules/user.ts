import request from '../request';


/**
 * 用户登录
 */
export function fetchLoginIn(params: any) {
    return request.post('/user/login', params);
}

/**
 * 用户注册
 */
export function fetchSignUp(params: any) {
    return request.post('/user/register', params);
}

/**
 * 批量用户注册
 */
export function fetchSignUpMultiple(params: any) {
    return request.post('/user/registerAll', params);
}

/**
 * 是否登录
 */
export function fetchIsLoginIn(params: any) {
    return request.get('/user/isLogin', params);
}

/**
 * 获取所有教师账号---管理员端
 */
export function fetchAllTeacher() {
    return request.get('/user/getAllTch');
}


/**
 *  修改用户姓名--- 管理员端
 */
export function fetchUpdateUserName(params: any) {
    return request.get('/user/updateName',params);
}

/**
 *  修改密码(通过旧密码)
 */
export function fetchUpdateUserPasswordByOld(params: any) {
    return request.post('/user/resetPwdByOldPwd',params);
}

/**
 *  修改用户账号状态
 */
export function fetchUpdateUserStatus(params: any) {
    return request.get('/user/setUserStatus',params);
}