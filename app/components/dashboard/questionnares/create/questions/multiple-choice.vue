<template>
    <div class="bg-sidebar w-full rounded-md grid grid-cols-1 lg:grid-cols-4 gap-3 p-2 sm:p-4 h-full min-h-0 overflow-y-auto lg:overflow-hidden">
        <div class="lg:hidden border bg-white rounded-md p-3 space-y-3" dir="rtl">
            <div class="flex items-center justify-between">
                <p class="font-bold text-base">
                    چندگزینه‌ای
                </p>
                <div class="flex items-center gap-x-2">
                    <span class="bg-primary/20 text-primary text-xs font-bold rounded-md px-2 py-1">
                        {{ multipleChoiceStore.options.length }}
                    </span>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2 border-b pb-2">
                <button
                    type="button"
                    class="text-sm font-semibold pb-2 border-b-2 transition-colors"
                    :class="activeMobileTab === 'builder' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'"
                    @click="activeMobileTab = 'builder'"
                >
                    ایجاد سوال
                </button>
                <button
                    type="button"
                    class="text-sm font-semibold pb-2 border-b-2 transition-colors"
                    :class="activeMobileTab === 'preview' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'"
                    @click="activeMobileTab = 'preview'"
                >
                    نمایش سوال
                </button>
            </div>
        </div>
        <div
            class="lg:col-span-1 bg-white space-y-3 border p-2 pb-10 min-h-0 max-h-[55vh] overflow-y-auto lg:h-full lg:max-h-none"
            :class="activeMobileTab === 'builder' ? 'block' : 'hidden lg:block'"
            dir="rtl"
        >
            <div class="border-b pb-4">
                <p class="font-bold mb-2 text-sm">
                    سوال
                </p>
                <QuillEditor :toolbar="toolbar" dir="rtl" v-model:content="quiestion" content-type="html"/>
            </div>
            <div class="border-b pb-4 space-y-2">
                <div class="flex items-center justify-between">
                    <p class="font-bold text-sm">
                        توضیحات
                    </p>
                    <radio v-model="hasDescription" id="description" />
                </div>
                <transition name="fade-slide" mode="out-in">
                    <QuillEditor :toolbar="toolbar" dir="rtl" v-if="hasDescription" content-type="html" v-model:content="description"/>
                </transition>
            </div>
            <div class="border-b pb-4">
                <div class=" flex justify-between">
                    <p class="font-bold text-sm mb-2">
                        گزینه ها
                    </p>
                    <plus class="size-4 text-primary cursor-pointer" v-if="!multipleChoiceStore.options.length" @click="multipleChoiceStore.addOption()" />
                </div>
                <div class="space-y-2">
                    <article v-for="(opt, index) in multipleChoiceStore.options" :key="index">
                        <UiCard class="p-1 space-y-1" v-if="!opt.isExtra">
                            <div class="flex items-center justify-end gap-x-1">
                                <UiButton class="text-white item-end p-1 h-6 cursor-pointer" @click="multipleChoiceStore.addOption()">
                                    <Plus />
                                </UiButton>
                                <UiButton class="text-white item-end p-1 h-6 cursor-pointer" @click="multipleChoiceStore.hideOption(index)">
                                    <Eye />
                                </UiButton>
                                <UiButton class="text-white item-end p-1 h-6 cursor-pointer" variant="destructive" @click="multipleChoiceStore.removeOption(index)">
                                    <X />
                                </UiButton>
                            </div>
                            <UiInput :placeholder="`${index + 1}. عنوان گزینه`" v-model="opt.title"/>
                            <UiInput placeholder="امتیاز گزینه" v-model="opt.score"/>
                            <UiInputFileUpload label="آپلود ویدیو / عکس +" @change="(files) => multipleChoiceStore.updateSourceFile(index,files)"/>
                            <toggle-button label="ستاره دار" :id="`required-${index}`" v-model="opt.isRequired" />
                            <toggle-button label="قفل تصادفی سازی" :id="`luck-random-${index}`" v-model="opt.isLuckRandom"/>
                        </UiCard>
                    </article>
                </div>
            </div>
            <div class="border-b space-y-2 pb-4">
                <toggle-button v-for="(btn, index) in toggleBtns" :key="btn.value" :id="btn.value" :label="btn.title" v-model="btn.inputValue" >
                    <div v-if="index == 3 && btn.inputValue" class="space-y-1 my-1">
                        <UiInput :placeholder="`برچسب گزینه ${labelIndex + 1}`" 
                        v-for="(label, labelIndex) in multipleChoiceStore.label" :key="labelIndex" 
                        v-model="label.title"/>
                    </div>
                    <div v-if="index == 7 && btn.inputValue" class="flex items-center gap-x-2 my-2">
                        <UiInput placeholder="حداقل"/>
                        <UiInput placeholder="حداکثر"/>
                    </div>
                    <div v-if="index == 2 && btn.inputValue">
                        <UiInputCheckBox label="همه موارد" id="all" v-model="exOptions.allOptions" @change="multipleChoiceStore.handleExtraOptions('همه موارد',exOptions.allOptions)"/>
                        <UiInputCheckBox label="هیچکدام" id="noOne" v-model="exOptions.noOne" @change="multipleChoiceStore.handleExtraOptions('هیچکدام', exOptions.noOne)"/>
                        <UiInputCheckBox label="سایر" id="other" v-model="exOptions.other" @change="multipleChoiceStore.handleExtraOptions('سایر', exOptions.other)"/>
                    </div>
                </toggle-button>
            </div>
        </div>
        <div
            class="bg-sidebar lg:col-span-3 border p-2 sm:p-3 space-y-5 min-h-[280px] lg:h-full overflow-auto lg:overflow-hidden"
            :class="activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'"
        >
            <div class="flex justify-center [&_svg]:size-5 gap-x-3 [&_svg]:transition-colors">
                <Monitor :class="{'text-primary': !isMobileView}" @click="isMobileView = false"/>
                <Smartphone :class="{'text-primary': isMobileView}" @click="isMobileView = true"/>
            </div>
            <div class="border p-3 sm:p-4 transition-all duration-500 rounded-md bg-background mx-auto max-w-full" :class="{'w-full': !isMobileView, 'w-full sm:w-80': isMobileView}">
                <div class="flex gap-x-2">
                    <span class="text-destructive" v-if="toggleBtns[1].inputValue">*</span>
                    <div v-html="quiestion"></div>
                </div>
                <div class="[&>*]:text-xs p-1" v-if="hasDescription" v-html="description"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 py-4 w-full" :class="{'!grid-cols-1': toggleBtns[4].inputValue}">
                    <button class="border border-primary rounded-md bg-accent p-2 flex flex-col items-start hover:bg-primary transition-all w-full"
                    :class="{'hidden': opt.isHide}"
                    v-for="(opt, index) in multipleChoiceStore.options" :key="index">
                        <div class="flex gap-x-1">
                            <span v-if="opt.isRequired" class="text-destructive">*</span>
                            <p class="whitespace-normal" :class="{'whitespace-nowrap': !isMobileView}">
                                {{ index + 1 }}. {{ opt.title }}
                            </p>
                        </div>
                        <div>
                            <img :src="opt.file" alt="" class="rounded-md size-28 object-contain" v-if="opt.file">
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '~/assets/css/quill.css';
import radio from '~/components/ui/input/radio.vue';
import toggleButton from './toggle-button.vue';
import { Plus, Eye, EyeClosed, Grip, X, Smartphone, Monitor } from 'lucide-vue-next';
import { useMultipleChoice } from '#imports';


