import { Annotation } from '../src/annotation'
import { expect } from '@jest/globals'
import { issueCommand } from '@actions/core/lib/command'

jest.mock('@actions/core/lib/command')

describe('push', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('call command to push the annotation', async () => {
    const reportLine = {
      message: 'Migration file detected, but no changes in schema.rb',
      level: 'error',
      file: 'db/migrate/20231013225210_create_products.rb',
      line: { start: 1, end: 1 },
      runner: 'Pronto::RailsSchema'
    }

    const annotation = new Annotation('error', reportLine.message, {
      title: reportLine.runner,
      file: reportLine.file,
      line: reportLine.line?.start,
      endLine: reportLine.line?.end
    })

    annotation.push()

    expect(issueCommand).toHaveBeenNthCalledWith(
      1,
      reportLine.level,
      {
        title: reportLine.runner,
        file: reportLine.file,
        line: reportLine.line?.start,
        endLine: reportLine.line?.end
      },
      reportLine.message
    )
  })
})
