<template>
    <header id="page-topbar">
        <div class="layout-width">
            <div class="navbar-header" style="border-bottom: .1rem solid; border-color: #e4e2e2;">
                <div class="card-body mt-3" v-if="post">
                    <div class="d-flex align-items-center mb-3">
                        <img :src="(post.user) ? post.user.avatar : ''" alt=""
                            class="avatar-xs rounded-circle">
                        <div class="ms-2 flex-grow-1">
                            <b-link href="#!">
                                <h6 class="mb-0 fs-13">{{ (post.user) ? post.user.name : '' }}</h6>
                            </b-link>
                            <p class="mb-0 text-muted fs-11">{{ post.created_at }}</p>
                        </div>
                        <div class="bookmark-icon">
                            <router-link :to="{ path: '/posts'}"><i class="ri ri-close-circle-fill text-dark align-middle h1"></i></router-link>
                        </div>
                    </div>
                </div>
                <div class="card-body mt-3" v-if="tag">
                    <div class="d-flex align-items-center mb-3">
                        <img v-if="tag.icon" :src="'https://traffigaze.info/images/icons/'+tag.icon" alt=""
                            class="avatar-xs rounded-circle">
                        <div class="ms-2 flex-grow-1">
                            <b-link href="#!">
                                <h6 class="mb-0 fs-13">{{ tag.name }}</h6>
                            </b-link>
                        </div>
                        <div class="bookmark-icon">
                            <router-link :to="{ path: '/history'}"><i class="ri ri-close-circle-fill text-dark align-middle h1"></i></router-link>
                        </div>
                    </div>
                </div>
                <div class="d-flex">
                    <!-- LOGO -->
                    <h5 class="text-primary mt-2">{{title}}</h5>
                    <div class="navbar-brand-box horizontal-logo">  
                        <router-link to="/" class="logo logo-dark">
                            <span class="logo-lg">
                                <img src="@/assets/images/logo-dark.png" alt="" height="17" />
                            </span>
                        </router-link>
                    </div>
                </div>
                <div class="d-flex align-items-center" v-if="!post && !tag">
                    <div class="ms-1 header-item d-sm-flex">
                        <b-button type="button" variant="ghost-secondary"
                            class="btn-icon btn-topbar rounded-circle light-dark-mode" @click="toggleDarkMode">
                            <i class="bx bx-moon fs-22"></i>
                        </b-button>
                    </div>

                    <div class="dropdown topbar-head-dropdown ms-1 header-item">
                        <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                            id="page-header-notifications-dropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            <i class="bx bx-bell fs-22"></i>
                            <span v-if="notifications.length > 0"
                                class="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                                {{ notifications.length }}<span class="visually-hidden">unread messages</span></span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                            aria-labelledby="page-header-notifications-dropdown">
                            <div >
                                    <SimpleBar data-simplebar style="max-height: 300px" class="pe-2">
                                        
                                        <router-link :to="{ path: '/post/'+notification.post_id }" @click="view(notification.post_id,notification.type)" class="text-reset notification-item d-block dropdown-item" v-for="(notification,index) in sortedNotification" v-bind:key="index">
                                        
                                            <div class="d-flex">
                                                <img :src="notification.avatar"
                                                    class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                                                <div class="flex-1">
                                                    <b-link href="#!" class="stretched-link">
                                                        <h6 class="mt-0 mb-1 fs-12">
                                                             <span class="fw-semibold">{{ notification.name }}</span> <span class="fs-11 text-muted"> {{notification.text}} </span>
                                                        </h6>
                                                    </b-link>
                                                   
                                                    <p class="mb-0 fs-10 fw-medium text-uppercase text-muted">
                                                        <span><i class="mdi mdi-clock-outline"></i> {{notification.created}}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            </router-link>
                                        

                                        <div class="my-3 text-center">
                                            <b-button @click="markall()" type="button" class="btn btn-sm" variant="soft-success">
                                                Mark all as read
                                            </b-button>
                                        </div>
                                    </SimpleBar>
                                </div>
                        </div>
                    </div>

                    <div class="dropdown ms-sm-3 header-item topbar-user">

                        <button type="button" class="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            <span class="d-flex align-items-center">
                                <img class="rounded-circle header-profile-user" :src="user.avatar" alt="." />
                                <span class="text-start ms-xl-2">
                                    <span
                                        class=" d-none d-xl-inline-block ms-1 fw-medium user-name-text">{{user.name}}</span>
                                    <span
                                        class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{{user.email}}</span>
                                </span>
                            </span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                            <h6 class="dropdown-header">{{ user.name}}</h6>
                            <router-link class="dropdown-item" to="/profile"><i
                                    class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                                <span class="align-middle">Profile</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/setting"><i
                                    class="mdi mdi-cog text-muted fs-16 align-middle me-1"></i>
                                <span class="align-middle">Settings</span>
                            </router-link>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" @click="logout"><i
                                    class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                                <span class="align-middle" data-key="t-logout">Logout</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script>
import Pusher from 'pusher-js';
    import axios from 'axios';
    import { mapActions } from 'vuex'
    import { SimpleBar } from "simplebar-vue3";
    export default {
        components: { SimpleBar, Pusher },
        props: ['user', 'post', 'tag', 'barangay', 'title'],
        data(){
            return {
                user_id: this.$store.state.auth.user.data.id,
                notifications: []
            }
        },
        created(){
            this.subscribe();
            this.fetch();
        },
        computed: {
            sortedNotification: function() {
                this.notifications.sort( ( a, b) => {
                    return new Date(b.created) - new Date(a.created);
                });
                return this.notifications;
            }
        },
        methods: {
            ...mapActions({
                signOut: "auth/logout"
            }),
            async logout() {
                await axios.post('/logout').then(({
                    data
                }) => {
                    this.signOut();
                    this.$router.push({
                        name: "login"
                    })
                })
            },
            toggleDarkMode() {
                if (document.documentElement.getAttribute("data-layout-mode") == "dark") {
                    document.documentElement.setAttribute("data-layout-mode", "light");
                } else {
                    document.documentElement.setAttribute("data-layout-mode", "dark");
                }
            },
            
            fetch(){
                this.load = false;
                axios.get('/notification',{params : { id : this.user_id}})
                .then(response => {
                    if(response){
                        response.data.likes.forEach((value, index) => {
                            this.notifications.push(value);
                        });
                        response.data.comments.forEach((value, index) => {
                            this.notifications.push(value);
                        });
                         response.data.reports.forEach((value, index) => {
                            this.notifications.push(value);
                        });
                    }
                })
                .catch(err => console.log(err));
            },

            view(id,type){
                axios.get('/viewNoti',{params : { id : id, type: type}})
                .then(response => {
                    if(response){
                    }
                })
                .catch(err => console.log(err));
            },

            subscribe() {
                let pusher = new Pusher('f9960142a530c321b7e6', { cluster: 'ap1' })
                pusher.subscribe('posts')
                pusher.bind('App\\Events\\PostBroadcast', data => {
                    console.log(data);
                    switch(data.type){
                        case 'notification':
                            if(this.user_id == data.post.user_id){
                                this.notifications.unshift(data.post);
                            }
                        break;
                    }
                })
            },
            markall(){
                this.notifications = [];
                 axios.get('/markall',{params : { id : this.user_id}})
                .then(response => {
                    if(response){
                    }
                })
                .catch(err => console.log(err));
            }
        }
    }
</script>
<style>
    #page-topbar {
        left: 0;
    }
</style>