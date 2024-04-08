import { defineStore } from 'pinia';
import { USER_TYPE } from '../../content/common'

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
}

export const useCommonStore = defineStore("common",{
    state: (): CommonState => ({
        userType: '',
        userInfo: {} as UserInfo,
    }),
    getters:{
    },
    actions:{
        setUserType(type: number) {
            this.userType = USER_TYPE.find((item) => item.value == type)?.label
        },
        setUserInfo(info: object) {
            this.userInfo = info;
        }
    },
    persist: [
        {
            key: 'common-store',  //存储的键名
            storage: sessionStorage   //本地存储位置 localStorage、sessionStorage
        }
    ]
});