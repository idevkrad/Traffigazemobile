<template>
    <Layout :tag="tag">
        <div class="main-content" style="background-color: white; height: 100vh;">
            <div class="page-content" style="background-color: white;">
                <div class="container-fluid">

                    <div class="row">
                        <div class="col-md-12" v-if="posts.length == 0">
                            <div class="alert alert-warning alert-solid text-center" role="alert"><b>No post found yesterday</b></div>
                        </div>
                        <b-col v-else lg="12" v-for="(post,index) in posts" v-bind:key="index">
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
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
<script>
    import Layout from '../../Layouts/Main.vue';
    import axios from 'axios';
    export default {
        components: {
            Layout
        },
        data() {
            return {
                posts: [],
                tag: {},
                barangay: {}
            }
        },
        created(){
            this.fetch();
        },
        methods: {
            fetch() {
                axios.get('/' +this.$route.params.type + '/' + this.$route.params.id)
                .then(response => {
                    if (response) {
                        this.tag = response.data.data.tag;
                        this.posts = response.data.data.lists;
                    }
                })
                .catch(err => console.log(err));
            },
        }
    }
</script>