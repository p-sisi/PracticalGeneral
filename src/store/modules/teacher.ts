import { defineStore } from 'pinia'
import { Task_Tech_Commit } from '../../content/task'

export interface TeacherState{
    homeHeaderMenuList: Array<any>;    //首页头部菜单列表
    activeHomeHeaderMenu: string;      //当前激活首页头部菜单
    activeHomeLeftTab: string;         //当前激活首页左部菜单
    teacherInfo: object;    //教师信息
    activeClass: object;    //当前激活课程信息
    activeTask: object;    //当前激活作业信息
    activeStudentTask: Task_Tech_Commit;    //当前激活学生作业信息
    breadNum: number;    //面包屑数量
}

export const useTeacherStore = defineStore("teacher",{
    state: (): TeacherState => ({
        homeHeaderMenuList: ['首页'],
        activeHomeHeaderMenu: '首页',
        teacherInfo: {
            name: '杨思远'
        },
        activeHomeLeftTab: '我的教学',
        activeClass:{},
        activeTask: {},
        breadNum: 1,
        activeStudentTask: {} as Task_Tech_Commit,
    }),
    actions:{
        addHomeHeaderMenuList(tab:string) {
            this.homeHeaderMenuList.push(tab);
        },
        setActiveHomeHeaderMenu(newTab: string) {
            this.activeHomeHeaderMenu = newTab;
        },
        setTeacherInfo(newInfo: object) {
            this.teacherInfo = newInfo;
        },
        setActiveHomeLeftTab(newTab: string) {
            this.activeHomeLeftTab = newTab;
        },
        setActiveClass(classItem:Object) {
            this.activeClass = classItem;
        },
        setActiveTask(taskItem:Object) {
            this.activeTask = taskItem;
        },
        setBreadNum(num:number) {
            this.breadNum = num;
        },
        setActiveStudentTask(taskItem:Task_Tech_Commit) {
            this.activeStudentTask = taskItem;
        }
    },
    persist: [
        {
            key: 'teacher-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
});