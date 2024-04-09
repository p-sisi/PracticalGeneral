//作业数据信息
export interface Task {
    id: number,    
    title: string,    //作业标题
    commitNum: number,  //提交人数
    commitStatus: number,  // 0-未提交，1-已提交，2-已批改
    content: string,     // 作业内容
    createTime: string,  // 创建时间
    deadTime: string,    // 截止时间
    score: any,    // 作业分数
}

//作业详情数据结构
export interface TaskDetail {
    id: number,
    answerRemark: string,   // 作业备注
    commitTime: string,    // 提交时间
    depositFilename: string,  //后端存储文件名
    originalFilename: string, //前端展示
    fileSize: number,     // 文件大小B
}