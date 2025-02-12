<template>
    <aside class="w-64 bg-white shadow-md">
        <nav class="p-4">
            <ul class="space-y-2">
                <li>
                    <NuxtLink to="/dashboard" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                        📊 Dashboard
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/menu" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                        🍽️ Menu Management
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/orders" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                        🛒 Orders
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/reports" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                        📈 Reports
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/settings" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                        ⚙️ Settings
                    </NuxtLink>
                </li>
            </ul>
        </nav>
    </aside>
</template>