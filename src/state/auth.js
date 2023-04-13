import axios from 'axios'
import router from '@/router'

export default {
    namespaced: true,
    state:{
        authenticated:false,
        user:{}
    },
    getters:{
        authenticated(state){
            return state.authenticated
        },
        user(state){
            return state.user
        }
    },
    mutations:{
        SET_AUTHENTICATED (state, value) {
            state.authenticated = value
        },
        SET_USER (state, value) {
            state.user = value
        },
        UPDATE_IMG (state, value) {
            state.user = value;
        }
    },
    actions:{
        login({commit}){
            const config = {
                headers:{
                  Authorization: `Bearer `+localStorage.getItem('token'),
                }
              };
            return axios.get('/user',config).then(({data})=>{
                commit('SET_USER',data)
                commit('SET_AUTHENTICATED',true)
                if(data.data.is_admin){
                    router.push({name:'admin'})
                }else{
                    router.push({name:'dashboard'})
                }
            }).catch(({response:{data}})=>{
                commit('SET_USER',{})
                commit('SET_AUTHENTICATED',false)
            })
        },
        logout({commit}){
            commit('SET_USER',{})
            commit('SET_AUTHENTICATED',false)
            localStorage.removeItem("token"); 
        },
        update({commit}){
            const config = {
                headers:{
                  Authorization: `Bearer `+localStorage.getItem('token'),
                }
              };
            return axios.get('/user',config).then(({data})=>{
                commit('UPDATE_IMG',data);
            }).catch(({response:{data}})=>{})
        },
    }
}