import { defineStore } from 'pinia'

export interface StudentState{
    menuList: Array<any>;    //头部菜单列表
    userName: string;    //学生姓名
    activeMenu: string;  //当前头部激活的菜单
    activeHomeTab: string;   //当前首页激活tab ：课程、公告
    activeClass: object;  //当前选中的课程---课程详情
    activeClassMenu: string;  //当前激活的菜单---课程详情
}

export const useStudentStore = defineStore("student",{
    state: (): StudentState => ({
        menuList: ['首页'],
        userName: '杨思远',
        activeClass: {
            classId: 2,       //课程id
            className: '高等数学', 
            createTime: '2023-12-13',  //课程创建时间
            addCode: '12345',  //加课码
            studentNum: '100',  //学生总人数
            teacher: '杨思远',   //任教老师
            status: 1,     //课程状态 0 已结束  1 进行中
        },
        activeClassMenu: '课程资源',
        activeMenu: '首页',
        activeHomeTab: '我的课程'
    }),
    getters:{
    },
    actions:{
        addMenuList(tab:string) {
            this.menuList.push(tab);
        },
        setUserName(newName: string) {
            this.userName = newName;
        },
        setActiveClass(newActiveClass: object) {
            this.activeClass = newActiveClass;
        },
        setActiveClassMenu(newActiveClassMenu: string) {
            this.activeClassMenu = newActiveClassMenu;
        },
        setActiveMenu(newMenu: string) {
            this.activeMenu = newMenu;
        },
        setActiveHomeTab(newTab: string) {
            this.activeHomeTab = newTab;
        }
    },
    persist: [
        {
            key: 'student-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
});