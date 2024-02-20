/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as fs from 'fs'
import * as core from '@actions/core'
import { Annotation } from './annotation'

const parseJson = (jsonContent: string): Annotation[] => {
  try {
    return JSON.parse(jsonContent)
  } catch (err) {
    core.error(`Error ${err}, unable to parse json`);
    throw new Error(`Unable to parse json!`)
  }
}

const buildFromReport = (reportLine: any): Annotation => {
  return new Annotation(reportLine.level, reportLine.message, {
    title: reportLine.title,
    file: reportLine.file,
    line: reportLine.line?.start,
    endLine: reportLine.line?.end
  })
}

export default function parse(reportPath: string): Annotation[] {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Report file '${reportPath}' not found`)
  }

  const reportContent = fs.readFileSync(reportPath, 'utf8')
  const report = parseJson(reportContent)

  const annotations: Annotation[] = []
  report.forEach((reportLine: any) => {
    switch (reportLine.level) {
      case 'error':
      case 'warning':
      case 'notice':
        annotations.push(buildFromReport(reportLine))
        break
      default:
        core.warning(
          `Unknown annotation type: ${reportLine.level}. Valid types: error, warning, notice`
        )
    }
  })

  return annotations
}
