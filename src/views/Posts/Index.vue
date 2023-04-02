<template>
<Layout>
    <div class="main-content">
        <div class="page-content">
            <b-container fluid>
                <b-row>
                    <b-col lg="12 mt-n2 mb-3">
                        <b-btn-group class="btn-group btn-group-sm" style="width: 100%;">
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio1" @click="sorty('latest')">
                            <label class="btn btn-outline-secondary mb-0" for="btnradio1">Latest</label>
                            <input type="radio" class="btn-check" name="btnradio" id="btnradio2" @click="sorty('top')">
                            <label class="btn btn-outline-secondary mb-0" for="btnradio2">Most Liked</label>
                             <input type="radio" class="btn-check" name="btnradio" id="btnradio3" @click="sorty('barangay')">
                            <label class="btn btn-outline-secondary mb-0" for="btnradio3">Barangay</label>
                        </b-btn-group>

                        <div class="mt-2" v-if="type == 'barangay'">
                            <select v-model="barangay" class="form-select" aria-label="Default select example">
                                <option value="" selected>Select Barangay</option>
                                <option :value="b.id" v-for="(b,index) in barangays" v-bind:key="index">{{b.name}}</option>
                            </select>
                        </div>
                    </b-col>
                    <b-col lg="12 mt-4" v-if="!load">
                        <center>
                            <span class="text-secondary">
                                <i class='bx bx-loader-circle bx-spin' style="font-size: 50px;"></i>
                            </span>
                        </center>
                    </b-col>
                    <b-col lg="12" v-for="(post,index) in posts" v-bind:key="index" v-else>
                        <b-card no-body class="explore-box card-animate border">
                            <b-card-body>
                                <div class="d-flex align-items-center mb-3">
                                    <img :src="post.user.avatar" alt=""
                                        class="avatar-xs rounded-circle">
                                    <div class="ms-2 flex-grow-1">
                                        <b-link href="#!">
                                            <h6 class="mb-0 fs-13">{{ post.user.name }}</h6>
                                        </b-link>
                                        <p class="mb-0 text-muted fs-11">{{ post.created_at }}</p>
                                    </div>
                                    <div class="bookmark-icon">
                                      <i class="mdi mdi-heart text-danger align-middle"></i> <span :id="'count'+post.id">{{ post.likes.length }}</span>
                                    </div>
                                </div>
                                <div class="explore-place-bid-img overflow-hidden rounded" v-if="post.image">
                                    <img :src="post.image" alt="" class="explore-img w-100">
                                    <div class="bg-overlay"></div>
                                    <div class="place-bid-btn">
                                        <router-link :to="{ path: '/post/'+post.id }" class="btn btn-success btn-sm"> View Post</router-link>
                                    </div>
                                    <!-- <div class="discount-time"><h5 id="auction-time-5" class="mb-0 text-white">54 : 11 : 34 : 59</h5></div> -->
                                </div>
                                 <div class="hstack gap-3 flex-wrap mt-3">
                                    <div class="text-muted"><i class='bx bxs-map me-1'></i>{{ (post.barangay) ? post.barangay.name : ''}} ({{ (post.tag) ? post.tag.name : ''}})</div>
                                </div>
                                <div class="mt-3 text-muted">
                                   {{ post.information}}
                                </div>
                            </b-card-body>
                            <b-card-footer class="border-top border-top-dashed">
                                <ul class="nav nav-justified card-footer-tabs fs-17 mt-n3 mb-n3">
                                    <li class="nav-item">
                                        <a href="#/" class="nav-link">
                                            <i @click="like(post.id)" :id="'like'+post.id" :class="(post.likes.filter(x => x.user.id == user_id).length > 0) ?'bx bxs-heart text-danger':'bx bx-heart'"></i> 
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <router-link :to="{ path: '/post/'+post.id }" class="nav-link">
                                            <i class='bx bx-message-square-dots' ></i>
                                        </router-link>
                                    </li>
                                    <li class="nav-item">
                                         <a href="#/" class="nav-link">
                                            <i @click="report(post.id)" :id="'report'+post.id"
                                            :class="(post.reports) ? (post.reports.filter(x => x.user.id == user_id).length > 0) ? 'bx bxs-dislike text-danger':'bx bx-dislike' : ''"></i>
                                        </a>
                                    </li>
                                </ul>
                            </b-card-footer>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</Layout>
