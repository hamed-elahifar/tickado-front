<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <UiLabel>متن سوال</UiLabel>
      <UiTextarea
        v-model="questionModel.title"
        placeholder="متن سوال را وارد کنید..."
        class="mt-1"
        rows="2"
      />
    </div>

    <div class="space-y-2">
      <UiLabel>توضیحات (اختیاری)</UiLabel>
      <UiInput
        v-model="questionModel.description"
        type="text"
        placeholder="توضیحات اضافی..."
        class="mt-1"
      />
    </div>

    <div v-if="questionSupportsMedia(questionModel.type)" class="space-y-2">
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
        v-if="questionModel.media && (questionModel.media.images.length || questionModel.media.videos.length || questionModel.media.carousel.length)"
        class="mt-3 space-y-3"
      >
        <div v-if="questionModel.media.images.length" class="flex flex-wrap gap-2">
          <img
            v-for="item in questionModel.media.images"
            :key="item.url"
            :src="item.url"
            class="h-16 w-16 rounded-md object-cover"
          />
        </div>
        <div v-if="questionModel.media.videos.length" class="flex flex-wrap gap-2">
          <video
            v-for="item in questionModel.media.videos"
            :key="item.url"
            :src="item.url"
            class="h-16 w-24 rounded-md object-cover"
            muted
            playsinline
          />
        </div>
      </div>
    </div>

    <div v-if="questionModel.type === 'long_text'" class="space-y-4">
      <div class="space-y-2">
        <UiLabel>الگوی پاسخ</UiLabel>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1">
            <UiSelect v-model="questionModel.answerPattern">
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

          <div v-if="questionModel.answerPattern === 'custom'" class="space-y-1">
            <UiInput
              v-model="questionModel.answerPatternMask"
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
            v-model.number="questionModel.maxChars"
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
            :id="`q-${questionModel.id}-respondent-media`"
            v-model="questionModel.allowRespondentMedia"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="text-xs">
            <p class="font-medium">امکان گذاشتن وویس از سمت پاسخگو</p>
          </div>
          <UiInputRadio
            :id="`q-${questionModel.id}-respondent-voice`"
            v-model="questionModel.allowRespondentVoice"
          />
        </div>
      </div>
    </div>

    <div v-if="questionHasOptions(questionModel.type)" class="space-y-3">
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
          v-for="(option, optIndex) in questionModel.options"
          :key="option.id"
          class="space-y-1"
        >
          <div class="flex items-center gap-2">
            <UiButton
              type="button"
              variant="ghost"
              size="icon"
              class="h-8 w-8 cursor-grab"
              disabled
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

    <div class="border-t pt-4 mt-2">
      <p class="text-xs font-semibold text-muted-foreground mb-3">
        تنظیمات سوال
      </p>

      <div class="grid gap-3 md:grid-cols-2">
        <div class="flex items-center justify-between gap-4">
          <div class="text-xs">
            <p class="font-medium">اجباری بودن پاسخ سوال</p>
          </div>
          <UiInputRadio
            :id="`q-${questionModel.id}-required`"
            v-model="questionModel.isRequired"
          />
        </div>

        <div class="flex items-center justify-between gap-4">
          <div class="text-xs">
            <p class="font-medium">نمایش شماره سوال</p>
          </div>
          <UiInputRadio
            :id="`q-${questionModel.id}-show-number`"
            v-model="questionModel.showNumber"
          />
        </div>

        <template v-if="['single_choice', 'multiple_choice', 'ranking', 'dropdown', 'matrix'].includes(questionModel.type)">
          <div class="flex items-center justify-between gap-4">
            <div class="text-xs">
              <p class="font-medium">تصادفی‌سازی ترتیب گزینه‌ها</p>
            </div>
            <UiInputRadio
              :id="`q-${questionModel.id}-randomize-options`"
              v-model="questionModel.randomizeOptions"
            />
          </div>

          <div class="flex items-center justify-between gap-4">
            <div class="text-xs">
              <p class="font-medium">تصادفی‌سازی تعدادی از گزینه‌ها</p>
            </div>
            <UiInputRadio
              :id="`q-${questionModel.id}-randomize-some-options`"
              v-model="questionModel.randomizeSomeOptions"
            />
          </div>

          <div class="flex items-center justify-between gap-4">
            <div class="text-xs">
              <p class="font-medium">افزودن گزینه‌های «سایر / هیچ‌کدام / همه موارد»</p>
            </div>
            <UiInputRadio
              :id="`q-${questionModel.id}-other-options`"
              v-model="questionModel.addOtherOption"
            />
          </div>

          <div class="flex items-center justify-between gap-4">
            <div class="text-xs">
              <p class="font-medium">چیدمان عمودی گزینه‌ها</p>
            </div>
            <UiInputRadio
              :id="`q-${questionModel.id}-vertical-layout`"
              v-model="questionModel.verticalLayout"
            />
          </div>

          <div v-if="questionModel.type === 'multiple_choice'" class="flex flex-col gap-2 md:col-span-2">
            <p class="text-xs font-medium">حداقل/حداکثر تعداد انتخاب</p>
            <div class="grid gap-2 md:grid-cols-2">
              <UiInput
                v-model.number="questionModel.minSelections"
                type="number"
                min="0"
                placeholder="حداقل تعداد انتخاب"
              />
              <UiInput
                v-model.number="questionModel.maxSelections"
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
</template>

<script setup lang="ts">
import { GripVertical, Plus, Trash2 } from 'lucide-vue-next'
import { questionHasOptions, questionSupportsMedia } from '@/stores/questionnaire'
import type { Question, QuestionMediaItem } from '@/stores/questionnaire'

const questionModel = defineModel<Question>({ required: true })

function addOption() {
  const lastOption = questionModel.value.options.at(-1)
  const nextId = ((lastOption && lastOption.id) ?? 0) + 1
  questionModel.value.options.push({ id: nextId, label: '' })
}

function removeOption(optionId: number) {
  questionModel.value.options = questionModel.value.options.filter((opt) => opt.id !== optionId)
}

function handleMediaChange(kind: 'image' | 'video' | 'carousel', files: File[] | null) {
  if (!files || files.length === 0) return
  const items: QuestionMediaItem[] = files.map((file) => ({ file, url: URL.createObjectURL(file) }))

  if (kind === 'image') {
    questionModel.value.media.images = items
  } else if (kind === 'video') {
    questionModel.value.media.videos = items
  } else {
    questionModel.value.media.carousel = items
  }
}
</script>
