<template>
    <div class="p-4 lg:p-6">
        <div class="mb-6">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <nuxt-link to="/dashboard/questionnaires">
                        <UiButton variant="ghost" size="sm">
                            <ArrowRight class="ml-2 h-4 w-4" />
                            {{ $t('common.back') }}
                        </UiButton>
                    </nuxt-link>
                    <h1 class="text-2xl font-bold tracking-tight">
                        {{ $t('questionnaires.new_questionnaire') }}
                    </h1>
                </div>
                <UiButton size="sm" variant="default">
                    <Save />
                    {{ $t('common.save') }}
                </UiButton>
            </div>  
        </div>
        <UiTabIndex :tab-items="tabItems" :selected-item="tab" @change-tab="(p) => tab = p" />
        <div class="mt-6">
            <transition name="fade-slide" mode="out-in">
                <DashboardQuestionnaresCreateForm v-if="tab == 'general_information'" />
                <DashboardQuestionnaresCreateQuestions v-else-if="tab == 'questions'" />
            </transition>
        </div>
    </div>
</template>
<script setup>
import { ArrowRight, Save, Book, FileQuestionMark, BookOpenText } from 'lucide-vue-next';
const tab = ref('general_information');
const tabItems = [
    { id: 'general_information', title: 'questionnaires.general_information', icon: Book },
    { id: 'questions', title: 'questionnaires.questions', icon: FileQuestionMark },
    { id: 'start_end_page', title: 'questionnaires.start_end_page', icon: BookOpenText },
]
</script>