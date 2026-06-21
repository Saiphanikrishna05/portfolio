export interface ResumeBasics {
  name: string
  label: string
  email: string
  url: string
  summary: string
  location: {
    city: string
    region: string
    countryCode: string
  }
  profiles: Array<{
    network: string
    username: string
    url: string
  }>
}

export interface EducationItem {
  institution: string
  area: string
  studyType: string
  startDate: string
  endDate: string
  score?: string
  courses: string[]
}

export interface WorkItem {
  name: string
  position: string
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
  keywords: string[]
}

export interface SkillGroup {
  name: string
  level: string
  keywords: string[]
}

export interface ProjectItem {
  name: string
  description: string
  keywords: string[]
  url?: string
  roles: string[]
  type: string
}

export interface Certificate {
  name: string
  issuer: string
  date: string
  url?: string
}

export interface Language {
  language: string
  fluency: string
}

export interface Resume {
  basics: ResumeBasics
  education: EducationItem[]
  work: WorkItem[]
  skills: SkillGroup[]
  projects: ProjectItem[]
  certificates: Certificate[]
  languages: Language[]
}

export interface PinnedRepo {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
  languages: Array<{ name: string; color: string; percentage: number }>
  topics: string[]
  updatedAt: string
  homepageUrl: string | null
  openGraphImageUrl: string
}

export interface DerivedSkill {
  name: string
  category: string
  score: number
  fromResume: boolean
  fromGitHub: boolean
}

export type TimelineEntry =
  | ({ kind: 'work' } & WorkItem)
  | ({ kind: 'education' } & EducationItem)
