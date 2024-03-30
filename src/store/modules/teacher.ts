import { defineStore } from 'pinia'

export interface TeacherState{
    menuList: Array<any>;    //头部菜单列表
    userName: string;    //教师姓名
}

export const useTeacherStore = defineStore("teacher",{
    state: (): TeacherState => ({
        menuList: ['首页','计算机课程导论'],
        userName: '庞思思',
    }),
    actions:{
        addMenuList(tab:string) {
            this.menuList.push(tab);
        },
        setUserName(newName: string) {
            this.userName = newName;
        },
    },
    persist: [
        {
            key: 'teacher-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
});