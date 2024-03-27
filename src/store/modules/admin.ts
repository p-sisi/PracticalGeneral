import { defineStore } from 'pinia'

export interface AdminState{
    userName: string;   //管理员名字
}

export const useAdminStore = defineStore("admin",{
    state: (): AdminState => ({
        userName: '杨思远',
    }),
    getters:{
    },
    actions:{
        setUserName(newName: string){
            this.userName = newName
        },
    }
})