import { defineStore } from 'pinia'
import { Course } from '../../content/course'

export interface AdminState{
    isShowCourseList: boolean;   //是否展示课程列表  or  展示新建课程及编辑课程
    isEditClass: boolean;       //编辑课程  or 新建课程
    activeCourseItem: Course;    //当前选择的课程信息
    isShowCourseEdit: boolean;  //是否展示课程编辑页 or 上传学生页面

    isShowTeacherList: boolean;   //教师管理：是否展示用户列表、否：展示新建用户及编辑用户
    isEditTeacher: boolean;   //编辑用户、新建用户
    isShowMultipleCreate: boolean;   //
    activeTeacherItem: any;    //当前选择的教师信息
}

export const useAdminStore = defineStore("admin",{
    state: (): AdminState => ({
        isShowCourseList: true,
        activeCourseItem: {} as Course,
        isEditTeacher: false,
        isShowTeacherList: true,
        isShowMultipleCreate: false,
        activeTeacherItem: {},
        isEditClass: false,
        isShowCourseEdit: false,
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
        updateActiveCourseItem(val: any) {
            this.activeCourseItem.courseId = val.courseId,
            this.activeCourseItem.courseNumber = val.courseNumber;
            this.activeCourseItem.courseName = val.courseName;
            this.activeCourseItem.teacherName = val.teacherName;
        },
        setIsEditTeacher(val: boolean){
            this.isEditTeacher = val;
        },
        setIsShowTeacherList(val: boolean){
            this.isShowTeacherList = val;
        },
        setIsShowMultipleCreate(val: boolean){
            this.isShowMultipleCreate = val;
        },
        setActiveTeacherItem(val: any){
            this.activeTeacherItem = val;
        },
        setIsEditClass(val: any) {
            this.isEditClass = val;
        },
        setIsShowCourseEdit(val: any) {
            this.isShowCourseEdit = val;
        }
    },
    persist: [
        {
            key: 'admin-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
})