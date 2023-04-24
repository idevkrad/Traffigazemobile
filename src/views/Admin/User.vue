<template>
    <Layout>
        <div class="main-content">
            <div class="page-content">
                <b-container fluid>
                    <nav aria-label="breadcrumb" class="mb-1">
                        <ol class="breadcrumb p-3 py-2 bg-white mb-0">
                            <li class="breadcrumb-item"><a class="" href="#" target="_self"><i class="ri-account-circle-fill"></i></a></li>
                            <li class="breadcrumb-item"><a class="" href="#" target="_self">Users</a></li>
                            <!-- <li class="breadcrumb-item active" aria-current="page"> General </li> -->
                        </ol>
                    </nav>
                    <div class="search-box mb-1">
                        <input type="text" v-model="keyword" class="form-control" placeholder="Search User"><i class="ri-search-line search-icon"></i>
                    </div>
                    <b-list-group>
                        <b-list-group-item v-for="(list,index) in lists" v-bind:key="index">
                            <div class="d-flex align-items-center">
                                <div class="flex-shrink-0">
                                    <img :src="'https://traffigaze.info/images/avatars/'+list.avatar" alt="" class="avatar-xs rounded-circle">
                                </div>
                                <div class="flex-grow-1 ms-2">
                                    <p class="mb-0">{{list.name}}</p>
                                    <span class="text-muted mt-0">{{list.email}}</span>
                                </div>
                            </div>
                        </b-list-group-item>
                    </b-list-group>
                    <!-- <nav aria-label="Page navigation example" class="mt-2 bg-white">
                        <ul class="pagination justify-content-center">
                            <li class="page-item disabled"><a class="page-link" href="#" target="_self" tabindex="-1">← &nbsp; Prev</a></li>
                            <li class="page-item"><a class="page-link" href="#" target="_self">1</a></li>
                            <li class="page-item"><a class="page-link" href="#" target="_self">2</a></li>
                            <li class="page-item"><a class="page-link" href="#" target="_self">3</a></li>
                            <li class="page-item"><a class="page-link" href="#" target="_self">Next &nbsp; →</a></li>
                        </ul>
                    </nav> -->
                    
                        
                </b-container>
            </div>
        </div>
    </Layout>
</template>
<script>
import _ from 'lodash';
import axios from 'axios';
import Layout from '../../Layouts/Admin.vue';
export default {
    components : { Layout },
    data(){
        return{
            lists: [],
            load: true,
            keyword: ''
        }
    },
    created(){
        this.fetch();
    },
    watch : {
        keyword(newVal){
            this.checkSearchStr(newVal)
        }
    },
    methods : {
        checkSearchStr: _.debounce(function(string) {
            this.fetch();
        }, 300),
        fetch(){
            this.load = false;
            axios.get('/users',{
                params: {
                    keyword: this.keyword,
                    count: Math.floor((window.innerHeight - 260) / 63)
                }
            })
            .then(response => {
                if(response){
                    this.lists = response.data.data;     
                    this.load = true;
                }
            })
            .catch(err => console.log(err));
        },
    }
}
</script>