const multipleChoiceStore = useMultipleChoice();
const hasDescription = ref(false)
const isMobileView = ref(false)
const activeMobileTab = ref('builder')
const quiestion = ref('')
const description = ref('')

const toolbar = [
    ['bold', 'italic', 'underline'], 
    ['image', 'video'],
    [{ 'color': [] }, { 'background': [] }], 
    [{ 'align': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }], 
    [{ 'font': [] }],

]
const exOptions = ref({
    noOne: false, allOptions: false, other: false
})
const toggleBtns = ref([
    {title: 'تصادفی', value: 'random', inputValue: false}, // 0
    {title: 'اجباری', value: 'sequential', inputValue: false}, // 1
    {title: 'افزودن گزینه سایر، همه موارد و هیچکدام', value: 'add_all_none', inputValue: false}, // 2
    {title: 'برچسب زدن گزینه ها', value: 'labeling', inputValue: false}, // 3
    {title: 'چیدمان عمودی', value: 'horizontal', inputValue: false}, // 4
    {title: 'چند انتخابی بودن', value: 'multiple', inputValue: false}, // 5
    {title: 'عدم نمایش شماره سوال', value: 'no_number', inputValue: false}, // 6
    {title: 'حداقل و حداکثر انتخاب', value: 'min_max', inputValue: false}, // 7
])

watch(() => toggleBtns.value[3].inputValue, (hasLabel) => {
    if(hasLabel) {
        multipleChoiceStore.handleLabel();
    }
})
</script>
