<template>
    <div class="auth-page-wrapper pt-2">
        <div class="auth-page-content">
            <b-container>
             

                <b-row class="">
                    <b-col md="8" lg="6" xl="5">
                        <b-card no-body class="mt-4">
                            <b-card-body class="p-4">
                                <div class="text-center mt-2">
                                    <h6 class="text-primary">Register to TraffiGaze!</h6>
                                </div>
                                <div class="p-2 mt-2">
                                    <b-alert v-model="authError" variant="danger" class="mt-3" dismissible>{{ authError }}</b-alert>
                                    <form @submit.prevent="tryToLogIn">
                                        <div class="mb-2">
                                            <label for="name" class="form-label mb-n2 fs-11">Name</label>
                                            <input type="text" class="form-control" id="name" placeholder="Enter name" v-model="user.name" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label for="mobile" class="form-label mb-n2 fs-11">Mobile</label>
                                            <input type="number" class="form-control" id="mobile" placeholder="Enter mobile" v-model="user.mobile" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>
                                        <div class="mb-2">
                                            <label for="email" class="form-label mb-n2 fs-11">Email</label>
                                            <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="user.email" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>

                                        <div class="mb-2">
                                            <label for="password" class="form-label mb-n2 fs-11">Password</label>
                                            <input type="password" class="form-control" id="password" placeholder="Enter password" v-model="user.password" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>

                                         <div class="mb-2">
                                            <label for="password" class="form-label mb-n2 fs-11">Re-Password</label>
                                            <input type="password" class="form-control" id="password" placeholder="Enter password" v-model="user.confirm_password" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>
                                        
                                        <div class="d-grid gap-2 mt-2">
                                            <button class="btn btn-light btn-sm" @click="ClickImage()" type="button" block="">
                                                <div class="btn-content">Take Picture</div>
                                            </button>
                                        </div>

                                        <div class="mt-4">
                                            <b-button  :disabled="processing" @click="register" variant="success" class="w-100" type="button">
                                                Sign Up
                                            </b-button>
                                            <router-link to="/login"><button class="btn btn-light btn-sm w-100 mt-1" type="button" block="">
                                                <div class="btn-content">Back</div>
                                            </button></router-link>
                                        </div>

                                    </form>
                                </div>
                            </b-card-body>
                        </b-card>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import axios from 'axios';
import { mapActions } from 'vuex'
export default {
    name:"login",
    data(){
        return {
            user:{
                avatar: '',
                email: '',
                password: '',
                confirm_password: '',
                mobile: '',
                name: ''
            },
            imageUrl: '',
            render: false,
            validationErrors:{},
            processing:false
        }
    },
    methods:{
        ...mapActions({
            signIn:'auth/login'
        }),
        async login(){
            this.processing = true
            await axios.post('login',this.user).then(({data})=>{
                localStorage.setItem('token', data.token);
                this.signIn();
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

        register(){
            this.processing = true;

            let data = new FormData()
            data.append('email', this.user.email);
            data.append('password', this.user.password);
            data.append('confirm_password', this.user.confirm_password);
            data.append('mobile', this.user.mobile);
            data.append('name', this.user.name)
            data.append('avatar', this.imageUrl)
            
            let config = {
                header : {
                'Content-Type' : 'multipart/form-data'
                }
            }


            axios.post('register',data,config).then(({data})=>{
               this.login();
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
            });
        },
    }
}
</script>