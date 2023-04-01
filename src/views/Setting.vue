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

                                         <div class="mt-4">
                                            <b-button  :disabled="processing" @click="register" variant="success" class="w-100" type="button">
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
                confirm_password: ''
            }
        }
    },

    methods : {
        
    },
}
</script>