<template>
    <div class="checkbox-wrapper-4">
        <input class="inp-cbx" :id="id" type="checkbox" :checked="inputVal"
        @change="changed"/>
        <label class="cbx !flex gap-x-2" :for="id">
            <span>
                <svg width="12px" height="10px">
                    <use xlink:href="#check-4"></use>
                </svg>
            </span>
            <span class=" text-sm">{{ label }}</span>
        </label>
        <svg class="inline-svg">
            <symbol id="check-4" viewbox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </symbol>
        </svg>
    </div>
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        required: true
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})
const inputVal = ref(props.modelValue)
const emit = defineEmits(['update:modelValue', 'change'])

const changed = () => {
    emit('update:modelValue', !props.modelValue)
    emit('change')
}
</script>