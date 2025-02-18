// middleware/03.auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'
import { useAuthStore } from '~/stores/auth.store'

// Public routes that don't require authentication
const publicRoutes: string[] = ['/']
const loginRoutes: string[] = ['/auth/staff/login', '/auth/dashboard/login']

// Role-based home pages
const roleHomePages = {
    cashier: '/staff/cashier',
    chef: '/staff/chef',
    admin: '/dashboard',
}

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore()
    const errPrefix = 'App Auth:'

    // Allow access to public routes
    if (publicRoutes.includes(to.path)) {
        console.log('want publicRoutes')
        return
    }

    // Allow access to login routes for unauthenticated users
    if (loginRoutes.includes(to.path) && !authStore.isAuthenticated) {
        console.log('want loginRoutes and Not auth')
        return
    }

    // Redirect authenticated users to their home page if they try to access login routes
    if (loginRoutes.includes(to.path) && authStore.isAuthenticated) {
        console.log('want loginRoutes and is auth')
        console.log(authStore.user)
        const homePage = roleHomePages[authStore.user?.role as keyof typeof roleHomePages] || '/'
        return navigateTo(homePage)
    }

    // Redirect unauthenticated users to the home page
    if (!authStore.isAuthenticated) {
        console.log('Not Auth')
        return navigateTo('/')
    }

    // Token Expiry Check
    if (authStore.isAuthenticated) {
        const tokenExpiry = authStore.tokenExpiry // Assuming you store token expiry in the auth store
        if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
            console.log('Auth and TokenExpiry')
            // try {
            //     await authStore.refreshToken()
            // } catch (error) {
            //     authStore.logout()
            //     return navigateTo('/')
            // }
            authStore.logout()
            return navigateTo('/')
        }
    }

    // Session Timeout
    // const lastActivity = useCookie('lastActivity', { maxAge: 60 * 60 }) // 1 hour
    // if (lastActivity.value) {
    //     const lastActivityTime = new Date(lastActivity.value).getTime()
    //     const currentTime = new Date().getTime()
    //     const inactiveDuration = currentTime - lastActivityTime

    //     if (inactiveDuration > 30 * 60 * 1000) {
    //         console.log('lastActivity and inActiveDuration')
    //         // 30 minutes
    //         authStore.logout()
    //         return navigateTo('/')
    //     }
    // }

    // Role-based access control
    if (to.path.startsWith('/staff/cashier') && !authStore.isCashier) {
        console.log('want cashier and not cashier')
        return navigateTo('/auth/staff/login')
    }

    if (to.path.startsWith('/staff/chef') && !authStore.isChef) {
        console.log('want chef and not chef')
        return navigateTo('/auth/staff/login')
    }

    if (to.path.startsWith('/dashboard') && !authStore.isAdmin) {
        console.log('want admin and not admin')
        return navigateTo('/auth/dashboard/login')
    }

    // Update last activity timestamp
    useCookie('lastActivity').value = new Date().toISOString()

    // Optional: Log route access for auditing
    console.log(`User ${authStore.user?.id} (${authStore.user?.role}) accessed ${to.path}`)
})

/* Explanation of 03.auth.global.ts Logic
- Public Routes: Allow access to login pages without authentication.
- Authentication Check: Redirect unauthenticated users to the login page.
- Role-Based Access:
    . /cashier routes are only accessible to users with the cashier role.
    . /chef routes are only accessible to users with the chef role.
    . /admin routes are only accessible to users with the admin role.
    
- Force Logout: If a user’s role doesn’t match the route, force logout and redirect to the login page.
- Audit Logging: Log route access for auditing purposes.

---
## Advanced Tricks

### **Token Expiry Check**:
   - Add a check for token expiry and automatically refresh the token if it’s about to expire.

```typescript
if (authStore.isAuthenticated) {
    const tokenExpiry = authStore.tokenExpiry // Assuming you store token expiry in the auth store
    if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
        try {
            await authStore.refreshToken()
        } catch (error) {
            authStore.logout()
            return navigateTo('/auth/login')
        }
    }
}
```

### **Session Timeout**:
   - Automatically log out inactive users after a certain period.

```typescript
const lastActivity = useCookie('lastActivity', { maxAge: 60 * 60 }) // 1 hour
if (lastActivity.value && new Date() - new Date(lastActivity.value)) > 30 * 60 * 1000) {
    authStore.logout()
    return navigateTo('/auth/login')
}
```
*/
