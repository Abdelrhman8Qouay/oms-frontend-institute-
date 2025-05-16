# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

-   Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

-   Run the npm run lint command to check if the code style is correct or run npm run lint:fix to automatically fix issues.

```bash
# check if code correct
npm run lint

# to automatically fix issues
npm run lint:fix
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Follow the improvements

### version 2

1. [Build "Cashier" page] with needed of files and the logic
2. [Build (axios, store) plugins]
3. [Build (APIs) logic] for more better calling the APIs for the pages
4. [Build (Layouts) components]
5. [Refactor (Cashier) Files]
6. [Build (useCache) composable] for cache handling with (VueUse) lib
7. [Enhanced Full Logic]

### version 3

1. [Added (format) functions] to the "utils" folder
2. [Fixed (Tailwindcss) tool] inside the app to works fine
3. [Enhanced (Cashier) page]
4. [Build (Chef) page]
   [Build (useWebsocket) composable]
5. [Added (Loader, OrderCard) components]
6. [Clear Logic separated]
7. [Refactored (Socket.io) for client]
   [Removed (useSocket) composable]
8. [Enhanced (Chef) Page logic]
   [Configured (Socket-client)]

### version 4

1. [Enhanced (Chef) Page logic]
2. [Enhanced (Cashier) Page logic]
3. [Added new (Types) and (useSocketIo) composable]
4. [Configured (Socket-Client)] with the env variables
5. [Build (Admin Home) Page]
   [Installed (Chart and Vue-Chart) Packages]

### version 5

1. [Added (Auth) pages]
2. [Added & Enhanced the (middlewares)]
3. [Built (Landing) page]
4. [Updated (Pages) structure]
5. [Created (Input) component] created advanced input instead of the manually setup

### version 6

1. [Update (Dashboard) components]
2. [Create (Show All Menus) Page] new page in the dashboard
3. [Create (Collapsible) Menus]
4. [Create (Dashboard Menu) Components]
5. [Create (Edit, Create) Dashboard Menu Pages]

### version 7

1. [Update (Dashboard Home)]
2. [Update (Data Types)]
3. [Upgrade Structure]
4. [Stopped (Auth)] stopped till end development
5. [Created (Orders) Dashboard Pages]
6. [Created (Order Tracking) Cashier Pages]
7. [Update (User role)]
8. [Update (Page Layouts)] some of changes for the layout of all pages to get something specific as needed

## Notes Now

1 proceed the rest of (chef) and (dashboard) design
2 put the metadata for each order details
3 update statistics of home dashboard (to avoid orders that failed or canceled )
4 Full check menu management in dashboard
5 Clear all consols (that is unnecessary)
6 Pack up this for the final project (and make this for upgrades)
7 Remove All Not needed tools and modules and dependencies

## Dependencies Installed

-   vueuse (Module)
-   pinia/nuxt (Module)
-   axios (Module)
-   auth/next (Module > Package)
    . Purpose: Handles authentication and authorization.
    . Use Case: User login, logout, and role-based access control.
-   uuid (Package) {UUIDs handler}
-   magic-regexp {Development Tools}
-   eslint (Module) {Development Tools}
    -   -D typescript (to make it more strict)
-   image (Module) {Performance and Optimization}
-   socket.io socket.io-client (Package) {Real-time Communication}
    . Purpose: Enables real-time communication with the backend.
    . Use Case: Real-time order updates, notifications, and IoT integration.
    ```bash
    npm install socket.io socket.io-client
    npm install --save-dev @types/socket.io-client
    ```
-   chart & Vue-chart (Package) {Charts Creation}

#### **Authentication Workflow**

1. **User Login**:

    - User submits login form.
    - Frontend sends credentials to `/auth/login` (Nest.js backend).
    - Backend validates credentials and returns a JWT token.
    - Frontend stores the token and fetches user details.

2. **Role-Based Access Control**:

    - Use middleware to restrict access to routes based on user roles.
    - Example middleware (`middleware/auth.ts`):

        ```typescript
        export default defineNuxtRouteMiddleware((to, from) => {
            const authStore = useAuthStore()
            if (!authStore.isAuthenticated) {
                return navigateTo('/auth/login')
            }

            // Check user role
            if (to.meta.requiresAdmin && !authStore.user.roles.includes('admin')) {
                return navigateTo('/')
            }
        })
        ```

3. **User Logout**:
    - Frontend sends a request to `/auth/logout` (Nest.js backend).
    - Backend invalidates the token.
    - Frontend clears the token and redirects to the home page.

---

##### **Why `@nuxtjs/auth-next`?**

-   **Official Support**: Maintained by the Nuxt team.
-   **JWT Integration**: Works seamlessly with JWT-based authentication.
-   **Role-Based Access**: Easily implement role-based access control.
-   **OAuth Support**: Supports third-party authentication (e.g., Google, Facebook).

-   tailwindcss (module)
    -   tailwindcss/vite (dependency)

## VueUse Installed & Used

-   integrations [VueUse Integrations](https://vueuse.org/integrations/README.html)
    This is an add-on of VueUse, providing integration wrappers for utility libraries.
-   axios >>> UseAxios (Api Calls)
    [Vueuse Axios](https://vueuse.org/integrations/useAxios/)

# Questions

## Best structure 🗃 with our backend structure

To structure your **Nuxt.js** app for an **Order Management System (OMS)** for small restaurants, you need to ensure that the frontend (Nuxt.js) and backend (Nest.js) are well-organized, scalable, and maintainable. Below is a suggested folder and file structure for your **Nuxt.js** app, keeping in mind the backend structure you've described.

---

### **Nuxt.js App Structure**

```plaintext
nuxt-app/
├── .nuxt/                  # Auto-generated Nuxt files
├── assets/                 # Static assets (images, fonts, etc.)
│   └── scss/               # Global SCSS files
├── components/             # Reusable Vue components
│   ├── common/             # Common components (e.g., buttons, modals)
│   ├── layout/             # Layout components (e.g., header, footer)
│   ├── order/              # Order-related components
│   ├── menu/               # Menu-related components
│   ├── notification/       # Notification components
│   └── ai/                 # AI-related components (e.g., recommendations)
├── composables/            # Composable functions (Vue 3)
├── layouts/                # Layouts for pages
│   └── default.vue         # Default layout
├── middleware/             # Nuxt middleware (e.g., auth, role-based access)
├── pages/                  # Application views and routes
│   ├── admin/              # Admin pages
│   ├── cashier/            # Cashier pages
│   ├── chef/               # Chef pages
│   ├── auth/               # Authentication pages (login, register)
│   └── index.vue           # Home page
├── plugins/                # Nuxt plugins (e.g., socket.io, axios)
├── public/                 # Static files (e.g., favicon, robots.txt)
├── server/                 # Server-side logic (API routes, middleware)
│   ├── api/                # API endpoints (if using Nuxt server middleware)
│   └── middleware/         # Server middleware
├── stores/                 # Pinia stores (state management)
│   ├── order.store.ts      # Order-related state
│   ├── menu.store.ts       # Menu-related state
│   ├── notification.store.ts # Notification state
│   └── auth.store.ts       # Authentication state
├── utils/                  # Utility functions
├── app.vue                 # Root Vue component
├── nuxt.config.ts          # Nuxt configuration file
└── tsconfig.json           # TypeScript configuration
```

---

### **Key Features and Integration with Backend**

1. **Authentication and Authorization**:

    - Use **JWT** for authentication.
    - Store tokens in cookies or localStorage.
    - Use middleware to protect routes (e.g., `auth`, `admin`, `cashier`, `chef`).

2. **Real-time Updates**:

    - Integrate **Socket.io** for real-time updates (e.g., order status, notifications).
    - Use **Pinia** stores to manage real-time state.

3. **AI Features**:

    - Display AI recommendations (e.g., predictive ordering) in the frontend.
    - Use composables to fetch and manage AI data.

4. **IoT Integration**:

    - Display real-time IoT data (e.g., cooking times, inventory alerts) using **Socket.io**.

5. **Rate Limiting and Caching**:

    - Use **axios** interceptors to handle rate-limiting errors from the backend.
    - Cache frequently used data (e.g., menu items) in the frontend.

6. **Role-based Access**:
    - Use middleware to restrict access to pages based on user roles (e.g., admin, cashier, chef).

---

### **Example Workflow**

1. **Order Placement**:

    - Customer places an order via the frontend.
    - Order data is sent to the backend (Nest.js) via an API call.

2. **Order Routing**:

    - Backend processes the order and routes it to the appropriate kitchen station.
    - Frontend displays real-time updates using **Socket.io**.

3. **Order Preparation**:

    - Chef receives the order on their dashboard.
    - IoT devices send real-time updates (e.g., cooking times) to the frontend.

4. **Order Fulfillment**:

    - Cashier marks the order as completed.
    - Frontend updates the order status and notifies the customer.

5. **Post-Order Management**:
    - Analytics data is stored in **MongoDB** and displayed on the admin dashboard.

---

### **Integration with Backend**

-   Use **axios** to communicate with the backend APIs.
-   Use **Socket.io** for real-time updates.
-   Store session data (e.g., JWT tokens) in cookies or localStorage.
-   Use **Pinia** for state management across the app.

---

### **Example Code Snippets**

1. **Axios Plugin** (`plugins/axios.ts`):

    ```typescript
    export default defineNuxtPlugin(() => {
        const axiosInstance = axios.create({
            baseURL: process.env.API_BASE_URL,
            headers: { 'Content-Type': 'application/json' },
        })

        return {
            provide: {
                axios: axiosInstance,
            },
        }
    })
    ```

2. **Socket.io Plugin** (`plugins/socket.io.ts`):

    ```typescript
    import { io } from 'socket.io-client'

    export default defineNuxtPlugin(() => {
        const socket = io(process.env.SOCKET_URL)

        return {
            provide: {
                socket,
            },
        }
    })
    ```

3. **Auth Middleware** (`middleware/auth.ts`):

    ```typescript
    export default defineNuxtRouteMiddleware((to, from) => {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) {
            return navigateTo('/auth/login')
        }
    })
    ```

4. **Pinia Store** (`stores/order.store.ts`):

    ```typescript
    import { defineStore } from 'pinia'

    export const useOrderStore = defineStore('order', {
        state: () => ({
            orders: [],
        }),
        actions: {
            async fetchOrders() {
                const { data } = await useAxios().get('/orders')
                this.orders = data
            },
        },
    })
    ```

---

### **Conclusion**

This structure ensures a clean separation of concerns, scalability, and maintainability for your Nuxt.js app. It integrates seamlessly with your Nest.js backend and supports advanced features like AI, IoT, and real-time updates.

## What modules do we need to load into our app "nuxtjs"?

To build a robust **Nuxt.js** app for your **Order Management System (OMS)**, you need to load specific modules that enhance functionality, improve performance, and simplify development. Below is a list of essential modules and their purposes:

---

### **Core Nuxt Modules**

1. **@nuxtjs/axios**

    - Purpose: Simplifies HTTP requests to your backend (Nest.js).
    - Use Case: Fetching order data, menu items, and sending updates to the backend.
    - Installation:
        ```bash
        npm install @nuxtjs/axios
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/axios'],
            axios: {
                baseURL: process.env.API_BASE_URL, // Backend API URL
            },
        })
        ```

2. **@pinia/nuxt**

    - Purpose: State management for Vue 3 (replaces Vuex).
    - Use Case: Managing global state like orders, menu items, and user authentication.
    - Installation:
        ```bash
        npm install @pinia/nuxt pinia
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@pinia/nuxt'],
        })
        ```

3. **@nuxtjs/auth-next** (or custom auth implementation)

    - Purpose: Handles authentication and authorization.
    - Use Case: User login, logout, and role-based access control.
    - Installation:
        ```bash
        npm install @nuxtjs/auth-next
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/auth-next'],
            auth: {
                strategies: {
                    local: {
                        token: {
                            property: 'token',
                            global: true,
                        },
                        user: {
                            property: 'user',
                        },
                        endpoints: {
                            login: { url: '/auth/login', method: 'post' },
                            logout: { url: '/auth/logout', method: 'post' },
                            user: { url: '/auth/user', method: 'get' },
                        },
                    },
                },
            },
        })
        ```

4. **@nuxtjs/i18n**
    - Purpose: Adds internationalization (i18n) support.
    - Use Case: Supporting multiple languages for a global audience.
    - Installation:
        ```bash
        npm install @nuxtjs/i18n
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/i18n'],
            i18n: {
                locales: ['en', 'ar'], // Supported languages
                defaultLocale: 'en',
                vueI18n: {
                    legacy: false,
                    locale: 'en',
                },
            },
        })
        ```

---

### **UI and Styling Modules**

5. **@nuxtjs/tailwindcss**

    - Purpose: Integrates Tailwind CSS for utility-first styling.
    - Use Case: Styling the app with a modern CSS framework.
    - Installation:
        ```bash
        npm install @nuxtjs/tailwindcss tailwindcss postcss autoprefixer
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/tailwindcss'],
        })
        ```

6. **@nuxtjs/google-fonts**
    - Purpose: Loads Google Fonts.
    - Use Case: Customizing typography.
    - Installation:
        ```bash
        npm install @nuxtjs/google-fonts
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/google-fonts'],
            googleFonts: {
                families: {
                    Roboto: true,
                    'Open+Sans': [400, 700],
                },
            },
        })
        ```

---

### **Real-time Communication**

7. **socket.io-client**

    - Purpose: Enables real-time communication with the backend.
    - Use Case: Real-time order updates, notifications, and IoT integration.
    - Installation:
        ```bash
        npm install socket.io-client
        ```
    - Usage: Create a plugin (`plugins/socket.io.ts`):

        ```typescript
        import { io } from 'socket.io-client'

        export default defineNuxtPlugin(() => {
            const socket = io(process.env.SOCKET_URL)

            return {
                provide: {
                    socket,
                },
            }
        })
        ```

---

### **Performance and Optimization**

8. **@nuxtjs/image**

    - Purpose: Optimizes images for performance.
    - Use Case: Displaying high-quality menu item images without slowing down the app.
    - Installation:
        ```bash
        npm install @nuxtjs/image
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/image'],
        })
        ```

9. **@nuxtjs/pwa**
    - Purpose: Adds Progressive Web App (PWA) support.
    - Use Case: Offline functionality and app-like experience.
    - Installation:
        ```bash
        npm install @nuxtjs/pwa
        ```
    - Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/pwa'],
        })
        ```

