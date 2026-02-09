<template>
  <label
    :for="id"
    class="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
  >
    <slot>{{ label }}</slot>
    <input
      :id="id"
      ref="inputEl"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      @change="onChange"
    />
  </label>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    accept?: string
    multiple?: boolean
  }>(),
  {
    label: 'انتخاب فایل',
    accept: '',
    multiple: false
  }
)

const emit = defineEmits<{
  (e: 'change', value: File[] | null): void
}>()

const inputEl = ref<HTMLInputElement | null>(null)
const id = `file-upload-${Math.random().toString(36).slice(2, 9)}`

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) {
    emit('change', null)
    return
  }
  emit('change', Array.from(target.files))
}
</script>

