// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    // devtools: { enabled: true }
    pages: true,
    modules: [
        '@vueuse/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxt/image',
        '@pinia/nuxt',
        '@nuxt/eslint',
        // '@sidebase/nuxt-auth',
        'nuxt-socket-io',
        // [magic-regexp][https://regexp.dev/guide]
        'magic-regexp/nuxt',
        // "@nuxtjs/axios",
        // "@nuxtjs/auth-next",
    ],

    build: {
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
            extractComments: false, // default was LICENSES
        },
        extractCSS: true,
    },

    css: ['./assets/css/main.css'],

    /*
      [Nuxt tailwindcss][https://tailwindcss.nuxtjs.org/getting-started/installation]
    */
    tailwindcss: {
        cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
        config: {},
        viewer: true,
        exposeConfig: false,
    },

    /*
    [nuxt/axios][https://axios.nuxtjs.org/setup]
  */
    // axios: {
    //   baseURL: process.env.API_BASE_URL || "http://localhost:3000", // Backend API URL
    // },

    /*
    [nuxt/auth][https://auth.nuxtjs.org/guide/setup]
    . Configure the auth module to work with your backend (Nest.js).
    . Use JWT for secure authentication and role-based access control.
  */
    // auth: {
    //   strategies: {
    //     local: {
    //       token: {
    //         property: process.env.AUTH_JWT_TOKEN || "token", // Property to store the JWT token
    //         global: true, // Automatically add token to all requests
    //       },
    //       user: {
    //         property: "user", // Property to store the user object
    //       },
    //       endpoints: {
    //         login: { url: "/auth/login", method: "post" }, // Login endpoint
    //         logout: { url: "/auth/logout", method: "post" }, // Logout endpoint
    //         user: { url: "/auth/user", method: "get" }, // Fetch user endpoint
    //       },
    //     },
    //   },
    //   redirect: {
    //     login: "/auth/login", // Redirect to login page if not authenticated
    //     logout: "/", // Redirect to home page after logout
    //     callback: "/auth/callback", // Callback URL for OAuth
    //     home: "/", // Redirect to home page after login
    //   },
    // },

    /* 
    [Nuxt Eslint][https://eslint.nuxt.com/packages/module]
    If you prefer to use ESLint for formatting, we also directly integrate with ESLint Stylistic to make it easy.
    You can opt-in by setting config.stylistic to true in the eslint module options.
  */
    eslint: {
        config: {
            stylistic: true, // <---
            /*
        stylistic: {
          indent: 'tab',
          semi: true,
          // ...
        }
      */
        },
    },

    /*
    [nuxt-socket-io][https://nuxt.com/modules/socket-io]
    Socket.io client and server module for Nuxt
    . Purpose: Enables real-time communication with the backend.
    . Use Case: Real-time order updates, notifications, and IoT integration.
  */
    io: {
        sockets: [
            {
                name: 'main',
                url: process.env.SOCKET_URL || 'http://localhost:3000',
            },
        ],
    },

    image: {
        quality: 100,
        format: ['webp', 'jpeg', 'jpg', 'png'],
        // The screen sizes predefined by `@nuxt/image`:
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
            '2xl': 1536,
        },
        /* How to use <image>
      <NuxtImg src="https://images.unsplash.com/<id>" />
    */

        // Runtime configuration
        runtimeConfig: {
            public: {
                apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000', // Public API URL
                socketUrl: process.env.SOCKET_URL || 'http://localhost:3000', // Public Socket URL
            },
        },
    },
})
