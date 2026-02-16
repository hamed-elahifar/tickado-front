<script setup lang="ts">
import { computed, ref } from "vue"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import FileUpload from "~/components/ui/input/FileUpload.vue"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import {
	Select as UiSelect,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select"
import { Lock, UploadCloud } from "lucide-vue-next"

const formId = "identity-form"

const { t } = useI18n()

const form = ref({
	appName: t("settings.identity_form.app_name_placeholder"),
	brandColor: "#3b82f6",
	theme: "light",
	address: t("settings.identity_form.address_placeholder"),
	about: t("settings.identity_form.about_placeholder"),
	terms: t("settings.identity_form.terms_placeholder"),
})

const themeOptions = computed(() => [
	{ value: "light", label: t("settings.identity_form.theme_light") },
	{ value: "dark", label: t("settings.identity_form.theme_dark") },
])

const logoName = ref<string | null>(null)
const isSaving = ref(false)

const brandColorPreview = computed(() => form.value.brandColor || "#000000")

const handleLogoChange = (files: File[] | null) => {
	logoName.value = files?.[0]?.name ?? null
}

const handleSubmit = async () => {
	if (isSaving.value) return

	isSaving.value = true
	await new Promise<void>((resolve) => setTimeout(resolve, 600))
	isSaving.value = false
}
</script>

<template>
	<Card class="w-full border border-border shadow-sm">
		<CardHeader class="text-right">
			<CardTitle class="text-2xl">{{ $t('settings.identity_form.title') }}</CardTitle>
			<CardDescription>{{ $t('settings.identity_form.subtitle') }}</CardDescription>
		</CardHeader>

		<CardContent>
			<form :id="formId" class="space-y-6" @submit.prevent="handleSubmit">
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<div class="space-y-2">
						<Label for="app-name">{{ $t('settings.identity_form.app_name') }}</Label>
						<Input
							id="app-name"
							v-model="form.appName"
							type="text"
							:placeholder="$t('settings.identity_form.app_name_placeholder')"
						/>
					</div>

					<div class="space-y-2">
						<Label for="brand-color">{{ $t('settings.identity_form.brand_color') }}</Label>
						<div class="flex items-center gap-3">
							<span
								class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input"
								:style="{ backgroundColor: brandColorPreview }"
								aria-hidden="true"
							/>
							<Input
								id="brand-color"
								v-model="form.brandColor"
								type="text"
								class="flex-1"
								:placeholder="$t('settings.identity_form.brand_color_placeholder')"
							/>
						</div>
						<p class="text-xs text-muted-foreground">{{ $t('settings.identity_form.brand_color_helper') }}</p>
					</div>

					<div class="space-y-2">
						<Label>{{ $t('settings.identity_form.logo') }}</Label>
						<div class="flex items-center gap-3">
							<FileUpload accept="image/*" @change="handleLogoChange">
								<span class="flex items-center gap-2 text-sm font-medium">
									<UploadCloud class="size-4" />
									{{ $t('settings.identity_form.upload_logo') }}
								</span>
							</FileUpload>
							<span class="text-xs text-muted-foreground line-clamp-1">
								{{ logoName || $t('settings.identity_form.logo_helper') }}
							</span>
						</div>
					</div>

					<div class="space-y-2 lg:col-span-1 md:col-span-2">
						<Label>{{ $t('settings.identity_form.theme') }}</Label>
						<UiSelect v-model="form.theme">
							<SelectTrigger class="w-full">
								<SelectValue :placeholder="$t('settings.identity_form.theme_placeholder')" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem v-for="option in themeOptions" :key="option.value" :value="option.value">
									{{ option.label }}
								</SelectItem>
							</SelectContent>
						</UiSelect>
					</div>
				</div>

				<div class="grid gap-4">
					<div class="space-y-2">
						<Label for="address">{{ $t('settings.identity_form.address') }}</Label>
						<Textarea
							id="address"
							v-model="form.address"
							:placeholder="$t('settings.identity_form.address_placeholder')"
						/>
					</div>

					<div class="space-y-2">
						<Label for="about">{{ $t('settings.identity_form.about') }}</Label>
						<Textarea
							id="about"
							v-model="form.about"
							:placeholder="$t('settings.identity_form.about_placeholder')"
						/>
					</div>

					<div class="space-y-2">
						<Label for="terms">{{ $t('settings.identity_form.terms') }}</Label>
						<Textarea
							id="terms"
							v-model="form.terms"
							:placeholder="$t('settings.identity_form.terms_placeholder')"
						/>
					</div>
				</div>
			</form>
		</CardContent>

		<CardFooter class="justify-start">
			<Button :form="formId" type="submit" class="gap-2 px-6" :disabled="isSaving">
				<template v-if="!isSaving">
					<Lock class="size-4" />
					{{ $t('settings.identity_form.save') }}
				</template>
				<UiLoadingSpinner v-else />
			</Button>
		</CardFooter>
	</Card>
</template>
