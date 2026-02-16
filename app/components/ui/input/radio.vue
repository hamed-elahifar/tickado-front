<template>
  <div class="checkbox-wrapper-6">
    <input
      class="tgl tgl-light"
      :id="id"
      type="checkbox"
      v-model="inputValue"
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

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue);
watch(() => inputValue.value, () => {
  emit('update:modelValue', inputValue.value)
})
</script>

