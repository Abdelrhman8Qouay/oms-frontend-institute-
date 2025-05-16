<template>
    <div class="min-h-screen flex flex-col">
        <div class="h-screen flex">
            <!-- Sidebar -->
            <LayoutsAdminSidebar class="h-full w-1/5 fixed top-0 left-0" />

            <div class="h-full flex flex-col w-4/5 ml-[20%]">
                <!-- Header -->
                <LayoutsAdminHeader class="border-b border-black/30" />


                <!-- Main Content -->
                <main class="flex-1 p-4 bg-gray-100">
                    <slot /> <!-- This is where the page content will be injected -->
                </main>

                <!-- Footer -->
                <LayoutsFooter />
            </div>

        </div>
    </div>
</template>