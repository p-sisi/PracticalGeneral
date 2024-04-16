//成绩分析相关接口

import request from '../request';

/**
 * 学生端----获取学生成绩所有数据
 */
export function fetchGetScoreAnalyze(params: any) {
    return request.get('/score/getStuAllScore', params);
}