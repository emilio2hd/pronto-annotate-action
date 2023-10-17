import * as core from '@actions/core';
import * as main from '../src/main';

import path from 'path';
import { issueCommand } from "@actions/core/lib/command"

import data from'./annotations.json';

jest.mock("@actions/core/lib/command");

const getInputMock = jest.spyOn(core, 'getInput');
const setFailedMock = jest.spyOn(core, 'setFailed');
const runMock = jest.spyOn(main, 'run');

describe('action', () => {
  beforeEach(() => { jest.clearAllMocks() })

  it('sets the time output', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'reportPath':
          return path.resolve(process.cwd(), '__tests__/annotations.json');
        default:
          return ''
      }
    });

    await main.run();

    expect(runMock).toHaveReturned();

    const firstAnnotation = data[0];
    expect(issueCommand).toHaveBeenNthCalledWith(
        1,
        firstAnnotation.level,
        {
          title: firstAnnotation.runner,
          file: firstAnnotation.file,
          line: firstAnnotation.line?.start,
          endLine: firstAnnotation.line?.end
        },
        firstAnnotation.message
      )
  })

  it('input file does not exist', async () => {
    const nonExistingFile = 'non-existing-annotations.json';

    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'reportPath':
          return nonExistingFile
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned();
    expect(setFailedMock).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(`Report file '${nonExistingFile}' not found`)
      )
  })
})
