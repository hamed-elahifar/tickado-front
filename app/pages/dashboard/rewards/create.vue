<template>
  <section class="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
    <Card class="w-full max-w-lg rounded-xl border border-border bg-card text-card-foreground shadow-lg">
      <CardHeader class="space-y-2">
        <CardTitle>
          {{ $t('rewards.new_rule') }}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Activity title -->
          <div class="space-y-2">
            <Label>
              {{ $t('rewards.form.activity_title') }}
              <span class="text-red-500">*</span>
            </Label>
            <Input
              v-model="form.title"
              type="text"
              :placeholder="$t('rewards.form.activity_title_placeholder')"
              required
            />
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label>
              {{ $t('rewards.form.description') }}
            </Label>
            <Textarea
              v-model="form.description"
              :placeholder="$t('rewards.form.description_placeholder')"
              rows="3"
            />
          </div>

          <!-- Score & Chance -->
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label>{{ $t('rewards.form.score') }}</Label>
              <Input
                v-model.number="form.score"
                type="number"
                min="0"
                inputmode="numeric"
              />
            </div>
            <div class="space-y-2">
              <Label>{{ $t('rewards.form.chance') }}</Label>
              <Input
                v-model.number="form.chance"
                type="number"
                min="0"
                inputmode="numeric"
              />
            </div>
          </div>

          <!-- Valid date range -->
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label>{{ $t('rewards.form.valid_from') }}</Label>
              <Input v-model="form.validFrom" type="date" />
            </div>
            <div class="space-y-2">
              <Label>{{ $t('rewards.form.valid_to') }}</Label>
              <Input v-model="form.validTo" type="date" />
            </div>
          </div>

          <!-- Usage limit -->
          <div class="space-y-2">
            <Label>{{ $t('rewards.form.usage_limit') }}</Label>
            <Input
              v-model.number="form.usageLimit"
              type="number"
              min="0"
              :placeholder="$t('rewards.form.usage_unlimited')"
            />
          </div>

          <!-- Active toggle -->
          <div class="flex items-center justify-between border-t pt-4 mt-2">
            <div class="space-y-0.5">
              <p class="text-sm font-medium">
                {{ $t('rewards.form.active') }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ form.active ? $t('common.status_active') : $t('common.status_inactive') }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs">
                {{ form.active ? $t('rewards.form.active_yes') : $t('rewards.form.active_no') }}
              </span>
              <UiSwitch v-model="form.active" />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4">
            <Button type="button" variant="outline" @click="handleCancel">
              {{ $t('rewards.form.cancel') }}
            </Button>
            <Button type="submit">
              {{ $t('rewards.form.submit') }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

const router = useRouter()

interface RewardRuleForm {
  title: string
  description: string
  score: number | undefined
  chance: number | undefined
  validFrom: string
  validTo: string
  usageLimit: number | undefined
  active: boolean
}

const form = ref<RewardRuleForm>({
  title: '',
  description: '',
  score: undefined,
  chance: undefined,
  validFrom: '',
  validTo: '',
  usageLimit: undefined,
  active: true
})

const handleCancel = () => {
  router.back()
}

const handleSubmit = () => {
  // TODO: connect to API once backend is ready
  // For now we just navigate back
  router.back()
}
</script>