<template>
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <!-- Logo -->
            <div class="text-2xl font-bold text-blue-600">
                🍔 Restaurant Admin
            </div>

            <!-- Navigation -->
            <nav class="flex items-center space-x-6">
                <button class="p-2 bg-gray-200 rounded">🔔 Notifications</button>
                <div class="relative">
                    <button @click="toggleProfileDropdown" class="flex items-center space-x-2">
                        <img src="https://via.placeholder.com/40" alt="User" class="w-8 h-8 rounded-full" />
                        <span class="text-gray-700">Admin</span>
                    </button>
                    <!-- Dropdown -->
                    <div v-if="isProfileDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg">
                        <ul class="p-2">
                            <li class="p-2 hover:bg-gray-50">Profile</li>
                            <li class="p-2 hover:bg-gray-50">Settings</li>
                            <li class="p-2 hover:bg-gray-50">Logout</li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
</template>

<script setup lang="ts">
const isProfileDropdownOpen = ref(false)

const toggleProfileDropdown = () => {
    isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}
</script>