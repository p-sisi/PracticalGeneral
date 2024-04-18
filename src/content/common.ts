//后端域名,更换ip地址
export const BASE_ERL = 'http://10.33.95.133:8081/';

//用户类型
export const USER_TYPE = [
    {
        value: 0,
        label: '管理员'
    },
    {
        value: 1,
        label: '教师'
    },
    {
        value: 2,
        label: '学生'
    }
]

//学生端---课程详情页菜单
export const COURSE_MENU_STU = [
    {
        label: '课程公告',
        name: 'notice',
        routeName: 'student_notice'
    },
    {
        label: '考勤',
        name: 'check_in',
        routeName: 'student_check_in'
    },
    {
        label: '实训作业',
        name: 'task',
        routeName: 'student_task'
    },
    {
        label: '课程资源',
        name: 'course',
        routeName: 'student_resource'
    },
    {
        label: '成员',
        name: 'member',
        routeName: 'student_member'
    },
    {
        label: '讨论',
        name: 'discuss',
        routeName: 'student_discuss'
    },
    {
        label: '结课答辩',
        name: 'reply',
        routeName: 'student_reply'
    },
    {
        label: '成绩分析',
        name: 'analysis',
        routeName: 'student_analyze'
    },
]

//教师端---课程详情页菜单
export const COURSE_MENU_TCH = [
    {
        label: '课程公告',
        name: 'notice',
        routeName: 'teacher_notice'
    },
    {
        label: '考勤管理',
        name: 'check_in',
        routeName: 'teacher_check_in'
    },
    {
        label: '作业管理',
        name: 'task',
        routeName: 'teacher_task'
    },
    
    {
        label: '学生信息',
        name: 'member',
        routeName: 'teacher_member'
    },
    {
        label: '课程资源',
        name: 'course',
        routeName: 'teacher_resource'
    },
    {
        label: '讨论',
        name: 'discuss',
        routeName: 'teacher_discuss'
    },
    {
        label: '结课答辩',
        name: 'reply',
        routeName: 'teacher_reply'
    },
    {
        label: '学生成绩',
        name: 'analysis',
        routeName: 'teacher_analyze'
    },
]

//管理员端---教师列表
export interface TACH_LIST {
    userId: number,     //用户id
    userType: number,   //用户类型  1:教师 0：管理员 2：学生
    headImg: any,       //头像
    account: string,    //教师账号
    password: string,   //密码
    name: string,       //教师名称
    createTime: string,  //创建时间
    email: any,        //绑定的邮箱
    phone: any,      //绑定的手机账号
    isEnable: boolean,  //账号是否可用
}


//视频资源列表---教师端、学生端
export interface TEACHER_VIDEO_LIST {
    id: number,       
    courseId: number,  //包含该视频资源的课程id
    deadTime: string,  //停止计分时间
    depositFilename: string,  //原文件名，后端储存
    originalFilename: string,  //前端展示
    title: string,       //标题
    duration: number,    //时长，单位s
    fileSize: number,    //大小
    isScore?: boolean,     //是否参与计分---教师端
    toScore?: boolean,     //是否参与计分---学生端
    uploadTime: string,   //视频资源上传时间
    viewCount: number,    //视频资源播放次数
    lastProgress?: number,  //上次进度   学生端
    maxProgress?: number,   //最大进度   学生端
    watchDurationSeconds?: any, //视频累计观看时长，单位s----学生端
}