---

### **Analytics and Monitoring**

10. **@nuxtjs/sentry**
    -   Purpose: Integrates Sentry for error tracking and monitoring.
    -   Use Case: Debugging and monitoring app performance.
    -   Installation:
        ```bash
        npm install @nuxtjs/sentry
        ```
    -   Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/sentry'],
            sentry: {
                dsn: process.env.SENTRY_DSN, // Your Sentry DSN
            },
        })
        ```

---

### **SEO and Meta Tags**

11. **@nuxtjs/robots**

    -   Purpose: Generates `robots.txt` for SEO.
    -   Use Case: Controlling search engine indexing.
    -   Installation:
        ```bash
        npm install @nuxtjs/robots
        ```
    -   Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/robots'],
        })
        ```

12. **@nuxtjs/sitemap**
    -   Purpose: Generates a sitemap for SEO.
    -   Use Case: Improving search engine visibility.
    -   Installation:
        ```bash
        npm install @nuxtjs/sitemap
        ```
    -   Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/sitemap'],
        })
        ```

---

### **Development Tools**

13. **@nuxtjs/eslint-module**

    -   Purpose: Integrates ESLint for code quality.
    -   Use Case: Ensuring consistent code style and catching errors early.
    -   Installation:
        ```bash
        npm install @nuxtjs/eslint-module eslint
        ```
    -   Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/eslint-module'],
        })
        ```

