# About Common Components

## Loader Component

### Props Explanation

```plaintext
Prop Name	        Type	        Default Value	        Description
isFullScreen	    Boolean	            false	        If true, the loader will cover the entire screen.
preventInteraction	Boolean	            false	        If true, prevents user interaction while the loader is active.
size	            String	            '50px'	        Size of the loader (width and height).
color	            String	            '#3498db'	    Color of the loader dots.
animationType	    String	            'bounce'	    Type of animation (bounce, rotate, or pulse).
```

### Usage Examples

-   Full-Screen Loader

```vue
<template>
    <div>
        <Loader :isFullScreen="true" :preventInteraction="true" animationType="rotate" />
    </div>
</template>

<script setup>
import Loader from '~/components/Loader.vue'
</script>
```

-   Item Loader

```vue
<template>
    <div>
        <p>Loading data...</p>
        <Loader :size="'30px'" :color="'#e74c3c'" animationType="pulse" />
    </div>
</template>

<script setup>
import Loader from '~/components/Loader.vue'
</script>
```

Final Notes
. This loader component is highly reusable and customizable.
. You can extend it further by adding more animations, sizes, or colors.
. It works seamlessly in both full-screen and item contexts.
