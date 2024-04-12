//作业列表--学生端
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

//作业列表--教师端
export interface Task_Tech {
    id: number,    
    title: string,    //作业标题
    content: string,     // 作业内容
    commitNum: number,  //提交人数
    createTime: string,  // 创建时间
    deadTime: string,    // 截止时间
}

//学生作业提交情况表格---教师端
export interface Task_Tech_Commit {
    commitId: number,   // 提交记录id
    stuId: number,    // 学生id
    stuName: string,    // 学生姓名
    commitStatus: number,  // 提交状态: 0 未提交 1 已提交  2 已批改
    commitTime: string,  //提交时间
    correctTime: string,  //批改时间
    score: any,    // 作业分数
}

//学生端---作业详情数据结构
export interface TaskDetail {
    id: number,
    answerRemark: string,   // 作业备注
    commitTime: string,    // 提交时间
    depositFilename: string,  //后端存储文件名
    originalFilename: string, //前端展示
    fileSize: number,     // 文件大小B
}