import { defineStore } from 'pinia';
import { USER_TYPE } from '../../content/common';
import { Course } from '@/content/course';

//用户信息接口
export interface userInfo {
    headImg: string;   //头像
    name: string;     //姓名
    userId: number;  //用户id
    userType: number;  //用户类型
}
export interface CommonState{
    userType: string;   //用户类型    教师，学生，管理员
    userInfo: object;   //用户信息
    activeHeaderMenu: string;   //当前激活的头部菜单
    headerMenu: string[];   //头部菜单
    activeClass: object;   //当前激活的课程
    courseData: object;   //课程数据
}

export const useCommonStore = defineStore("common",{
    state: (): CommonState => ({
        userType: '',
        userInfo: {} as UserInfo,
        activeHeaderMenu: '首页' ,
        headerMenu: ['首页'],
        activeClass: {} as Course,
        courseData: {} as Course[],
    }),
    getters:{
    },
    actions:{
        setUserType(type: number) {
            this.userType = USER_TYPE.find((item) => item.value == type)?.label
        },
        setUserInfo(info: object) {
            this.userInfo = info;
        },
        setActiveHeaderMenu(menu: string) {
            this.activeHeaderMenu = menu;
        },
        addHeaderMenu(menu: string) {
            this.headerMenu.push(menu);
        },
        setHeaderMenu(menu: string[]) {
            this.headerMenu = menu;
        },
        setActiveClass(course: Course) {
            this.activeClass = course;
        },
        setCourseData(data: Course[]) {
            this.courseData = data;
        }
    },
    persist: [
        {
            key: 'common-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
});