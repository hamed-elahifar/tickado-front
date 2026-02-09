<template>
  <div class="grid gap-6 lg:grid-cols-4">

    <!-- Question types sidebar -->
    <div>
      <UiCard class="space-y-4 p-4">
        <div>
          <p class="text-sm font-semibold">
            انواع سوال
          </p>
          <p class="mt-1 text-xs text-muted-foreground">
            نوع سوال مورد نظر را انتخاب کنید و به پرسشنامه اضافه کنید.
          </p>
        </div>

        <div class="space-y-2">
          <UiButton
            v-for="type in questionTypes"
            :key="type.type"
            type="button"
            variant="outline"
            class="flex w-full items-center justify-between"
            @click="addQuestion(type.type)"
          >
            <span class="text-sm">
              {{ type.label }}
            </span>
            <Plus class="h-4 w-4" />
          </UiButton>
        </div>
      </UiCard>
    </div>

    <!-- Questions list -->
    <div class="space-y-4 col-span-3">
      <UiCard class="p-4">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold">
              سوالات پرسشنامه
            </p>
            <p class="text-xs text-muted-foreground mt-1">
              سوالات را اضافه، ویرایش و مرتب‌سازی کنید.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <UiButton
              size="sm"
              variant="outline"
              class="gap-2"
              @click="isPreviewMode = !isPreviewMode"
            >
              <Eye class="ml-1 h-4 w-4" />
              <span>{{ isPreviewMode ? 'خروج از پیش‌نمایش' : 'پیش‌نمایش پرسشنامه' }}</span>
            </UiButton>
            <UiButton size="sm" variant="outline" @click="addQuestion('long_text')">
              <Plus class="ml-2 h-4 w-4" />
              افزودن سوال
            </UiButton>
          </div>
        </div>
      </UiCard>

      <DashboardQuestionnaresCreateDemo
        v-if="isPreviewMode"
        class="mt-2"
        :questions="questions"
        @close="isPreviewMode = false"
      />

      <div v-if="questions.length && !isPreviewMode" class="space-y-4">
        <UiCard
          v-for="(question, index) in questions"
          :key="question.id"
          class="overflow-hidden"
          draggable="true"
          @dragstart="handleQuestionDragStart(index)"
          @dragover.prevent
          @drop="handleQuestionDrop(index)"
          @dragend="handleQuestionDragEnd"
        >
          <!-- Card header -->
          <div class="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
            <div class="flex items-center gap-3">
              <UiButton
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="toggleQuestion(question.id)"
              >
                <ChevronUp v-if="question.expanded" class="h-4 w-4" />
                <ChevronDown v-else class="h-4 w-4" />
              </UiButton>

              <div>
                <p class="text-sm font-semibold">
                  سوال {{ index + 1 }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ getQuestionTypeLabel(question.type) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <UiButton
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                @click="duplicateQuestion(question.id)"
              >
                <Copy class="h-4 w-4" />
              </UiButton>
              <UiButton
                type="button"
                variant="ghost"
                size="icon"
                class="h-8 w-8 text-destructive hover:text-destructive"
                @click="removeQuestion(question.id)"
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
                    @change="(files) => handleMediaChange(question.id, 'image', files)"
                  />
                  <UiInputFileUpload
                    label="آپلود ویدیو"
                    accept="video/*"
                    @change="(files) => handleMediaChange(question.id, 'video', files)"
                  />
                  <UiInputFileUpload
                    label="افزودن کاروسل"
                    accept="image/*"
                    multiple
                    @change="(files) => handleMediaChange(question.id, 'carousel', files)"
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
                    @click="addOption(question.id)"
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
                        @click="removeOption(question.id, option.id)"
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
      </div>

      <div v-else-if="!isPreviewMode">
        <UiCard class="flex flex-col items-center justify-center gap-3 border-dashed py-10">
          <p class="text-sm font-medium text-muted-foreground">
            هنوز سوالی اضافه نشده است.
          </p>
          <UiButton size="sm" @click="addQuestion('long_text')">
            <Plus class="ml-2 h-4 w-4" />
            افزودن اولین سوال
          </UiButton>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trash2, Copy, ChevronDown, ChevronUp, GripVertical, Eye } from 'lucide-vue-next'

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
  file: File
  url: string
}

interface QuestionMedia {
  images: QuestionMediaItem[]
  videos: QuestionMediaItem[]
  carousel: QuestionMediaItem[]
}

interface QuestionOption {
  id: number
  /**
   * عنوان اصلی گزینه (نمایش در کنار رادیو/چک‌باکس/لیست)
   */
  label: string
  /**
   * متن توضیحی گزینه (اختیاری)
   */
  text?: string
  /**
   * امتیاز گزینه
   */
  score?: number
  /**
   * قفل تصادفی‌سازی برای این گزینه
   */
  lockRandomization?: boolean
  /**
   * آیا گزینه به‌صورت ویژه (ستاره‌دار) نمایش داده شود؟
   */
  isStarred?: boolean
  /**
   * گزینه پیش‌فرض انتخاب‌شده
   */
  isDefault?: boolean
}

interface Question {
  id: number
  type: QuestionType
  title: string
  description: string
  options: QuestionOption[]
  media: QuestionMedia

  // تنظیمات عمومی سوال
  isRequired: boolean
  showNumber: boolean

  // تنظیمات مربوط به پاسخ متنی
  answerPattern?: 'free' | 'date' | 'phone' | 'numeric' | 'time' | 'custom'
  answerPatternMask?: string
  maxChars?: number
  allowRespondentMedia?: boolean
  allowRespondentVoice?: boolean

