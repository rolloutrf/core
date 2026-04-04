import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join, basename } from 'node:path'

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

// 1. Tasks
console.log('Generating tasks.json...')
const tasksDir = join(DATA_DIR, 'Tasks')
const tasks = []
if (existsSync(tasksDir)) {
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
      tasks.push({
        name: file,
        module: moduleName,
        content: readFileSync(filePath, 'utf-8'),
      })
    }
  }
}
writeFileSync(join(OUT_DIR, 'tasks.json'), JSON.stringify(tasks, null, 2))
console.log(`  ${tasks.length} tasks`)

// 2. Specs
console.log('Generating specs.json...')
const specsDir = join(DATA_DIR, 'Specs')
const specs = []
if (existsSync(specsDir)) {
  const specDirs = readdirSync(specsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => parseInt(a.name) - parseInt(b.name))

  for (const dir of specDirs) {
    const dirPath = join(specsDir, dir.name)
    const mdFile = readdirSync(dirPath).find(f => f.endsWith('.md'))
    if (!mdFile) continue
    const titleMatch = mdFile.match(/^\d+\.\s+(.+)\.md$/)
    const title = titleMatch ? titleMatch[1].trim() : mdFile.replace('.md', '')
    specs.push({
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
const callsDir = join(DATA_DIR, 'Calls')
const calls = []
if (existsSync(callsDir)) {
  const callFiles = readdirSync(callsDir).filter(file => file.endsWith('.md')).sort()

  for (const file of callFiles) {
    if (!file.endsWith('.md')) continue
    calls.push({
      title: file.replace(/\.md$/i, ''),
      content: readFileSync(join(callsDir, file), 'utf-8'),
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
const articlesDir = join(DATA_DIR, 'Articles')
const articles = []
if (existsSync(articlesDir)) {
  for (const filePath of walkFiles(articlesDir)) {
    if (!filePath.endsWith('.md')) continue
    articles.push({
      title: basename(filePath).replace(/\.md$/i, ''),
      content: readFileSync(filePath, 'utf-8'),
    })
  }
}
writeFileSync(join(OUT_DIR, 'articles.json'), JSON.stringify(articles, null, 2))
console.log(`  ${articles.length} articles`)

// 5. Community
console.log('Generating community.json...')
const communityFile = join(DATA_DIR, 'Community', 'people.md')
if (existsSync(communityFile)) {
  writeFileSync(
    join(OUT_DIR, 'community.json'),
    JSON.stringify({ content: readFileSync(communityFile, 'utf-8') }, null, 2)
  )
} else {
  writeFileSync(join(OUT_DIR, 'community.json'), JSON.stringify({ content: '' }))
}

// Copy community photos
const photosDir = join(DATA_DIR, 'Community', 'photos')
if (existsSync(photosDir)) {
  cpSync(photosDir, join(OUT_DIR, 'community-photos'), { recursive: true })
  const photoCount = readdirSync(join(OUT_DIR, 'community-photos')).length
  console.log(`  ${photoCount} community photos copied`)
}

// 6. Video
console.log('Generating video.json...')
const videoDir = join(DATA_DIR, 'Intro')
let videoContent = ''
if (existsSync(videoDir)) {
  const videoFile = readdirSync(videoDir).find(f => f.endsWith('.md'))
  if (videoFile) {
    videoContent = readFileSync(join(videoDir, videoFile), 'utf-8')
  }
}
writeFileSync(join(OUT_DIR, 'video.json'), JSON.stringify({ content: videoContent }, null, 2))
console.log('  video.json')

// 7. Vacancies
console.log('Generating vacancies.json...')
const vacancyDir = join(DATA_DIR, 'Vacancy')
const vacancies = []
if (existsSync(vacancyDir)) {
  for (const file of readdirSync(vacancyDir)) {
    if (!file.endsWith('.md')) continue
    vacancies.push({
      title: file.replace(/\.md$/i, ''),
      content: readFileSync(join(vacancyDir, file), 'utf-8'),
    })
  }
}
writeFileSync(join(OUT_DIR, 'vacancies.json'), JSON.stringify(vacancies, null, 2))
console.log(`  ${vacancies.length} vacancies`)

console.log('Prebuild complete!')
