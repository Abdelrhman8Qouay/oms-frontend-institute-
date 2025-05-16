<template>
    <aside class="bg-[var(--admin-color)] shadow-md">
        <nav class="p-6">
            <!-- Logo -->
            <div class="text-2xl mb-10 font-bold text-blue-600 flex flex-col justify-center items-center">
                <img src="/images/logo.png" class="w-13 aspect-auto object-cover" alt="system logo">
            </div>

            <!-- Sidebar Menu -->
            <ul class="space-y-2 text-white">
                <li>
                    <NuxtLink :to="link_map.head" class="itemA">
                        <Icon name="mdi:view-dashboard-outline" class="mr-2" /> Dashboard
                    </NuxtLink>
                </li>

                <CommonCollapsibleMenu title="Menu Management" icon="mdi:format-list-bulleted-square"
                    class="hover:bg-gray-200/20 rounded text-base" :defaultOpen="false">
                    <li>
                        <NuxtLink :to="link_map.menu(false)" class="itemB">
                            Show All
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink :to="link_map.menu(true)" class="itemB">
                            Create One
                        </NuxtLink>
                    </li>
                </CommonCollapsibleMenu>

                <li>
                    <NuxtLink :to="link_map.orders(false)" class="itemA">
                        <Icon name="mdi:clipboard-text-search-outline" class="mr-2" /> Orders
                    </NuxtLink>
                </li>
                <!-- <li>
                    <NuxtLink to="/reports" class="itemA">
                        📈 Reports
                    </NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/settings" class="itemA">
                        ⚙️ Settings
                    </NuxtLink>
                </li> -->
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
<style lang="scss">
.itemA {
    @apply flex items-center p-2 hover:bg-gray-200/20 rounded text-base;
}

.itemB {
    @apply flex items-center p-2 hover:bg-gray-200/20 rounded text-sm;
}
</style>