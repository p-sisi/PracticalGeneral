//课程状态
export const CLASS_STATUS = [
    {
        value: 0,
        label: '全部'
    },
    {
        value: 1,
        label: '进行中'
    },
    {
        value: 2,
        label: '已结束'
    }
]

//课程列表
export const CLASS_LIST_DATA = [
    {
        classId: 1,
        className: '计算机导论',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 1,    //1：正在进行中  0：已结束
    },
    {
        classId: 2,
        className: '高等数学',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 0,
    },
    {
        classId: 3,
        className: '线性代数',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 1,
    },
    {
        classId: 4,
        className: '大学英语',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 0,
    },
    {
        classId: 5,
        className: 'Python编程',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 1,
    },
    {
        classId: 6,
        className: '数据结构',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 0,
    },
    {
        classId: 7,
        className: '计算机组成原理',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 1,
    },
    {
        classId: 8,
        className: '操作系统',
        imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        teacher: '杨思远',
        status: 0,
    }
]

//公告列表
export const NOTICE_LIST_DATA = [
    {
        noticeId: 1,
        courseId: 0,
        noticeType: 'system',    //system:系统公告  course: 课程公告
        title: '公告标题1',
        content: '公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1公告内容1',
        createTime: '2022-01-01 00:00:00',   //公告首次发布时间
        updateTime: '2022-01-01 00:00:00',   //公告最后一次更新时间
        resource: '系统',  //公告来源，系统 or 具体课程
        publisher: '杨思远',   //公告发布者
        status: 0,    //公告状态： 0 未读   1 已读
        isTop: false,   //是否置顶
    },
    {
        noticeId: 2,
        courseId: 0,
        noticeType: 'course',
        title: '公告标题2',
        content: '公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2公告内容2',
        createTime: '2022-01-01 00:00:00',
        updateTime: '2022-01-01 00:00:00',
        resource: '计算机系统',
        publisher: '杨思远',
        status: 1,
    },
    {
        noticeId: 3,
        courseId: 0,
        noticeType: 'system',
        title: '公告标题3',
        content: '公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3公告内容3',
        createTime: '2022-01-01 00:00:00',
        updateTime: '2022-01-01 00:00:00',
        resource: '系统',
        publisher: '杨思远',
        status: 0,
    },
    {
        noticeId: 4,
        courseId: 0,
        noticeType: 'system',
        title: '公告标题4',
        content: '公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4公告内容4',
        createTime: '2022-01-01 00:00:00',
        updateTime: '2022-01-01 00:00:00',
        resource: '系统',
        publisher: '杨思远',
        status: 1,
    },
    {
        noticeId: 5,
        courseId: 0,
        noticeType: 'system',
        title: '公告标题5',
        content: '公告内容5',
        createTime: '2022-01-01 00:00:00',
        updateTime: '2022-01-01 00:00:00',
        resource: '系统',
        publisher: '杨思远',
        status: 0,
    }
]


//课程详情页菜单
export const COURSE_MENU = [
    {
        label: '课程资源',
        name: 'course',
        route: 'resource'
    },
    {
        label: '课程公告',
        name: 'notice',
        route: 'notice'
    },
    {
        label: '实训作业',
        name: 'task',
        route: 'task'
    },
    {
        label: '成员',
        name: 'member',
        route: 'member'
    },
    {
        label: '讨论',
        name: 'discuss',
        route: 'discuss'
    },
    {
        label: '成绩分析',
        name: 'analysis',
        route: 'analyze'
    },
    {
        label: '考勤',
        name: 'check_in',
        route: 'check_in'
    },
    {
        label: '答辩',
        name: 'reply',
        route: 'reply'
    },
    {
        label: '问卷调查',
        name: 'survey',
        route: 'survey'
    }
]

//课程详情信息
export const COURSE_INFO = {
    courseId: 1,
    name: '计算机导论',
    createTime: '2023-11-24',
    teacher: '杨思远',
    studentNum: 100,
    addCode: '123456',
    status: 1,  
}

