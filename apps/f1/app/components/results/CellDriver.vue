<script setup lang="ts">
  type FullName = ResultRow['fullName']
  type NameAcronym = ResultRow['nameAcronym']
  type TeamColor = ResultRow['teamColor']

  const props = defineProps<{
    fullName: FullName
    nameAcronym: NameAcronym
    teamColor: TeamColor
  }>()
</script>

<template>
  <div class="flex flex-row items-center gap-2">
    <span :style="{ backgroundColor: `#${props.teamColor}` }" class="h-5 w-1 rounded-xs" />
    <p class="num text-white">
      {{ props.nameAcronym }}
    </p>
    <p>{{ props.fullName }}</p>
  </div>
</template>
