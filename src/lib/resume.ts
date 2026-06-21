import { z } from 'zod'
import type { Resume } from './types'
import rawResume from '@/data/resume.json'

const profileSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: z.string(),
})

const basicsSchema = z.object({
  name: z.string(),
  label: z.string(),
  email: z.string().email(),
  url: z.string(),
  summary: z.string(),
  location: z.object({
    city: z.string(),
    region: z.string(),
    countryCode: z.string(),
  }),
  profiles: z.array(profileSchema),
})

const educationSchema = z.object({
  institution: z.string(),
  area: z.string(),
  studyType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  score: z.string().optional(),
  courses: z.array(z.string()),
})

const workSchema = z.object({
  name: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  summary: z.string(),
  highlights: z.array(z.string()),
  keywords: z.array(z.string()),
})

const skillSchema = z.object({
  name: z.string(),
  level: z.string(),
  keywords: z.array(z.string()),
})

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  url: z.string().optional(),
  roles: z.array(z.string()),
  type: z.string(),
})

const certificateSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string().optional(),
})

const languageSchema = z.object({
  language: z.string(),
  fluency: z.string(),
})

const resumeSchema = z.object({
  basics: basicsSchema,
  education: z.array(educationSchema),
  work: z.array(workSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  certificates: z.array(certificateSchema),
  languages: z.array(languageSchema),
})

let _resume: Resume | null = null

export function getResume(): Resume {
  if (_resume) return _resume
  const result = resumeSchema.safeParse(rawResume)
  if (!result.success) {
    throw new Error(`resume.json validation failed:\n${result.error.message}`)
  }
  _resume = result.data as Resume
  return _resume
}
