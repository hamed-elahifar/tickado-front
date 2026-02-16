<template>
    <CommonPageTitle 
    :title="$t('questionnaires.questionnaire_management')" 
    :description="$t('questionnaires.registered_questionnaire')">
        <UiButton type="button" @click="goToCreate" class="cursor-pointer">
            <Plus />
            {{$t('questionnaires.new_questionnaire')}}
        </UiButton>
    </CommonPageTitle>
</template>
<script setup>
import { Plus } from 'lucide-vue-next'

const router = useRouter()

function goToCreate() {
  router.push('/dashboard/questionnaires/create')
}
</script>