<template>
	<div class="space-y-4">
		<!-- Header Section -->
		<div class="flex items-center justify-between gap-4">
			<div class="flex-1 max-w-sm">
				<UiInput
					v-model="searchQuery"
					:placeholder="$t('questionnaires.search_placeholder')"
					class="w-full"
				/>
			</div>
			<UiButton variant="outline" size="sm">
				{{ $t('questionnaires.export_excel') }}
			</UiButton>
		</div>

		<!-- Table Section -->
		<UiCard>
			<UiTable>
				<UiTableHeader>
					<UiTableRow>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.title') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.designer_name') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.category') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.status') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.interview_type') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.project') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.population') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.code') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.date') }}</UiTableCell>
						<UiTableCell class="font-semibold">{{ $t('questionnaires.actions') }}</UiTableCell>
					</UiTableRow>
				</UiTableHeader>
				<UiTableBody>
					<UiTableRow v-for="questionnaire in filteredQuestionnaires" :key="questionnaire.id">
						<UiTableCell class="font-medium">{{ questionnaire.title }}</UiTableCell>
						<UiTableCell>{{ questionnaire.designer }}</UiTableCell>
						<UiTableCell>{{ questionnaire.category }}</UiTableCell>
						<UiTableCell>
							<UiBadge
								:variant="
									questionnaire.status === 'active'
										? 'outline'
										: questionnaire.status === 'draft'
											? 'secondary'
											: 'muted'
								"
							>
								<span v-if="questionnaire.status === 'active'">{{ $t('questionnaires.status_active') }}</span>
								<span v-else-if="questionnaire.status === 'draft'">{{ $t('questionnaires.status_draft') }}</span>
								<span v-else>{{ $t('questionnaires.status_completed') }}</span>
							</UiBadge>
						</UiTableCell>
						<UiTableCell>
							<span v-if="questionnaire.interviewType === 'online'">
								{{ $t('questionnaires.interview_online') }}
							</span>
							<span v-else-if="questionnaire.interviewType === 'in_person'">
								{{ $t('questionnaires.interview_in_person') }}
							</span>
							<span v-else>{{ $t('questionnaires.interview_field') }}</span>
						</UiTableCell>
						<UiTableCell>{{ questionnaire.project }}</UiTableCell>
						<UiTableCell>{{ questionnaire.population }}</UiTableCell>
						<UiTableCell>{{ questionnaire.code }}</UiTableCell>
						<UiTableCell>{{ questionnaire.date }}</UiTableCell>
						<UiTableCell>
							<UiDropdownMenu>
								<UiDropdownMenuTrigger as-child>
									<UiButton variant="ghost" size="sm">⋮</UiButton>
								</UiDropdownMenuTrigger>
								<UiDropdownMenuContent>
									<UiDropdownMenuItem class="cursor-pointer">
										{{ $t('questionnaires.action_quick_view') }}
									</UiDropdownMenuItem>
									<UiDropdownMenuItem class="cursor-pointer">
										{{ $t('questionnaires.action_edit') }}
									</UiDropdownMenuItem>
									<UiDropdownMenuItem class="cursor-pointer">
										{{ $t('questionnaires.action_history') }}
									</UiDropdownMenuItem>
									<UiDropdownMenuItem class="cursor-pointer text-destructive">
										{{ $t('questionnaires.action_delete') }}
									</UiDropdownMenuItem>
									<UiDropdownMenuItem class="cursor-pointer">
										{{ $t('questionnaires.action_copy') }}
									</UiDropdownMenuItem>
									<UiDropdownMenuItem class="cursor-pointer">
										{{ $t('questionnaires.action_download_data') }}
									</UiDropdownMenuItem>
									<UiDropdownMenuItem class="cursor-pointer">
										{{ $t('questionnaires.action_send') }}
									</UiDropdownMenuItem>
								</UiDropdownMenuContent>
							</UiDropdownMenu>
						</UiTableCell>
					</UiTableRow>
				</UiTableBody>
			</UiTable>

			<!-- Empty State -->
			<div v-if="filteredQuestionnaires.length === 0" class="p-8 text-center">
				<p class="text-muted-foreground">{{ $t('questionnaires.no_data') }}</p>
			</div>
		</UiCard>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Questionnaire {
	id: number
	title: string
	designer: string
	category: string
	status: 'active' | 'draft' | 'completed'
	interviewType: 'online' | 'in_person' | 'field'
	project: string
	population: string
	code: string
	date: string
}

const questionnaires = ref<Questionnaire[]>([
	{
		id: 1,
		title: 'سبک مصرف خانوار',
		designer: 'مریم شریفی',
		category: 'صنایع غذایی',
		status: 'active',
		interviewType: 'online',
		project: 'شرکت پگاه',
		population: 'خانوارهای شهری',
		code: 'Q-1024',
		date: '1404/10/22'
	},
	{
		id: 2,
		title: 'رضایت مشترکین اینترنت',
		designer: 'علی رضایی',
		category: 'مخابرات و ارتباطات',
		status: 'draft',
		interviewType: 'field',
		project: 'شرکت مخابرات',
		population: 'مشترکین خانگی',
		code: 'Q-2091',
		date: '1404/11/05'
	},
	{
		id: 3,
		title: 'ارزیابی محصولات بهداشتی',
		designer: 'نرگس کاظمی',
		category: 'آرایشی و بهداشتی',
		status: 'completed',
		interviewType: 'in_person',
		project: 'شرکت گلرنگ',
		population: 'مصرف‌کنندگان 18-45',
		code: 'Q-3158',
		date: '1404/09/18'
	}
])

const searchQuery = ref('')

const filteredQuestionnaires = computed(() => {
	const query = searchQuery.value.trim().toLowerCase()
	if (!query) {
		return questionnaires.value
	}
	return questionnaires.value.filter((item) => {
		return (
			item.title.toLowerCase().includes(query) ||
			item.designer.toLowerCase().includes(query) ||
			item.category.toLowerCase().includes(query) ||
			item.project.toLowerCase().includes(query) ||
			item.code.toLowerCase().includes(query)
		)
	})
})
</script>