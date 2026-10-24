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
  <header class="bg-muted rounded-lg px-4 py-3 flex items-center justify-between">
    <div class="flex items-center gap-2">
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
          base: 'w-90',
        }"
        icon="i-lucide-search"
        placeholder="Пилот, этап, сессия…"
        size="lg"
      />
      <USelect
        v-model="selectedOption"
        :items="options"
        :ui="{
          base: 'w-40',
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
          itemTrailingIcon: 'text-accent size-4',
        }"
        label-key="label"
        selected-icon="i-lucide-check"
        size="lg"
        value-key="id"
      />
    </div>
  </header>
</template>
