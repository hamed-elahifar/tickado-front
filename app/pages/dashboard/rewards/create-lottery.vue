<script setup lang="ts">
import { ref, reactive } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'
import UiInput from '~/components/ui/input/Input.vue'
import UiButton from '~/components/ui/button/Button.vue'
import UiLabel from '~/components/ui/label/Label.vue'
import UiSelect from '~/components/ui/select/Select.vue'
import UiSelectTrigger from '~/components/ui/select/SelectTrigger.vue'
import UiSelectValue from '~/components/ui/select/SelectValue.vue'
import UiSelectContent from '~/components/ui/select/SelectContent.vue'
import UiSelectItem from '~/components/ui/select/SelectItem.vue'

const router = useRouter()

const form = reactive({
  title: '',
  type: 'single', 
  requiredChance: 1,
  userChanceLimit: '',
  startDate: '',
  endDate: '',
  isActive: true
})

interface Prize {
  id: number
  title: string
  score: number | string
  count: number | string
}

const prizes = ref<Prize[]>([
  { id: Date.now(), title: '', score: 0, count: 1 }
])

const addPrize = () => {
  prizes.value.push({
    id: Date.now(),
    title: '',
    score: 0,
    count: 1
  })
}

const removePrize = (index: number) => {
  prizes.value.splice(index, 1)
}

const handleSubmit = () => {
  console.log('Form:', form, prizes.value)
  router.back()
}

const handleCancel = () => {
    router.back()
}
</script>

<template>
    <section class="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
        <UiCard class="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div class="flex items-center justify-between p-4 border-b">
                <h2 class="text-xl font-bold">{{ $t('lottery.new_lottery') }}</h2>
            </div>
    
            <div class="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                <div class="space-y-2">
                    <UiLabel class="font-medium">{{ $t('lottery.title_label') }} <span class="text-red-500">*</span></UiLabel>
                    <UiInput v-model="form.title" :placeholder="$t('lottery.title_placeholder')" />
                </div>
    
                 <div class="space-y-2">
                    <UiLabel class="font-medium">{{ $t('lottery.type_label') }}</UiLabel>
                    <UiSelect v-model="form.type">
                        <UiSelectTrigger>
                            <UiSelectValue :placeholder="$t('lottery.type_single_prize')" />
                        </UiSelectTrigger>
                        <UiSelectContent>
                            <UiSelectItem value="single">{{ $t('lottery.single_prize') }}</UiSelectItem>
                            <UiSelectItem value="multi">{{ $t('lottery.multi_prize') }}</UiSelectItem>
                        </UiSelectContent>
                    </UiSelect>
                </div>
    
                <div class="space-y-2">
                    <UiLabel class="font-medium">{{ $t('lottery.prizes') }}</UiLabel>
                    <div v-for="(prize, index) in prizes" :key="prize.id" class="flex gap-2 items-center">
                        <UiInput v-model="prize.title" :placeholder="$t('lottery.prize_title')" class="flex-grow" />
                        <UiInput v-model="prize.score" type="number" class="w-20 text-center" placeholder="0" />
                        <UiInput v-model="prize.count" type="number" class="w-20 text-center" placeholder="1" />
                        <button @click="removePrize(index)" class="text-red-500 hover:bg-red-50 p-2 rounded transition-colors" v-if="prizes.length > 0">
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>
                    <UiButton type="button" variant="outline" class="w-fit flex gap-2 items-center px-4" @click="addPrize">
                        <Plus class="w-4 h-4" />
                        {{ $t('lottery.add_prize') }}
                    </UiButton>
                </div>
    
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                         <UiLabel class="font-medium">{{ $t('lottery.required_chance') }}</UiLabel>
                         <UiInput v-model="form.requiredChance" type="number" />
                    </div>
                    <div class="space-y-2">
                         <UiLabel class="font-medium">{{ $t('lottery.user_chance_limit') }}</UiLabel>
                         <UiInput v-model="form.userChanceLimit" :placeholder="$t('lottery.no_limit_placeholder')" />
                    </div>
                </div>
    
                 <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                         <UiLabel class="font-medium">{{ $t('lottery.start_date') }}</UiLabel>
                         <UiInput v-model="form.startDate" type="date" class="w-full" />
                    </div>
                    <div class="space-y-2">
                         <UiLabel class="font-medium">{{ $t('lottery.end_date') }}</UiLabel>
                         <UiInput v-model="form.endDate" type="date" class="w-full" />
                    </div>
                </div>
    
                <div class="flex items-center gap-4 py-2">
                    <UiLabel class="font-medium">{{ $t('lottery.active') }}</UiLabel>
                    <div class="flex items-center gap-2">
                         <UiInputRadio :model-value="form.isActive" @update:model-value="(active) => form.isActive = active" />
                         <span class="text-sm font-medium">{{ $t('lottery.yes') }}</span>
                    </div>
                </div>
    
            </div>
    
            <div class="p-4 border-t flex gap-2">
                 <UiButton @click="handleSubmit" >{{ $t('lottery.create') }}</UiButton>
                 <UiButton variant="outline" @click="handleCancel" >{{ $t('lottery.cancel') }}</UiButton>
            </div>
        </UiCard>
    </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>