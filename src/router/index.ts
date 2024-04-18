import { createRouter,createWebHashHistory } from "vue-router";

//管理员页面
import admin from '../views/admin/Index.vue'
import adminClass from '../views/admin/ClassList.vue'
import adminTeacher from '../views/admin/Teacher.vue'
import adminStudent from '../views/admin/Student.vue'
import adminNotice from '../views/admin/Notice.vue'
import adminLog from '../views/admin/Log.vue'

import Login from '../views/Login.vue'


//学生、教师共用页面
import Index from '../views/stu-tea/Index.vue'
import IndexBody from '../views/stu-tea/IndexBody.vue'
import IndexClass from '../views/stu-tea/ClassDetail.vue'
import ClassResource from '../views/stu-tea/ClassResource.vue'

//学生页面
import StudentNotice from '../views/student/Notice.vue'
import StudentTask from '../views/student/Task.vue'
import StudentDiscuss from '../views/student/Discuss.vue'
import StudentAnalyze from '../views/student/Analyze.vue'
import StudentCheck from '../views/student/CheckIn.vue'
import StudentReply from '../views/student/Reply.vue'
import StudentMember from '../views/student/Member.vue'

//教师页面
import TeacherNotice from '../views/teacher/Notice.vue'
import TeacherTask from '../views/teacher/Task.vue'
import TeacherTaskDetail from '../views/teacher/TaskDetail.vue'
import TeacherTaskDetailStu from '../views/teacher/TaskDetailStu.vue'
import TeacherDiscuss from '../views/teacher/Discuss.vue'
import TeacherAnalyze from '../views/teacher/Analyze.vue'
import TeacherCheck from '../views/teacher/CheckIn.vue'
import TeacherReply from '../views/teacher/Reply.vue'
import TeacherMember from '../views/teacher/Member.vue'



const routes = [
    {
        // 管理员路由
        name: 'admin',   
        path: '/admin',  
        component: admin,
        children: [
            {
                path: 'class',
                name: 'admin-class',
                component: adminClass,
            },
            {
                path: 'user-teacher',
                name: 'admin-teacher',
                component: adminTeacher,
            },
            {
                path: 'user-student',
                name: 'admin-student',
                component: adminStudent,
            },
            {
                path: 'notice',
                name: 'admin-notice',
                component: adminNotice,
            },
            {
                path: 'log',
                name: 'admin-log',
                component: adminLog,
            },
        ]
    },
    {
        name: 'login',   
        path: '/login',  
        component: Login  
    },
    {
        // 学生路由
        name: 'student',   
        path: '/student',  
        component: Index,
        children: [
            {
              path: 'home',
              name: 'student_home',
              component: IndexBody,
            },
            {
                // 学生端--课程详情页路由
                path: 'class_detail',
                name: 'student_class_detail',
                component: IndexClass,
                children: [
                    {
                        path: 'resource',
                        name: 'student_resource',
                        component: ClassResource,
                    },
                    {
                        path: 'notice',
                        name: 'student_notice',
                        component: StudentNotice,
                    },
                    {
                        path: 'task',
                        name: 'student_task',
                        component: StudentTask,
                    },
                    {
                        path: 'discuss',
                        name: 'student_discuss',
                        component: StudentDiscuss,
                    },
                    {
                        path: 'analyze',
                        name: 'student_analyze',
                        component: StudentAnalyze,
                    },
                    {
                        path: 'check_in',
                        name: 'student_check_in',
                        component: StudentCheck,
                    },
                    {
                        path: 'reply',
                        name: 'student_reply',
                        component: StudentReply,
                    },
                    {
                        path: 'member',
                        name: 'student_member',
                        component: StudentMember,
                    },           
                ]
            },
        ] 
    }, 
    {
        // 教师路由
        name: 'teacher',   
        path: '/teacher',  
        component: Index,
        children: [
            {
              path: 'index',
              name: 'teacher_index',
              component: IndexBody,
            },
            {
                // 教师端----课程详情页路由
                path: 'class_detail',
                name: 'teacher_class_detail',
                component: IndexClass,
                children: [
                    {
                        path: 'resource',
                        name: 'teacher_resource',
                        component: ClassResource,
                    },
                    {
                        path: 'notice',
                        name: 'teacher_notice',
                        component: TeacherNotice,
                    },
                    {//教师端---作业列表
                        path: 'task',
                        name: 'teacher_task',
                        component: TeacherTask,
                        meta: {
                            breadcrumb: '作业列表'
                        }
                    },
                    {//教师端---作业详情
                        path: 'task_detail',
                        name: 'teacher_task_detail',
                        component: TeacherTaskDetail,
                        meta: {
                            breadcrumb: '作业详情'
                        }
                    },
                    {//教师端---学生作业详情
                        path: 'stu_detail',
                        name: 'teacher_task_stu_detail',
                        component: TeacherTaskDetailStu,
                        meta: {
                            breadcrumb: '学生作业详情'
                        }
                    },
                    {
                        path: 'discuss',
                        name: 'teacher_discuss',
                        component: TeacherDiscuss,
                    },
                    {
                        path: 'analyze',
                        name: 'teacher_analyze',
                        component: TeacherAnalyze,
                    },
                    {
                        path: 'check_in',
                        name: 'teacher_check_in',
                        component: TeacherCheck,
                    },
                    {
                        path: 'reply',
                        name: 'teacher_reply',
                        component: TeacherReply,
                    },
                    {
                        path: 'member',
                        name: 'teacher_member',
                        component: TeacherMember,
                    },
                ]
            },
        ]
    },
    {
        path: '/',
        redirect: '/login' 
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;