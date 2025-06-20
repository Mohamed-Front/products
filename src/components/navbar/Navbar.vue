<template>

  <va-navbar class="nave w-full flex justify-between shadow-xl my-3 mx-5 rounded-xl" style="color:white !important; direction: ltr !important;">
    <template #right>
      <div class="left">
        <h1>{{ translatedRouteName }}</h1>
      </div>
    </template>
    <template #left>
      <div class="right flex items-center gap-4">
        <va-icon-menu-collapsed
          :class="{ 'x-flip': isSidebarMinimized }"
          class="va-navbar__item"
          :color="colors.primary"
          @click="isSidebarMinimized = !isSidebarMinimized"
        />
        <LocaleSelect id="local-switcher"></LocaleSelect>
        <Button  @click="handleLogout"  icon="pi pi-sign-out" ></Button>

      </div>
    </template>
  </va-navbar>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../../stores/global-store'
import { useAuthStore } from '../../stores/Auth'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useColors } from 'vuestic-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
import VuesticLogo from '../VuesticLogo.vue'
import VaIconMenuCollapsed from '../icons/VaIconMenuCollapsed.vue'
import AppNavbarActions from './components/AppNavbarActions.vue'
import LocaleSelect from '../LocaleSelect.vue'


const GlobalStore = useGlobalStore()
const authStore = useAuthStore()
const { isSidebarMinimized, userName } = storeToRefs(GlobalStore)
const { getColors } = useColors()
const colors = computed(() => getColors())

const handleLogout =  () => {
   authStore.handleLogout()
}

// Computed property to reactively track route name changes and translate
const translatedRouteName = computed(() => {
  return router.currentRoute.value.name ? t(router.currentRoute.value.name) : ''
})
</script>

<style lang="scss" scoped>
.va-navbar {
  box-shadow: var(--va-box-shadow);
  z-index: 2;
  background-color: #ffffff !important;
  padding: 0.5rem 1rem;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.x-flip {
  transform: scaleX(-100%);
}

.logout-btn {
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

@media screen and (max-width: 768px) {
  .va-navbar {
    padding: 0.5rem;
  }

  .right {
    gap: 0.5rem;
  }

  .logout-btn {
    padding: 0.35rem;
  }
}
</style>
