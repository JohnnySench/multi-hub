<script setup lang="ts">
  type FullName = ResultRow['fullName']
  type NameAcronym = ResultRow['nameAcronym']
  type TeamColor = ResultRow['teamColor']

  /** Без fullName — короткая метка (полоска + код), как в селекте этапа */
  const props = withDefaults(defineProps<{
    fullName?: FullName
    nameAcronym?: NameAcronym
    teamColor?: TeamColor
    loading?: boolean
  }>(), {
    fullName: undefined,
    nameAcronym: undefined,
    teamColor: undefined,
    loading: false,
  })
</script>

<template>
  <div class="flex flex-row items-center gap-2">
    <template v-if="props.loading">
      <USkeleton class="h-5 w-1 rounded-xs" />
      <USkeleton class="h-4 w-8 rounded-xs" />
    </template>
    <template v-else>
      <span :style="{ backgroundColor: `#${props.teamColor}` }" class="h-5 w-1 rounded-xs" />
      <p class="num text-white">
        {{ props.nameAcronym }}
      </p>
      <p v-if="props.fullName">
        {{ props.fullName }}
      </p>
    </template>
  </div>
</template>
