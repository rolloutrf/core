import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, basename, dirname } from 'node:path'

const OUT_DIR = 'public/data'
const CLONE_DIR = '/tmp/rolloutrf-data'

// Clone or use existing data repo
if (process.env.DATA_REPO_PATH && existsSync(process.env.DATA_REPO_PATH)) {
  console.log(`Using existing data repo at ${process.env.DATA_REPO_PATH}`)
  var DATA_DIR = process.env.DATA_REPO_PATH
} else {
  if (existsSync(CLONE_DIR)) rmSync(CLONE_DIR, { recursive: true })
  console.log('Cloning rolloutrf/data...')
  execSync('git clone --depth 1 https://github.com/rolloutrf/data.git ' + CLONE_DIR, { stdio: 'inherit' })
  var DATA_DIR = CLONE_DIR
}

// Ensure output directories exist
mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(join(OUT_DIR, 'community-photos'), { recursive: true })
mkdirSync(join(OUT_DIR, 'article-images'), { recursive: true })

// Helper: recursively list all files in a directory
function walkFiles(dir) {
  const results = []
  if (!existsSync(dir)) return results
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkFiles(full))
    } else {
      results.push(full)
    }
  }
  return results
}

function createSlug(value) {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\.md$/i, '')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// 1. Tasks
console.log('Generating tasks.json...')
const tasksDir = join(DATA_DIR, 'Задачи')
const tasks = []
if (existsSync(tasksDir)) {
  const usedTaskSlugs = new Set()
  for (const entry of readdirSync(tasksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const moduleDirName = entry.name
    const moduleMatch = moduleDirName.match(/^\d+\.\s+(.+)$/)
    const moduleName = moduleMatch ? moduleMatch[1].trim() : moduleDirName
    const moduleDir = join(tasksDir, moduleDirName)
    for (const file of readdirSync(moduleDir)) {
      if (file === '.DS_Store') continue
      const filePath = join(moduleDir, file)
      if (!statSync(filePath).isFile()) continue
      const baseSlug = createSlug(`${moduleName}-${file}`) || `task-${tasks.length + 1}`
      let slug = baseSlug
      let duplicateIndex = 2

      while (usedTaskSlugs.has(slug)) {
        slug = `${baseSlug}-${duplicateIndex}`
        duplicateIndex += 1
      }

      usedTaskSlugs.add(slug)

      const rawTaskContent = readFileSync(filePath, 'utf-8')
      const taskContent = rawTaskContent.replace(/\(([^\)]+)\)\[([^\]]+)\]/g, '[$1]($2)')
      const headingMatch = taskContent.match(/^#\s+(.+)$/m)
      const taskName = headingMatch ? headingMatch[1].trim() : file.replace(/\.md$/i, '')
      tasks.push({
        slug,
        name: taskName,
        module: moduleName,
        content: taskContent,
      })
    }
  }
}
writeFileSync(join(OUT_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2))
console.log(`  ${tasks.length} tasks`)

// 2. Specs
console.log('Generating specs.json...')
const specsDir = join(DATA_DIR, 'Спецификации')
const specs = []
if (existsSync(specsDir)) {
  const usedSpecSlugs = new Set()
  const specDirs = readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => parseInt(a.name) - parseInt(b.name))

  for (const dir of specDirs) {
    const dirPath = join(specsDir, dir.name)
    const mdFile = readdirSync(dirPath).find(f => f.endsWith('.md'))
    if (!mdFile) continue
    const titleMatch = mdFile.match(/^\d+\.\s+(.+)\.md$/)
    const title = titleMatch ? titleMatch[1].trim() : mdFile.replace('.md', '')
    const baseSlug = createSlug(dir.name) || `spec-${specs.length + 1}`
    let slug = baseSlug
    let duplicateIndex = 2

    while (usedSpecSlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`
      duplicateIndex += 1
    }

    usedSpecSlugs.add(slug)

    specs.push({
      slug,
      dirName: dir.name,
      title,
      content: readFileSync(join(dirPath, mdFile), 'utf-8'),
    })
  }
}
writeFileSync(join(OUT_DIR, 'specs.json'), JSON.stringify(specs, null, 2))
console.log(`  ${specs.length} specs`)

// 3. Calls
console.log('Generating calls.json...')
const callsDir = join(DATA_DIR, 'Созвоны')
const calls = []
if (existsSync(callsDir)) {
  const callFiles = readdirSync(callsDir)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' }))
  const usedSlugs = new Set()

  for (const file of callFiles) {
    const content = readFileSync(join(callsDir, file), 'utf-8')
    const headingMatch = content.match(/^#\s+(.+)$/m)
    const baseSlug = createSlug(file) || `call-${calls.length + 1}`
    let slug = baseSlug

    let duplicateIndex = 2
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`
      duplicateIndex += 1
    }

    usedSlugs.add(slug)

    calls.push({
      slug,
      title: headingMatch ? headingMatch[1].trim() : file.replace(/\.md$/i, ''),
      content,
    })
  }
}
writeFileSync(
  join(OUT_DIR, 'calls.json'),
  JSON.stringify({
    items: calls,
    primary: calls[0] ?? null,
  }, null, 2)
)
console.log(`  ${calls.length} calls`)

