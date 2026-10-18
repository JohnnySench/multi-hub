import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    overrides: {
      'vue/attributes-order': ['error', {
        order: [
          'DEFINITION',          // is
          'LIST_RENDERING',      // v-for
          'CONDITIONALS',        // v-if / v-else-if / v-else / v-show
          'RENDER_MODIFIERS',    // v-once / v-pre
          'GLOBAL',              // id
          ['UNIQUE', 'SLOT'],    // key, ref, v-slot
          'TWO_WAY_BINDING',     // v-model
          'OTHER_DIRECTIVES',    // свои директивы
          'ATTR_DYNAMIC',        // :prop — по алфавиту
          'ATTR_STATIC',         // prop="..." — по алфавиту
          'ATTR_SHORTHAND_BOOL', // disabled (без значения)
          'CONTENT',             // v-html / v-text
          'EVENTS',              // @click — всегда последними
        ],
        alphabetical: true,
      }],
    },
  },
  typescript: true,
  stylistic: { indent: 2, quotes: 'single', semi: false },
  rules: { 'no-console': 'error' }
})
