<template>
    <CommonPageTitle 
    :title="$t('questionnaires.questionnaire_management')" 
    :description="$t('questionnaires.registered_questionnaire')">
        <UiButton @click="navigateTo('/dashboard/questionnaires/create')" class="cursor-pointer">
            <Plus />
            {{$t('questionnaires.new_questionnaire')}}
        </UiButton>
    </CommonPageTitle>
</template>
<script setup>
import { Plus } from 'lucide-vue-next';
</script>