// 4. Articles
console.log('Generating articles.json...')
const articlesDir = join(DATA_DIR, 'Публикации')
const articles = []
const usedArticleSlugs = new Set()

function pushArticle(filePath, slugOverride) {
  if (!existsSync(filePath) || !filePath.endsWith('.md')) return

  let content = readFileSync(filePath, 'utf-8')
  if (content.trim() === '...') return

  const headingMatch = content.match(/^#\s+(.+)$/m)
  const title = headingMatch ? headingMatch[1].trim() : basename(filePath).replace(/\.md$/i, '')
  const baseSlug = slugOverride ?? createSlug(title) ?? `article-${articles.length + 1}`
  let slug = baseSlug
  let duplicateIndex = 2

  while (usedArticleSlugs.has(slug)) {
    slug = `${baseSlug}-${duplicateIndex}`
    duplicateIndex += 1
  }

  usedArticleSlugs.add(slug)

  const articleDir = dirname(filePath)
  const imagesDir = join(articleDir, 'images')
  if (existsSync(imagesDir)) {
    const destDir = join(OUT_DIR, 'article-images', slug)
    mkdirSync(destDir, { recursive: true })
    cpSync(imagesDir, destDir, { recursive: true })
    content = content.replace(/\(images\//g, `(/data/article-images/${slug}/`)
  }

  articles.push({
    slug,
    title,
    content,
  })
}


if (existsSync(articlesDir)) {
  for (const filePath of walkFiles(articlesDir)) {
    pushArticle(filePath)
  }
}

writeFileSync(join(OUT_DIR, 'articles.json'), JSON.stringify(articles, null, 2))
console.log(`  ${articles.length} articles`)

// 5. Community
console.log('Generating community.json...')
const communityFile = join(DATA_DIR, 'Сообщество', 'people.md')
if (existsSync(communityFile)) {
  writeFileSync(
    join(OUT_DIR, 'community.json'),
    JSON.stringify({ content: readFileSync(communityFile, 'utf-8') }, null, 2)
  )
} else {
  writeFileSync(join(OUT_DIR, 'community.json'), JSON.stringify({ content: '' }))
}

// Copy community photos
const photosDir = join(DATA_DIR, 'Сообщество', 'photos')
if (existsSync(photosDir)) {
  cpSync(photosDir, join(OUT_DIR, 'community-photos'), { recursive: true })
  const photoCount = readdirSync(join(OUT_DIR, 'community-photos')).length
  console.log(`  ${photoCount} community photos copied`)
}

// 6. Intro
console.log('Generating intro.json...')
const introDir = join(DATA_DIR, 'Интро')
let introContent = ''
if (existsSync(introDir)) {
  const introFile = readdirSync(introDir).find(f => f.endsWith('.md'))
  if (introFile) {
    introContent = readFileSync(join(introDir, introFile), 'utf-8')
  }
}
writeFileSync(join(OUT_DIR, 'intro.json'), JSON.stringify({ content: introContent }, null, 2))
console.log('  intro.json')

// 7. Video
console.log('Generating video.json...')
writeFileSync(
  join(OUT_DIR, 'video.json'),
  JSON.stringify({
    items: calls,
    primary: calls[0] ?? null,
  }, null, 2)
)
console.log(`  ${calls.length} video items`)

// 8. Vacancies
console.log('Generating vacancies.json...')
const vacancyDir = join(DATA_DIR, 'Вакансии')
const vacancies = []
if (existsSync(vacancyDir)) {
  const usedVacancySlugs = new Set()
  for (const file of readdirSync(vacancyDir)) {
    if (!file.endsWith('.md')) continue
    const title = file.replace(/\.md$/i, '')
    const baseSlug = createSlug(title) || `vacancy-${vacancies.length + 1}`
    let slug = baseSlug
    let duplicateIndex = 2

    while (usedVacancySlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`
      duplicateIndex += 1
    }

    usedVacancySlugs.add(slug)

    vacancies.push({
      slug,
      title,
      content: readFileSync(join(vacancyDir, file), 'utf-8'),
    })
  }
}
writeFileSync(join(OUT_DIR, 'vacancies.json'), JSON.stringify(vacancies, null, 2))
console.log(`  ${vacancies.length} vacancies`)

// 9. Onboarding
console.log('Generating onboarding.json...')
const onboardingDir = join(DATA_DIR, 'Онбординг')
const onboarding = []
if (existsSync(onboardingDir)) {
  const usedOnboardingSlugs = new Set()

  for (const filePath of walkFiles(onboardingDir).sort((a, b) => a.localeCompare(b, 'ru', { numeric: true, sensitivity: 'base' }))) {
    if (!filePath.endsWith('.md')) continue

    const content = readFileSync(filePath, 'utf-8')
    const title = basename(filePath).replace(/\.md$/i, '')
    const headingMatch = content.match(/^#\s+(.+)$/m)
    const baseSlug = createSlug(title) || `onboarding-${onboarding.length + 1}`
    let slug = baseSlug
    let duplicateIndex = 2

    while (usedOnboardingSlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`
      duplicateIndex += 1
    }

    usedOnboardingSlugs.add(slug)

    onboarding.push({
      slug,
      title: headingMatch ? headingMatch[1].trim() : title,
      content,
    })
  }
}
writeFileSync(join(OUT_DIR, 'onboarding.json'), JSON.stringify(onboarding, null, 2))
console.log(`  ${onboarding.length} onboarding docs`)

// 10. HowTo
console.log('Generating howto.json...')
const howtoDir = join(DATA_DIR, 'Инструкции')
const howto = []
if (existsSync(howtoDir)) {
  const usedHowtoSlugs = new Set()
  for (const file of readdirSync(howtoDir).filter(f => f.endsWith('.md')).sort()) {
    const content = readFileSync(join(howtoDir, file), 'utf-8')
    const headingMatch = content.match(/^#\s+(.+)$/m)
    const title = headingMatch ? headingMatch[1].trim() : file.replace(/\.md$/i, '')
    const baseSlug = createSlug(file) || `howto-${howto.length + 1}`
    let slug = baseSlug
    let duplicateIndex = 2
    while (usedHowtoSlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`
      duplicateIndex += 1
    }
    usedHowtoSlugs.add(slug)
    howto.push({ slug, title, content })
  }
}
writeFileSync(join(OUT_DIR, 'howto.json'), JSON.stringify(howto, null, 2))
console.log(`  ${howto.length} howto docs`)

// 11. Strategy
console.log('Generating strategy.json...')
const strategyDir = join(DATA_DIR, 'Стратегия')
const strategy = []
if (existsSync(strategyDir)) {
  const usedStrategySlugs = new Set()
  for (const file of readdirSync(strategyDir).filter(f => f.endsWith('.md')).sort()) {
    const content = readFileSync(join(strategyDir, file), 'utf-8')
    const headingMatch = content.match(/^#\s+(.+)$/m)
    const title = headingMatch ? headingMatch[1].trim() : file.replace(/\.md$/i, '')
    const baseSlug = createSlug(file) || `strategy-${strategy.length + 1}`
    let slug = baseSlug
    let duplicateIndex = 2
    while (usedStrategySlugs.has(slug)) {
      slug = `${baseSlug}-${duplicateIndex}`
      duplicateIndex += 1
    }
    usedStrategySlugs.add(slug)
    strategy.push({ slug, title, content })
  }
}
writeFileSync(join(OUT_DIR, 'strategy.json'), JSON.stringify(strategy, null, 2))
console.log(`  ${strategy.length} strategy docs`)

console.log('Prebuild complete!')