  // تنظیمات مربوط به سوالات گزینه‌ای/ماتریسی و ...
  randomizeOptions: boolean
  randomizeSomeOptions?: boolean
  addOtherOption?: boolean
  addNoneOption?: boolean
  addAllOption?: boolean
  addOptionLabels?: boolean
  hideOptionLabels?: boolean
  allowMultiple?: boolean
  minSelections?: number
  maxSelections?: number
  verticalLayout?: boolean

  expanded: boolean
}

const questionTypes: { type: QuestionType; label: string }[] = [
  { type: 'long_text', label: 'متن طولانی' },
  { type: 'single_choice', label: 'تک انتخابی' },
  { type: 'multiple_choice', label: 'چند انتخابی' },
  { type: 'ranking', label: 'رتبه‌بندی' },
  { type: 'dropdown', label: 'لیست کشویی' },
  { type: 'scale', label: 'مقیاس' },
  { type: 'rating', label: 'امتیازی' },
  { type: 'content_block', label: 'بلوک محتوا' },
  { type: 'matrix', label: 'ماتریس' },
  { type: 'file_upload', label: 'آپلود فایل' },
  { type: 'geo_location', label: 'موقعیت مکانی' }
]

const questions = ref<Question[]>([
  createQuestion('long_text'),
  createQuestion('single_choice')
])

const isPreviewMode = ref(false)

function createQuestion(type: QuestionType): Question {
  const hasOptions = questionHasOptions(type)

  const base: Question = {
    id: Date.now() + Math.random(),
    type,
    title: '',
    description: '',
    options: hasOptions
      ? [
          { id: 1, label: '' },
          { id: 2, label: '' }
        ]
      : [],
    media: {
      images: [],
      videos: [],
      carousel: []
    },
    // عمومی
    isRequired: false,
    showNumber: true,
    // پاسخ متنی
    answerPattern: type === 'long_text' ? 'free' : undefined,
    answerPatternMask: undefined,
    maxChars: undefined,
    allowRespondentMedia: type === 'long_text' ? false : undefined,
    allowRespondentVoice: type === 'long_text' ? false : undefined,
    // گزینه‌ای
    randomizeOptions: false,
    randomizeSomeOptions: false,
    addOtherOption: false,
    addNoneOption: false,
    addAllOption: false,
    addOptionLabels: true,
    hideOptionLabels: false,
    allowMultiple: type === 'multiple_choice',
    minSelections: undefined,
    maxSelections: undefined,
    verticalLayout: true,
    expanded: true
  }

  return base
}

function addQuestion(type: QuestionType) {
  // فقط جعبه سوالی که تازه اضافه می‌شود باز بماند
  questions.value.forEach((q) => {
    q.expanded = false
  })
  const created = createQuestion(type)
  questions.value.push(created)
}

function removeQuestion(id: number) {
  questions.value = questions.value.filter((q) => q.id !== id)
}

function duplicateQuestion(id: number) {
  const original = questions.value.find((q) => q.id === id)
  if (!original) return

  const cloned: Question = {
    ...original,
    options: original.options.map((opt) => ({ ...opt })),
    id: Date.now() + Math.random(),
    expanded: true
  }

  const index = questions.value.findIndex((q) => q.id === id)
  questions.value.splice(index + 1, 0, cloned)
}

function toggleQuestion(id: number) {
  let target: Question | undefined
  questions.value.forEach((q) => {
    if (q.id === id) {
      target = q
    } else {
      q.expanded = false
    }
  })

  if (!target) return
  target.expanded = !target.expanded
}

function questionHasOptions(type: QuestionType) {
  return ['single_choice', 'multiple_choice', 'ranking', 'dropdown', 'scale', 'rating', 'matrix'].includes(
    type
  )
}

function addOption(questionId: number) {
  const question = questions.value.find((q) => q.id === questionId)
  if (!question) return

  const lastOption = question.options.length ? question.options[question.options.length - 1] : undefined
  const nextId = ((lastOption && lastOption.id) ?? 0) + 1
  question.options.push({ id: nextId, label: '' })
}

function removeOption(questionId: number, optionId: number) {
  const question = questions.value.find((q) => q.id === questionId)
  if (!question) return

  question.options = question.options.filter((opt) => opt.id !== optionId)
}

function getQuestionTypeLabel(type: QuestionType) {
  return questionTypes.find((item) => item.type === type)?.label ?? ''
}

const draggingQuestionIndex = ref<number | null>(null)

function handleQuestionDragStart(index: number) {
  draggingQuestionIndex.value = index
}

function handleQuestionDrop(targetIndex: number) {
  const sourceIndex = draggingQuestionIndex.value
  if (sourceIndex === null || sourceIndex === targetIndex) return

  const list = questions.value
  const [moved] = list.splice(sourceIndex, 1)
  if (!moved) {
    draggingQuestionIndex.value = null
    return
  }
  list.splice(targetIndex, 0, moved)
  draggingQuestionIndex.value = null
}

function handleQuestionDragEnd() {
  draggingQuestionIndex.value = null
}

function questionSupportsMedia(type: QuestionType) {
  return ['long_text', 'single_choice', 'multiple_choice', 'ranking', 'dropdown', 'scale', 'rating', 'content_block', 'matrix'].includes(
    type
  )
}

function handleMediaChange(
  questionId: number,
  kind: 'image' | 'video' | 'carousel',
  files: File[] | null
) {
  const question = questions.value.find((q) => q.id === questionId)
  if (!question || !files || files.length === 0) return

  const items: QuestionMediaItem[] = files.map((file) => ({
    file,
    url: URL.createObjectURL(file)
  }))

  if (kind === 'image') {
    question.media.images = items
  } else if (kind === 'video') {
    question.media.videos = items
  } else {
    question.media.carousel = items
  }
}
</script>