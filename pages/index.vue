<template>
    <div>
        <h1>Welcome to the homepage</h1>
        <pre>{{ data }}df</pre>
    </div>
</template>

<script setup lang="ts">
const api = useApi()
const { data } = await api.admin.getMenus({}, { immediate: true, initialData: [] })
</script>