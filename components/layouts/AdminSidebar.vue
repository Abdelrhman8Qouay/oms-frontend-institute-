<template>
    <aside class="w-64 bg-white shadow-md">
        <nav class="p-4">
            <ul class="space-y-2">
                <li>
                    <NuxtLink :to="link_map.head" class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
                        📊 Dashboard
                    </NuxtLink>
                </li>

                <CommonCollapsibleMenu title="Menu Management" icon="🍽️" :defaultOpen="false">
                    <li>
                        <NuxtLink :to="link_map.menu(false)"
                            class="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded text-sm">
                            Show All
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="link_map.menu(true)"
                            class="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded text-sm">
                            Create One
                        </NuxtLink>
                    </li>
                </CommonCollapsibleMenu>

                <li>
                    <NuxtLink :to="link_map.orders(false)"
                        class="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
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

<script lang="ts" setup>

const link_map = {
    head: "/dashboard",
    menu: (create: boolean) => create ? `${link_map.head}/menus/create` : `${link_map.head}/menus/`,
    orders: (create: boolean) => create ? `${link_map.head}/orders/create` : `${link_map.head}/orders/`,
}

</script>