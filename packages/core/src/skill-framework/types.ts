export type PggSkillLanguage = "ko" | "en";

export type LocalizedText = Record<PggSkillLanguage, string>;
export type LocalizedMarkdown = Record<PggSkillLanguage, readonly string[]>;

export type CoreWorkflowSkillName =
  | "pgg-add"
  | "pgg-plan"
  | "pgg-code"
  | "pgg-refactor"
  | "pgg-qa";

export type OptionalAuditSkillName = "pgg-token" | "pgg-performance";
export type LegacyCompatibilitySkillName = "pgg-performanc";
export type WorkflowSkillName = CoreWorkflowSkillName | OptionalAuditSkillName;
export type StandaloneSkillName = "pgg-status" | "pgg-verify";
export type GeneratedSkillName = WorkflowSkillName | StandaloneSkillName;
export type RegistrySkillLookupName = GeneratedSkillName | LegacyCompatibilitySkillName;

export type FlowStatus = "PASS" | "FAIL" | "PARTIAL" | "BLOCKED";
export type PggMode = "auto on" | "auto off";
export type PggTeamsMode = "teams on" | "teams off";
export type PggGitMode = "on" | "off";
export type PggBumpType = "major" | "minor" | "patch";
export type PggCommitConvention =
  | "feat"
  | "fix"
  | "docs"
  | "refactor"
  | "perf"
  | "test"
  | "chore";

export interface PggSkillModeSpecificBehavior {
  readonly autoOff: LocalizedMarkdown;
  readonly autoOn: LocalizedMarkdown;
  readonly teamsOff: LocalizedMarkdown;
  readonly teamsOn: LocalizedMarkdown;
}

export interface PggSkillAdditionalGuidanceSection {
  readonly title: LocalizedText;
  readonly body: LocalizedMarkdown;
}

export interface PggSkillDefinition {
  readonly id: WorkflowSkillName;
  readonly name: LocalizedText;
  readonly legacyAliases?: readonly LegacyCompatibilitySkillName[];
  readonly purpose: LocalizedMarkdown;
  readonly targetAgent: LocalizedMarkdown;
  readonly triggerConditions: LocalizedMarkdown;
  readonly inputs: LocalizedMarkdown;
  readonly outputs: LocalizedMarkdown;
  readonly absoluteRules: LocalizedMarkdown;
  readonly antiPatterns: LocalizedMarkdown;
  readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
  readonly additionalGuidance?: readonly PggSkillAdditionalGuidanceSection[];
  readonly requiredPhases: LocalizedMarkdown;
  readonly approvalGates: LocalizedMarkdown;
  readonly verificationRequirements: LocalizedMarkdown;
  readonly reviewRequirements: LocalizedMarkdown;
  readonly completionMessageContract: LocalizedMarkdown;
  readonly tokenAccountingRequirements: LocalizedMarkdown;
  readonly nextFlowRouting: LocalizedMarkdown;
  readonly performanceTriggerGuidance: LocalizedMarkdown;
  readonly poggnWorkspaceRequirements: LocalizedMarkdown;
  readonly gitModeRequirements: LocalizedMarkdown;
  readonly branchLifecycleRequirements: LocalizedMarkdown;
  readonly versioningRequirements: LocalizedMarkdown;
  readonly commitMessageRequirements: LocalizedMarkdown;
  readonly archiveRequirements: LocalizedMarkdown;
  readonly qaRequirements: LocalizedMarkdown;
  readonly generatedDocumentationSections: LocalizedMarkdown;
}

export interface PggRunStateSchema {
  readonly runId: string;
  readonly topicName: string;
  readonly activePath: string;
  readonly archivePath: string;
  readonly currentFlow: string;
  readonly flowStatus: FlowStatus;
  readonly pggGit: PggGitMode;
  readonly isGitRepository: boolean;
  readonly baseBranch: string | null;
  readonly workingBranch: string | null;
  readonly releaseBranch: string | null;
  readonly currentVersion: string;
  readonly targetVersion: string;
  readonly bumpType: PggBumpType;
  readonly convention: PggCommitConvention;
  readonly versionReason: string;
  readonly versionSource: string;
}

export interface PggTokenUsageRecordSchema {
  readonly runId: string;
  readonly flowId: string;
  readonly taskId: string | null;
  readonly filePath: string;
  readonly operation: "created" | "modified" | "generated";
  readonly source: "llm" | "generator" | "tool";
  readonly tokenCount: number;
  readonly tokenizer: string;
  readonly isEstimated: boolean;
  readonly charCount: number;
  readonly byteCount: number;
  readonly lineCount: number;
  readonly contentSha256: string;
  readonly commitSha: string | null;
  readonly measuredAt: string;
}

export interface PggLegacyClassification {
  readonly keep: readonly string[];
  readonly replace: readonly string[];
  readonly deprecated: readonly string[];
  readonly removableAfterMigration: readonly string[];
}
