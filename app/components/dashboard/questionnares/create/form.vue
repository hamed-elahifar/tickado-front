<template>
  <UiCard class="space-y-6 p-6">
    <div>
      <p class="text-sm font-semibold text-muted-foreground">
        {{ $t('questionnaires.general_information') }}
      </p>
      <p class="text-sm text-muted-foreground">
        {{ $t('questionnaires.general_information_hint') }}
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <UiLabel>{{ $t('questionnaires.title') }}</UiLabel>
          <UiInput
            v-model="formData.title"
            :placeholder="$t('questionnaires.title_placeholder')"
            class="mt-2"
          />
        </div>
        <div class="space-y-2">
          <UiLabel>{{ $t('questionnaires.duration') }}</UiLabel>
          <UiInput
            v-model="formData.duration"
            type="number"
            :placeholder="$t('questionnaires.duration_placeholder')"
            class="mt-2"
            min="1"
          />
        </div>
      </div>

      <div class="space-y-2">
        <UiLabel>{{ $t('questionnaires.description') }}</UiLabel>
        <UiTextarea
          v-model="formData.description"
          :placeholder="$t('questionnaires.description_placeholder')"
          class="mt-2"
        />
      </div>

      <div class="space-y-2">
        <UiLabel>{{ $t('questionnaires.category') }}</UiLabel>
        <UiSelect v-model="formData.category">
          <UiSelectTrigger class="w-full">
            <UiSelectValue :placeholder="$t('questionnaires.category_placeholder')" />
          </UiSelectTrigger>
          <UiSelectContent>
            <UiSelectItem
              v-for="category in categoryOptions"
              :key="category.value"
              :value="category.value"
            >
              {{ category.label }}
            </UiSelectItem>
          </UiSelectContent>
        </UiSelect>
      </div>

      <div class="flex justify-end">
        <UiButton type="submit">{{ $t('common.save') }}</UiButton>
      </div>
    </form>
  </UiCard>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

interface QuestionnaireForm {
  title: string
  description: string
  duration: string
  category: string
}

const emit = defineEmits<{
  submit: (payload: QuestionnaireForm) => void
}>()

const formData = reactive<QuestionnaireForm>({
  title: '',
  description: '',
  duration: '',
  category: ''
})

const { t } = useI18n()

const categoryOptions = computed(() => [
  { value: 'telecom', label: t('questionnaires.category_telecom') },
  { value: 'food', label: t('questionnaires.category_food') },
  { value: 'cosmetics', label: t('questionnaires.category_cosmetics') },
  { value: 'other', label: t('questionnaires.category_other') }
])

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>