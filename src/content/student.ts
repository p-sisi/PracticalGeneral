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
