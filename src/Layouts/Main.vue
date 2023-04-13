<template>
    <div>
        <div id="layout-wrapper">
            <Header :post="post" :tag="tag" :user="user.data" :title="title"/>
                 <slot />
            <Footer :post="post"/>
        </div>
    </div>
</template>
<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
export default {
    props: ['props','post', 'tag', 'title'],
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