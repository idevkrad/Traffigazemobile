<template>
    <div>
        <div id="layout-wrapper">
            <Header :user="user.data" />
                 <slot />
            <Footer/>
        </div>
    </div>
</template>
<script>
import Header from '@/components/Admin/Header.vue';
import Footer from '@/components/Admin/Footer.vue';
export default {
    components : { Header, Footer },
    data(){
        return {
            user:this.$store.state.auth.user
        }
    },
}
</script>
<style>
.main-content {
    margin-left: 0px;
}
</style>