14. **@nuxtjs/stylelint-module**
    -   Purpose: Integrates Stylelint for CSS quality.
    -   Use Case: Ensuring consistent styling and catching CSS errors.
    -   Installation:
        ```bash
        npm install @nuxtjs/stylelint-module stylelint
        ```
    -   Configuration (`nuxt.config.ts`):
        ```typescript
        export default defineNuxtConfig({
            modules: ['@nuxtjs/stylelint-module'],
        })
        ```

---

### **Final Configuration Example**

```typescript
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/axios',
        '@pinia/nuxt',
        '@nuxtjs/auth-next',
        '@nuxtjs/i18n',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
        '@nuxtjs/image',
        '@nuxtjs/pwa',
        '@nuxtjs/sentry',
        '@nuxtjs/robots',
        '@nuxtjs/sitemap',
        '@nuxtjs/eslint-module',
        '@nuxtjs/stylelint-module',
    ],
    // Additional configurations for each module
})
```

---

### **Conclusion**

These modules will help you build a scalable, performant, and feature-rich Nuxt.js app for your OMS. Each module addresses specific needs, from state management and real-time communication to SEO and performance optimization.

## what is the best of from "VueUse" lib or "Nuxtjs" modules provided for common things like (image or etc..) to use in our app?

When deciding between **VueUse** and **Nuxt.js modules** for common functionalities like image handling, state management, or utilities, it’s important to consider the following:

