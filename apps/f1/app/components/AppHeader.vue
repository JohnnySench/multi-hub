<script setup lang="ts">
  const route = useRoute()
  const breadcrumbs = computed(() => {
    return [
      {
        label: route.meta.title,
        active: false,
      },
    ]
  })

  const query = shallowRef('')

  const options = [
    {
      id: 2025,
      label: 'Сезон 2025',
    },
    {
      id: 2026,
      label: 'Сезон 2026',
    },
  ]

  const selectedOption = shallowRef(2026)
</script>

<template>
  <header class="flex items-center justify-between rounded-lg bg-muted px-2 py-3 sm:px-4">
    <div class="flex items-center gap-1 sm:gap-2">
      <AppLogo />
      <span class="text-muted">/</span>
      <UBreadcrumb :items="breadcrumbs">
        <template #separator>
          <span class="text-muted">/</span>
        </template>
      </UBreadcrumb>
    </div>
    <div class="flex flex-row gap-4">
      <UInput
        v-model.trim="query"
        :ui="{
          base: 'sm:w-50 md:w-70 lg:w-90',
        }"
        class="hidden sm:block"
        icon="i-lucide-search"
        placeholder="Пилот, этап, сессия…"
        size="lg"
      />
      <USelect
        v-model="selectedOption"
        :items="options"
        :ui="{
          base: 'w-36 text-sm sm:w-40 sm:gap-2 sm:px-3 sm:py-2',
          trailingIcon: 'size-4 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:size-5',
          itemTrailingIcon: 'size-4 text-accent',
        }"
        label-key="label"
        selected-icon="i-lucide-check"
        size="md"
        value-key="id"
      >
        <template #default="{ modelValue }">
          <span class="sm:hidden">{{ modelValue }}</span>
          <span class="hidden sm:inline">Сезон {{ modelValue }}</span>
        </template>
      </USelect>
    </div>
  </header>
</template>
