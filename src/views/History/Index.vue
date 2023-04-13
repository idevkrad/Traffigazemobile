<template>
<Layout title="History">
    <div class="main-content">
        <div class="page-content">
            <b-container fluid>
                <b-row>
                    <b-col lg="12">
                         <b-btn-group class="btn-group btn-group-sm mb-2" style="width: 100%;">
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio1" @click="view = 'tag'">
                            <label class="btn btn-outline-secondary mb-0" for="btnradio1">Tag</label>
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio3" @click="view = 'barangay'">
                            <label class="btn btn-outline-secondary mb-0" for="btnradio3">Barangay</label>
                        </b-btn-group>
                        <ul class="list-group mb-1" v-if="view == 'tag'">
                            <li class="list-group-item" v-for="(list,index) in tags" v-bind:key="index" style="cursor: pointer;">
                                 <router-link :to="{ path: '/history/'+list.id+'/tag' }">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0 avatar-xs">
                                                <img :src="'https://traffigaze.info/images/icons/'+list.icon" class="avatar-xs rounded" />
                                            </div>
                                            <div class="flex-shrink-0 ms-2">
                                                <h6 class="fs-14 mb-0 mt-2">{{list.name}}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <span class="fw-bold text-primary">{{list.posts_count}}</span>
                                    </div>
                                </div>
                                </router-link>
                            </li>
                        </ul>
                        <ul class="list-group mb-1" v-if="view == 'barangay'">
                            <li class="list-group-item" v-for="(list,index) in barangays" v-bind:key="index" style="cursor: pointer;">
                                 <router-link :to="{ path: '/history/'+list.id+'/barangay' }">
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <div class="d-flex">
                                            <div class="flex-shrink-0 avatar-xs" v-if="list.icon">
                                                <img :src="'https://traffigaze.info/images/icons/'+list.icon" class="avatar-xs rounded" />
                                            </div>
                                            <div class="flex-shrink-0 ms-2">
                                                <h6 class="fs-14 mb-0 mt-2">{{list.name}}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink-0">
                                        <span class="fw-bold text-primary">{{list.posts_count}}</span>
                                    </div>
                                </div>
                                </router-link>
                            </li>
                        </ul>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</Layout>
</template>
<script>
import axios from 'axios';
import Layout from '../../Layouts/Main.vue';
export default {
    components : { Layout },
    data(){
        return {
            tags: [],
            barangays: [],
            view: 'tag'
        }
    },
    created(){
        this.fetchTag();
        this.fetchBarangay();
    },
    methods: {
        fetchTag(){
            this.load = false;
            axios.get('/tag',{ params: {
                type: 'yesterday'
            }})
            .then(response => {
                if(response){
                    this.tags = response.data.lists;
                }
            })
            .catch(err => console.log(err));
        },
        fetchBarangay(){
            this.load = false;
            axios.get('/barangay',{ params: {
                type: 'yesterday'
            }})
            .then(response => {
                if(response){
                    this.barangays = response.data.lists;
                }
            })
            .catch(err => console.log(err));
        },
    }

}
</script>
