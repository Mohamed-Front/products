<template>
  <div class="auth-layout grid grid-cols-12 content-center">
    <div class="flex col-span-12 p-4 justify-center">

    </div>

    <div class="flex justify-center col-span-12 p-4 my-2">
      <va-card class="auth-layout__card">
        <va-card-content>
          <va-tabs v-model="tabIndex" center>
            <template #tabs>
              <va-tab name="login">Login</va-tab>

            </template>
          </va-tabs>

          <va-separator />

          <div class="p-3">
            <router-view />
          </div>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script>
  import VuesticLogo from '../components/VuesticLogo.vue'
  import { useI18n } from 'vue-i18n'

  export default {
    name: 'AuthLayout',
    components: { VuesticLogo },
    setup() {
      const { t } = useI18n()
      return { t }
    },
    data() {
      return {
        selectedTabIndex: 0,
      }
    },
    computed: {
      tabIndex: {
        set(tabName) {
          this.$router.push({ name: tabName })
        },
        get() {
          return this.$route.name
        },
      },
    },
  }
</script>

<style lang="scss">
  .auth-layout {
    min-height: 100vh;
    background-image: linear-gradient(to right, var(--va-background-primary), var(--va-white));

    &__card {
      width: 100%;
      max-width: 1000px;
    }
  }
</style>
