<template>
  <div class="flex items-center justify-between gap-3 rounded-md border px-3 py-2 bg-muted/30">
    <span class="text-xs font-medium text-muted-foreground">{{ label }}</span>
    <UiSwitch :model-value="value" @update:model-value="onToggle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ label: string; checked?: boolean; invert?: boolean }>()
const emit = defineEmits<{ 'update:checked': [boolean] }>()

const value = computed(() => (props.invert ? !props.checked : !!props.checked))

function onToggle(val: boolean) {
  emit('update:checked', props.invert ? !val : val)
}
</script>