//作业列表
export const TASK_DATA = [
    {
        id: 1,
        title: '实验一实验报告',
        content: '提交中，没提交',
        deadTime: '2024-11-24 12:59:59',     //截止日期
        commitNum: 2,
        commitStatus: 0,     //提交状态   0：未提交 1：已提交  2：已批改 
        score: 0,     //得分   未打分则0，打分则为分数
    },
    {//提交中，已提交，没批改
        id: 2,
        title: '作业标题2',
        content: '提交中，已提交，没批改',
        deadTime: '2024-11-24 12:59:59',
        commitNum: 2,
        commitStatus: 1,
        score: 0,
    },
    {//提交中，已提交，已批改
        id: 6,
        title: '作业标题2',
        content: '提交中，已提交，已批改',
        deadTime: '2024-11-24 12:59:59',
        commitNum: 2,
        commitStatus: 2,
        score: 90,
    },
    {//已截止，已提交，已批改
        id: 3,
        title: '作业标题3',
        content: '已截止，已提交，已批改',
        deadTime: '2023-11-24 12:59:59',
        commitNum: 2,
        commitStatus: 2,
        score: 90,
    },
    {//已截止，已提交，没批改
        id: 4,
        title: '作业标题4',
        content: '已截止，已提交，没批改',
        deadTime: '2023-11-24 12:59:59',
        commitNum: 2,
        commitStatus: 1,
        score: 0,
    },
    {//已截止，没提交
        id: 5,
        title: '作业标题4',
        content: '已截止，没提交',
        deadTime: '2023-11-24 12:59:59',
        commitNum: 2,
        commitStatus: 0,
        score: 0,
    }
]

//作业提交记录
export const TASK_SUBMIT_RECORD = [
    {
        taskId: 1,
        fileName: '实验一报告.docx',
        fileSize: '1243.10kb',
        submitTime: '2032-12-23 12:32'
    },
    {
        taskId: 2,
        fileName: '实验二报告.docx',
        fileSize: '1243.10kb',
        submitTime: '2032-12-23 12:32'
    }
]

//讨论话题列表
export const DISCUSS_LIST_DATA = [
    {
        id: 1,
        title: '讨论标题1',
        publisher:'杨思远',
        content: '1111',
        viewCount: 12,
        replyCount: 10,
        createTime:'2022-31-42 12:12:12'
    },
    {
        id: 1,
        title: '讨论标题1',
        publisher:'杨思远',
        content: '1111',
        viewCount: 12,
        replyCount: 10,
        createTime:'2022-31-42 12:12:12'
    },
]


//讨论回复列表
export const DISCUSS_REPLY_LIST_DATA = [
    {
        id: 1,
        name: '杨思远',
        time: '2031-21-12 21:31:21',
        text: '庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！庞思思真聪明！',
        replyData: [
            {
                id: 1,
                name: '杨思思',
                time: '2021-21-32 12:12:12',
                text: '庞思思真聪明+1',
                replyName: '杨思远',   
            },
            {
                id:2,
                name: '杨远远',
                time: '2000-13-12 12:12:12',
                text: '庞思思真聪明+2',
                replyName: '杨思思',
            }
        ]
    },
    {
        id: 2,
        name: '庞思思',
        time: '2021-21-32 12:12:12',
        text: '杨思远真垃圾',
        replyData: [],
    }
]


//学生签到记录
export const STUDENT_SIGN_IN_DATA = [
    {
        id:1,
        title: '第一次签到',  //签到标题
        type: '数字签到',    //签到类型  1 按钮签到   2 数字签到
        createTime: '2020-12-31 12:12:12',   //签到发起时间
        endTime: '2020-12-31 12:12:12',     //截止时间
        signTime: '2020-12-31 12:12:12',    //签到时间
        status: 4,   //签到状态   0 缺勤   1 出勤   2 迟到   3 请假  4 未签到
    },
    {
        id:2,
        title: '第二次签到',
        type: '按钮签到', 
        createTime: '2020-12-31 12:12:12',
        endTime: '2020-12-31 12:12:12',
        signTime: '2020-12-31 12:12:12',
        status:1,
    },
    {
        id:3,
        title: '第三次签到',
        type: '数字签到', 
        createTime: '2020-12-31 12:12:12',
        endTime: '2020-12-31 12:12:12',
        signTime: '2020-12-31 12:12:12',
        status: 2,
    },
    {
        id:4,
        title: '第四次签到',
        type: '数字签到', 
        createTime: '2020-12-31 12:12:12',
        endTime: '2020-12-31 12:12:12',
        signTime: '2020-12-31 12:12:12',
        status: 3,
    }
]