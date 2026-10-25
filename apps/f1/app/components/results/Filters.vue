<script setup lang="ts">
  import type { Meeting } from '~/composables/results/useMeetings.ts'

  const items = [
    {
      label: 'П1',
      icon: 'i-lucide-user',
    },
    {
      label: 'Спринт-квала',
      icon: 'i-lucide-lock',
    },
    {
      label: 'Спринт',
      icon: 'i-lucide-lock',
    },
    {
      label: 'Квала',
      icon: 'i-lucide-lock',
    },
    {
      label: 'Гонка',
      icon: 'i-lucide-lock',
    },
  ]

  const meeting = useRouteQuery<Meeting['meeting_key']>('meeting', undefined, {
    transform: { get: Number, set: Number },
    mode: 'push',
  })

  const { meetings } = useMeetings()
</script>

<template>
  <div class="flex flex-row items-center gap-x-2">
    <USelectMenu
      v-model="meeting"
      :items="meetings"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
      }"
      class="w-50"
      label-key="countryName"
      value-key="meetingKey"
    >
      <template #item="{ item, index }">
        <div>
          <span v-if="item.isCancelled">—</span>
          <span v-else>{{ `R${index + 1}` }}</span>
          <span>{{ item.countryName }}</span>
          <span>{{ item.location }}</span>
        </div>
      </template>
    </USelectMenu>
    <UTabs :items="items" />
  </div>
</template>
