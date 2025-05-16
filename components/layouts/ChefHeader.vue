<template>
    <header class="bg-white shadow-md">
        <div class="px-2 py-4 flex justify-between items-center">

            <!-- Navigation -->
            <nav>
                <!-- Logo -->
                <NuxtLink to="/">
                    <div class="flex flex-col justify-center items-center w-auto h-12">
                        <img src="/images/logo.png" class="w-full h-full object-cover" alt="system logo">
                    </div>
                </NuxtLink>

                <!-- Dropdown -->
                <div class="list">
                    <button @click="toggleProfileDropdown">
                        <img src="https://via.placeholder.com/40" alt="User" class="w-8 h-8 rounded-full" />
                        <span class="text-gray-700">Chef</span>
                    </button>
                    <!-- Dropdown -->
                    <div v-if="isProfileDropdownOpen" class="dropdown">
                        <ul>
                            <!-- <li>Profile</li>
                            <li>Settings</li> -->
                            <li @click="logout">Logout</li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const authStore = useAuthStore()
const isProfileDropdownOpen = ref(false)

const toggleProfileDropdown = () => {
    isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

const logout = async () => {
    await authStore.logout('staff', $api)
}
</script>

<style scoped lang="scss">
nav {
    @apply flex justify-start items-center space-x-2 w-full h-max;

    .nav-btn {
        @apply p-2 border border-gray-300/80 hover:border-none hover:bg-yellow-500 transition-all rounded flex items-center;
    }

    button {
        @apply flex items-center space-x-2;
    }

    .list {
        @apply relative;

        .dropdown {
            @apply absolute right-0 mt-2 w-48 bg-white rounded shadow-lg;

            ul {
                @apply p-2 bg-slate-600 rounded;

                li {
                    @apply p-1 text-white hover:bg-gray-400/70 transition-colors cursor-pointer;
                }
            }
        }
    }
}
</style>