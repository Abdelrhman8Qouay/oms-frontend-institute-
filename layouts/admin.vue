<template>
    <div class="min-h-screen flex flex-col">
        <!-- Header -->
        <LayoutsAdminHeader />

        <div class="flex flex-1">
            <!-- Sidebar -->
            <LayoutsAdminSidebar />

            <!-- Main Content -->
            <main class="flex-1 p-6 bg-gray-100">
                <slot /> <!-- This is where the page content will be injected -->
            </main>
        </div>

        <!-- Footer -->
        <LayoutsAdminFooter />
    </div>
</template>