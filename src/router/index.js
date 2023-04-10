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
    // {
    //     path: "/",
    //     name: "admin",
    //     component: () => import('@/views/Admin/Home.vue'),
    //     meta: {
    //         middleware: "auth",
    //         title: `Admin`
    //     }
    // },
    // {
    //     path: "/users",
    //     name: "users",
    //     component: () => import('@/views/Admin/User.vue'),
    //     meta: {
    //         middleware: "auth",
    //         title: `Users`
    //     }
    // },
    // {
    //     path: "/reports",
    //     name: "reports",
    //     component: () => import('@/views/Admin/Reports.vue'),
    //     meta: {
    //         middleware: "auth",
    //         title: `Reports`
    //     }
    // },
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
        path: "/history",
        name: "history",
        component: () => import('@/views/History/Index.vue'),
        meta: {
            middleware: "auth",
            title: `Histories`
        }
    },
    {
        path: "/history/:id/:type",
        name: "history/view",
        component: () => import('@/views/History/View.vue'),
        props: true,
        meta: {
            middleware: "auth",
            title: `View History`
        }
    },
    {
        path: "/statistic",
        name: "statistic",
        component: () => import('@/views/Statistic/Index.vue'),
        meta: {
            middleware: "auth",
            title: `Statistics`
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
            // if (store.state.auth.user.data.is_admin){
            //     next({ name: "admin" })
            // }else{
                next({ name: "dashboard" })
            // }
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