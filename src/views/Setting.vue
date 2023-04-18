<template>
    <Layout>
        <div class="main-content">
            <div class="page-content">
                <b-container fluid>
                    <b-row>
                        <b-col lg="12">
                            <div class="card mt-n3">
                                <div class="card-body">
                                    <div class="mb-2">
                                            <label for="password" class="form-label mb-n2 fs-11">Password</label>
                                            <div class="position-relative auth-pass-inputgroup mb-3">
                                                <input :type="(!showPassword) ? 'password' : 'text'" class="form-control" id="password" placeholder="Enter password" v-model="user.password" />
                                                <b-button @click="toggleShow" variant="link" class="position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon">
                                                        <i class="ri-eye-fill align-middle"></i>
                                                    </b-button>
                                                <div class="invalid-feedback">
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>

                                         <div class="mb-2">
                                            <label for="password" class="form-label mb-n2 fs-11">Re-Password</label>
                                            <input :type="(!showPassword) ? 'password' : 'text'" class="form-control" id="password" placeholder="Enter password" v-model="user.password_confirmation" />
                                            <div class="invalid-feedback">
                                                <span></span>
                                            </div>
                                        </div>

                                        <div v-if="validationErrors" class="alert alert-danger" role="alert">{{validationErrors}}</div>
                                        <div v-if="success && validationErrors == null" class="alert alert-success" role="alert">{{success}}</div>
                                         <div class="mt-4">
                                            <b-button  :disabled="processing" @click="update" variant="success" class="w-100" type="button">
                                                Submit
                                            </b-button>
                                        </div>
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                </b-container>
            </div>
        </div>
    </Layout>
</template>
<script>
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
            user: {
                id: this.$store.state.auth.user.data.id,
                password: '',
                password_confirmation: ''
            },
            validationErrors: '',
            success: '',
            showPassword: false,
        }
    },

    methods : {
        update(){
            let data = new FormData()
            data.append('id', this.$store.state.auth.user.data.id);
            data.append('password', this.user.password)
            data.append('password_confirmation', this.user.password_confirmation)
            let config = {
                header : {
                'Content-Type' : 'multipart/form-data'
                }
            }

            axios.post('password',data,config).then(({data})=>{
               this.success = data.message;
               this.validationErrors = null;
               this.user.password = '';
               this.user.password_confirmation = '';
            }).catch(({response})=>{
                if(response.status===422){
                    this.validationErrors = response.data.message
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
    },
}
</script>