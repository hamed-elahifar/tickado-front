import { defineStore } from 'pinia'
import { ref } from 'vue'

export type QuestionType =
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

export interface QuestionMediaItem {
  file: File
  url: string
}

export interface QuestionMedia {
  images: QuestionMediaItem[]
  videos: QuestionMediaItem[]
  carousel: QuestionMediaItem[]
}

export interface QuestionOption {
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
  fontFamily?: string
  fontSize?: string
  textColor?: string
  highlightColor?: string
  media?: QuestionMedia
}

export interface RichTextBlock {
  id: number
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  align?: 'right' | 'left' | 'center'
  color?: string
  highlight?: string
  fontFamily?: string
  fontSize?: string
  media?: QuestionMedia
}

export interface Question {
  id: number
  type: QuestionType
  title: string
  description: string
  options: QuestionOption[]
  media: QuestionMedia
  richTextBlocks?: RichTextBlock[]
  descriptionBlocks?: RichTextBlock[]
  optionReadySet?: string
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

export function questionHasOptions(type: QuestionType) {
  return ['single_choice', 'multiple_choice', 'ranking', 'dropdown', 'scale', 'rating', 'matrix'].includes(type)
}

export function questionSupportsMedia(type: QuestionType) {
  return ['long_text', 'single_choice', 'multiple_choice', 'ranking', 'dropdown', 'scale', 'rating', 'content_block', 'matrix'].includes(type)
}

export function createQuestion(type: QuestionType): Question {
  const hasOptions = questionHasOptions(type)

  const baseRichBlock: RichTextBlock = {
    id: Date.now() + Math.random(),
    text: '',
    bold: false,
    italic: false,
    underline: false,
    align: 'right',
    color: undefined,
    highlight: undefined,
    fontFamily: 'IRANSans',
    fontSize: '14px',
    media: {
      images: [],
      videos: [],
      carousel: []
    }
  }

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
    richTextBlocks: type === 'multiple_choice' ? [{ ...baseRichBlock }] : [],
    descriptionBlocks: type === 'multiple_choice' ? [{ ...baseRichBlock, id: Date.now() + Math.random() }] : [],
    optionReadySet: undefined,
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

export const useQuestionnaireStore = defineStore('questionnaire', () => {
  const questions = ref<Question[]>([
    // createQuestion('long_text'),
    // createQuestion('single_choice')
  ])
  const isPreviewMode = ref(false)
  const draggingQuestionIndex = ref<number | null>(null)

  function setPreviewMode(value: boolean) {
    isPreviewMode.value = value
  }

  function addQuestion(type: QuestionType) {
    questions.value.forEach((q) => {
      q.expanded = false
    })
    const created = createQuestion(type)
    questions.value.push(created)
  }

  function addExistingQuestion(question: Question) {
    questions.value.forEach((q) => {
      q.expanded = false
    })
    questions.value.push({ ...question, expanded: true })
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

  function handleDragStart(index: number) {
    draggingQuestionIndex.value = index
  }

  function handleDrop(targetIndex: number) {
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

  function handleDragEnd() {
    draggingQuestionIndex.value = null
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

  return {
    questions,
    isPreviewMode,
    draggingQuestionIndex,
    setPreviewMode,
    addQuestion,
    addExistingQuestion,
    removeQuestion,
    duplicateQuestion,
    toggleQuestion,
    addOption,
    removeOption,
    handleDragStart,
    handleDrop,
    handleDragEnd,
    handleMediaChange
  }
})
