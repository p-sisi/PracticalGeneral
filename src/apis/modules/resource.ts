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
 * 更改视频资源
 */
export function fetchUpdateVideoResource(params: any) {
    return request.post('/video/updateVideoInfo',params);
}