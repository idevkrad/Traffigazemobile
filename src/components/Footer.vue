<template>
    <footer class="footer p-2">
        <div class="row" v-if="post">
            <div class="col">
                <div class="position-relative">
                    <input type="text" v-model="comment" class="form-control border-light bg-light" placeholder="Enter Message...">
                </div>
            </div>
            <div class="col-auto ms-n3">
                <button @click="send()" class="btn btn-primary btn-md btn-icon" type="button" >
                    <div class="btn-content"><i class="mdi mdi-send"></i></div>
                </button>
            </div>
        </div>
        <ul class="nav nav-pills nav-justified card-footer-tabs fs-17" v-if="!post">
            <li class="nav-item">
                <router-link to="/" class="nav-link">
                    <i class="ri-home-3-line"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/create" class="nav-link">
                    <button class="btn btn-light btn-md position-relative p-0 avatar-xs rounded-circle" type="button">
                        <div class="btn-content">
                            <span class="avatar-title bg-transparent text-reset">
                                <i class='bx bxs-plus-circle'></i>
                            </span>
                        </div>
                    </button>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/posts" class="nav-link">
                    <i class='bx bxs-report'></i>
                </router-link>
            </li>
        </ul>
    </footer>
</template>
<script>
import axios from 'axios';
    export default {
        props: ['post'],
        data(){
            return {
                comment: '',
                user_id: this.$store.state.auth.user.data.id
            }
        },
        methods: {
            send(){
                axios.post('/comment',{
                    post_id: this.post.id,
                    user_id: this.user_id,
                    comment: this.comment
                })
                .then(response => {
                    if(response){
                        // console.log(response);
                        this.comment = '';
                    }
                })
                .catch(err => console.log(err));
            }
        }
    }
</script>
<style>
    .footer {
        left: 0;
        position: fixed;
        border-top: .1rem solid;
        border-color: #e4e2e2;
    }
</style>