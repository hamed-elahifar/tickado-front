<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <th :class="cn('h-10 sm:h-12 px-2 sm:px-4 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&:has([role=checkbox])]:rtl:pl-0 [&:has([role=checkbox])]:rtl:pr-0 text-xs sm:text-sm', props.class)">
    <slot />
  </th>
</template>
