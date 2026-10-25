<script setup lang="ts">
  type Compound = ResultRow['compound']
  const props = defineProps<{
    compound: Compound
  }>()

  const compoundUi = {
    SOFT: 'bg-tyre-s',
    MEDIUM: 'bg-tyre-m',
    HARD: 'bg-tyre-h',
    INTERMEDIATE: 'bg-tyre-i',
    WET: 'bg-tyre-w',
  } satisfies Record<Compound[number], string>

  const tyres = computed(() => props.compound.map((c) => {
    return {
      compoundStyle: compoundUi[c],
      compoundTyre: c[0],
    }
  }))
</script>

<template>
  <div class="flex flex-row gap-1">
    <div
      v-for="(item, tyreIndex) in tyres"
      :key="tyreIndex"
      :class="item.compoundStyle"
      class="
        grid size-5 shrink-0 place-items-center rounded-full font-num text-[10px] font-bold text-ink
        inset-ring-2 inset-ring-black/25
      "
    >
      {{ item.compoundTyre }}
    </div>
  </div>
</template>
