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
            v-for="page in specialPages"
            :key="page.key"
            type="button"
            variant="secondary"
            class="flex w-full items-center justify-between"
            disabled
          >
            <div class="flex items-center gap-2">
              <span
                class="flex h-9 w-9 items-center justify-center rounded-lg text-sm"
                :class="page.tone"
              >
                <component :is="page.icon" class="h-4 w-4" />
              </span>
              <div class="text-right">
                <p class="text-sm font-semibold">
                  {{ page.label }}
                </p>
                <p class="text-[11px] text-muted-foreground">
                  {{ page.description }}
                </p>
              </div>
            </div>
          </UiButton>

          <div class="pt-1 border-t border-dashed border-muted" />

          <UiButton
            v-for="type in questionTypes"
            :key="type.type"
            type="button"
            variant="outline"
            class="flex w-full items-center justify-between cursor-pointer"
            @click="openNewQuestion(type.type)"
          >
            <div class="flex items-center gap-2">
              <span
                class="flex h-7 w-9 items-center justify-center rounded-lg text-sm"
                :class="type.tone"
              >
                <component :is="type.icon" class="h-4 w-4" />
              </span>
              <span class="text-sm">
                {{ type.label }}
              </span>
            </div>
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
              @click="togglePreviewMode"
            >
              <Eye class="ml-1 h-4 w-4" />
              <span>{{ isPreviewMode ? 'خروج از پیش‌نمایش' : 'پیش‌نمایش پرسشنامه' }}</span>
            </UiButton>
            <!-- <UiButton size="sm" variant="outline" @click="openNewQuestion('long_text')">
              <Plus class="ml-2 h-4 w-4" />
              افزودن سوال
            </UiButton> -->
          </div>
        </div>
      </UiCard>

      <DashboardQuestionnaresCreateDemo
        v-if="isPreviewMode"
        class="mt-2"
        :questions="questions"
        @close="isPreviewMode = false"
      />

      <div v-else class="space-y-4">
        <UiCard
          v-if="welcomePage"
          class="flex items-center justify-between border border-muted/60 bg-muted/40 px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl"
              :class="welcomePage.tone"
            >
              <component :is="welcomePage.icon" class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm font-semibold">{{ welcomePage.label }}</p>
              <p class="text-xs text-muted-foreground">{{ welcomePage.description }}</p>
            </div>
          </div>
        </UiCard>

        <div v-if="questions.length" class="space-y-4">
          <QuestionCard
            v-for="(question, index) in questions"
            :key="question.id"
            :question="question"
            :index="index"
          />

          <UiCard
            v-if="endPage"
            class="flex items-center justify-between border border-muted/60 bg-muted/40 px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl"
                :class="endPage.tone"
              >
                <component :is="endPage.icon" class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold">{{ endPage.label }}</p>
                <p class="text-xs text-muted-foreground">{{ endPage.description }}</p>
              </div>
            </div>
          </UiCard>
        </div>

        <div v-else>
          <UiCard class="flex flex-col items-center justify-center gap-3 border-dashed py-10 mb-4">
            <p class="text-sm font-medium text-muted-foreground">
              هنوز سوالی اضافه نشده است.
            </p>
            <!-- <UiButton size="sm" @click="openNewQuestion('long_text')">
              <Plus class="ml-2 h-4 w-4" />
              افزودن اولین سوال
            </UiButton> -->
          </UiCard>

          <UiCard
            v-if="endPage"
            class="flex items-center justify-between border border-muted/60 bg-muted/40 px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-xl"
                :class="endPage.tone"
              >
                <component :is="endPage.icon" class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold">{{ endPage.label }}</p>
                <p class="text-xs text-muted-foreground">{{ endPage.description }}</p>
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </div>

    <UiDialog v-model:open="isEditorOpen" class="bg-sidebar">
      <UiDialogContent class="h-[90vh] !bg-sidebar overflow-hidden flex flex-col">

        <div v-if="draftQuestion" class="flex-1 min-h-0">

          <multipleChoice v-if="draftQuestion.type === 'multiple_choice'" v-model="draftQuestion" class="h-full" />
        </div>

        <UiDialogFooter class="flex items-center justify-end gap-2 pt-4">
          <UiButton type="button" variant="ghost" @click="closeEditor">انصراف</UiButton>
          <UiButton type="button" @click="saveDraftQuestion" :disabled="!draftQuestion">ذخیره سوال</UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { Plus, Eye } from 'lucide-vue-next'
import QuestionCard from './questions/QuestionCard.vue'
const multipleChoice = defineAsyncComponent(() => import('./questions/multiple-choice.vue'));
import { QUESTION_TYPES_META, SPECIAL_PAGES, getQuestionMeta } from './questions/question-types'
import { useQuestionnaireStore, createQuestion } from '@/stores/questionnaire'
import type { QuestionType, Question } from '@/stores/questionnaire'

const questionnaireStore = useQuestionnaireStore()
const { questions, isPreviewMode } = storeToRefs(questionnaireStore)

const questionTypes = QUESTION_TYPES_META
const specialPages = SPECIAL_PAGES

const welcomePage = specialPages.find((page) => page.key === 'welcome')
const endPage = specialPages.find((page) => page.key === 'end')

const isEditorOpen = ref(false)
const draftQuestion = ref<Question | null>(null)

function togglePreviewMode() {
  questionnaireStore.setPreviewMode(!isPreviewMode.value)
}

function openNewQuestion(type: QuestionType) {
  draftQuestion.value = createQuestion(type)
  isEditorOpen.value = true
}

function closeEditor() {
  isEditorOpen.value = false
  draftQuestion.value = null
}

function saveDraftQuestion() {
  if (!draftQuestion.value) return
  questionnaireStore.addExistingQuestion(draftQuestion.value)
  closeEditor()
}
</script>
