<template>
    <footer class="footer p-2">
        <ul class="nav nav-pills nav-justified card-footer-tabs fs-17">
            <li class="nav-item">
                <router-link to="/" class="nav-link">
                    <i class="ri-home-3-line"></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/users" class="nav-link">
                   <i class='ri-user-2-fill'></i>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/reports" class="nav-link">
                    <i class='bx bxs-report'></i>
                </router-link>
            </li>
        </ul>
    </footer>
</template>
<script>
export default {
    data(){
        return {
            comment: '',
            user_id: this.$store.state.auth.user.data.id
        }
    },
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