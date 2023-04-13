<template>
    <Layout>
        <div class="main-content">
            <div class="page-content">
                <b-container fluid>
                    <div class="card">
                        <div class="card-header align-items-center d-flex">
                            <h4 class="card-title mb-0 flex-grow-1">Tags Statistic</h4>
                        </div>
                        <div class="card-body">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Tag</th>
                                        <th class="text-center" scope="col">Posts</th>
                                        <th class="text-center" scope="col">Likes</th>
                                        <th class="text-center" scope="col">Reports</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(list,index) in tags" v-bind:key="index">
                                        <td scope="row">{{list.name}}</td>
                                        <td class="text-center">{{list.posts_count}}</td>
                                        <td class="text-center">{{list.likes_count}}</td>
                                        <td class="text-center">{{list.reports_count}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </b-container>
            </div>
        </div>
    </Layout>
</template>
<script>
import axios from 'axios';
import Layout from '../../Layouts/Admin.vue';
export default {
    components : { Layout },
    data(){
        return {
            tags: []
        }
    },
    created(){
        this.fetch();
    },
    methods : {
        fetch(){
            axios.get('/tags')
            .then(response => {
                if(response){
                    this.tags = response.data.data;  
                }
            })
            .catch(err => console.log(err));
        }
    }
}
</script>