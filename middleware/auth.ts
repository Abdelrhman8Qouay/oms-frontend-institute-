// export default defineNuxtRouteMiddleware((to, from) => {
//     const authStore = useAuthStore()

//     if (!authStore.isAuthenticated) {
//         return navigateTo('/auth/login')
//     }

//     // Redirect based on role
//     if (to.path.startsWith('/chef') && !authStore.isChef) {
//         return navigateTo('/auth/login')
//     }

//     if (to.path.startsWith('/cashier') && !authStore.isCashier) {
//         return navigateTo('/auth/login')
//     }

//     if (to.path.startsWith('/admin') && !authStore.isAdmin) {
//         return navigateTo('/auth/login')
//     }
// })
