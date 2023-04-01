<template>
     <ul class="nav nav-justified card-footer-tabs fs-17">
        <li class="nav-item">
            <a href="#/" class="nav-link">
                <i @click="like(post.id)" :id="'like'+post.id"
                    :class="(post.likes) ? (post.likes.filter(x => x.user.id == user_id).length > 0) ? 'bx bxs-heart text-danger':'bx bx-heart' : ''">
                </i>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link">
                <i class='bx bx-message-square-dots'></i>
            </a>
        </li>
        <li class="nav-item">
            <a href="#/" class="nav-link">
                <i @click="report(post.id)" :id="'report'+post.id"
                :class="(post.reports) ? (post.reports.filter(x => x.user.id == user_id).length > 0) ? 'bx bxs-dislike text-danger':'bx bx-dislike' : ''"></i>
            </a>
        </li>
    </ul>
</template>
<script>
export default {
    props: ['post'],
    data(){
        return {
            user_id: this.$store.state.auth.user.data.id
        }
    },
    methods : {
        like(post_id){
            axios.post('/like',{
                post_id: post_id,
                user_id: this.user_id
            })
            .then(response => {
                if(response){
                    
                }
            })
            .catch(err => console.log(err));
        },
        report(post_id){
            axios.post('/report',{
                post_id: post_id,
                user_id: this.user_id
            })
            .then(response => {
                if(response){
                    
                }
            })
            .catch(err => console.log(err));
        },
    }
}
</script>