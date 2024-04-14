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