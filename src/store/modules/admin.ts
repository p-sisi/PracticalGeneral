import { defineStore } from 'pinia'
import { Course } from '../../content/course'

export interface AdminState{
    isShowCourseList: boolean;   //课程管理：是否展示课程列表、否：展示新建课程及编辑课程
    activeCourseItem: Course;    //当前选择的课程信息
    isEdit: boolean;   //编辑课程、新建课程
    isShowTeacherList: boolean;   //教师管理：是否展示用户列表、否：展示新建用户及编辑用户
    isEditTeacher: boolean;   //编辑用户、新建用户
    isShowMultipleCreate: boolean;   //批量创建用户
}

export const useAdminStore = defineStore("admin",{
    state: (): AdminState => ({
        isShowCourseList: true,
        activeCourseItem: {} as Course,
        isEdit: false,
        isEditTeacher: false,
        isShowTeacherList: true,
        isShowMultipleCreate: false,
    }),
    getters:{
    },
    actions:{
        setIsShowCourseList(val: boolean){
            this.isShowCourseList = val;
        },
        setActiveCourseItem(val: Course){
            this.activeCourseItem = val;
        },
        setIsEdit(val: boolean){
            this.isEdit = val;
        },
        setIsEditTeacher(val: boolean){
            this.isEditTeacher = val;
        },
        setIsShowTeacherList(val: boolean){
            this.isShowTeacherList = val;
        },
        setIsShowMultipleCreate(val: boolean){
            this.isShowMultipleCreate = val;
        }
    },
    persist: [
        {
            key: 'admin-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
})