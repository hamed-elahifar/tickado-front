<template>
  <div class="space-y-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex-1 max-w-sm">
        <UiInput
          v-model="searchQuery"
          :placeholder="$t('rewards.search_placeholder')"
          class="w-full"
        />
      </div>
      <UiButton variant="outline" size="sm">
        <Download />
        {{ $t('common.export_excel') }}
      </UiButton>
    </div>

    <!-- Table Section -->
    <UiCard>
      <UiTable>
        <UiTableHeader>
          <UiTableRow>
            <UiTableCell class="font-semibold">
              {{ $t('common.title') }}
            </UiTableCell>
            <UiTableCell class="font-semibold">
              {{ $t('rewards.rewards_count') }}
            </UiTableCell>
            <UiTableCell class="font-semibold">
              {{ $t('rewards.rule_id') }}
            </UiTableCell>
            <UiTableCell class="font-semibold">
              {{ $t('rewards.time_range') }}
            </UiTableCell>
            <UiTableCell class="font-semibold">
              {{ $t('rewards.participants') }}
            </UiTableCell>
            <UiTableCell class="font-semibold">
              {{ $t('common.status') }}
            </UiTableCell>
            <UiTableCell class="font-semibold">
              {{ $t('common.actions') }}
            </UiTableCell>
          </UiTableRow>
        </UiTableHeader>
        <UiTableBody>
          <UiTableRow v-for="rule in paginatedRules" :key="rule.id">
            <UiTableCell class="font-medium">
              <div class="flex items-center gap-2">
                <span>{{ rule.title }}</span>
                <Trophy class="h-4 w-4 text-yellow-500" />
              </div>
            </UiTableCell>
            <UiTableCell>
              <UiBadge variant="secondary">
                {{ rule.rewardsCount }} {{ $t('rewards.rewards_count') }}
              </UiBadge>
            </UiTableCell>
            <UiTableCell>
              {{ rule.itemId }}
            </UiTableCell>
            <UiTableCell>
              {{ rule.timeRange }}
            </UiTableCell>
            <UiTableCell>
              {{ rule.participants }}
            </UiTableCell>
            <UiTableCell>
              <UiSwitch v-model="rule.active" />
            </UiTableCell>
            <UiTableCell>
              <UiDropdownMenu>
                <UiDropdownMenuTrigger as-child>
                  <UiButton variant="ghost" size="sm">
                    <EllipsisVertical />
                  </UiButton>
                </UiDropdownMenuTrigger>
                <UiDropdownMenuContent>
                  <UiDropdownMenuItem class="cursor-pointer">
                    <Edit />
                    {{ $t('common.edit') }}
                  </UiDropdownMenuItem>
                  <UiDropdownMenuItem class="cursor-pointer text-destructive">
                    <Trash2 />
                    {{ $t('common.delete') }}
                  </UiDropdownMenuItem>
                </UiDropdownMenuContent>
              </UiDropdownMenu>
            </UiTableCell>
          </UiTableRow>
        </UiTableBody>
      </UiTable>

      <!-- Empty State -->
      <div v-if="filteredRules.length === 0" class="p-8 text-center">
        <p class="text-muted-foreground">
          {{ $t('rewards.no_data') }}
        </p>
      </div>
    </UiCard>

    <!-- Pagination Section -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">
          {{ $t('common.show') }}
        </span>
        <UiSelect v-model="itemsPerPage">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </UiSelect>
      </div>
      <div class="text-sm text-muted-foreground">
        {{ $t('common.page') }} {{ currentPage }}
        {{ $t('common.of') }} {{ totalPages }}
      </div>
      <div class="flex gap-2">
        <UiButton
          variant="outline"
          size="sm"
          :disabled="currentPage === 1"
          @click="goToPreviousPage"
        >
          <ChevronLeft />
        </UiButton>
        <UiButton
          variant="outline"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="goToNextPage"
        >
          <ChevronRight />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import UiInput from '~/components/ui/input/Input.vue'
import UiButton from '~/components/ui/button/Button.vue'
import UiCard from '~/components/ui/card/Card.vue'
import UiTable from '~/components/ui/table/Table.vue'
import UiTableHeader from '~/components/ui/table/TableHeader.vue'
import UiTableBody from '~/components/ui/table/TableBody.vue'
import UiTableRow from '~/components/ui/table/TableRow.vue'
import UiTableCell from '~/components/ui/table/TableCell.vue'
import UiBadge from '~/components/ui/badge/Badge.vue'
import UiDropdownMenu from '~/components/ui/dropdown-menu/DropdownMenu.vue'
import UiDropdownMenuTrigger from '~/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import UiDropdownMenuContent from '~/components/ui/dropdown-menu/DropdownMenuContent.vue'
import UiDropdownMenuItem from '~/components/ui/dropdown-menu/DropdownMenuItem.vue'
import UiSelect from '~/components/ui/select/Select.vue'
import { EllipsisVertical, Edit, Trash2, Download, ChevronLeft, ChevronRight, Trophy } from 'lucide-vue-next'

interface RewardRule {
  id: number
  title: string
  rewardsCount: number
  itemId: number
  timeRange: string
  participants: string
  active: boolean
}

const rules = ref<RewardRule[]>([
  {
    id: 1,
    title: 'Labore pariatur Vol',
    rewardsCount: 1,
    itemId: 37,
    timeRange: '-',
    participants: '•',
    active: true
  }
])

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(25)

const filteredRules = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return rules.value.filter((rule) => rule.title.toLowerCase().includes(query))
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredRules.value.length / itemsPerPage.value))
})

const paginatedRules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRules.value.slice(start, end)
})

const goToPreviousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>