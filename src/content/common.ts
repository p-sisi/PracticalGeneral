//后端域名,更换ip地址
export const BASE_ERL = 'http://10.33.12.200:8081/';

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
        label: '课程资源',
        name: 'course',
        routeName: 'student_resource'
    },
    {
        label: '课程公告',
        name: 'notice',
        routeName: 'student_notice'
    },
    {
        label: '实训作业',
        name: 'task',
        routeName: 'student_task'
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
        label: '成绩分析',
        name: 'analysis',
        routeName: 'student_analyze'
    },
    {
        label: '考勤',
        name: 'check_in',
        routeName: 'student_check_in'
    },
    {
        label: '答辩',
        name: 'reply',
        routeName: 'student_reply'
    },
    {
        label: '问卷调查',
        name: 'survey',
        routeName: 'student_survey'
    }
]

//教师端---课程详情页菜单
export const COURSE_MENU_TCH = [
    {
        label: '课程资源',
        name: 'course',
        routeName: 'teacher_resource'
    },
    {
        label: '课程公告',
        name: 'notice',
        routeName: 'teacher_notice'
    },
    {
        label: '作业管理',
        name: 'task',
        routeName: 'teacher_task'
    },
    {
        label: '学生管理',
        name: 'member',
        routeName: 'teacher_member'
    },
    {
        label: '讨论',
        name: 'discuss',
        routeName: 'teacher_discuss'
    },
    {
        label: '学情分析',
        name: 'analysis',
        routeName: 'teacher_analyze'
    },
    {
        label: '考勤管理',
        name: 'check_in',
        routeName: 'teacher_check_in'
    },
    {
        label: '答辩',
        name: 'reply',
        routeName: 'teacher_reply'
    },
    {
        label: '问卷调查',
        name: 'survey',
        routeName: 'teacher_survey'
    }
]