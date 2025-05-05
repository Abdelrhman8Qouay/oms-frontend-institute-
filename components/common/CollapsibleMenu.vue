<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    },
    defaultOpen: {
        type: Boolean,
        default: false
    }
});

const isOpen = ref(props.defaultOpen);
const toggle = () => {
    isOpen.value = !isOpen.value;
};
</script>

<template>
    <div>
        <button @click="toggle" class="flex items-center justify-between w-full p-2 rounded transition-colors">
            <div class="flex items-center">
                <Icon v-if="icon" :name="icon" class="mr-2" />
                <span>{{ title }}</span>
            </div>
            <Icon name="chevron-down" class="transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
        </button>

        <div v-show="isOpen" class="pl-6 mt-1 space-y-1">
            <ul class="space-y-1">
                <slot />
            </ul>
        </div>
    </div>
</template>