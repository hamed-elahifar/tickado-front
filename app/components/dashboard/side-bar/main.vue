<template>
    <div
      class="relative overflow-hidden h-[calc(100vh-8rem)]"
      style="
        --radix-scroll-area-corner-width: 0px;
        --radix-scroll-area-corner-height: 0px;
      "
    >
      <div
        class="h-full w-full rounded-[inherit]"
      >
        <div class="table min-w-full">
          <nav class="p-3 space-y-1">
            <NuxtLink v-for="item in data" :key="item.title"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all 
              hover:bg-accent hover:text-accent-foreground text-sm"
              :class="{'bg-primary text-primary-foreground': $route.path == item.route}"
              :to="item.route"
              :prefetch="false"
              >
              <component :is="item.icon" class="size-5" />
              <span class="font-medium">{{$t(item.title)}}</span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </div>
</template>
<script setup>
import {Users, Building2, LayoutDashboard, UserCog, FileText, Gift, Wallet, Settings} from "lucide-vue-next"
const {locale} = useI18n()
const data = ref([
    { title: 'dashboard.dashboard', icon: LayoutDashboard, route: '/dashboard' },
    { title: 'dashboard.user_management', icon: Users, route: '/dashboard/user-managment' },
    { title: 'dashboard.customers', icon: Building2, route: '/dashboard/customers' },
    { title: 'dashboard.partners', icon: UserCog, route: '/dashboard/collabrators' },
    { title: 'dashboard.questionnaires', icon: FileText, route: '/dashboard/questionnaires' },
    { title: 'dashboard.rewards_lottery', icon: Gift, route: '/dashboard/rewards' },
    { title: 'dashboard.finance', icon: Wallet, route: '/dashboard/finance' },
    { title: 'dashboard.settings', icon: Settings , route: '/dashboard/settings' }
])
</script>