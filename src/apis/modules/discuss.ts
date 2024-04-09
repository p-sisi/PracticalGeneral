//讨论相关接口

import request from '../request';

/**
 * 学生端---获取课程全部讨论
 */
export function fetchDiscussByCourseId(params: any) {
    return request.get('/discussion/getAllByCourseId', params);
}

/**
 * 学生端---获取某个讨论的所有评论
 */
export function fetchDiscussComment(params: any) {
    return request.get('/discussion/getAllComments', params);
}

/**
 * 发起评论
 */
export function fetchNewDiscuss(params: any) {
    return request.post('/discussion/newDiscussion', params);
}


/**
 * 回复评论（一级二级）
 */
export function fetchReplyDiscuss(params: any) {
    return request.post('/discussion/newComment', params);
}

/**
 * 删除回复（一级二级）
 */
export function fetchDeleteReplyDiscuss(params: any) {
    return request.get('/discussion/deleteComment', params);
}