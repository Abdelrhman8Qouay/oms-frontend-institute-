
<template>
    <div>
        <div class="container_content py-52">
            <div class="text-4xl text-center text-white font-semibold">Error Code: {{ props.error.statusCode }}</div>
            <div class="text-2xl text-pink-600">Error Message: {{ props.error.message }}</div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps(['error']);

// await navigateTo('/');

</script>

<style lang="scss"></style>