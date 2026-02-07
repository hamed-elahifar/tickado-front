<template>
  <NuxtLoadingIndicator :color="'var(--primary)'" height="5" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
const {locale} = useI18n()
const dir = computed(() => (locale.value === 'fa' ? 'rtl' : 'ltr'))

watchEffect(() => {
  document.documentElement.dir = dir.value
})
</script>