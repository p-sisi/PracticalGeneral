//讨论列表数据结构
export interface Discuss {
    id: number;          
    content: string;   //内容
    title: string;    //标题
    createTime: string;        //发布时间
    creatorHeadImg: any;    //发布者头像
    creatorName: string;       //发布者名称
    hotDegree: number;         //热度
    commentNum: number;     //评论总数
    viewNum: number;        //浏览总量
    isTop: boolean;   //是否置顶
}

//讨论一级回复
export interface Discuss_First_Reply {
    id: number;
    ownerId: number;  // 发布者id
    ownerName: string;   //发布者名称
    ownerHeadImg: any;    //发布者头像
    content: string;   //内容
    createTime: string;        //发布时间
    secondaryCommentDTOS: Discuss_Second_Reply[];   //二级评论数据
}

//讨论二级回复
export interface Discuss_Second_Reply {
    id: number;
    ownerId: number;  // 发布者id
    ownerName: string;   //发布者名称
    ownerHeadImg: any;    //发布者头像
    replyUserName: string;  //回复者名称
    content: string;   //内容
    createTime: string;        //发布时间
}