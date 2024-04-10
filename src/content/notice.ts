//公告详情信息
export interface Notice {
    noticeId: number;   
    courseId: number;
    content: string;       //内容
    createTime: string;    //发布时间
    updateTime: string;    //更新时间
    creatorName: string;   //发布者名称
    isRead?: false;         //是否已读
    isTop: true;          //是否置顶
    noticeType: number;   //课程类型： 0 系统公告 1 课程公告
    courseName: string;   //公告来源课程名称
    title: string;        //标题
    readCount?: number;    //公告已读人数
}