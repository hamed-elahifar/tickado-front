<template>
    <div class="p-4 lg:p-6">
        <div class="mb-6">
            <div class="mb-6">
                <CommonPageTitle 
                :title="$t('finance.financial_management')" 
                :description="$t('finance.transactions_and_withdrawals')">
                </CommonPageTitle>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 mb-6 gap-4">
                <UiCard v-for="(item, index) in cardItems" :key="index" class="shadow-primary">
                    <div class="flex items-start justify-between p-5">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground mb-2">{{ $t(item.title) }}</p>
                            <p class="text-2xl font-semibold">{{ item.value }}</p>
                        </div>
                        <span class="size-6 bg-amber-500/30 flex items-center justify-center rounded-md">
                            <component :is="item.icon" class="size-4 text-primary"  />
                        </span>
                    </div>
                </UiCard>
            </div>
            <UiTabIndex :tab-items="tabItems" :selected-item="selectedTab" @change-tab="(p) => selectedTab = p" />
        </div>
        <transition name="fade-slide" mode="out-in">
            <DashboardFinanceTransactionsTabel />
        </transition>
    </div>
</template>
<script setup>
import {TrendingUp, TrendingDown, Wallet, Clock3, CreditCard} from "lucide-vue-next"
const cardItems = ref([
    {title: 'finance.pending_approval', value: '0', icon: Clock3},
    {title: 'finance.pending_amount', value: '0', icon: Wallet},
    {title: 'finance.total_deposits', value: '0', icon: TrendingUp},
    {title: 'finance.total_withdrawals', value: '0', icon: TrendingDown},
])
const selectedTab = ref('transactions');
const tabItems = ref([
    {title: 'finance.transactions', icon: Wallet, id: 'transactions', value: '0'},
    {title: 'finance.withdrawal_requests', icon: CreditCard, id: 'withdrawal_requests', value: '0'}
])
</script>