import { createRouter,createWebHashHistory } from "vue-router";


const routes = [
    {
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
                component: () => import('../views/admin/Class.vue'),
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
        name: 'student',   
        path: '/student',  
        component: () => import('../views/student/Index.vue'),
        children: [
            {
              path: 'home',
              name: 'student-home',
              component: () => import('../views/student/Home.vue'),
            },
            {
                path: 'class_detail',
                name: 'student_class_detail',
                component: () => import('../views/student/ClassDetail.vue'),
                children: [
                    {
                        path: 'resource',
                        name: 'resource',
                        component: () => import('../views/student/ClassResource.vue'),
                    },
                    {
                        path: 'notice',
                        name: 'notice',
                        component: () => import('../views/student/ClassNotice.vue'),
                    },
                    {
                        path: 'task',
                        name: 'task',
                        component: () => import('../views/student/ClassTask.vue'),
                    },
                    {
                        path: 'discuss',
                        name: 'discuss',
                        component: () => import('../views/student/ClassDiscuss.vue'),
                    },
                    {
                        path: 'analyze',
                        name: 'analyze',
                        component: () => import('../views/student/ClassAnalyze.vue'),
                    },
                    {
                        path: 'check_in',
                        name: 'check_in',
                        component: () => import('../views/student/ClassCheckIn.vue'),
                    },
                    {
                        path: 'reply',
                        name: 'reply',
                        component: () => import('../views/student/ClassReply.vue'),
                    },
                    {
                        path: 'member',
                        name: 'member',
                        component: () => import('../views/student/ClassMember.vue'),
                    },
                    {
                        path: 'survey',
                        name: 'survey',
                        component: () => import('../views/student/ClassSurvey.vue'),
                    },
                    
                ]
            },

        ] 
    }, 
    {
        name: 'teacher',   
        path: '/teacher',  
        component: () => import('../views/teacher/Index.vue')  
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