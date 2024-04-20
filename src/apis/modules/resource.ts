//资源相关接口
import request from '../request';


/**
 * 获取课程的所有视频资源---学生端
 */
export function fetchVideoResource(params: any) {
    return request.get('/video/stuGetAllVideo',params);
}

/**
 * 获取课程的所有视频资源---教师端
 */
export function fetchVideoResourceTech(params: any) {
    return request.get('/video/tchGetAllVideo',params);
}

/**
 * 获取课程的所有文件资源
 */
export function fetchFileResource(params: any) {
    return request.get('/courseFile/getAllFile',params);
}


/**
 * 上传视频资源
 */
export function fetchUploadVideoResource(params: any) {
    return request.post('/video/uploadVideo',params);
}

/**
 * 删除视频资源
 */
export function fetchDeleteVideoResource(params: any) {
    return request.get('/video/deleteVideo',params);
}

/**
 * 删除文件资源
 */
export function fetchDeleteFileResource(params: any) {
    return request.get('/courseFile/deleteFile',params);
}

/**
 * 更改视频资源
 */
export function fetchUpdateVideoResource(params: any) {
    return request.post('/video/updateVideoInfo',params);
}

/**
 *  暂停播放视频---学生端   监听视频进度
 */
export function fetchPauseVideoResource(params: any) {
    return request.get('/video/watchStop',params);
}

/**
 *  开始播放视频---学生端   监听视频进度
 */
export function fetchPlayVideoResource(params: any) {
    return request.get('/video/watchStart',params);
}

/**
 *  每30s检查进度，视频开始播放时开始计时器，视频暂停播放时结束计时器
 */
export function fetchVideoResourcePlayWatch(params: any) {
    return request.get('/video/watchAutoCheck',params);
}