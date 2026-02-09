<template>
  <div class="checkbox-wrapper-6">
    <input
      class="tgl tgl-light"
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="toggle"
    />
    <label class="tgl-btn" :for="id"></label>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    id: string
    modelValue?: boolean
  }>(),
  {
    modelValue: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

