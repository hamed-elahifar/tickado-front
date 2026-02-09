<template>
  <div class="relative">
    <UiCard class="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold">
            پیش‌نمایش پرسشنامه
          </h2>
          <p class="text-xs text-muted-foreground mt-1">
            نمایش تقریبی برای پاسخ‌دهنده (الهام‌گرفته از گوگل فرم)
          </p>
        </div>
        <UiButton variant="ghost" size="icon" @click="emit('close')">
          <X class="h-4 w-4" />
        </UiButton>
      </div>

      <div
        v-if="questions && questions.length"
        class="space-y-6 border-t pt-4"
      >
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="space-y-3 border-b pb-4 last:border-b-0 last:pb-0"
        >
          <div class="flex items-start gap-2">
            <span
              v-if="question.showNumber !== false"
              class="mt-0.5 text-xs text-muted-foreground"
            >
              {{ index + 1 }}.
            </span>
            <div class="space-y-1">
              <p class="text-sm font-medium">
                {{ question.title || `سوال ${index + 1}` }}
                <span v-if="question.isRequired" class="text-destructive">*</span>
              </p>
              <p v-if="question.description" class="text-xs text-muted-foreground">
                {{ question.description }}
              </p>
            </div>
          </div>

          <!-- Media preview -->
          <div
            v-if="question.media && (question.media.images?.length || question.media.videos?.length)"
            class="flex flex-wrap gap-2"
          >
            <img
              v-for="item in question.media.images || []"
              :key="item.url"
              :src="item.url"
              class="h-20 w-20 rounded-md object-cover"
            />
            <video
              v-for="item in question.media.videos || []"
              :key="item.url"
              :src="item.url"
              class="h-20 w-32 rounded-md object-cover"
              controls
            />
          </div>

          <!-- Answer UI -->
          <div class="mt-1">
            <!-- Long text -->
            <UiTextarea
              v-if="question.type === 'long_text'"
              placeholder="پاسخ خود را اینجا بنویسید..."
              rows="3"
            />

            <!-- Single choice -->
            <div v-else-if="question.type === 'single_choice'" class="space-y-2">
              <label
                v-for="opt in question.options"
                :key="opt.id"
                class="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  :name="`q-${question.id}`"
                  class="h-4 w-4 text-primary"
                />
                <span>{{ opt.label || 'گزینه بدون نام' }}</span>
              </label>
            </div>

            <!-- Multiple choice -->
            <div v-else-if="question.type === 'multiple_choice'" class="space-y-2">
              <label
                v-for="opt in question.options"
                :key="opt.id"
                class="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  class="h-4 w-4 text-primary"
                />
                <span>{{ opt.label || 'گزینه بدون نام' }}</span>
              </label>
            </div>

            <!-- Dropdown -->
            <UiSelect v-else-if="question.type === 'dropdown'">
              <UiSelectTrigger class="w-full">
                <UiSelectValue placeholder="یک گزینه انتخاب کنید" />
              </UiSelectTrigger>
              <UiSelectContent>
                <UiSelectItem
                  v-for="opt in question.options"
                  :key="opt.id"
                  :value="String(opt.id)"
                >
                  {{ opt.label || 'گزینه بدون نام' }}
                </UiSelectItem>
              </UiSelectContent>
            </UiSelect>

            <!-- Fallback for other types -->
            <p v-else class="text-xs text-muted-foreground italic">
              پیش‌نمایش این نوع سوال به زودی اضافه می‌شود.
            </p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-sm text-muted-foreground">
        هنوز سوالی برای پیش‌نمایش وجود ندارد.
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

type QuestionType =
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'ranking'
  | 'dropdown'
  | 'scale'
  | 'rating'
  | 'content_block'
  | 'matrix'
  | 'file_upload'
  | 'geo_location'

interface QuestionMediaItem {
  file?: File
  url: string
}

interface QuestionMedia {
  images?: QuestionMediaItem[]
  videos?: QuestionMediaItem[]
  carousel?: QuestionMediaItem[]
}

interface QuestionOption {
  id: number
  label: string
}

interface Question {
  id: number
  type: QuestionType
  title: string
  description: string
  options: QuestionOption[]
  isRequired?: boolean
  showNumber?: boolean
  media?: QuestionMedia
}

const props = defineProps<{
  questions: Question[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

