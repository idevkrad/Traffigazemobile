<template>
    <header id="page-topbar">
        <div class="layout-width">
            <div class="navbar-header" style="border-bottom: .1rem solid; border-color: #e4e2e2;">
                <div class="d-flex">
                    <!-- LOGO -->
                    <div class="navbar-brand-box horizontal-logo">  
                        <router-link to="/" class="logo logo-dark">
                            <span class="logo-lg">
                                <img src="@/assets/images/logo-dark.png" alt="" height="17" />
                            </span>
                        </router-link>
                    </div>
                </div>
                <div class="d-flex align-items-center" v-if="!post">
                    <div class="ms-1 header-item d-sm-flex">
                        <b-button type="button" variant="ghost-secondary"
                            class="btn-icon btn-topbar rounded-circle light-dark-mode" @click="toggleDarkMode">
                            <i class="bx bx-moon fs-22"></i>
                        </b-button>
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
                            <!-- <router-link class="dropdown-item" to="/profile"><i
                                    class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                                <span class="align-middle">Profile</span>
                            </router-link>
                            <router-link class="dropdown-item" to="/setting"><i
                                    class="mdi mdi-cog text-muted fs-16 align-middle me-1"></i>
                                <span class="align-middle">Setting</span>
                            </router-link> -->
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
    import axios from 'axios';
    import { mapActions } from 'vuex'
    import { SimpleBar } from "simplebar-vue3";
    export default {
        components: { SimpleBar },
        props: ['user'],
        data(){
            return {
                user_id: this.$store.state.auth.user.data.id,
                notifications: []
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
        }
    }
</script>
<style>
    #page-topbar {
        left: 0;
    }
</style>