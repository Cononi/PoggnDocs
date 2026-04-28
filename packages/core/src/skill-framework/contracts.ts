import type {
  LocalizedMarkdown,
  PggRunStateSchema,
  PggSkillDefinition,
  PggSkillModeSpecificBehavior,
  PggTokenUsageRecordSchema
} from "./types.js";

export const REQUIRED_SKILL_DEFINITION_FIELDS = [
  "id",
  "name",
  "purpose",
  "targetAgent",
  "triggerConditions",
  "inputs",
  "outputs",
  "absoluteRules",
  "antiPatterns",
  "modeSpecificBehavior",
  "requiredPhases",
  "approvalGates",
  "verificationRequirements",
  "reviewRequirements",
  "completionMessageContract",
  "tokenAccountingRequirements",
  "nextFlowRouting",
  "performanceTriggerGuidance",
  "poggnWorkspaceRequirements",
  "gitModeRequirements",
  "branchLifecycleRequirements",
  "versioningRequirements",
  "commitMessageRequirements",
  "archiveRequirements",
  "qaRequirements",
  "generatedDocumentationSections"
] as const satisfies readonly (keyof PggSkillDefinition)[];

export const COMMON_MODE_SPECIFIC_BEHAVIOR: PggSkillModeSpecificBehavior = {
  autoOff: {
    ko: [
      "`auto off`에서는 사용자 중심으로 실행한다.",
      "불명확한 요구사항은 질문으로 확인한다.",
      "승인 gate를 통과하기 전에는 다음 flow로 조용히 진행하지 않는다."
    ],
    en: [
      "In `auto off`, execution is user-centered.",
      "Ask when requirements are unclear.",
      "Do not silently advance past an approval gate."
    ]
  },
  autoOn: {
    ko: [
      "`auto on`에서는 자율적으로 최적 답안을 추론할 수 있다.",
      "가정, 불확실성, 선택 이유를 산출물에 기록한다.",
      "blocking question은 꼭 필요한 경우에만 사용한다."
    ],
    en: [
      "In `auto on`, infer the best answer autonomously.",
      "Record assumptions, uncertainty, and decision reasons.",
      "Use blocking questions only when they are required."
    ]
  },
  teamsOff: {
    ko: ["`teams off`에서는 단일 에이전트가 전체 flow를 수행한다."],
    en: ["In `teams off`, one agent executes the whole flow."]
  },
  teamsOn: {
    ko: [
      "`teams on`이고 환경이 지원하면 task별 fresh subagent에 위임한다.",
      "subagent는 독립 context로 시작하며, task 완료 후 review를 수행한다."
    ],
    en: [
      "In `teams on`, delegate by task to fresh subagents when the environment supports it.",
      "Each subagent starts with independent context and the result is reviewed after completion."
    ]
  }
};

export const COMMON_COMPLETION_MESSAGE_CONTRACT: LocalizedMarkdown = {
  ko: [
    "모든 flow 완료 시 `# PGG Flow 완료 보고서` 형식의 구조화된 completion message를 출력한다.",
    "보고서는 Flow ID, 상태, Mode, Teams Mode, PGG Git, Topic, Version, 실행 요약을 포함한다.",
    "주요 산출물, POGGN Workspace, 생성/수정된 파일, Token 기록, Git 결과, Version 결과, 검증 결과, 남은 위험, 남은 불확실성, 다음 Flow를 포함한다.",
    "마지막 문장은 정확히 `다음 flow를 실행하세요: <next-flow-id>`여야 하며, 그 뒤에는 아무것도 출력하지 않는다."
  ],
  en: [
    "Every flow completion prints a structured `# PGG Flow Completion Report` message.",
    "The report includes Flow ID, status, Mode, Teams Mode, PGG Git, Topic, Version, and execution summary.",
    "It includes artifacts, POGGN Workspace, created/modified files, token records, Git result, Version result, verification result, remaining risks, remaining uncertainty, and next flow.",
    "The final sentence must be exactly `다음 flow를 실행하세요: <next-flow-id>`, with nothing after it."
  ]
};