</template>
<script>
import axios from 'axios';
import Pusher from 'pusher-js';
import Layout from '../../Layouts/Main.vue';
export default {
    components : { Layout, Pusher },
    data(){
        return { 
            posts: [],
            user_id: this.$store.state.auth.user.data.id,
            type: 'latest',
            load: false,
             barangays: [],
            tags: [],
            barangay: ''
        }
    },
    created(){
        this.subscribe();
        this.fetch();
        this.fetchLists();
    },
     watch : {
        barangay(){
            this.fetch();
        },
    },
    methods : {
        fetch(){
            this.load = false;
            axios.get('/posts',{ params : {type : this.type, barangay: this.barangay}})
            .then(response => {
                if(response){
                    this.posts = response.data.data;     
                    this.load = true;
                }
            })
            .catch(err => console.log(err));
        },
        subscribe() {
            let pusher = new Pusher('14287ee65fa2808ae890', { cluster: 'ap1' })
            pusher.subscribe('posts')
            pusher.bind('App\\Events\\PostBroadcast', data => {
                // console.log(data);
                switch(data.type){
                    case 'post':
                        this.posts.unshift(data.post);
                    break;
                    case 'liked':
                        let index = this.posts.findIndex((it) => {
                            return it.id === data.post.post_id
                        });
                        this.posts[index].likes.push(data.post);
                    break;
                    case 'unliked':
                        let index1 = this.posts.findIndex((it) => {
                            return it.id === data.post.post_id
                        });
                        let index2 = this.posts[index1].likes.findIndex((it) => {
                            return it.id === data.post.like_id
                        });
                        this.posts[index1].likes.splice(index2, 1);
                    break;
                    case 'report':
                        let index3 = this.posts.findIndex((it) => {
                            return it.id === data.post.post_id
                        });
                        this.posts[index3].reports.push(data.post);
                    break;
                     case 'unreported':
                        let index4 = this.posts.findIndex((it) => {
                            return it.id === data.post.post_id
                        });
                        let index5 = this.posts[index4].reports.findIndex((it) => {
                            return it.id === data.post.like_id
                        });
                        this.posts[index4].reports.splice(index5, 1);
                    break;
                }
            })
        },
        like(post_id){
            axios.post('/like',{
                post_id: post_id,
                user_id: this.user_id
            })
            .then(response => {
                if(response){
                    if(response.data.message == 'liked'){
                        // document.getElementById('like'+post_id).classList.add('bxs-heart');
                        // document.getElementById('like'+post_id).classList.remove('bx-heart');
                        // document.getElementById('like'+post_id).classList.add('text-danger');
                        // document.getElementById('count'+post_id).innerHTML++;
                    }else{
                        // document.getElementById('like'+post_id).classList.add('bx-heart');
                        // document.getElementById('like'+post_id).classList.remove('bxs-heart');
                        // document.getElementById('like'+post_id).classList.remove('text-danger');
                        // document.getElementById('count'+post_id).innerHTML--;
                    }
                }
            })
            .catch(err => console.log(err));
        },
        report(post_id){
            axios.post('/report',{
                post_id: post_id,
                user_id: this.user_id
            })
            .then(response => {
                if(response){
                    
                }
            })
            .catch(err => console.log(err));
        },
        sorty(type){
            this.type = type;
            if(this.type != 'barangay'){
                this.barangay = '';
            }
            this.fetch();
        },
        fetchLists(){
            axios.get('/lists')
            .then(response => {
                if(response){
                    this.barangays = response.data.data.barangays;   
                    this.tags = response.data.data.tags;    
                }
            })
            .catch(err => console.log(err));
        },
    }
}
</script>