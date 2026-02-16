<template>
  <component :is="'div'" v-bind="$attrs">
    <slot name="trigger" />
    <Teleport to="body">
      <Transition name="dialog-overlay">
        <div
          v-if="isOpen"
          class="fixed inset-0 z-50 bg-black/50"
          @click="handleOverlayClick"
        />
      </Transition>
      <Transition name="dialog-content">
        <div
          v-if="isOpen"
          class="fixed left-[50%] top-[50%] z-50 w-11/12 translate-x-[-50%] translate-y-[-50%]"
        >
          <slot />
        </div>
      </Transition>
    </Teleport>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch, provide } from 'vue'

interface Props {
  modelValue?: boolean
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  open: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:open': [value: boolean]
}>()

const internalOpen = ref(props.modelValue || props.open)

const isOpen = computed({
  get: () => internalOpen.value,
  set: (value: boolean) => {
    internalOpen.value = value
    emit('update:modelValue', value)
    emit('update:open', value)
  },
})

watch(() => props.modelValue, (newVal) => {
  internalOpen.value = newVal
})

watch(() => props.open, (newVal) => {
  internalOpen.value = newVal
})

const handleOverlayClick = () => {
  isOpen.value = false
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

provide('dialog-open', isOpen)
</script>
