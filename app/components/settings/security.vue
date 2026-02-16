<script setup lang="ts">
import { computed, ref } from "vue"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Lock } from "lucide-vue-next"

const isTwoFactorEnabled = ref(true)
const isSaving = ref(false)

const toggleTwoFactor = () => {
  isTwoFactorEnabled.value = !isTwoFactorEnabled.value
}

const toggleContainerClass = computed(() =>
  cn(
    "relative inline-flex h-8 w-16 items-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    isTwoFactorEnabled.value ? "border-primary/80 bg-primary/10" : "border-border bg-muted/60",
  ),
)

const toggleHandleClass = computed(() =>
  cn(
    "absolute left-0 top-0 h-8 w-8 rounded-full bg-white shadow transition-transform duration-200",
    isTwoFactorEnabled.value ? "translate-x-8" : "translate-x-0",
  ),
)

const statusLabel = computed(() => (isTwoFactorEnabled.value ? "فعال است" : "غیرفعال است"))

const handleSave = async () => {
  if (isSaving.value) {
    return
  }
  isSaving.value = true
  await new Promise<void>((resolve) => setTimeout(resolve, 450))
  isSaving.value = false
}
</script>

<template>
  <Card class="w-full space-y-4">
    <CardHeader class="space-y-2 text-right">
      <CardTitle class="text-2xl">تنظیمات امنیتی</CardTitle>
      <CardDescription>کنترل ورود، دستگاه‌ها و اعتبارسنجی حساب در یک نگاه</CardDescription>
    </CardHeader>

    <CardContent class="px-6">
      <div class="flex flex-col gap-4 rounded-2xl border border-border bg-muted/40 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="text-right">
          <p class="text-lg font-semibold text-foreground">احراز هویت دو مرحله‌ای</p>
          <p class="text-sm text-muted-foreground">افزایش امنیت با تایید دو مرحله‌ای در زمان ورود</p>
        </div>

        <div class="flex flex-col items-end gap-2">
          <span class="text-sm font-semibold text-foreground">{{ statusLabel }}</span>
          <UiInputRadio />
        </div>
      </div>
    </CardContent>

    <CardFooter class="justify-end">
      <Button variant="default" size="default" class="gap-2 px-6" :disabled="isSaving" @click="handleSave">
        <template v-if="!isSaving">
          <Lock class="size-4" />
          ذخیره
        </template>
        <UiLoadingSpinner v-else />
      </Button>
    </CardFooter>
  </Card>
</template>