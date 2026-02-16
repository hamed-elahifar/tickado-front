<template>
    <div class="p-4 lg:p-6">
        <div class="mb-6">
            <div class="mb-6">
                <CommonPageTitle :title="$t('dashboard.settings')" />
            </div>
            <UiTabIndex :selected-item="selectedTab" :tab-items="tabItems" @change-tab="(p) => selectedTab = p" />
        </div>
        <transition name="fade-slide" mode="out-in">
            <SettingsIdentity v-if="selectedTab == 'identity'"/>
            <SettingsSecurity v-else-if="selectedTab == 'security'" />
        </transition>
    </div>

</template>
<script setup>
import {Settings, Users, MessageSquare, Shield, Image, BookOpen, BellRing} from "lucide-vue-next"

const selectedTab = ref('identity');
const tabItems = ref([
    {title: 'settings.identity', icon: Users, value: '0', id: 'identity'},
    {title: 'settings.security', icon: Shield, value: '1', id: 'security'},
    {title: 'settings.banners', icon: Image, value: '2', id: 'banners'},
    {title: 'settings.stories', icon: BookOpen, value: '3', id: 'stories'},
    {title: 'settings.tickets', icon: MessageSquare, value: '4', id: 'tickets'},
    {title: 'settings.notifications', icon: BellRing, value: '5', id: 'notifications'},
    {title: 'settings.invite_friends', icon: Settings, value: '6', id: 'invite_friends'},
])
</script>