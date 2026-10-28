<script setup lang="ts">
  type Compound = ResultRow['compound']
  const props = defineProps<{
    compound: Compound
  }>()

  /** Состав без null: null — отдельный случай ниже */
  type KnownCompound = NonNullable<Compound[number]>

  const compoundUi = {
    SOFT: 'bg-tyre-s',
    MEDIUM: 'bg-tyre-m',
    HARD: 'bg-tyre-h',
    INTERMEDIATE: 'bg-tyre-i',
    WET: 'bg-tyre-w',
    /** Неизвестный состав (тесты, старые гонки) — серый кружок с «?» */
    UNKNOWN: 'bg-carbon-400',
    TEST_UNKNOWN: 'bg-carbon-400',
  } satisfies Record<KnownCompound, string>

  const UNKNOWN_COMPOUNDS = new Set<Compound[number]>([null, 'UNKNOWN', 'TEST_UNKNOWN'])

  const tyres = computed(() => props.compound.map((c) => {
    return {
      compoundStyle: compoundUi[c ?? 'UNKNOWN'],
      compoundTyre: UNKNOWN_COMPOUNDS.has(c) ? '?' : c?.[0],
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
