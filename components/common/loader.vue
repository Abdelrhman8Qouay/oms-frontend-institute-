<template>
    <div :class="[
        'loader',
        {
            'loader--full': isFullScreen,
            'loader--item': !isFullScreen,
            'loader--prevent-interaction': preventInteraction,
        },
    ]" :style="{
        width: size,
        height: size,
    }">
        <div v-for="i in 3" :key="i" :class="['loader__dot', `loader__dot--${animationType}`]" :style="{
            backgroundColor: color,
            animationDelay: `${i * 0.2}s`,
        }"></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
const props = defineProps({
    isFullScreen: {
        type: Boolean,
        default: false,
    },
    preventInteraction: {
        type: Boolean,
        default: false,
    },
    size: {
        type: String,
        default: '50px',
    },
    color: {
        type: String,
        default: '#3498db',
    },
    animationType: {
        type: String,
        default: 'bounce',
        validator: (value: string) => ['bounce', 'rotate', 'pulse', 'fade'].includes(value),
    },
});

// Computed
const loaderStyle = computed(() => ({
    width: props.size,
    height: props.size,
}));
</script>

<style scoped>
/* Base Loader Styles */
.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

/* Full Screen Loader */
.loader--full {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

/* Prevent Interaction */
.loader--prevent-interaction {
    pointer-events: none;
}

/* Item Loader */
.loader--item {
    display: inline-block;
}

/* Loader Dots */
.loader__dot {
    width: 20%;
    height: 20%;
    border-radius: 50%;
    margin: 0 5%;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
}

/* Bounce Animation */
.loader__dot--bounce {
    animation-name: bounce;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-100%);
    }
}

/* Rotate Animation */
.loader__dot--rotate {
    animation-name: rotate;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Pulse Animation */
.loader__dot--pulse {
    animation-name: pulse;
}

@keyframes pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
    }
}

/* Fade Animation */
.loader__dot--fade {
    animation-name: fade;
}

@keyframes fade {

    0%,
    100% {
        opacity: 0.2;
    }

    50% {
        opacity: 1;
    }
}
</style>