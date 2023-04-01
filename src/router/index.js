import { createRouter, createWebHistory } from 'vue-router'
import store from '@/state/store'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/Layouts/Auth/Login.vue'),
        meta: {
            middleware: "guest",
            title: `Login`
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/Layouts/Auth/Register.vue'),
        meta: {
            middleware: "guest",
            title: `Register`
        }
    },
    {
        path: "/",
        name: "dashboard",
        component: () => import('@/views/Home.vue'),
        meta: {
            middleware: "auth",
            title: `Dashboard`
        }
    },

    {
        path: "/posts",
        name: "posts",
        component: () => import('@/views/Posts/Index.vue'),
        meta: {
            middleware: "auth",
            title: `Posts`
        }
    },
    {
        path: "/post/:id",
        name: "post/view",
        component: () => import('@/views/Posts/View.vue'),
        props: true,
        meta: {
            middleware: "auth",
            title: `View Post`
        }
    },
    {
        path: "/create",
        name: "create",
        component: () => import('@/views/Posts/Create.vue'),
        meta: {
            middleware: "auth",
            title: `Create`
        }
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import('@/views/Profile.vue'),
        meta: {
            middleware: "auth",
            title: `Profile`
        }
    },
    {
        path: "/setting",
        name: "setting",
        component: () => import('@/views/Setting.vue'),
        meta: {
            middleware: "auth",
            title: `Setting`
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
    linkExactActiveClass: "text-info",
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.meta.middleware == "guest") {
        if (store.state.auth.authenticated) {
            next({ name: "dashboard" })
        }
        next()
    } else {
        if (store.state.auth.authenticated) {
            next()
        } else {
            next({ name: "login" })
        }
    }
})


export default router