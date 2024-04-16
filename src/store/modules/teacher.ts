import { defineStore } from 'pinia'
import { Task_Tech_Commit } from '../../content/task'
import { Check_Tech } from '../../content/check'

export interface TeacherState{
    activeLeftMenu: string;    //当前激活的左侧菜单
    activeTask: object;    //当前激活作业信息
    activeStudentTask: Task_Tech_Commit;    //当前激活学生作业信息
    breadNum: number;    //面包屑数量
    activeCheck: Check_Tech;    //当前激活批改作业信息
    isShowCheck: boolean;    //是否显示签到列表  true：签到列表  false：签到详情
}

export const useTeacherStore = defineStore("teacher",{
    state: (): TeacherState => ({
        activeLeftMenu: '课程公告',
        activeTask: {},
        breadNum: 1,
        activeStudentTask: {} as Task_Tech_Commit,
        activeCheck: {} as Check_Tech,
        isShowCheck: true,
    }),
    actions:{
        setActiveLeftMenu(menu: string) {
            this.activeLeftMenu = menu;
        },
        setActiveTask(taskItem:Object) {
            this.activeTask = taskItem;
        },
        setBreadNum(num:number) {
            this.breadNum = num;
        },
        setActiveStudentTask(taskItem:Task_Tech_Commit) {
            this.activeStudentTask = taskItem;
        }, 
        setActiveCheck(checkItem:Check_Tech) {
            this.activeCheck = checkItem;
        },
        setActiveCheckId(id:number) {
            this.activeCheck.id = id;
        },
        setActiveCheckDeadTime(time: any) {
            this.activeCheck.deadTime = time;
        },
        setIsShowCheck(isShow:boolean) {
            this.isShowCheck = isShow;
        },
        //退出登录时初始化信息
        initTeacherStore() {
            this.activeCheck = {} as Check_Tech;
            this.activeTask = {};
            this.activeLeftMenu = '课程公告';
            this.isShowCheck = true;
            this.breadNum = 1
            this.activeStudentTask = {} as Task_Tech_Commit;
        }
    },
    persist: [
        {
            key: 'teacher-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
});