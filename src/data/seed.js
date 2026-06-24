import Database from 'better-sqlite3'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..')

// Open / create DB
const db = new Database(join(root, 'portfolio.db'))

// Apply schema
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
db.exec(schema)

// Seed placeholder rows if table is empty
const count = db.prepare('SELECT COUNT(*) as n FROM projects').get().n
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (title, category, cover_image, images, description, client, role, year, tags)
    VALUES (@title, @category, @cover_image, @images, @description, @client, @role, @year, @tags)
  `)

  const placeholders = [
    // Industry Work
    {
      title: 'Vogue Italia — Spring Editorial',
      category: 'industry-work',
      cover_image: '/images/industry-work/vogue-spring.jpg',
      images: JSON.stringify(['/images/industry-work/vogue-spring.jpg']),
      description: 'Spring/Summer editorial exploring the tension between structure and fluidity in contemporary womenswear.',
      client: 'Vogue Italia',
      role: 'Fashion Stylist',
      year: 2024,
      tags: JSON.stringify(['editorial', 'womenswear', 'print']),
    },
    {
      title: 'SSENSE — Campaign AW24',
      category: 'industry-work',
      cover_image: '/images/industry-work/ssense-aw24.jpg',
      images: JSON.stringify(['/images/industry-work/ssense-aw24.jpg']),
      description: 'Autumn/Winter campaign for SSENSE digital platform featuring emerging designers.',
      client: 'SSENSE',
      role: 'Creative Stylist',
      year: 2024,
      tags: JSON.stringify(['campaign', 'digital', 'luxury']),
    },
    {
      title: 'Dazed — Emerging Designers',
      category: 'industry-work',
      cover_image: '/images/industry-work/dazed-emerging.jpg',
      images: JSON.stringify(['/images/industry-work/dazed-emerging.jpg']),
      description: 'Feature story on five emerging designers reshaping London fashion week.',
      client: 'Dazed Magazine',
      role: 'Fashion Editor',
      year: 2023,
      tags: JSON.stringify(['editorial', 'emerging', 'london']),
    },
    // Creative Direction
    {
      title: 'Maison Léa — Brand Identity',
      category: 'creative-direction',
      cover_image: '/images/creative-direction/maison-lea.jpg',
      images: JSON.stringify(['/images/creative-direction/maison-lea.jpg']),
      description: 'Complete visual identity for Maison Léa, a Paris-based atelier. Concept rooted in archival textile research.',
      client: 'Maison Léa',
      role: 'Creative Director',
      year: 2024,
      tags: JSON.stringify(['branding', 'identity', 'atelier']),
    },
    {
      title: 'Soft Hours — Launch Campaign',
      category: 'creative-direction',
      cover_image: '/images/creative-direction/soft-hours.jpg',
      images: JSON.stringify(['/images/creative-direction/soft-hours.jpg']),
      description: 'Creative direction for the launch campaign of Soft Hours, a slow-fashion label focused on natural dyes.',
      client: 'Soft Hours',
      role: 'Creative Director',
      year: 2023,
      tags: JSON.stringify(['campaign', 'slow-fashion', 'natural']),
    },
    // Photography
    {
      title: 'Between Seasons',
      category: 'photography',
      cover_image: '/images/photography/between-seasons.jpg',
      images: JSON.stringify(['/images/photography/between-seasons.jpg']),
      description: 'Personal series exploring transitional light and the body in landscape.',
      client: null,
      role: 'Photographer',
      year: 2024,
      tags: JSON.stringify(['personal', 'landscape', 'body']),
    },
    {
      title: 'Studio Portraits',
      category: 'photography',
      cover_image: '/images/photography/studio-portraits.jpg',
      images: JSON.stringify(['/images/photography/studio-portraits.jpg']),
      description: 'Controlled studio work examining texture, shadow, and material presence.',
      client: null,
      role: 'Photographer',
      year: 2023,
      tags: JSON.stringify(['studio', 'portrait', 'texture']),
    },
  ]

  const insertMany = db.transaction((rows) => rows.forEach((r) => insert.run(r)))
  insertMany(placeholders)
  console.log(`Seeded ${placeholders.length} placeholder projects.`)
}

// Export JSON per category into public/data/ so Vite copies it to dist/
mkdirSync(join(root, 'public', 'data'), { recursive: true })

const categories = ['industry-work', 'creative-direction', 'photography']
categories.forEach((cat) => {
  const rows = db.prepare('SELECT * FROM projects WHERE category = ? ORDER BY year DESC, id DESC').all(cat)
  const parsed = rows.map((r) => ({
    ...r,
    images: JSON.parse(r.images),
    tags: JSON.parse(r.tags),
  }))
  const outPath = join(root, 'public', 'data', `${cat}.json`)
  writeFileSync(outPath, JSON.stringify(parsed, null, 2))
  console.log(`Written ${outPath} (${parsed.length} projects)`)
})

db.close()
