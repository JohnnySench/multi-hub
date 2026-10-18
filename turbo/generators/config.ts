import type { PlopTypes } from '@turbo/gen'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function editJson(file: string, edit: (json: any) => void) {
  const json = JSON.parse(readFileSync(file, 'utf8'))
  edit(json)
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`)
}

function sortKeys(obj: Record<string, string>) {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('app', {
    description: 'Новое приложение в apps/ на слое shell',
    prompts: [
      { type: 'input', name: 'name', message: 'Код приложения (kebab-case, он же префикс роутов):' },
      { type: 'input', name: 'title', message: 'Название в меню выбора приложений:' },
    ],
    actions: [
      // все файлы из templates/app → apps/<name>
      {
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/apps/{{ name }}',
        base: 'templates/app',
        templateFiles: 'templates/app/**/*',
      },
      // дописать в конец extends у portal (конец — чтобы не менять приоритет существующих)
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/apps/portal/nuxt.config.ts',
        pattern: /(extends: \[[^\]]*?)(\n {2}\])/,
        template: '$1\n    \'@multi/{{ name }}\',$2',
      },
      // JSON правим кодом: добавить зависимость portal (с сортировкой ключей, иначе lint) и скрипт dev в корне
      (answers: any) => {
        const root = answers.turbo.paths.root
        editJson(join(root, 'apps/portal/package.json'), (pkg) => {
          pkg.dependencies[`@multi/${answers.name}`] = 'workspace:*'
          pkg.dependencies = sortKeys(pkg.dependencies)
        })
        editJson(join(root, 'package.json'), (pkg) => {
          pkg.scripts[`dev:${answers.name}`] = `pnpm --filter @multi/${answers.name} dev`
        })
        return 'portal: зависимость добавлена; корень: скрипт dev добавлен'
      },
    ],
  })
}
