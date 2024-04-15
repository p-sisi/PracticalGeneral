import { createRouter,createWebHashHistory } from "vue-router";


const routes = [
    {
        // 管理员路由
        name: 'admin',   
        path: '/admin',  
        component: () => import('../views/admin/Index.vue'),
        children: [
            {
              path: 'home',
              name: 'admin-home',
              component: () => import('../views/admin/Home.vue'),
            },
            {
                path: 'class',
                name: 'admin-class',
                component: () => import('../views/admin/ClassList.vue'),
            },
            {
                path: 'user-teacher',
                name: 'admin-teacher',
                component: () => import('../views/admin/Teacher.vue'),
            },
            {
                path: 'user-student',
                name: 'admin-student',
                component: () => import('../views/admin/Student.vue'),
            },
            {
                path: 'notice',
                name: 'admin-notice',
                component: () => import('../views/admin/Notice.vue'),
            },
            {
                path: 'log',
                name: 'admin-log',
                component: () => import('../views/admin/Log.vue'),
            },
        ]
    },
    {
        name: 'login',   
        path: '/login',  
        component: () => import('../views/Login.vue')  
    },
    {
        // 学生路由
        name: 'student',   
        path: '/student',  
        component: () => import('../views/stu-tea/Index.vue'),
        children: [
            {
              path: 'home',
              name: 'student_home',
              component: () => import('../views/stu-tea/IndexBody.vue'),
            },
            {
                // 学生端--课程详情页路由
                path: 'class_detail',
                name: 'student_class_detail',
                component: () => import('../views/stu-tea/ClassDetail.vue'),
                children: [
                    {
                        path: 'resource',
                        name: 'student_resource',
                        component: () => import('../views/stu-tea/ClassResource.vue'),
                    },
                    {
                        path: 'notice',
                        name: 'student_notice',
                        component: () => import('../views/student/Notice.vue'),
                    },
                    {
                        path: 'task',
                        name: 'student_task',
                        component: () => import('../views/student/Task.vue'),
                    },
                    {
                        path: 'discuss',
                        name: 'student_discuss',
                        component: () => import('../views/student/Discuss.vue'),
                    },
                    {
                        path: 'analyze',
                        name: 'student_analyze',
                        component: () => import('../views/student/Analyze.vue'),
                    },
                    {
                        path: 'check_in',
                        name: 'student_check_in',
                        component: () => import('../views/student/CheckIn.vue'),
                    },
                    {
                        path: 'reply',
                        name: 'student_reply',
                        component: () => import('../views/student/Reply.vue'),
                    },
                    {
                        path: 'member',
                        name: 'student_member',
                        component: () => import('../views/student/Member.vue'),
                    },
                    {
                        path: 'survey',
                        name: 'student_survey',
                        component: () => import('../views/student/Survey.vue'),
                    },
                    
                ]
            },
        ] 
    }, 
    {
        // 教师路由
        name: 'teacher',   
        path: '/teacher',  
        component: () => import('../views/stu-tea/Index.vue'),
        children: [
            {
              path: 'index',
              name: 'teacher_index',
              component: () => import('../views/stu-tea/IndexBody.vue'),
            },
            {
                // 教师端----课程详情页路由
                path: 'class_detail',
                name: 'teacher_class_detail',
                component: () => import('../views/stu-tea/ClassDetail.vue'),
                children: [
                    {
                        path: 'resource',
                        name: 'teacher_resource',
                        component: () => import('../views/stu-tea/ClassResource.vue'),
                    },
                    {
                        path: 'notice',
                        name: 'teacher_notice',
                        component: () => import('../views/teacher/Notice.vue'),
                    },
                    {//教师端---作业列表
                        path: 'task',
                        name: 'teacher_task',
                        component: () => import('../views/teacher/Task.vue'),
                        meta: {
                            breadcrumb: '作业列表'
                        }
                    },
                    {//教师端---作业详情
                        path: 'task_detail',
                        name: 'teacher_task_detail',
                        component: () => import('../views/teacher/TaskDetail.vue'),
                        meta: {
                            breadcrumb: '作业详情'
                        }
                    },
                    {//教师端---学生作业详情
                        path: 'stu_detail',
                        name: 'teacher_task_stu_detail',
                        component: () => import('../views/teacher/TaskDetailStu.vue'),
                        meta: {
                            breadcrumb: '学生作业详情'
                        }
                    },
                    {
                        path: 'discuss',
                        name: 'teacher_discuss',
                        component: () => import('../views/teacher/Discuss.vue'),
                    },
                    {
                        path: 'analyze',
                        name: 'teacher_analyze',
                        component: () => import('../views/teacher/Analyze.vue'),
                    },
                    {
                        path: 'check_in',
                        name: 'teacher_check_in',
                        component: () => import('../views/teacher/CheckIn.vue'),
                    },
                    {
                        path: 'reply',
                        name: 'teacher_reply',
                        component: () => import('../views/teacher/Reply.vue'),
                    },
                    {
                        path: 'member',
                        name: 'teacher_member',
                        component: () => import('../views/teacher/Member.vue'),
                    },
                    {
                        path: 'survey',
                        name: 'teacher_survey',
                        component: () => import('../views/teacher/Survey.vue'),
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