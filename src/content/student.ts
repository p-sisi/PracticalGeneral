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
        label: '学情分析',
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
        taskId: 1,
        title: '实验一实验报告',
        content: '提交实验一实验报告',
        deadline: '2023-11-24 12:59:59',     //截止日期
        isSubmit: false,     //是否提交
        score: 0,     //得分   未打分则0，打分则为分数
        isEnd: false,     //是否截止
    },
    {
        taskId: 2,
        title: '作业标题2',
        content: '作业内容2',
        deadline: '2023-11-24 12:59:59',
        isSubmit: true,
        score: 90,
        isEnd: false,
    },
    {
        taskId: 3,
        title: '作业标题3',
        content: '作业内容3',
        deadline: '2023-11-24 12:59:59',
        isSubmit: false,
        score: 90,
        isEnd: true,
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
        text: '庞思思真聪明！',
        replyData: [
            {
                id: 1,
                name: '杨思思',
                time: '2021-21-32 12:12:12',
                text: '庞思思真聪明+1',
            },
            {
                id:2,
                name: '杨远远',
                time: '2000-13-12 12:12:12',
                text: '庞思思真聪明+2',
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