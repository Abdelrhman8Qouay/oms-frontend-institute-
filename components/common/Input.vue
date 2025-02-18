<template>
    <div class="mb-4">
        <!-- Label -->
        <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700">
            {{ label }}
        </label>

        <!-- Input Field -->
        <input :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :required="required"
            :disabled="disabled" :class="[
                'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none transition-all',
                {
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500': !error,
                    'border-red-500 focus:ring-red-500 focus:border-red-500': error,
                },
                inputClass,
            ]" @input="onInput" @blur="onBlur" />

        <!-- <div v-if="type === 'password'" class="absolute right-1 top-1/2 -translate-y-1/2 text-red-500">
            <Icon name="mdi:eye" />
            <Icon  name="mdi:eye" />
        </div> -->

        <!-- Helper Text -->
        <p v-if="helperText" class="mt-[1px] text-xs text-gray-500">
            {{ helperText }}
        </p>

        <!-- Error Message -->
        <p v-if="error" class="mt-2 text-sm text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: 'text',
        validator: (value: string) =>
            ['text', 'password', 'email', 'number', 'tel', 'url'].includes(value),
    },
    modelValue: {
        type: [String, Number],
        default: '',
    },
    placeholder: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    error: {
        type: String,
        default: '',
    },
    helperText: {
        type: String,
        default: '',
    },
    inputClass: {
        type: String,
        default: '',
    },
})

// Emits
const emit = defineEmits(['update:modelValue', 'blur'])

// Handle Input
const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
}

// Handle Blur
const onBlur = () => {
    emit('blur')
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>