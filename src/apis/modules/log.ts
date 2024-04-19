//日志相关接口请求

import request from '../request';

/**
 * 获取所有操作日志：0错误信息，1更新信息，2删除信息，3新增信息，4其他信息，5全部信息
 */
export function fetchGetLog(params: any) {
    return request.get('/log/getAll',params);
}