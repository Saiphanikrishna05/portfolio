export const dynamic = 'force-dynamic'

import { getResume } from '@/lib/resume'
import { getPinnedRepos } from '@/lib/github'
import { deriveSkills } from '@/lib/skillDeriver'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Timeline } from '@/components/sections/Timeline'
import { SkillMatrix } from '@/components/sections/SkillMatrix'
import { Certificates } from '@/components/sections/Certificates'
import { JobMatcher } from '@/components/sections/JobMatcher'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/ui/ChatWidget'

export default async function Home() {
  const resume     = getResume()
  const repos      = await getPinnedRepos()
  const skills     = deriveSkills(resume.skills, repos)

  return (
    <main>
      <Hero basics={resume.basics} />
      <Projects repos={repos} />
      <SkillMatrix derivedSkills={skills} resumeSkills={resume.skills} />
      <Timeline work={resume.work} education={resume.education} />
      <Certificates certificates={resume.certificates} />
      <JobMatcher />
      <Contact basics={resume.basics} />
      <Footer basics={resume.basics} />
      <ChatWidget />
    </main>
  )
}
