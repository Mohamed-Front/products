<template>
 <!-- <img src="../assets/logo.png" class="w-[51px] mx-3 h-[30px]" > -->
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useColors } from 'vuestic-ui'
  const { getColor, shiftHSLAColor } = useColors()

  const props = withDefaults(
    defineProps<{
      height?: number | string
      color?: string
    }>(),
    {
      height: 16,
      color: 'primary',
    },
  )

  const colorsComputed = computed(() => {
    const color = getColor(props.color, 'primary')
    return { start: color, end: shiftHSLAColor(color, { l: -20 }) }
  })
</script>