export const COMMON_TOKEN_ACCOUNTING_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "모든 flow는 LLM이 생성하거나 수정한 파일의 token count를 기록한다.",
    "기본 저장 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
    "record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.",
    "token record는 나중에 data로 사용할 수 있는 JSONL 구조여야 한다."
  ],
  en: [
    "Every flow records token counts for files created or modified by the LLM.",
    "The default path is `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
    "Each record includes runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, and measuredAt.",
    "Token records must be JSONL data that can be reused later."
  ]
};

export const COMMON_POGGN_WORKSPACE_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "`pgg-add`가 시작되면 `topic_name`을 생성한다.",
    "PGG process artifact는 `poggn/active/{topic_name}` 아래에 저장한다.",
    "`pgg-qa` PASS 후 process artifact를 `poggn/archive/{topic_name}`으로 이동한다.",
    "application source file은 실제 project path에 생성하거나 수정한다.",
    "report, state, plan, QA report, token record, metrics는 active topic directory에 저장한다."
  ],
  en: [
    "`pgg-add` creates `topic_name` when it starts.",
    "PGG process artifacts are stored under `poggn/active/{topic_name}`.",
    "After `pgg-qa` PASS, process artifacts move to `poggn/archive/{topic_name}`.",
    "Application source files are still created or modified at their real project paths.",
    "Reports, state files, plans, QA reports, token records, and metrics are stored under the active topic directory."
  ]
};

export const COMMON_GIT_MODE_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "`pgg git = off`이면 branch 생성, commit, release branch 전환, working branch 삭제, push를 수행하지 않는다.",
    "`pgg git = on`이면 git 저장소 여부를 확인한다.",
    "git 저장소가 있으면 branch, commit, release, push 규칙을 적용한다.",
    "git 저장소가 없으면 git 작업을 생략하고 사유를 기록한다."
  ],
  en: [
    "When `pgg git = off`, do not create branches, commit, switch release branches, delete working branches, or push.",
    "When `pgg git = on`, check whether the project is a git repository.",
    "If it is a git repository, apply branch, commit, release, and push rules.",
    "If it is not a git repository, skip git operations and record the reason."
  ]
};

export const COMMON_BRANCH_LIFECYCLE_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "`pgg-add`는 `pgg git = on`이고 git 저장소이면 working branch를 생성하거나 전환한다.",
    "기존 branch naming policy가 있으면 사용하고, 없으면 `pgg/working/{topic_name}`을 사용한다.",
    "`pgg-qa` PASS 후 active artifact를 archive로 이동하고 final QA/archive commit을 생성한다.",
    "release branch는 기존 정책이 없으면 `release/{topic_name}-v{version}`을 사용한다.",
    "`pgg-qa` FAIL이면 archive 이동, release branch 전환, working branch 제거, push를 수행하지 않는다."
  ],
  en: [
    "`pgg-add` creates or switches to a working branch when `pgg git = on` and the project is a git repository.",
    "Use an existing branch naming policy when present; otherwise use `pgg/working/{topic_name}`.",
    "After `pgg-qa` PASS, move active artifacts to archive and create the final QA/archive commit.",
    "Use `release/{topic_name}-v{version}` when no release branch policy exists.",
    "On `pgg-qa` FAIL, do not archive, switch release branches, delete the working branch, or push."
  ]
};

export const COMMON_VERSIONING_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "version format은 `x.x.x`이다.",
    "`major`는 breaking change, 기존 시스템 기능의 완전한 변경, public behavior의 큰 변경에 사용한다.",
    "`minor`는 기능 추가, 기능 삭제, 새 flow 추가, 비파괴적 기능 확장에 사용한다.",
    "`patch`는 bug fix, docs, tests, 동작 보존 refactor, 비파괴적 performance improvement, chore에 사용한다.",
    "core는 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource, projectVersionUpdated, versionVerification을 표현해야 한다."
  ],
  en: [
    "The version format is `x.x.x`.",
    "`major` is used for breaking changes, complete behavior replacement, or major public behavior changes.",
    "`minor` is used for feature additions, removals, new flows, or meaningful non-breaking expansion.",
    "`patch` is used for bug fixes, docs, tests, behavior-preserving refactors, non-breaking performance improvements, and chores.",
    "The core must represent currentVersion, targetVersion, bumpType, convention, versionReason, versionSource, projectVersionUpdated, and versionVerification."
  ]
};

