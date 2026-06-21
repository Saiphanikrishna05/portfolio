'use client'

import { motion } from 'framer-motion'
import { Award } from 'lucide-react'
import type { Certificate } from '@/lib/types'

function fmtDate(d: string) {
  const [y, m] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m, 10) - 1]} ${y}`
}

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  if (!certificates.length) return null

  return (
    <section id="certificates" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Certificates</h2>
          <p className="mt-2 text-slate-400 text-base">Professional certifications and training.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-violet-500/30 hover:bg-white/[0.06] transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center">
                  <Award size={18} className="text-violet-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-100 text-sm leading-snug">{cert.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{cert.issuer}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
                    >
                      View credential
                    </a>
                  ) : (
                    <span className="text-slate-600">Verified</span>
                  )}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  {fmtDate(cert.date)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