1. **VueUse**:

    - A collection of **Vue Composition API utilities**.
    - Lightweight and framework-agnostic (works with Vue 3 and Nuxt 3).
    - Ideal for small, reusable composable functions (e.g., `useClipboard`, `useLocalStorage`).
    - Best for **client-side logic** and **reactive utilities**.

2. **Nuxt.js Modules**:
    - Officially supported or community-driven modules specifically designed for Nuxt.
    - Provide **server-side and client-side integration**.
    - Often include **built-in optimizations** for Nuxt (e.g., SEO, performance, and DX).
    - Best for **framework-specific features** (e.g., image optimization, PWA, auth).

---

### **When to Use VueUse**

-   **Lightweight utilities**: For small, reusable composable functions.
-   **Client-side reactivity**: For reactive state, event listeners, or browser APIs.
-   **Custom logic**: When you need fine-grained control over functionality.

#### **Common VueUse Utilities**

-   **`useClipboard`**: Copy text to the clipboard.
-   **`useLocalStorage`**: Persist state in `localStorage`.
-   **`useMouse`**: Track mouse position.
-   **`useFetch`**: Lightweight alternative to Nuxt’s `useFetch`.
-   **`useDark`**: Toggle dark mode.

#### **Example: Using VueUse**

```bash
npm install @vueuse/core
```

