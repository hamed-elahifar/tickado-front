<template>
  <UiCard
    class="overflow-hidden"
    draggable="true"
    @dragstart="handleDragStart"
    @dragover.prevent
    @drop="handleDrop"
    @dragend="handleDragEnd"
  >
    <!-- Card header -->
    <div class="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
      <div class="flex items-center gap-3">
        <UiButton
          type="button"
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          @click="toggleQuestion"
        >
          <ChevronUp v-if="question.expanded" class="h-4 w-4" />
          <ChevronDown v-else class="h-4 w-4" />
        </UiButton>

        <div
          v-if="meta"
          class="flex h-9 w-9 items-center justify-center rounded-lg"
          :class="meta.tone"
        >
          <component
            :is="meta.icon"
            class="h-4 w-4"
          />
        </div>

        <div>
          <p class="text-sm font-semibold">
            سوال {{ index + 1 }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ meta?.label ?? '' }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <UiButton
          type="button"
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          @click="duplicateQuestion"
        >
          <Copy class="h-4 w-4" />
        </UiButton>
        <UiButton
          type="button"
          variant="ghost"
          size="icon"
          class="h-8 w-8 text-destructive hover:text-destructive"
          @click="removeQuestion"
        >
          <Trash2 class="h-4 w-4" />
        </UiButton>
      </div>
    </div>

    <!-- Card body -->
    <transition name="fade-slide">
      <div v-if="question.expanded" class="space-y-4 p-4">
        <div class="space-y-2">
          <UiLabel>متن سوال</UiLabel>
          <UiTextarea
            v-model="question.title"
            placeholder="متن سوال را وارد کنید..."
            class="mt-1"
            rows="2"
          />
        </div>

        <div class="space-y-2">
          <UiLabel>توضیحات (اختیاری)</UiLabel>
          <UiInput
            v-model="question.description"
            type="text"
            placeholder="توضیحات اضافی..."
            class="mt-1"
          />
        </div>

        <!-- Media block (image / video / carousel) -->
        <div
          v-if="questionSupportsMedia(question.type)"
          class="space-y-2"
        >
          <UiLabel>مدیا سوال</UiLabel>
          <div class="flex flex-wrap items-center gap-2">
            <UiInputFileUpload
              label="آپلود تصویر"
              accept="image/*"
              @change="(files) => handleMediaChange('image', files)"
            />
            <UiInputFileUpload
              label="آپلود ویدیو"
              accept="video/*"
              @change="(files) => handleMediaChange('video', files)"
            />
            <UiInputFileUpload
              label="افزودن کاروسل"
              accept="image/*"
              multiple
              @change="(files) => handleMediaChange('carousel', files)"
            />
          </div>
          <div
            v-if="
              question.media &&
              (question.media.images.length || question.media.videos.length || question.media.carousel.length)
            "
            class="mt-3 space-y-3"
          >
            <div v-if="question.media.images.length" class="flex flex-wrap gap-2">
              <img
                v-for="item in question.media.images"
                :key="item.url"
                :src="item.url"
                class="h-16 w-16 rounded-md object-cover"
              />
            </div>
            <div v-if="question.media.videos.length" class="flex flex-wrap gap-2">
              <video
                v-for="item in question.media.videos"
                :key="item.url"
                :src="item.url"
                class="h-16 w-24 rounded-md object-cover"
                muted
                playsinline
              />
            </div>
          </div>
        </div>

        <!-- Answer pattern / extra settings for long text questions -->
        <div v-if="question.type === 'long_text'" class="space-y-4">
          <div class="space-y-2">
            <UiLabel>الگوی پاسخ</UiLabel>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-1">
                <UiSelect v-model="question.answerPattern">
                  <UiSelectTrigger class="w-full">
                    <UiSelectValue placeholder="انتخاب الگو" />
                  </UiSelectTrigger>
                  <UiSelectContent>
                    <UiSelectItem value="free">متن آزاد</UiSelectItem>
                    <UiSelectItem value="date">تاریخ</UiSelectItem>
                    <UiSelectItem value="phone">شماره موبایل</UiSelectItem>
                    <UiSelectItem value="numeric">
                      کاراکترهای عددی (کد ملی، کد پستی و ...)
                    </UiSelectItem>
                    <UiSelectItem value="time">زمان</UiSelectItem>
                    <UiSelectItem value="custom">الگوی دلخواه</UiSelectItem>
                  </UiSelectContent>
                </UiSelect>
              </div>

              <div v-if="question.answerPattern === 'custom'" class="space-y-1">
                <UiInput
                  v-model="question.answerPatternMask"
                  type="text"
                  placeholder="مثال: 999-999-9999"
                />
                <p class="text-xs text-muted-foreground">
                  الگوی دلخواه ورودی (ماسک)
                </p>
              </div>
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-1">
              <UiLabel>محدودیت تعداد کاراکتر پاسخ</UiLabel>
              <UiInput
                v-model.number="question.maxChars"
                type="number"
                min="1"
                placeholder="بدون محدودیت"
              />
              <p class="text-xs text-muted-foreground">
                در صورت خالی بودن، محدودیتی برای طول پاسخ اعمال نمی‌شود.
              </p>
            </div>
          </div>

          <div class="grid gap-3 md:grid-cols-2">
            <div class="flex items-center justify-between">
              <div class="text-xs">
                <p class="font-medium">آپلود عکس/ویدیو از سمت پاسخگو</p>
              </div>
              <UiInputRadio
                :id="`q-${question.id}-respondent-media`"
                v-model="question.allowRespondentMedia"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="text-xs">
                <p class="font-medium">امکان گذاشتن وویس از سمت پاسخگو</p>
              </div>
              <UiInputRadio
                :id="`q-${question.id}-respondent-voice`"
                v-model="question.allowRespondentVoice"
              />
            </div>
          </div>
        </div>

        <!-- Options -->
        <div v-if="questionHasOptions(question.type)" class="space-y-3">
          <div class="flex items-center justify-between">
            <UiLabel>گزینه‌ها</UiLabel>
            <UiButton
              type="button"
              variant="ghost"
              size="sm"
              class="text-xs"
              @click="addOption"
            >
              <Plus class="ml-1 h-3 w-3" />
              افزودن گزینه
            </UiButton>
          </div>

          <div class="space-y-2">
            <div
              v-for="(option, optIndex) in question.options"
              :key="option.id"
              class="space-y-1"
            >
              <div class="flex items-center gap-2">
                <UiButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 cursor-grab"
                >
                  <GripVertical class="h-4 w-4 text-muted-foreground" />
                </UiButton>
                <span class="w-8 text-xs text-muted-foreground text-center">
                  {{ optIndex + 1 }}
                </span>
                <UiInput
                  v-model="option.label"
                  type="text"
                  :placeholder="`عنوان گزینه ${optIndex + 1}`"
                  class="flex-1"
                />
                <UiButton
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="h-8 w-8 text-destructive hover:text-destructive"
                  @click="removeOption(option.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </UiButton>
              </div>

              <div class="pl-14 flex flex-wrap items-center gap-3 text-xs">
                <div class="flex items-center gap-1">
                  <UiInput
                    v-model.number="option.score"
                    type="number"
                    class="h-7 w-24 text-xs"
                    placeholder="امتیاز"
                  />
                </div>
                <div class="flex items-center gap-1">
                  <UiSwitch v-model="option.lockRandomization" />
                  <span class="text-muted-foreground">قفل تصادفی‌سازی</span>
                </div>
                <div class="flex items-center gap-1">
                  <UiSwitch v-model="option.isStarred" />
                  <span class="text-muted-foreground">ستاره‌دار</span>
                </div>
                <div class="flex items-center gap-1">
                  <UiSwitch v-model="option.isDefault" />
                  <span class="text-muted-foreground">گزینه پیش‌فرض</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Question settings -->
        <div class="border-t pt-4 mt-2">
          <p class="text-xs font-semibold text-muted-foreground mb-3">
            تنظیمات سوال
          </p>

          <div class="grid gap-3 md:grid-cols-2">
            <!-- Required / show number -->
            <div class="flex items-center justify-between gap-4">
              <div class="text-xs">
                <p class="font-medium">اجباری بودن پاسخ سوال</p>
              </div>
              <UiInputRadio
                :id="`q-${question.id}-required`"
                v-model="question.isRequired"
              />
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="text-xs">
                <p class="font-medium">نمایش شماره سوال</p>
              </div>
              <UiInputRadio
                :id="`q-${question.id}-show-number`"
                v-model="question.showNumber"
              />
            </div>

            <!-- Choice-based settings -->
            <template
              v-if="
                ['single_choice', 'multiple_choice', 'ranking', 'dropdown', 'matrix'].includes(
                  question.type
                )
              "
            >
              <div class="flex items-center justify-between gap-4">
                <div class="text-xs">
                  <p class="font-medium">تصادفی‌سازی ترتیب گزینه‌ها</p>
                </div>
                <UiInputRadio
                  :id="`q-${question.id}-randomize-options`"
                  v-model="question.randomizeOptions"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <div class="text-xs">
                  <p class="font-medium">تصادفی‌سازی تعدادی از گزینه‌ها</p>
                </div>
                <UiInputRadio
                  :id="`q-${question.id}-randomize-some-options`"
                  v-model="question.randomizeSomeOptions"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <div class="text-xs">
                  <p class="font-medium">افزودن گزینه‌های «سایر / هیچ‌کدام / همه موارد»</p>
                </div>
                <UiInputRadio
                  :id="`q-${question.id}-other-options`"
                  v-model="question.addOtherOption"
                />
              </div>

              <div class="flex items-center justify-between gap-4">
                <div class="text-xs">
                  <p class="font-medium">چیدمان عمودی گزینه‌ها</p>
                </div>
                <UiInputRadio
                  :id="`q-${question.id}-vertical-layout`"
                  v-model="question.verticalLayout"
                />
              </div>

              <div
                v-if="question.type === 'multiple_choice'"
                class="flex flex-col gap-2 md:col-span-2"
              >
                <p class="text-xs font-medium">حداقل/حداکثر تعداد انتخاب</p>
                <div class="grid gap-2 md:grid-cols-2">
                  <UiInput
                    v-model.number="question.minSelections"
                    type="number"
                    min="0"
                    placeholder="حداقل تعداد انتخاب"
                  />
                  <UiInput
                    v-model.number="question.maxSelections"
                    type="number"
                    min="0"
                    placeholder="حداکثر تعداد انتخاب"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </transition>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Copy, Trash2, ChevronDown, ChevronUp, GripVertical, Plus } from 'lucide-vue-next'
import { useQuestionnaireStore, questionHasOptions, questionSupportsMedia } from '~/stores/questionnaire'
import type { Question } from '~/stores/questionnaire'
import { getQuestionMeta } from './question-types'

const props = defineProps<{
  question: Question
  index: number
}>()

const questionnaireStore = useQuestionnaireStore()
const meta = computed(() => getQuestionMeta(props.question.type))

function toggleQuestion() {
  questionnaireStore.toggleQuestion(props.question.id)
}

function duplicateQuestion() {
  questionnaireStore.duplicateQuestion(props.question.id)
}

function removeQuestion() {
  questionnaireStore.removeQuestion(props.question.id)
}

function addOption() {
  questionnaireStore.addOption(props.question.id)
}

function removeOption(optionId: number) {
  questionnaireStore.removeOption(props.question.id, optionId)
}

function handleMediaChange(
  kind: 'image' | 'video' | 'carousel',
  files: File[] | null
) {
  questionnaireStore.handleMediaChange(props.question.id, kind, files)
}

function handleDragStart() {
  questionnaireStore.handleDragStart(props.index)
}

function handleDrop() {
  questionnaireStore.handleDrop(props.index)
}

function handleDragEnd() {
  questionnaireStore.handleDragEnd()
}
</script>
