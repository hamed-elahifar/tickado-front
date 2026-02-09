<template>
    <!-- Mobile Menu Button -->
     <header class="lg:hidden flex items-center justify-between h-12 mb-4 p-4 border-b sticky top-0 bg-background z-10">
        <button
          @click="isSidebarOpen = true"
          variant="ghost"
          :aria-label="isSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
          :class="{'opacity-0' : isSidebarOpen}"
          class="lg:hidden p-2 rounded-md 
          bg-sidebar text-sidebar-foreground hover:bg-sidebar/90 transition-colors"
        >
          <Menu class="size-6" />
        </button>
        <div class="flex items-center gap-2">
          <button
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="p-2 rounded-full hover:bg-sidebar/10 transition-colors relative"
          >
            <User />
            <!-- User Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 bg-white dark:bg-sidebar rounded-md shadow-lg z-50 min-w-40"
            >
              <button
                @click="handleLogout"
                class="w-full text-right rtl:text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-sidebar/70 transition-colors border-t"
              >
                {{ $t('common.logout') }}
              </button>
            </div>
          </button>
        </div>
      </header>
    
    <section class="flex w-full min-h-screen">
      <!-- Overlay for Mobile -->
      <Transition name="fade">
        <div
          v-if="isSidebarOpen"
          @click="isSidebarOpen = false"
          class="lg:hidden fixed inset-0 bg-black/50 z-40 top-0"
        />
      </Transition>

      <!-- Sidebar -->
      <aside
        class="
          fixed lg:static top-0
          h-screen w-1/6 min-w-56
          bg-sidebar
          text-sidebar-foreground
          flex flex-col
          z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:rtl:translate-x-0 lg:bg-sidebar lg:p-4
          overflow-y-auto
        "
        :class="[
          isSidebarOpen 
            ? 'translate-x-0 rtl:translate-x-0' 
            : '-translate-x-full rtl:translate-x-full'
        ]"
      >
        <DashboardSideBarHead />
        <DashboardSideBarMain />
        <!-- <DashboardSideBarFooter /> -->
      </aside>

      <!-- Main Content -->
      <main
        class="
          flex-1 w-full
          min-h-screen
          flex flex-col
          px-4 lg:px-5
          py-4 lg:py-0
          bg-background
          text-foreground
          rounded-lg lg:rounded-none
          transition-all duration-300
          overflow-y-auto
        "
      >      
        <div class="lg:hidden h-8" />
        <slot />
      </main>
  </section>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Menu, User } from "lucide-vue-next"
import { useRoute } from 'vue-router'

const route = useRoute()
const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)

const handleLogout = () => {
  // اینجا logic خروج را اضافه کنید
  console.log('User logged out')
  isUserMenuOpen.value = false
  // مثال: await logout()
  // router.push('/auth/login')
}

watch(route, () => {
  isSidebarOpen.value = false
})
</script>