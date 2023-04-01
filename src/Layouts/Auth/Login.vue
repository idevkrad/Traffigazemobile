<template>
    <div class="auth-page-wrapper pt-5">
        <div class="auth-page-content">
            <b-container>
             

                <b-row class="justify-content-center">
                    <b-col md="8" lg="6" xl="5">
                        <b-card no-body class="mt-4">
                            <b-card-body class="p-4">
                                <div class="text-center mt-2">
                                    <h5 class="text-primary">Welcome to TraffiGaze!</h5>
                                    <p class="text-muted">Sign in to continue</p>
                                </div>
                                <div class="p-2 mt-4">
                                    <b-alert v-model="authError" variant="danger" class="mt-3" dismissible>{{ authError }}</b-alert>
                                    <form @submit.prevent="tryToLogIn">
                                        <div class="mb-2">
                                            <label for="email" class="form-label mb-n2 fs-11">Email</label>
                                            <input type="email" class="form-control" id="email" placeholder="Enter email" v-model="auth.email" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>

                                        <div class="mb-2">
                                            <label class="form-label mb-n2 fs-11" for="password-input">Password</label>
                                            <div class="position-relative auth-pass-inputgroup mb-3">
                                                <input :type="(!showPassword) ? 'password' : 'text'" v-model="auth.password" class="form-control pe-5" placeholder="Enter password" id="password-input" />
                                                <b-button @click="toggleShow" variant="link" class="position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon">
                                                    <i class="ri-eye-fill align-middle"></i>
                                                </b-button>
                                                <div class="invalid-feedback">
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                            <label class="form-check-label" for="auth-remember-check">Remember me</label>
                                        </div>

                                        <div class="mt-4">
                                            <b-button  :disabled="processing" @click="login" variant="success" class="w-100" type="button">
                                                Sign In
                                            </b-button>
                                        </div>

                                    </form>
                                </div>
                            </b-card-body>
                        </b-card>

                        <div class="mt-4 text-center">
                            <p class="mb-0"> Don't have an account? 
                                <router-link to="/register" class="fw-semibold text-primary text-decoration-underline">Signup</router-link>
                            </p>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex'
export default {
    name:"login",
    data(){
        return {
            auth:{
                email:"",
                password:""
            },
            validationErrors:{},
            processing:false,
            showPassword: false,
        }
    },
    methods:{
        ...mapActions({
            signIn:'auth/login'
        }),
        async login(){
            this.processing = true
            await axios.post('login',this.auth).then(({data})=>{
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
        toggleShow() {
            if(this.showPassword){
                this.showPassword = false;
            }else{
                this.showPassword = true;
            }
        }
    }
}
</script>