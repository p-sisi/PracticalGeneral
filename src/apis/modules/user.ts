import request from '../request';


/**
 * 用户登录--通过账号
 */
export function fetchLoginIn(params: any) {
    return request.post('/user/login', params);
}

/**
 * 用户登录--通过邮箱和验证码
 */
export function fetchLoginInByEmail(params: any) {
    return request.get('/user/loginByEmail', params);
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
 * 获取所有学生账号---管理员端
 */
export function fetchAllStudent() {
    return request.get('/user/getAllStu');
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

/**
 *  发送验证码
 */
export function fetchSendEmailCode(params: any) {
    return request.get('/user/sendEmailCode',params);
}