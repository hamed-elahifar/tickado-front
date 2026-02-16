<template>
    <div class="space-y-4">
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
        <UiCard>
            <UiTable>
                <UiTableHeader>
                    <UiTableRow>
                        <UiTableCell v-for="head in tabelHead" :key="head">
                            {{ $t(head) }}
                        </UiTableCell>
                    </UiTableRow>
                </UiTableHeader>
            </UiTable>
            <div class="p-8 text-center">
                <p class="text-muted-foreground">{{ $t('questionnaires.no_data') }}</p>
            </div>
        </UiCard>
    </div>
</template>
<script setup>
const tabelHead = ref([
    'financial_transaction.date', 'common.user', 
    'financial_transaction.type', 'financial_transaction.account_number', 'financial_transaction.description', 
    'common.status', 'common.actions'
])
</script>