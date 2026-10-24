import type { PlopTypes } from '@turbo/gen'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function editJson(file: string, edit: (json: any) => void) {
  const json = JSON.parse(readFileSync(file, 'utf8'))
  edit(json)
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`)
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('app', {
    description: 'Новое приложение в apps/ на слое ui',
    prompts: [
      { type: 'input', name: 'name', message: 'Код приложения (kebab-case):' },
      { type: 'input', name: 'title', message: 'Название (заголовок вкладки):' },
    ],
    actions: [
      // все файлы из templates/app → apps/<name>
      {
        type: 'addMany',
        destination: '{{ turbo.paths.root }}/apps/{{ name }}',
        base: 'templates/app',
        templateFiles: 'templates/app/**/*',
      },
      // JSON правим кодом: скрипт dev в корне
      (answers: any) => {
        editJson(join(answers.turbo.paths.root, 'package.json'), (pkg) => {
          pkg.scripts[`dev:${answers.name}`] = `pnpm --filter @multi/${answers.name} dev`
        })
        return 'корень: скрипт dev добавлен'
      },
    ],
  })
}
