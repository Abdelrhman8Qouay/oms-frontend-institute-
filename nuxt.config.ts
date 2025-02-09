// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',

    devtools: { enabled: false },
    pages: true,

    modules: [
        '@vueuse/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxt/image',
        '@pinia/nuxt', // '@sidebase/nuxt-auth',
        '@nuxt/eslint', // [magic-regexp][https://regexp.dev/guide]
        // "@nuxtjs/axios",
        // "@nuxtjs/auth-next",
        'magic-regexp/nuxt',
        '@formkit/auto-animate',
        '@nuxtjs/google-fonts',
        'nuxt-icon',
    ],

    googleFonts: {
        display: 'swap', // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
        preload: true,
        families: {
            Roboto: true,
            Inter: [400, 700],
            'Josefin+Sans': true,
            Lato: [100, 300],
            Raleway: {
                wght: [100, 400],
                ital: [100],
            },
        },
    },

    /*
        [Nitro Guid websocket][https://nitro.build/guide/websocket]
        [How to use (With Nuxt)][https://socket.io/how-to/use-with-nuxt]
        Socket.io client and server module for Nuxt
        . Purpose: Enables real-time communication with the backend.
        . Use Case: Real-time order updates, notifications, and IoT integration.
    */
    nitro: {
        experimental: {
            websocket: true,
        },
    },

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

    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    /*
    [Nuxt tailwindcss][https://tailwindcss.nuxtjs.org/getting-started/installation]
  */
    tailwindcss: {
        cssPath: ['~/assets/css/main.css', { injectPosition: 'first' }],
        config: {},
        viewer: process.env.NODE_ENV === 'development', // provide with the config viewer on Nuxt DevTools
        editorSupport: process.env.NODE_ENV === 'development', // take advantage of some DX utilities
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
    },

    // Runtime configuration
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000', // Public API URL
            socketUrl: process.env.SOCKET_URL || 'http://localhost:3000', // Public Socket URL
            apiTimeout: process.env.API_TIMEOUT,
        },
    },
})
