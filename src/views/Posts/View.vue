<template>
    <Layout :post="post">
        <div class="main-content" style="background-color: white; height: 100vh;">
            <div class="page-content" style="background-color: white;">
                <div class="container-fluid">

                    <div class="row">
                        <div class="col-md-12">
                            <div class="">
                                <div class="card-body">
                                    <div class="">
                                        <p class="fw-medium mb-0 float-end" data-v-dfe3cca2="">
                                            <i class="mdi mdi-heart text-danger align-middle" data-v-dfe3cca2=""></i> {{ (post.likes) ? post.likes.length : ''}} </p>
                                        <ol class="breadcrumb m-0 mb-3 fw-bold">
                                            <li class="breadcrumb-item">{{ (post.tag) ? post.tag.name : ''}}</li>
                                            <li class="breadcrumb-item">{{ (post.barangay) ? post.barangay.name : ''}}</li>
                                        </ol>
                                        <p>{{post.information}}</p>
                                        <code class="text-muted">{{post.location}}</code>
                                    </div>
                                </div>
                                <div class="card-body border-top border-bottom mt-2">
                                    <Action :post="post" />
                                </div>
                                <div class="card-body">
                                    <h6 class="card-title mb-4 mt-3 fs-12">Comments ({{(post.comments) ? post.comments.length : ''}})</h6>
                                    <div class="d-flex mb-4 mt-3 border-bottom border-bottom-dashed"
                                        v-for="(comment,index) in post.comments" v-bind:key="index">
                                        <div class="flex-shrink-0">
                                            <img :src="comment.user.avatar" alt="" class="avatar-xs rounded-circle">
                                        </div>
                                        <div class="flex-grow-1 ms-3">
                                            <h5 class="fs-13 mb-0">{{comment.user.name}}</h5>
                                            <small class="text-muted fs-11">{{comment.created_at}}</small>
                                            <p class="text-muted fs-12 mt-1">{{comment.comment}}</p>
                                        </div>
                                    </div>
                                    <p v-if="(post.comments) ? post.comments.length == 0 : ''"
                                        class="text-center text-muted">No comments yet.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>
<script>
    import Action from './Action.vue';
    import Layout from '../../Layouts/Main.vue';
    import axios from 'axios';
    import Pusher from 'pusher-js';
    export default {
        components: {
            Layout,
            Action,
            Pusher
        },
        data() {
            return {
                post: {}
            }
        },
        created() {
            this.fetch();
            this.subscribe();
        },
        methods: {
            fetch() {
                axios.get('/view/' + this.$route.params.id)
                    .then(response => {
                        if (response) {
                            this.post = response.data.data;
                        }
                    })
                    .catch(err => console.log(err));
            },
            subscribe() {
                let pusher = new Pusher('f9960142a530c321b7e6', {
                    cluster: 'ap1'
                })
                pusher.subscribe('posts')
                pusher.bind('App\\Events\\PostBroadcast', data => {
                    console.log(data);
                    switch (data.type) {
                        case 'comment':
                            if (data.post.post_id == this.post.id) {
                                this.post.comments.unshift(data.post);
                            }
                            break;
                        case 'post':

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
                    }
                })
            },
        }
    }
</script>