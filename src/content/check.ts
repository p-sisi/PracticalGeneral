//签到列表数据
export interface Check {
    id: number,
    signType: number,   //签到类型：1 数字签到 0 快速签到
    createTime: string, //发起签到时间
    deadTime: string,   //签到截止时间
    mySignStatus: 0,    //签到状态：0 缺勤   1 出勤   2 请假   3 迟到
    signTime: any,      //签到时间
    title: string,      //标题
}