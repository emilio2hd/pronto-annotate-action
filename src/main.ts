import * as core from '@actions/core';
import reportParse from './report-parser';

export async function run(): Promise<void> {
  try {
    const reportPath = core.getInput('reportPath');

    const annotations = reportParse(reportPath);

    annotations.forEach(annotation => annotation.push());
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
