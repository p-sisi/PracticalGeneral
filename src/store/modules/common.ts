import { defineStore } from 'pinia';
import { USER_TYPE } from '../../content/common'

export interface CommonState{
    userType: string;   //用户类型    0 管理员 1教师 2学生
    userInfo: object;   //用户信息
}

export const useCommonStore = defineStore("common",{
    state: (): CommonState => ({
        userType: '',
        userInfo: {},
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