```typescript
import { useLocalStorage } from '@vueuse/core'

const theme = useLocalStorage('theme', 'light')
```

---

### **When to Use Nuxt.js Modules**

-   **Framework-specific features**: For features tightly integrated with Nuxt (e.g., image optimization, PWA).
-   **Server-side functionality**: For server-side rendering (SSR) or static site generation (SSG).
-   **Performance optimizations**: For built-in optimizations like lazy loading, caching, or image compression.

#### **Common Nuxt.js Modules**

-   **`@nuxtjs/image`**: Optimize and lazy-load images.
-   **`@nuxtjs/pwa`**: Add PWA capabilities (offline support, installability).
-   **`@nuxtjs/auth-next`**: Handle authentication and authorization.
-   **`@nuxtjs/i18n`**: Add internationalization (i18n) support.
-   **`@nuxtjs/tailwindcss`**: Integrate Tailwind CSS for styling.

#### **Example: Using Nuxt.js Modules**

```bash
npm install @nuxtjs/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
    modules: ['@nuxtjs/image'],
    image: {
        domains: ['https://my-cdn.com'],
    },
})
```

---

### **Comparison Table**

| Feature                  | VueUse                                 | Nuxt.js Modules                         |
| ------------------------ | -------------------------------------- | --------------------------------------- |
| **Image Optimization**   | Not available                          | Use `@nuxtjs/image`                     |
| **State Management**     | `useLocalStorage`, `useSessionStorage` | Use Pinia (`@pinia/nuxt`)               |
| **Authentication**       | Not available                          | Use `@nuxtjs/auth-next`                 |
| **Internationalization** | Not available                          | Use `@nuxtjs/i18n`                      |
| **PWA Support**          | Not available                          | Use `@nuxtjs/pwa`                       |
| **Reactive Utilities**   | `useMouse`, `useClipboard`, etc.       | Not available                           |
| **SEO**                  | Not available                          | Use `@nuxtjs/robots`, `@nuxtjs/sitemap` |
| **Performance**          | Lightweight utilities                  | Built-in optimizations                  |

---

### **Best Practices**

1. **Use Nuxt.js Modules for Framework-Specific Features**:

    - For image optimization, use `@nuxtjs/image`.
    - For PWA support, use `@nuxtjs/pwa`.
    - For authentication, use `@nuxtjs/auth-next`.

2. **Use VueUse for Lightweight, Reactive Utilities**:

    - For client-side reactivity (e.g., `useLocalStorage`, `useClipboard`).
    - For custom composable logic.

3. **Combine Both When Necessary**:
    - Use Nuxt.js modules for framework integration and VueUse for client-side utilities.

---

### **Example: Combining VueUse and Nuxt.js Modules**

1. **Image Optimization (Nuxt.js Module)**:

    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
        modules: ['@nuxtjs/image'],
    })
    ```

2. **Dark Mode Toggle (VueUse)**:

    ```typescript
    import { useDark, useToggle } from '@vueuse/core'

    const isDark = useDark()
    const toggleDark = useToggle(isDark)
    ```

3. **Authentication (Nuxt.js Module)**:

    ```typescript
    // nuxt.config.ts
    export default defineNuxtConfig({
        modules: ['@nuxtjs/auth-next'],
    })
    ```

4. **Clipboard Utility (VueUse)**:

    ```typescript
    import { useClipboard } from '@vueuse/core'

    const { copy } = useClipboard()
    copy('Hello, world!')
    ```

---

### **Conclusion**

-   Use **Nuxt.js modules** for framework-specific features like image optimization, PWA, and authentication.
-   Use **VueUse** for lightweight, reactive utilities and client-side logic.
-   Combine both to leverage the strengths of each library and build a scalable, performant Nuxt.js app.
