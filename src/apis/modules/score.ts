//成绩分析、结课答辩相关接口

import request from '../request';

/**
 * 学生端----获取学生成绩所有数据
 */
export function fetchGetScoreAnalyze(params: any) {
    return request.get('/score/getStuAllScore', params);
}

/**
 * 教师端----获取所有学生成绩所有数据
 */
export function fetchGetScoreAnalyzeTech(params: any) {
    return request.get('/score/tchGetAllStu', params);
}

/**
 * 学生端----获取个人答辩记录
 */
export function fetchGetReplyHistory(params: any) {
    return request.get('/defence/stuGetDefence', params);
}

/**
 * 教师端----获取所有学生答辩记录
 */
export function fetchGetReplyHistoryTech(params: any) {
    return request.get('/defence/tchGetAllDefence', params);
}

/**
 * 学生端----学生申请答辩
 */
export function fetchReplyTime(params: any) {
    return request.post('/defence/stuApplyDefence', params);
}