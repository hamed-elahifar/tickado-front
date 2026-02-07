<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <td
    :class="
      cn(
        'p-2 sm:p-4 align-middle [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:rtl:pl-0 [&:has([role=checkbox])]:rtl:pr-0 text-xs sm:text-sm',
        props.class,
      )
    "
  >
    <slot />
  </td>
</template>