export const COMMON_COMMIT_MESSAGE_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "모든 PGG commit message는 `{convention}. {version} {message}` 형식을 따른다.",
    "예: `feat. 1.3.0 rebuild pgg skill framework`",
    "push는 `pgg-qa` PASS 완료 전에는 수행하지 않는다."
  ],
  en: [
    "Every PGG commit message follows `{convention}. {version} {message}`.",
    "Example: `feat. 1.3.0 rebuild pgg skill framework`",
    "Do not push before `pgg-qa` PASS is complete."
  ]
};

export const COMMON_ARCHIVE_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "`pgg-qa` PASS 전에는 active artifact를 archive로 이동하지 않는다.",
    "PASS 후 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.",
    "archive 상태, QA 결과, version 결과, git 결과를 final state에 남긴다."
  ],
  en: [
    "Do not move active artifacts to archive before `pgg-qa` PASS.",
    "After PASS, move `poggn/active/{topic_name}` to `poggn/archive/{topic_name}`.",
    "Record archive status, QA result, version result, and git result in final state."
  ]
};

export const COMMON_QA_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "QA는 acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, git outcome을 검증한다.",
    "PASS가 아니면 release branch 전환, archive 이동, working branch 제거, push를 수행하지 않는다.",
    "실패한 검증 명령과 실패 로그 요약을 completion message에 기록한다."
  ],
  en: [
    "QA verifies acceptance criteria, generated docs, tests, version, token accounting, POGGN workspace, and git outcome.",
    "Unless QA is PASS, do not switch release branches, archive, delete the working branch, or push.",
    "Record failed verification commands and failure summaries in the completion message."
  ]
};

export const COMMON_PERFORMANCE_TRIGGER_GUIDANCE: LocalizedMarkdown = {
  ko: [
    "`pgg-performance`는 성능 측정이 필요한 경우에만 실행하는 조건부 helper flow다.",
    "`pgg-performanc` spelling은 compatibility alias로 registry에서 인식한다.",
    "성능 기준, 측정 명령, baseline, 결과 해석을 process artifact에 기록한다."
  ],
  en: [
    "`pgg-performance` is a conditional helper flow that runs only when performance measurement is needed.",
    "The `pgg-performanc` spelling is recognized by the registry as a compatibility alias.",
    "Record performance criteria, measurement commands, baselines, and interpretation in process artifacts."
  ]
};

export const PGG_RUN_STATE_SCHEMA_EXAMPLE: PggRunStateSchema = {
  runId: "string",
  topicName: "string",
  activePath: "poggn/active/{topic_name}",
  archivePath: "poggn/archive/{topic_name}",
  currentFlow: "string",
  flowStatus: "PASS",
  pggGit: "off",
  isGitRepository: true,
  baseBranch: "string",
  workingBranch: "string",
  releaseBranch: "string",
  currentVersion: "0.0.0",
  targetVersion: "0.0.0",
  bumpType: "patch",
  convention: "chore",
  versionReason: "string",
  versionSource: "package.json"
};

export const PGG_TOKEN_USAGE_RECORD_SCHEMA_EXAMPLE: PggTokenUsageRecordSchema = {
  runId: "string",
  flowId: "string",
  taskId: null,
  filePath: "string",
  operation: "modified",
  source: "llm",
  tokenCount: 0,
  tokenizer: "string",
  isEstimated: false,
  charCount: 0,
  byteCount: 0,
  lineCount: 0,
  contentSha256: "string",
  commitSha: null,
  measuredAt: "ISO-8601 timestamp"
};
