export interface CommunityPerson {
  slug: string
  name: string
  bio: string
  photoUrl: string | null
  telegram: string | null
}

function createSlug(value: string) {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function parseCommunityMarkdown(markdown: string): CommunityPerson[] {
  const sections = markdown.split(/^## /m).slice(1)

  return sections
    .map((section) => {
      const lines = section.split('\n')
      const name = lines[0].trim()
      const photoMatch = section.match(/!\[.*?\]\((photos\/[^)]+)\)/)
      const telegramMatch = section.match(/Telegram:\s*(https?:\/\/\S+)/)
      const bio = lines
        .slice(1)
        .filter((line) => !line.startsWith('![') && !line.startsWith('Telegram:') && line.trim() !== '---')
        .join('\n')
        .trim()

      return {
        slug: createSlug(name),
        name,
        bio,
        photoUrl: photoMatch ? '/data/community-photos/' + photoMatch[1].replace('photos/', '') : null,
        telegram: telegramMatch ? telegramMatch[1] : null,
      }
    })
    .filter((person) => person.name && person.bio)
}

export function getCommunityInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}
