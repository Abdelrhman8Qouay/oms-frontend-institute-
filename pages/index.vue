<template>
    <div class="min-h-screen bg-[#171718] flex flex-col items-center justify-center p-4">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-5xl font-bold text-white mb-2">Welcome to <strong class=" text-amber-600">OrmS
                    Turbo</strong> System</h1>
            <p class="text-xl text-white font-extralight">Your Fast Food Restaurant Order Management System</p>
        </div>

        <!-- Role Selection Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
            <!-- Staff Card -->
            <div class="landing-card">
                <div class="behind">
                    <img src="/images/landing-staff.PNG" alt="Staff Icon" />
                    <div class="layer"></div>
                </div>
                <div class="content">
                    <h2>Restaurant Staff</h2>
                    <p>Are you part of the restaurant team? Log in to manage orders, menus,
                        and
                        more.</p>
                    <button @click="navigateToStaffLogin">
                        Staff Login
                    </button>
                </div>
            </div>

            <!-- Admin Manager Card -->
            <div class="landing-card">
                <div class="behind">
                    <img src="/images/landing-manager.jpeg" alt="Manager Image" />
                    <div class="layer"></div>
                </div>
                <div class="content">
                    <h2>Admin Manager</h2>
                    <p>Are you an admin? Log in to manage the system, view reports, and
                        oversee
                        operations.</p>
                    <button @click="navigateToAdminLogin">
                        Admin Login
                    </button>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-center text-white">
            <p class="text-sm">© 2024 OrmS Turbo. All rights reserved.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()

definePageMeta({
    layout: false,
})

function navigateToStaffLogin() {
    router.push('/auth/staff/login')
}

function navigateToAdminLogin() {
    router.push('/auth/dashboard/login')
}
</script>

<style scoped lang="scss">
/* Custom styles for hover effects */
button {
    transition: transform 0.2s ease;
}

button:hover {
    transform: scale(1.05);
}

.landing-card {
    @apply relative bg-white rounded-lg border border-amber-600 shadow-lg overflow-hidden p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300;

    &:hover .behind img {
        @apply scale-110;
    }

    .behind {
        @apply w-full h-full absolute left-0 top-0 z-0;

        img {
            @apply w-full h-full object-cover transition-transform;
        }

        .layer {
            @apply w-full h-full blur-sm bg-black/60 left-0 top-0 absolute;
        }
    }

    .content {
        @apply w-full h-full z-10;

        h2 {
            @apply text-2xl font-bold text-gray-200 mb-2;
        }

        p {
            @apply text-gray-300 mb-6;
        }

        button {
            @apply bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors duration-300;
        }
    }
}
</style>