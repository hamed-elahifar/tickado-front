<template>
  <div
    class="fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] 
    border border-border bg-background p-6 shadow-lg duration-200 rounded-lg"
    @click.stop
  >
    <button
      type="button"
      @click="closeDialog"
      class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-4 w-4"
      >
        <path d="M18 6l-12 12M6 6l12 12" />
      </svg>
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const dialogOpen = inject<any>('dialog-open')

const closeDialog = () => {
  if (dialogOpen) {
    dialogOpen.value = false
  }
}
</script>
