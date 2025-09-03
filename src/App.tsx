'use client'

import { motion } from 'motion/react'

import { Editor } from '@/components/editor'

export default function App() {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <Editor />
    </motion.div>
  )
}