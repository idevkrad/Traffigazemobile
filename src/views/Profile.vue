<template>
    <Layout>
        <div class="main-content">
            <div class="page-content">
                <b-container fluid>
                    <b-row>
                        <b-col lg="12">
                            <div class="card mt-n3">
                                <div class="card-body">
                                    <ul class="list-unstyled mb-0 vstack gap-0">
                                        <li>
                                            <div class="d-flex align-items-center mb-3">
                                                <div class="flex-shrink-0"><img :src="this.$store.state.auth.user.data.avatar" alt=""
                                                        class="avatar-xs rounded-circle "></div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="fs-14 mt-2">{{this.$store.state.auth.user.data.name}}</h6>
                                                </div>
                                            </div>
                                        </li>
                                        <li class="fs-12"><i class="ri-mail-line me-2 align-middle text-muted"></i>{{this.$store.state.auth.user.data.email}}</li>
                                        <li class="fs-12"><i class="ri-phone-line me-2 align-middle text-muted"></i>{{this.$store.state.auth.user.data.mobile}}</li>
                                    </ul>
                                    <div class="d-grid gap-2 mt-2">
                                        <button class="btn btn-light btn-sm" @click="ClickImage()" type="button" block="">
                                            <div class="btn-content">Change Photo (Camera)</div>
                                        </button>
                                            <button class="btn btn-light btn-sm" @click="ClickImage2()" type="button" block="">
                                            <div class="btn-content">Change Photo (Upload)</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </b-col>
                        
                        <b-col lg="12 mt-n3 mb-2">
                            <span class="badge bg-secondary bg-secondary w-100">My Posts</span>
                        </b-col>
                        <b-col lg="12 mt-4" v-if="!load">
                            <center>
                                <span class="text-secondary">
                                    <i class='bx bx-loader-circle bx-spin' style="font-size: 50px;"></i>
                                </span>
                            </center>
                        </b-col>
                        <b-col lg="12" v-for="(post,index) in posts" v-bind:key="index" v-else>
                            <!-- <router-link :to="{ path: '/post/'+post.id }"> -->
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
                                                <b-link href="#!" class="btn btn-success btn-sm"> View Image</b-link>
                                            </div>
                                        </div>
                                        <div class="mt-3 text-muted">
                                        {{ post.information}}
                                        </div>
                                    </b-card-body>
                                </b-card>
                            <!-- </router-link> -->
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </div>
    </Layout>
</template>
<script>
import { mapActions } from 'vuex'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import axios from 'axios';
import Layout from '../Layouts/Main.vue';
export default {
    components: {
        Layout
    },
    data(){
        return {
            user_id: this.$store.state.auth.user.data.id,
            load: false,
            posts: [],
            imageUrl: '',
        }
    },
    created(){
        this.fetch();
    },
    methods : {
         ...mapActions({
            updateImg:'auth/update'
        }),
        fetch(){
            this.load = false;
            axios.get('/posts',{ params : {type : 'profile', id: this.user_id}})
            .then(response => {
                if(response){
                    this.posts = response.data.data;     
                    this.load = true;
                }
            })
            .catch(err => console.log(err));
        },

        async ClickImage() {
            await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                source: CameraSource.Camera,
                resultType: CameraResultType.Base64,
                }).then((image) => {
                this.render = true;
                this.imageUrl = String(image.base64String)
                this.imageUrl = 'data:image/jpeg;base64,'+this.imageUrl;
                this.update();
            });
        },

        async ClickImage2() {
            await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                source: CameraSource.Photos,
                resultType: CameraResultType.Base64,
                }).then((image) => {
                this.render = true;
                this.imageUrl = String(image.base64String)
                this.imageUrl = 'data:image/jpeg;base64,'+this.imageUrl;
                this.update();
            });
        },

        update(){
            this.processing = true;

            let data = new FormData()
            data.append('id', this.$store.state.auth.user.data.id);
            data.append('avatar', this.imageUrl)
            
            let config = {
                header : {
                'Content-Type' : 'multipart/form-data'
                }
            }

            axios.post('update',data,config).then(({data})=>{
               this.updateImg();
               this.$router.go(0);
            }).catch(({response})=>{
                if(response.status===422){
                    this.validationErrors = response.data.errors
                }else{
                    this.validationErrors = {}
                    alert(response.data.message)
                }
            }).finally(()=>{
                this.processing = false
            })
        },
    },
}
</script>