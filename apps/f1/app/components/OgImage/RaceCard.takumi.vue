<script setup lang="ts">
/**
 * OG-карточка гонки в стиле «Pit wall»: этап + подиум.
 * Рендерится на сервере через nuxt-og-image (satori) для ссылок в Telegram и соцсетях.
 * Пропсы приходят из results.vue (defineOgImageComponent).
 *
 * ВАЖНО: satori-компонент использует только инлайн-стили — Tailwind-классы
 * (в т.ч. произвольные значения) в рендере nuxt-og-image не раскрываются.
 */
  const props = defineProps<{
    /** Номер этапа без R, например 1 */
    round?: number | null
    /** Признак тестов */
    isTesting?: boolean
    /** Страна или место этапа */
    place?: string
    /** Название сессии: «Гонка», «Спринт» */
    sessionLabel?: string
    /** Подиум: топ-3 со цветами команд */
    podium?: Array<{ position: number, nameAcronym: string, teamName: string, teamColor?: string }>
    year?: number | null
    /** Семейство шрифта из fonts-available (должно быть в конфиге @nuxt/fonts) */
    fontFamily?: string
  }>()

  const lead = props.round ? `R${props.round}` : props.isTesting ? 'ТЕСТЫ' : null
  const title = [lead, props.place && ` · ${props.place}`, props.sessionLabel && ` · ${props.sessionLabel}`].filter(Boolean).join('')

  function stripeStyle(i: number) {
    return {
      position: 'absolute' as const,
      left: `${i * 18 - 30}px`,
      top: 0,
      bottom: 0,
      width: '10px',
      backgroundColor: i % 2 === 0 ? '#E10600' : 'transparent',
      transform: 'skewX(-20deg)',
    }
  }

  function logoBarStyle(i: number) {
    return {
      width: '8px',
      height: i === 1 ? '22px' : '32px',
      backgroundColor: i === 3 ? '#E10600' : '#ffffff',
      transform: 'skewX(-14deg)',
    }
  }

  function positionColor(position: number) {
    return position === 1 ? '#FF1E10' : position === 3 ? '#FFD60A' : '#E4E4EA'
  }

  /** OpenF1 возвращает team_colour без «#» («00D7B6») — добавляем, если нужно */
  const teamColor = (color?: string) => (color && !color.startsWith('#') ? `#${color}` : color) || '#8D8D99'
</script>

<template>
  <div
    style="
      position: relative;
      width: 1200px;
      height: 630px;
      background: #08080A;
      color: #ffffff;
      font-family: 'Roboto Flex', sans-serif;
      padding: 40px;
      box-sizing: border-box;
      overflow: hidden;
    "
  >
    <!-- Верхняя красная полоса -->
    <div style="position: absolute; top: 0; left: 0; right: 0; height: 8px; background: #E10600" />

    <!-- Диагональные красные сегменты слева, как эфирная плашка -->
    <div
      v-for="i in 8"
      :key="i"
      :style="stripeStyle(i)"
    />

    <!-- Шапка: логотип-полосы + название -->
    <div style="display: flex; align-items: flex-end; gap: 16px; position: relative; z-index: 1">
      <div style="display: flex; align-items: flex-end; gap: 4px">
        <div
          v-for="i in [0, 1, 2, 3]"
          :key="i"
          :style="logoBarStyle(i)"
        />
      </div>
      <div style="font-size: 52px; font-weight: 700; line-height: 1">
        ФОРМУЛА 1
      </div>
    </div>

    <div style="position: relative; z-index: 1; display: flex; flex-direction: column; justify-content: space-between; height: 490px">
      <!-- Этап -->
      <div v-if="title" style="display: flex; margin-top: 28px">
        <div
          style="
            background: #E10600;
            padding: 14px 28px;
            font-size: 38px;
            font-weight: 700;
            transform: skewX(-12deg);
          "
        >
          <span style="display: inline-block; transform: skewX(12deg)">{{ title }}</span>
        </div>
      </div>

      <!-- Подиум -->
      <div>
        <div style="font-size: 30px; font-weight: 700; color: #C77DFF; margin-bottom: 14px">
          PODIUM
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px">
          <div
            v-for="row in podium"
            :key="row.position"
            style="
              display: flex;
              align-items: center;
              gap: 20px;
              background: #1D1D22;
              border-radius: 12px;
              padding: 16px 24px;
            "
          >
            <div
              :style="{ color: positionColor(row.position) }"
              style="width: 40px; text-align: right; font-size: 38px; font-weight: 700"
            >
              {{ row.position }}
            </div>
            <div style="display: flex; align-items: center; gap: 16px">
              <div
                :style="{ backgroundColor: teamColor(row.teamColor) }"
                style="width: 6px; height: 34px; border-radius: 3px"
              />
              <div style="font-size: 38px; font-weight: 700">
                {{ row.nameAcronym }}
              </div>
            </div>
            <div style="margin-left: auto; font-size: 24px; color: #8D8D99">
              {{ row.teamName }}
            </div>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <div style="display: flex; justify-content: space-between; font-size: 24px; color: #8D8D99">
        <div>multi-hub · гонки из OpenF1</div>
        <div v-if="year">
          {{ year }}
        </div>
      </div>
    </div>
  </div>
</template>
