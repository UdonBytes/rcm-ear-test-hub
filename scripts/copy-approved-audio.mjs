import { stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { approvedExercises } from '../src/data/approvedExercises.js'

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const destinationRoot = join(appRoot, 'public', 'audio', 'approved')

const approvedPaths = new Set()
for (const level of Object.values(approvedExercises)) {
  for (const examples of Object.values(level)) {
    for (const example of examples) {
      for (const field of ['audio', 'qualityAudio', 'toneAudio', 'clapbackAudio', 'playbackAudio']) {
        if (example[field]) approvedPaths.add(example[field].replace('/audio/approved/', ''))
      }
    }
  }
}

let missingCount = 0
for (const approvedPath of approvedPaths) {
  const destination = join(destinationRoot, approvedPath)
  if (!existsSync(destination)) {
    console.error(`Approved audio is missing from public/audio/approved: ${approvedPath}`)
    missingCount += 1
    continue
  }
  await stat(destination)
}

if (missingCount > 0) {
  throw new Error(`${missingCount} approved audio file(s) are missing.`)
}

console.log(`Verified ${approvedPaths.size} approved audio files.`)
