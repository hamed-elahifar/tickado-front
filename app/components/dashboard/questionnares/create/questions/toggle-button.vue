<template>
    <div>
        <div class="flex justify-between items-center">
            <UiLabel>
                {{ label }}
            </UiLabel>
            <UiInputRadio v-model="inputValue" :id="id" />
        </div>
        <slot />
    </div>
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    id: {
        type: String, 
        required: true
    }
})

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);
watch(() => inputValue.value, () => {
  emit('update:modelValue', inputValue.value)
})
</script>