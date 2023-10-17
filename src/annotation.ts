import {issueCommand} from "@actions/core/lib/command"

export type AnnotationLevel = 'notice' | 'error' | 'warning';

// https://docs.github.com/en/enterprise-server@3.10/actions/using-workflows/workflow-commands-for-github-actions#setting-a-notice-message
export type AnnotationProps = {
  title?: string;
  file?: string;
  line?: number;
  endLine?: number;
  col?: number;
  endColumn?: number;
}

export class Annotation {
  message: string;
  level: AnnotationLevel;
  properties: AnnotationProps

  constructor(level: AnnotationLevel, message: string, properties: AnnotationProps = {}) {
    this.message = message;
    this.level = level;
    this.properties = properties
  }

  push(): void {
    issueCommand(this.level, this.properties, this.message)
  }
}
