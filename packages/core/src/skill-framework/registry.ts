import {
  COMMON_ARCHIVE_REQUIREMENTS,
  COMMON_BRANCH_LIFECYCLE_REQUIREMENTS,
  COMMON_COMMIT_MESSAGE_REQUIREMENTS,
  COMMON_COMPLETION_MESSAGE_CONTRACT,
  COMMON_GIT_MODE_REQUIREMENTS,
  COMMON_MODE_SPECIFIC_BEHAVIOR,
  COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
  COMMON_POGGN_WORKSPACE_REQUIREMENTS,
  COMMON_QA_REQUIREMENTS,
  COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
  COMMON_VERSIONING_REQUIREMENTS,
  REQUIRED_SKILL_DEFINITION_FIELDS
} from "./contracts.js";
import type {
  CoreWorkflowSkillName,
  GeneratedSkillName,
  LegacyCompatibilitySkillName,
  LocalizedMarkdown,
  OptionalAuditSkillName,
  PggSkillDefinition,
  RegistrySkillLookupName,
  StandaloneSkillName,
  WorkflowSkillName
} from "./types.js";

export const CORE_WORKFLOW_SKILLS = [
  "pgg-add",
  "pgg-plan",
  "pgg-code",
  "pgg-refactor",
  "pgg-qa"
] as const satisfies readonly CoreWorkflowSkillName[];

export const OPTIONAL_AUDIT_SKILLS = [
  "pgg-token",
  "pgg-performance"
] as const satisfies readonly OptionalAuditSkillName[];

export const LEGACY_COMPATIBILITY_SKILLS = [
  "pgg-performanc"
] as const satisfies readonly LegacyCompatibilitySkillName[];

export const STANDALONE_SKILLS = [
  "pgg-status",
  "pgg-verify"
] as const satisfies readonly StandaloneSkillName[];

export const WORKFLOW_SKILLS = [
  ...CORE_WORKFLOW_SKILLS,
  ...OPTIONAL_AUDIT_SKILLS
] as const satisfies readonly WorkflowSkillName[];

export const GENERATED_SKILLS = [
  ...WORKFLOW_SKILLS,
  ...STANDALONE_SKILLS
] as const satisfies readonly GeneratedSkillName[];

export const WORKFLOW_FRONTMATTER_STAGES = [
  "add",
  "plan",
  "code",
  "refactor",
  "qa"
] as const;

export const WORKFLOW_FRONTMATTER_SKILLS = [
  ...CORE_WORKFLOW_SKILLS,
  "pgg-performance"
] as const;

export const PGG_DEFAULT_FLOW = [
  "pgg-add",
  "pgg-plan",
  "pgg-code",
  "pgg-refactor",
  "pgg-qa"
] as const satisfies readonly CoreWorkflowSkillName[];

export const PGG_CONDITIONAL_HELPER_FLOWS = [
  "pgg-performance",
  "pgg-performanc"
] as const satisfies readonly (OptionalAuditSkillName | LegacyCompatibilitySkillName)[];

export const PGG_COMPATIBILITY_FLOW_ALIASES = {
  "pgg-performanc": "pgg-performance"
} as const satisfies Record<LegacyCompatibilitySkillName, OptionalAuditSkillName>;

export const MANDATORY_IMPLEMENTATION_CRITERIA_KO = [
  "요구사항 traceability를 유지한다.",
  "변경 파일과 검증 명령을 기록한다.",
  "generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신한다.",
  "token accounting, POGGN workspace, version, git outcome을 flow 산출물에 남긴다."
] as const;

export const MANDATORY_IMPLEMENTATION_CRITERIA_EN = [
  "Maintain requirement traceability.",
  "Record changed files and verification commands.",
  "Update generated Markdown only through TypeScript Skill definitions and the generator.",
  "Record token accounting, POGGN workspace, version, and git outcome in flow artifacts."
] as const;

export const README_WORKFLOW_SUMMARY_KO = [
  "`pgg-add`에서 topic과 요구사항을 확정한다.",
  "`pgg-plan`에서 plan, task, version bump를 구체화한다.",
  "`pgg-code`에서 승인된 task를 구현한다.",
  "`pgg-refactor`에서 legacy 제거와 구조 개선을 수행한다.",
  "`pgg-qa`에서 검증, archive, release 결정을 수행한다.",
  "`pgg-performance`는 성능 측정이 필요한 경우에만 실행한다."
] as const;

export const README_WORKFLOW_SUMMARY_EN = [
  "`pgg-add` fixes the topic and requirements.",
  "`pgg-plan` expands the plan, tasks, and version bump.",
  "`pgg-code` implements approved tasks.",
  "`pgg-refactor` removes legacy paths and improves structure.",
  "`pgg-qa` verifies, archives, and decides release readiness.",
  "`pgg-performance` runs only when performance measurement is needed."
] as const;

export const README_WORKFLOW_STAGE_SUMMARIES_KO = README_WORKFLOW_SUMMARY_KO;
export const README_WORKFLOW_STAGE_SUMMARIES_EN = README_WORKFLOW_SUMMARY_EN;

export const README_OPTIONAL_AUDIT_SUMMARIES_KO = [
  "`pgg-token`은 필요한 topic에서 token usage를 추가 audit한다.",
  "`pgg-performance`는 필요한 topic에서 성능 baseline과 결과를 비교한다.",
  "`pgg-performanc`는 registry compatibility alias로 인식한다."
] as const;

export const README_OPTIONAL_AUDIT_SUMMARIES_EN = [
  "`pgg-token` performs an additional token usage audit when needed.",
  "`pgg-performance` compares performance baselines and results when needed.",
  "`pgg-performanc` is recognized as a registry compatibility alias."
] as const;

const generatedSections = md(
  [
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
    "qaRequirements"
  ],
  [
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
    "qaRequirements"
  ]
);

function md(ko: readonly string[], en: readonly string[]): LocalizedMarkdown {
  return { ko, en };
}

function defineSkill(
  definition: Omit<
    PggSkillDefinition,
    | "modeSpecificBehavior"
    | "completionMessageContract"
    | "tokenAccountingRequirements"
    | "performanceTriggerGuidance"
    | "poggnWorkspaceRequirements"
    | "gitModeRequirements"
    | "branchLifecycleRequirements"
    | "versioningRequirements"
    | "commitMessageRequirements"
    | "archiveRequirements"
    | "qaRequirements"
    | "generatedDocumentationSections"
  > &
    Partial<
      Pick<
        PggSkillDefinition,
        | "modeSpecificBehavior"
        | "completionMessageContract"
        | "tokenAccountingRequirements"
        | "performanceTriggerGuidance"
        | "poggnWorkspaceRequirements"
        | "gitModeRequirements"
        | "branchLifecycleRequirements"
        | "versioningRequirements"
        | "commitMessageRequirements"
        | "archiveRequirements"
        | "qaRequirements"
        | "generatedDocumentationSections"
      >
    >
): PggSkillDefinition {
  return {
    modeSpecificBehavior: COMMON_MODE_SPECIFIC_BEHAVIOR,
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    poggnWorkspaceRequirements: COMMON_POGGN_WORKSPACE_REQUIREMENTS,
    gitModeRequirements: COMMON_GIT_MODE_REQUIREMENTS,
    branchLifecycleRequirements: COMMON_BRANCH_LIFECYCLE_REQUIREMENTS,
    versioningRequirements: COMMON_VERSIONING_REQUIREMENTS,
    commitMessageRequirements: COMMON_COMMIT_MESSAGE_REQUIREMENTS,
    archiveRequirements: COMMON_ARCHIVE_REQUIREMENTS,
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: generatedSections,
    ...definition
  };
}

export const PGG_SKILL_DEFINITIONS = [
  defineSkill({
    id: "pgg-add",
    name: { ko: "PGG Add", en: "PGG Add" },
    purpose: md(
      [
        "`pgg-add`는 요구사항을 발견하고 명세화하는 Skill이다.",
        "코드를 작성하지 않고 요구사항 수집, 기능 목적 정의, Acceptance Criteria 초안 작성, topic_name 생성, POGGN active workspace 생성, version 결정, pgg git on일 때 working branch 생성을 수행한다."
      ],
      [
        "`pgg-add` is the Skill for discovering and specifying requirements.",
        "It does not write code; it collects requirements, defines feature purpose, drafts Acceptance Criteria, creates topic_name, creates the POGGN active workspace, decides the version, and creates or switches the working branch when pgg git is on."
      ]
    ),
    targetAgent: md(
      ["요구사항 발견, 제약 조건 도출, 초기 POGGN workspace/state 생성, version/git mode 결정을 수행하는 AI 개발 에이전트."],
      ["An AI development agent that discovers requirements, exposes constraints, creates the initial POGGN workspace/state, and decides version/git mode."]
    ),
    triggerConditions: md(
      [
        "새 기능, bug fix, 문서/테스트/리팩터링, migration, 성능 요구사항 등 새 PGG topic이 시작될 때 실행한다.",
        "사용자 요청이 모호하더라도 구현을 시작하지 않고 요구사항 발견 flow로 진입한다."
      ],
      [
        "Run when a new PGG topic starts: feature, bug fix, docs/tests/refactor, migration, or performance-sensitive request.",
        "Even when the user request is vague, enter requirement discovery instead of implementation."
      ]
    ),
    inputs: md(
      [
        "사용자 요청 원문",
        "현재 repository 상태와 기존 legacy 분류",
        "현재 version source. npm library는 기본적으로 `package.json` version을 사용한다.",
        "기존 project/version/git/branch naming policy",
        "`auto` mode, `teams` mode, `pgg git` mode"
      ],
      [
        "Raw user request",
        "Current repository state and existing legacy classification",
        "Current version source. For npm libraries, use `package.json` version by default.",
        "Existing project/version/git/branch naming policy",
        "`auto` mode, `teams` mode, and `pgg git` mode"
      ]
    ),
    outputs: md(
      [
        "`topic_name`",
        "`poggn/active/{topic_name}` active path",
        "`poggn/archive/{topic_name}` archive path",
        "요구사항 수집 결과, 기능 목적, 포함 범위, 제외 범위, 가정, 리스크",
        "Acceptance Criteria 초안과 승인 상태",
        "currentVersion, targetVersion, bumpType, convention, versionReason, versionSource",
        "pgg git 상태, isGitRepository, baseBranch, workingBranch",
        "pgg-performance 필요성 후보",
        "`poggn/active/{topic_name}/metrics/token-usage.jsonl` token 기록"
      ],
      [
        "`topic_name`",
        "`poggn/active/{topic_name}` active path",
        "`poggn/archive/{topic_name}` archive path",
        "Requirement collection result, feature purpose, in-scope items, out-of-scope items, assumptions, risks",
        "Acceptance Criteria draft and approval status",
        "currentVersion, targetVersion, bumpType, convention, versionReason, versionSource",
        "pgg git status, isGitRepository, baseBranch, workingBranch",
        "pgg-performance applicability candidate",
        "`poggn/active/{topic_name}/metrics/token-usage.jsonl` token records"
      ]
    ),
    absoluteRules: md(
      [
        "구현 코드를 작성하면 안 된다.",
        "`auto off`에서는 사용자 승인 없이 다음 단계로 진행하면 안 된다.",
        "`auto off`에서는 설계 출력이나 코드 작성 전에 반드시 질문해야 한다.",
        "단순히 `뭘 만들까요?`라고 묻지 않는다.",
        "소크라테스식 질문으로 숨겨진 요구사항과 제약 조건을 끌어낸다.",
        "설계 문서는 작은 단위로 나누어 보여주고, 각 단위마다 승인받은 뒤 다음 단계로 넘어간다.",
        "generated Markdown은 직접 수정하지 않고 TypeScript Skill 정의와 generator를 수정한다."
      ],
      [
        "Do not write implementation code.",
        "In `auto off`, do not advance without user approval.",
        "In `auto off`, ask before design output or code writing.",
        "Do not ask a vague `What should I build?` question.",
        "Use Socratic questions to expose hidden requirements and constraints.",
        "Present design documents in small units and get approval for each unit before moving on.",
        "Do not hand-edit generated Markdown; update TypeScript Skill definitions and the generator."
      ]
    ),
    antiPatterns: md(
      [
        "구현 코드, 테스트 코드, migration, 설정 변경 작성",
        "모호한 요청을 임의 확정하고 `pgg-plan`으로 이동",
        "한 번에 많은 질문을 던지거나 단순히 `뭘 만들까요?`라고 질문",
        "topic 없이 PGG process artifact를 흩뿌리기",
        "version 결정 없이 산출물 완료 처리",
        "`pgg git = off`인데 branch/commit/push 수행",
        "`pgg git = on`이지만 git repository 여부나 branch naming policy를 확인하지 않음"
      ],
      [
        "Writing implementation code, tests, migrations, or configuration changes",
        "Assuming vague requirements and moving to `pgg-plan`",
        "Asking too many questions at once or asking only `What should I build?`",
        "Scattering PGG process artifacts without a topic",
        "Completing without a version decision",
        "Creating branches, commits, or pushes when `pgg git = off`",
        "Skipping git repository and branch naming policy checks when `pgg git = on`"
      ]
    ),
    modeSpecificBehavior: {
      autoOff: md(
        [
          "`auto off`에서는 구현 코드를 한 줄도 작성하지 않는다.",
          "먼저 최대 5개의 소크라테스식 질문을 한다.",
          "질문은 사용자 목표, 최소 동작, 실패 시 동작, 보안 제약, 데이터 저장 필요 여부, 권한 요구사항, 성공 조건, 제외 범위, 변경 규모, version bump 판단 근거를 드러내야 한다.",
          "설계 출력은 작은 단위로 나누고 각 단위마다 승인받기 전 다음 단위로 넘어가지 않는다.",
          "승인 전 마지막 문장은 `다음 flow를 실행하세요: pgg-add`로 유지한다."
        ],
        [
          "In `auto off`, do not write any implementation code.",
          "Ask up to five Socratic questions first.",
          "Questions must expose user goals, minimum behavior, failure behavior, security constraints, data persistence needs, authorization needs, success conditions, out-of-scope items, change size, and version bump rationale.",
          "Split design output into small units and do not advance before each unit is approved.",
          "Before approval, keep the final sentence as `다음 flow를 실행하세요: pgg-add`."
        ]
      ),
      autoOn: md(
        [
          "`auto on`에서는 가능한 요구사항을 자동 추론한다.",
          "기능 목적, Acceptance Criteria 초안, topic_name, version bump를 작성한다.",
          "가정, 불확실성, 선택 이유를 명시한다.",
          "정말 필요한 경우가 아니라면 blocking question을 하지 않는다."
        ],
        [
          "In `auto on`, infer likely requirements.",
          "Write the feature purpose, Acceptance Criteria draft, topic_name, and version bump decision.",
          "State assumptions, uncertainty, and decision reasons.",
          "Avoid blocking questions unless they are truly required."
        ]
      ),
      teamsOff: md(
        ["`teams off`에서는 단일 에이전트가 요구사항 발견, state 작성, review를 수행한다."],
        ["In `teams off`, one agent performs requirement discovery, state writing, and review."]
      ),
      teamsOn: md(
        [
          "`teams on`이고 환경이 지원하면 product manager와 UX/UI expert 관점의 bounded review를 task별 fresh subagent에 위임할 수 있다.",
          "subagent는 구현하지 않고 요구사항, 사용자 흐름, 제약 조건, acceptance criteria만 review한다."
        ],
        [
          "In `teams on`, when supported, delegate bounded product-manager and UX/UI expert reviews to fresh subagents.",
          "Subagents do not implement; they only review requirements, user flow, constraints, and acceptance criteria."
        ]
      )
    },
    additionalGuidance: [
      {
        title: { ko: "필수 단계", en: "Required Steps" },
        body: md(
          [
            "1. 요구 사항 수집",
            "2. 기능 목적 정의",
            "3. Acceptance Criteria 초안 작성",
            "4. topic_name 생성",
            "5. POGGN active workspace 생성",
            "6. version 결정",
            "7. `pgg git = on`일 경우 working branch 생성 또는 전환"
          ],
          [
            "1. Collect requirements",
            "2. Define feature purpose",
            "3. Draft Acceptance Criteria",
            "4. Create topic_name",
            "5. Create the POGGN active workspace",
            "6. Decide the version",
            "7. Create or switch to the working branch when `pgg git = on`"
          ]
        )
      },
      {
        title: { ko: "소크라테스식 질문", en: "Socratic Questions" },
        body: md(
          [
            "한 번에 최대 5개의 질문만 한다.",
            "필수 질문 예시: 이 기능의 최소 동작은 무엇인가요?",
            "필수 질문 예시: 실패했을 때 사용자에게 어떤 일이 발생해야 하나요?",
            "필수 질문 예시: 이 기능이 절대 하면 안 되는 행동은 무엇인가요?",
            "필수 질문 예시: 어떤 데이터 저장, 인증, 권한, 보안 요구사항이 있나요?",
            "필수 질문 예시: 이 변경은 기존 동작을 깨뜨리나요, 기능 추가인가요, 버그 수정인가요?"
          ],
          [
            "Ask at most five questions at a time.",
            "Example: What is the minimum behavior for this feature?",
            "Example: What should happen to the user when it fails?",
            "Example: What must this feature never do?",
            "Example: What data storage, authentication, authorization, or security requirements exist?",
            "Example: Does this change break existing behavior, add a feature, or fix a bug?"
          ]
        )
      },
      {
        title: { ko: "topic_name 생성", en: "topic_name Generation" },
        body: md(
          [
            "사용자 요청과 기능 목적을 기준으로 사람이 이해 가능한 slug를 만든다.",
            "형식은 lowercase kebab-case다.",
            "공백은 hyphen으로 바꾼다.",
            "충돌 시 runId 또는 timestamp를 추가한다.",
            "예: `login-flow`, `auth-session-refresh`, `checkout-payment-validation`"
          ],
          [
            "Create a human-readable slug from the user request and feature purpose.",
            "Use lowercase kebab-case.",
            "Replace spaces with hyphens.",
            "When there is a collision, append runId or timestamp.",
            "Examples: `login-flow`, `auth-session-refresh`, `checkout-payment-validation`"
          ]
        )
      },
      {
        title: { ko: "POGGN active workspace", en: "POGGN Active Workspace" },
        body: md(
          [
            "`pgg-add`가 시작되면 `poggn/active/{topic_name}`을 생성한다.",
            "권장 파일: `poggn/active/{topic_name}/state.json`",
            "권장 파일: `poggn/active/{topic_name}/pgg-add/requirements.md`",
            "권장 파일: `poggn/active/{topic_name}/pgg-add/acceptance-criteria.md`",
            "권장 파일: `poggn/active/{topic_name}/metrics/token-usage.jsonl`",
            "PGG process artifact는 반드시 active topic directory 하위에 저장한다."
          ],
          [
            "When `pgg-add` starts, create `poggn/active/{topic_name}`.",
            "Recommended file: `poggn/active/{topic_name}/state.json`",
            "Recommended file: `poggn/active/{topic_name}/pgg-add/requirements.md`",
            "Recommended file: `poggn/active/{topic_name}/pgg-add/acceptance-criteria.md`",
            "Recommended file: `poggn/active/{topic_name}/metrics/token-usage.jsonl`",
            "PGG process artifacts must be stored under the active topic directory."
          ]
        )
      },
      {
        title: { ko: "Version 결정", en: "Version Decision" },
        body: md(
          [
            "currentVersion은 기존 version source에서 읽는다.",
            "npm library는 기본적으로 `package.json` version을 사용한다.",
            "산출물은 currentVersion, targetVersion, bumpType, convention, reason, versionSource를 포함한다.",
            "`major`: breaking change, 기존 시스템 기능의 완전한 변경, public behavior의 큰 변경.",
            "`minor`: 기능 추가, 기능 삭제, 새로운 flow 추가, 비파괴적 기능 확장.",
            "`patch`: bug fix, 문서/테스트 수정, 동작 보존 refactor, 비파괴적 성능 개선, chore."
          ],
          [
            "Read currentVersion from the existing version source.",
            "For npm libraries, use `package.json` version by default.",
            "The output includes currentVersion, targetVersion, bumpType, convention, reason, and versionSource.",
            "`major`: breaking change, complete replacement of existing system behavior, or large public behavior change.",
            "`minor`: feature addition, feature removal, new flow, or non-breaking expansion.",
            "`patch`: bug fix, docs/tests change, behavior-preserving refactor, non-breaking performance improvement, or chore."
          ]
        )
      },
      {
        title: { ko: "pgg git mode", en: "pgg git mode" },
        body: md(
          [
            "`pgg git = off`이면 branch 생성, commit, push를 하지 않고 완료 메시지에 비활성화 상태를 기록한다.",
            "`pgg git = on`이면 git repository 여부를 확인한다.",
            "git repository가 아니면 git 작업을 생략하고 사유를 기록한다.",
            "git repository이면 기존 branch naming policy를 사용하고, 없으면 `pgg/working/{topic_name}` working branch를 생성하거나 전환한다.",
            "`state.json`에는 pggGit, isGitRepository, baseBranch, workingBranch, topicName, currentVersion, targetVersion, bumpType, convention, activePath, archivePath를 기록한다."
          ],
          [
            "When `pgg git = off`, do not create branches, commit, or push; record disabled git status in the completion message.",
            "When `pgg git = on`, check whether the project is a git repository.",
            "If it is not a git repository, skip git operations and record the reason.",
            "If it is a git repository, use the existing branch naming policy; otherwise create or switch to `pgg/working/{topic_name}`.",
            "`state.json` records pggGit, isGitRepository, baseBranch, workingBranch, topicName, currentVersion, targetVersion, bumpType, convention, activePath, and archivePath."
          ]
        )
      },
      {
        title: { ko: "필수 출력 섹션", en: "Required Output Sections" },
        body: md(
          [
            "topic_name, active path, archive path",
            "요구사항 수집 결과, 기능 목적, 포함 범위, 제외 범위, 가정, 리스크",
            "Acceptance Criteria 초안, 승인 상태",
            "currentVersion, targetVersion, bumpType, convention, versionReason",
            "pgg git 상태, working branch 정보",
            "pgg-performance 필요성 후보"
          ],
          [
            "topic_name, active path, archive path",
            "Requirement collection result, feature purpose, in-scope items, out-of-scope items, assumptions, risks",
            "Acceptance Criteria draft and approval status",
            "currentVersion, targetVersion, bumpType, convention, versionReason",
            "pgg git status and working branch information",
            "pgg-performance applicability candidate"
          ]
        )
      },
      {
        title: { ko: "Acceptance Criteria 초안 작성 규칙", en: "Acceptance Criteria Drafting Rules" },
        body: md(
          [
            "각 Acceptance Criterion은 관찰 가능한 동작으로 작성한다.",
            "정상 경로, 실패 경로, 제외 범위, 보안/권한/데이터 저장 요구사항을 필요한 만큼 분리한다.",
            "검증 가능한 pass/fail 기준을 포함한다.",
            "불확실한 조건은 가정 또는 질문으로 분리하고 승인 상태를 표시한다."
          ],
          [
            "Write each Acceptance Criterion as observable behavior.",
            "Separate happy path, failure path, out-of-scope items, and security/authorization/data persistence requirements as needed.",
            "Include verifiable pass/fail criteria.",
            "Separate uncertain conditions into assumptions or questions and mark approval status."
          ]
        )
      },
      {
        title: { ko: "Commit 규칙", en: "Commit Rules" },
        body: md(
          [
            "`pgg git = on`이고 git repository이면 초기 POGGN workspace와 pgg-add 산출물을 commit할 수 있다.",
            "commit message 형식은 `{convention}. {version} {message}`이다.",
            "예: `feat. 1.3.0 add pgg requirements for login-flow`",
            "`pgg git = off`이면 commit하지 않는다."
          ],
          [
            "When `pgg git = on` and the project is a git repository, the initial POGGN workspace and pgg-add artifacts may be committed.",
            "Commit messages use `{convention}. {version} {message}`.",
            "Example: `feat. 1.3.0 add pgg requirements for login-flow`",
            "When `pgg git = off`, do not commit."
          ]
        )
      }
    ],
    requiredPhases: md(
      [
        "요구 사항 수집",
        "기능 목적 정의",
        "Acceptance Criteria 초안 작성",
        "topic_name 생성",
        "POGGN active workspace 생성",
        "version 결정",
        "`pgg git = on`일 경우 working branch 생성 또는 전환",
        "approval gate 확인"
      ],
      [
        "Collect requirements",
        "Define feature purpose",
        "Draft Acceptance Criteria",
        "Create topic_name",
        "Create the POGGN active workspace",
        "Decide version",
        "Create or switch to the working branch when `pgg git = on`",
        "Check approval gate"
      ]
    ),
    approvalGates: md(
      [
        "`auto off`에서는 요구사항 질문 답변과 작은 설계 단위 승인이 완료되기 전 `pgg-plan`으로 진행하지 않는다.",
        "정상 완료와 승인 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-plan`이다.",
        "요구사항 불충분 또는 승인 미완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이다."
      ],
      [
        "In `auto off`, do not continue to `pgg-plan` until requirement questions and small design-unit approvals are complete.",
        "On normal approved completion, the final sentence is `다음 flow를 실행하세요: pgg-plan`.",
        "When requirements are insufficient or approval is incomplete, the final sentence is `다음 flow를 실행하세요: pgg-add`."
      ]
    ),
    verificationRequirements: md(
      [
        "`topic_name`이 lowercase kebab-case이고 충돌 시 runId 또는 timestamp가 붙었는지 확인한다.",
        "`poggn/active/{topic_name}`과 권장 state/requirements/acceptance/token 파일 경로가 산출물에 기록되었는지 확인한다.",
        "currentVersion이 version source에서 읽혔고 targetVersion, bumpType, convention, reason, versionSource가 기록되었는지 확인한다.",
        "`pgg git` mode, git repository 여부, baseBranch, workingBranch 판단이 state에 기록되었는지 확인한다.",
        "completion message 마지막 문장이 허용된 next flow 문장인지 확인한다."
      ],
      [
        "Verify that `topic_name` is lowercase kebab-case and includes runId or timestamp on collision.",
        "Verify that `poggn/active/{topic_name}` and recommended state/requirements/acceptance/token file paths are recorded.",
        "Verify that currentVersion was read from the version source and targetVersion, bumpType, convention, reason, and versionSource are recorded.",
        "Verify that `pgg git` mode, git repository status, baseBranch, and workingBranch decisions are recorded in state.",
        "Verify that the completion message final sentence is an allowed next-flow sentence."
      ]
    ),
    reviewRequirements: md(
      [
        "질문이 숨겨진 요구사항과 제약 조건을 실제로 드러내는지 review한다.",
        "기능 목적, 포함 범위, 제외 범위, 가정, 리스크가 서로 충돌하지 않는지 review한다.",
        "Acceptance Criteria가 관찰 가능하고 검증 가능한지 review한다.",
        "version bump와 convention 판단 근거가 요구사항과 일치하는지 review한다.",
        "pgg-performance 필요성 후보가 성능/속도/최적화/응답 시간/처리량/메모리 요구사항을 놓치지 않았는지 review한다."
      ],
      [
        "Review whether questions actually expose hidden requirements and constraints.",
        "Review whether feature purpose, scope, assumptions, and risks are consistent.",
        "Review whether Acceptance Criteria are observable and verifiable.",
        "Review whether version bump and convention rationale match the requirements.",
        "Review whether pgg-performance applicability captures performance, speed, optimization, response-time, throughput, or memory requirements."
      ]
    ),
    nextFlowRouting: md(
      [
        "정상 완료와 승인 완료: `pgg-add` -> `pgg-plan`.",
        "요구사항 불충분 또는 승인 미완료: `pgg-add` -> `pgg-add`.",
        "성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량 요구가 있으면 pgg-performance 필요성 후보로 기록하고 이후 `pgg-plan` 또는 `pgg-code`에서 실행 필요성을 판단한다."
      ],
      [
        "Normal approved completion: `pgg-add` -> `pgg-plan`.",
        "Insufficient requirements or incomplete approval: `pgg-add` -> `pgg-add`.",
        "When performance, speed, optimization, response-time, throughput, or memory-use requirements exist, record a pgg-performance applicability candidate so later `pgg-plan` or `pgg-code` can decide whether to run it."
      ]
    )
  }),
  defineSkill({
    id: "pgg-plan",
    name: { ko: "PGG Plan", en: "PGG Plan" },
    purpose: md(
      [
        "`pgg-plan`은 승인된 요구사항과 설계를 상세한 구현 계획으로 바꾸는 Skill이다.",
        "산출물은 junior engineer가 프로젝트 맥락 없이도 그대로 따라갈 수 있을 만큼 정확한 파일 경로, 완전한 코드 또는 코드 작성 지시, 검증 단계, 예상 결과, 실패 시 확인 항목을 포함해야 한다."
      ],
      [
        "`pgg-plan` turns approved requirements and design into a detailed implementation plan.",
        "Outputs must include exact file paths, complete code or code-writing instructions, verification steps, expected results, and failure checks so a junior engineer can follow them without project context."
      ]
    ),
    targetAgent: md(
      [
        "승인된 pgg-add 산출물을 읽고 구현 전략, 검증 전략, test plan, version bump task, 2~5분 단위 task를 설계하는 AI 개발 에이전트."
      ],
      [
        "An AI development agent that reads approved pgg-add artifacts and designs implementation strategy, verification strategy, test plan, version bump task, and 2-5 minute tasks."
      ]
    ),
    triggerConditions: md(
      [
        "`pgg-add` 산출물이 승인된 뒤에만 실행한다.",
        "`auto off`에서 pgg-add 승인이 없으면 구현 계획을 생성하지 않고 승인을 요청한다.",
        "승인 전에는 구현 task를 생성하지 않는다."
      ],
      [
        "Run only after `pgg-add` artifacts are approved.",
        "In `auto off`, if pgg-add approval is missing, request approval instead of creating an implementation plan.",
        "Do not create implementation tasks before approval."
      ]
    ),
    inputs: md(
      [
        "`poggn/active/{topic_name}/state.json`",
        "승인된 `pgg-add` 산출물과 acceptance criteria",
        "repository discovery 결과와 기존 project verification contract",
        "pgg-add에서 결정한 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource",
        "`auto` mode, `teams` mode, `pgg git` mode"
      ],
      [
        "`poggn/active/{topic_name}/state.json`",
        "Approved `pgg-add` artifacts and acceptance criteria",
        "Repository discovery result and existing project verification contract",
        "currentVersion, targetVersion, bumpType, convention, versionReason, and versionSource decided by pgg-add",
        "`auto` mode, `teams` mode, and `pgg git` mode"
      ]
    ),
    outputs: md(
      [
        "`poggn/active/{topic_name}/pgg-plan/plan.md`",
        "`poggn/active/{topic_name}/pgg-plan/task.md`",
        "`poggn/active/{topic_name}/pgg-plan/spec/*/*.md`",
        "`poggn/active/{topic_name}/pgg-plan/reviews/plan.review.md`",
        "`poggn/active/{topic_name}/pgg-plan/reviews/task.review.md`",
        "승인된 설계 요약, topic_name, active path, version metadata, 검증 전략, test plan, 생성할 테스트 목록, 성공/실패 기준, 경계값/예외/회귀/성능 기준",
        "version bump task와 2~5분 단위 task 목록",
        "`poggn/active/{topic_name}/metrics/token-usage.jsonl` token 기록"
      ],
      [
        "`poggn/active/{topic_name}/pgg-plan/plan.md`",
        "`poggn/active/{topic_name}/pgg-plan/task.md`",
        "`poggn/active/{topic_name}/pgg-plan/spec/*/*.md`",
        "`poggn/active/{topic_name}/pgg-plan/reviews/plan.review.md`",
        "`poggn/active/{topic_name}/pgg-plan/reviews/task.review.md`",
        "Approved design summary, topic_name, active path, version metadata, verification strategy, test plan, tests to create, success/failure criteria, and boundary/exception/regression/performance criteria",
        "Version bump task and 2-5 minute task list",
        "`poggn/active/{topic_name}/metrics/token-usage.jsonl` token records"
      ]
    ),
    absoluteRules: md(
      [
        "`poggn/active/{topic_name}/state.json`을 반드시 읽는다.",
        "pgg-plan 산출물은 `poggn/active/{topic_name}/pgg-plan/` 아래에 저장한다.",
        "`auto off`에서는 승인된 pgg-add 산출물이 없으면 계획과 task를 생성하지 않는다.",
        "구현 코드를 실제 project file에 적용하지 않는다.",
        "각 task는 2~5분 내 완료 가능한 크기, 정확한 파일 경로, 필요한 경우 완전한 코드, 검증 단계, 예상 결과, 실패 시 확인 항목을 포함한다.",
        "`적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리` 같은 모호한 표현을 쓰지 않는다.",
        "pgg-add에서 결정한 version 정보를 사용하고 project version을 targetVersion으로 올리는 명시적 task를 포함한다.",
        "성능 기준이 있으면 측정 대상, 지표, baseline 또는 baseline 측정 방법, 성공/실패 기준, pgg-performance 실행 필요 여부를 포함한다."
      ],
      [
        "Always read `poggn/active/{topic_name}/state.json`.",
        "Store pgg-plan artifacts under `poggn/active/{topic_name}/pgg-plan/`.",
        "In `auto off`, do not create plans or tasks without approved pgg-add artifacts.",
        "Do not apply implementation code to real project files.",
        "Each task includes a 2-5 minute size, exact file paths, complete code when needed, verification steps, expected result, and failure checks.",
        "Do not use vague phrases such as `implement appropriately`, `add required logic`, or `handle it generally`.",
        "Use the version information decided by pgg-add and include an explicit task that bumps the project version to targetVersion.",
        "When performance criteria exist, include target, metric, baseline or baseline method, success/failure criteria, and whether pgg-performance is required."
      ]
    ),
    antiPatterns: md(
      [
        "승인되지 않은 pgg-add 산출물을 근거로 task 생성",
        "`state.json`을 읽지 않고 version이나 approval 상태 추정",
        "root `plan.md`/`task.md`만 생성하고 `pgg-plan/` 산출물을 누락",
        "2~5분보다 큰 task 또는 파일 경로 없는 task",
        "검증 단계, 예상 결과, 실패 시 확인 항목 없는 task",
        "version bump task 누락",
        "성능 민감 변경인데 pgg-performance 후보 판단 누락"
      ],
      [
        "Creating tasks from unapproved pgg-add artifacts",
        "Inferring version or approval state without reading `state.json`",
        "Creating only root `plan.md`/`task.md` and missing `pgg-plan/` artifacts",
        "Tasks larger than 2-5 minutes or tasks without file paths",
        "Tasks without verification steps, expected results, or failure checks",
        "Missing version bump task",
        "Missing pgg-performance applicability decision for performance-sensitive changes"
      ]
    ),
    modeSpecificBehavior: {
      autoOff: md(
        [
          "승인된 pgg-add 산출물을 먼저 확인한다.",
          "승인되지 않았다면 계획이나 구현 task를 만들지 않고 승인 요청으로 멈춘다.",
          "상세 검증 전략, test plan, 생성할 테스트, 성공/실패 기준, 경계값/예외/회귀/성능 기준, version bump task, 2~5분 task를 작성한다.",
          "구현 단계로 넘어가기 전에 승인을 요구한다.",
          "정상 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-code`이고, 설계 승인 미완료 시 `다음 flow를 실행하세요: pgg-add`이다."
        ],
        [
          "First confirm approved pgg-add artifacts.",
          "If approval is missing, stop with an approval request instead of creating a plan or implementation tasks.",
          "Write detailed verification strategy, test plan, tests to create, success/failure criteria, boundary/exception/regression/performance criteria, version bump task, and 2-5 minute tasks.",
          "Require approval before moving to implementation.",
          "On normal completion the final sentence is `다음 flow를 실행하세요: pgg-code`; when design approval is incomplete it is `다음 flow를 실행하세요: pgg-add`."
        ]
      ),
      autoOn: md(
        [
          "최적 구현 전략을 추론한다.",
          "전체 상세 계획을 자동 생성한다.",
          "version bump task를 포함한다.",
          "가정, 불확실성, 병렬화 가능한 task, 예상 병목, 검증 명령어를 포함한다."
        ],
        [
          "Infer the best implementation strategy.",
          "Automatically generate the full detailed plan.",
          "Include the version bump task.",
          "Include assumptions, uncertainty, parallelizable tasks, expected bottlenecks, and verification commands."
        ]
      ),
      teamsOff: md(
        ["`teams off`에서는 단일 에이전트가 승인 확인, 계획 작성, task review를 수행한다."],
        ["In `teams off`, one agent confirms approval, writes the plan, and reviews tasks."]
      ),
      teamsOn: md(
        [
          "`teams on`이고 환경이 지원하면 software architect와 domain expert 관점의 bounded review를 task별 fresh subagent에 위임할 수 있다.",
          "subagent는 구현하지 않고 task 명확성, spec 경계, domain constraint, 검증 기준만 review한다."
        ],
        [
          "In `teams on`, when supported, delegate bounded software-architect and domain-expert reviews to fresh subagents.",
          "Subagents do not implement; they review only task clarity, spec boundaries, domain constraints, and verification criteria."
        ]
      )
    },
    additionalGuidance: [
      {
        title: { ko: "필수 단계", en: "Required Steps" },
        body: md(
          [
            "1. 승인된 pgg-add 산출물을 확인한다.",
            "2. `poggn/active/{topic_name}/state.json`을 읽는다.",
            "3. 검증 전략을 수립한다.",
            "4. test plan을 작성한다.",
            "5. 어떤 테스트를 만들지 결정한다.",
            "6. 성공/실패 기준을 정의한다.",
            "7. 경계값, 예외, 회귀, 성능 기준을 정의한다.",
            "8. version bump task를 작성한다.",
            "9. 구현을 2~5분 단위 task로 쪼갠다."
          ],
          [
            "1. Confirm approved pgg-add artifacts.",
            "2. Read `poggn/active/{topic_name}/state.json`.",
            "3. Define the verification strategy.",
            "4. Write the test plan.",
            "5. Decide which tests to create.",
            "6. Define success/failure criteria.",
            "7. Define boundary, exception, regression, and performance criteria.",
            "8. Write the version bump task.",
            "9. Split implementation into 2-5 minute tasks."
          ]
        )
      },
      {
        title: { ko: "Version Plan", en: "Version Plan" },
        body: md(
          [
            "pgg-add가 결정한 currentVersion, targetVersion, bumpType, convention, versionReason, versionSource를 그대로 사용한다.",
            "package.json이 versionSource이면 `package.json`의 version을 targetVersion으로 수정하는 task를 포함한다.",
            "package.json이 versionSource가 아니면 기존 프로젝트의 versionSource 파일을 사용한다.",
            "version bump task 검증은 version source의 version 값이 targetVersion과 일치하는지 확인한다."
          ],
          [
            "Use the currentVersion, targetVersion, bumpType, convention, versionReason, and versionSource decided by pgg-add.",
            "If package.json is the versionSource, include a task that updates `package.json` version to targetVersion.",
            "If package.json is not the versionSource, use the project's existing versionSource file.",
            "The version bump task verifies that the version source value equals targetVersion."
          ]
        )
      },
      {
        title: { ko: "Task 작성 규칙", en: "Task Writing Rules" },
        body: md(
          [
            "각 task는 2~5분 내 완료 가능한 단일 변경이어야 한다.",
            "각 task는 파일 경로를 정확히 적는다.",
            "필요한 경우 붙여 넣을 수 있는 완전한 코드 또는 코드 작성 지시를 포함한다.",
            "각 task는 검증 단계, 예상 결과, 실패 시 확인할 항목을 포함한다.",
            "모호한 표현인 `적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리`를 사용하지 않는다."
          ],
          [
            "Each task is one 2-5 minute change.",
            "Each task states exact file paths.",
            "When needed, include complete paste-ready code or code-writing instructions.",
            "Each task includes verification steps, expected result, and failure checks.",
            "Do not use vague phrases such as `implement appropriately`, `add required logic`, or `handle it generally`."
          ]
        )
      },
      {
        title: { ko: "pgg-performance 유도 조건", en: "pgg-performance Trigger Conditions" },
        body: md(
          [
            "성능 기준이 요구사항에 포함되면 pgg-performance 후보로 표시한다.",
            "응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수가 중요하면 pgg-performance 후보로 표시한다.",
            "대량 데이터, 반복 처리, 네트워크 요청, 캐싱, 동시성, 파일 처리 변경이 있으면 pgg-performance 후보로 표시한다.",
            "pgg-code 이후 benchmark가 필요할 수 있으면 pgg-performance 후보로 표시한다.",
            "성능 기준이 있으면 측정 대상, 측정 지표, baseline 또는 baseline 측정 방법, 성공/실패 기준, pgg-performance 실행 필요 여부를 기록한다."
          ],
          [
            "Mark pgg-performance as a candidate when performance criteria are part of the requirements.",
            "Mark pgg-performance as a candidate when response time, throughput, memory use, bundle size, or DB query count matters.",
            "Mark pgg-performance as a candidate when the change touches large data, repeated processing, network requests, caching, concurrency, or file processing.",
            "Mark pgg-performance as a candidate when a benchmark may be needed after pgg-code.",
            "When performance criteria exist, record target, metric, baseline or baseline method, success/failure criteria, and whether pgg-performance must run."
          ]
        )
      },
      {
        title: { ko: "Commit 규칙", en: "Commit Rules" },
        body: md(
          [
            "`pgg git = on`이고 git repository이면 pgg-plan 산출물을 commit할 수 있다.",
            "commit message 형식은 `{convention}. {version} {message}`이다.",
            "예: `feat. 1.3.0 add pgg implementation plan for login-flow`",
            "`pgg git = off`이면 commit하지 않는다."
          ],
          [
            "When `pgg git = on` and the project is a git repository, pgg-plan artifacts may be committed.",
            "Commit messages use `{convention}. {version} {message}`.",
            "Example: `feat. 1.3.0 add pgg implementation plan for login-flow`",
            "When `pgg git = off`, do not commit."
          ]
        )
      }
    ],
    requiredPhases: md(
      [
        "승인된 pgg-add 산출물 확인",
        "`state.json` 읽기와 version metadata 확인",
        "검증 전략 수립",
        "test plan과 생성할 테스트 목록 작성",
        "성공/실패, 경계값, 예외, 회귀, 성능 기준 정의",
        "version bump task 작성",
        "2~5분 단위 task 분해",
        "approval gate 확인"
      ],
      [
        "Confirm approved pgg-add artifacts",
        "Read `state.json` and confirm version metadata",
        "Define verification strategy",
        "Write test plan and tests-to-create list",
        "Define success/failure, boundary, exception, regression, and performance criteria",
        "Write version bump task",
        "Break work into 2-5 minute tasks",
        "Check approval gate"
      ]
    ),
    approvalGates: md(
      [
        "`auto off`에서는 pgg-add 승인 전 계획을 생성하지 않는다.",
        "`auto off`에서는 plan 승인 전 `pgg-code`로 진행하지 않는다.",
        "설계 승인 미완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이다.",
        "계획이 불충분하면 마지막 문장은 `다음 flow를 실행하세요: pgg-plan`이다.",
        "정상 완료와 계획 승인 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-code`이다."
      ],
      [
        "In `auto off`, do not create a plan before pgg-add approval.",
        "In `auto off`, do not continue to `pgg-code` before plan approval.",
        "When design approval is incomplete, the final sentence is `다음 flow를 실행하세요: pgg-add`.",
        "When the plan is insufficient, the final sentence is `다음 flow를 실행하세요: pgg-plan`.",
        "On normal completion with plan approval, the final sentence is `다음 flow를 실행하세요: pgg-code`."
      ]
    ),
    verificationRequirements: md(
      [
        "산출물이 `poggn/active/{topic_name}/pgg-plan/` 아래에 있는지 확인한다.",
        "currentVersion, targetVersion, bumpType, convention, versionReason, versionSource가 plan에 포함되었는지 확인한다.",
        "version bump task가 있고 versionSource를 targetVersion으로 올리도록 지시하는지 확인한다.",
        "모든 acceptance criteria가 task 또는 verification step에 연결되었는지 확인한다.",
        "각 task가 파일 경로, 완전한 코드 또는 코드 작성 지시, 검증 단계, 예상 결과, 실패 시 확인 항목을 포함하는지 확인한다.",
        "성능 민감 조건이 있으면 pgg-performance 필요 여부와 측정 기준이 포함되었는지 확인한다.",
        "completion message 마지막 문장이 허용된 next flow 문장인지 확인한다."
      ],
      [
        "Verify that artifacts are under `poggn/active/{topic_name}/pgg-plan/`.",
        "Verify that currentVersion, targetVersion, bumpType, convention, versionReason, and versionSource are included in the plan.",
        "Verify that a version bump task exists and instructs updating versionSource to targetVersion.",
        "Verify that every acceptance criterion maps to a task or verification step.",
        "Verify that each task includes file paths, complete code or instructions, verification steps, expected result, and failure checks.",
        "If performance-sensitive conditions exist, verify that pgg-performance applicability and measurement criteria are included.",
        "Verify that the completion message final sentence is an allowed next-flow sentence."
      ]
    ),
    reviewRequirements: md(
      [
        "plan review는 구현 전략, dependency, blast radius, version bump 적합성을 검토한다.",
        "task review는 2~5분 크기, 파일 경로 정확성, 코드 지시 완전성, 검증 가능성을 검토한다.",
        "test coverage가 acceptance criteria, 경계값, 예외, 회귀, 성능 기준을 충분히 다루는지 검토한다.",
        "review 문서에는 software architect와 domain expert 관점의 attribution을 남긴다."
      ],
      [
        "Plan review checks implementation strategy, dependencies, blast radius, and version bump fit.",
        "Task review checks 2-5 minute size, file path accuracy, instruction completeness, and verifiability.",
        "Review whether test coverage sufficiently covers acceptance criteria, boundaries, exceptions, regressions, and performance criteria.",
        "Review documents include software architect and domain expert attribution."
      ]
    ),
    nextFlowRouting: md(
      [
        "정상 완료: `pgg-plan` -> `pgg-code`.",
        "설계 승인 미완료: `pgg-plan` -> `pgg-add`.",
        "계획 불충분: `pgg-plan` -> `pgg-plan`.",
        "마지막 문장은 `다음 flow를 실행하세요: pgg-code`, `다음 flow를 실행하세요: pgg-add`, `다음 flow를 실행하세요: pgg-plan` 중 하나여야 한다."
      ],
      [
        "Normal completion: `pgg-plan` -> `pgg-code`.",
        "Incomplete design approval: `pgg-plan` -> `pgg-add`.",
        "Insufficient plan: `pgg-plan` -> `pgg-plan`.",
        "The final sentence must be one of `다음 flow를 실행하세요: pgg-code`, `다음 flow를 실행하세요: pgg-add`, or `다음 flow를 실행하세요: pgg-plan`."
      ]
    ),
    performanceTriggerGuidance: md(
      [
        "성능 기준이 요구사항에 포함되면 pgg-performance 후보로 표시한다.",
        "응답 시간, 처리량, 메모리 사용량, 번들 크기, DB query 수가 중요하면 pgg-performance 후보로 표시한다.",
        "대량 데이터, 반복 처리, 네트워크 요청, 캐싱, 동시성, 파일 처리 변경이 있으면 pgg-performance 후보로 표시한다.",
        "pgg-code 이후 benchmark가 필요할 수 있으면 pgg-performance 후보로 표시한다.",
        "성능 기준이 있다면 측정 대상, 측정 지표, baseline 또는 baseline 측정 방법, 성능 성공/실패 기준, pgg-performance 실행 필요 여부를 포함한다."
      ],
      [
        "Mark pgg-performance as a candidate when performance criteria are included in requirements.",
        "Mark pgg-performance as a candidate when response time, throughput, memory use, bundle size, or DB query count matters.",
        "Mark pgg-performance as a candidate when the change touches large data, repeated processing, network requests, caching, concurrency, or file processing.",
        "Mark pgg-performance as a candidate when a benchmark may be needed after pgg-code.",
        "When performance criteria exist, include measurement target, metric, baseline or baseline method, performance success/failure criteria, and whether pgg-performance must run."
      ]
    ),
    generatedDocumentationSections: md(
      [
        "pgg-plan 목적",
        "승인된 설계 필요 조건",
        "active workspace 사용",
        "검증 전략",
        "test plan",
        "테스트 선택",
        "성공/실패 기준",
        "경계값/예외/회귀/성능 기준",
        "version bump task",
        "2~5분 task 규칙",
        "파일 경로/완전한 코드/검증 단계 요구사항",
        "pgg-performance 유도 조건",
        "completion message 규격",
        "completionMessageContract",
        "token accounting 규칙",
        "commit 규칙",
        "next flow routing"
      ],
      [
        "pgg-plan purpose",
        "approved design precondition",
        "active workspace usage",
        "verification strategy",
        "test plan",
        "test selection",
        "success/failure criteria",
        "boundary/exception/regression/performance criteria",
        "version bump task",
        "2-5 minute task rules",
        "file path/complete code/verification step requirements",
        "pgg-performance trigger conditions",
        "completion message contract",
        "completionMessageContract",
        "token accounting rules",
        "commit rules",
        "next flow routing"
      ]
    )
  }),
  defineSkill({
    id: "pgg-code",
    name: { ko: "PGG Code", en: "PGG Code" },
    purpose: md(
      [
        "`pgg-code`는 승인된 `pgg-plan`을 기반으로 테스트 우선 구현, 실패 분석, 수정, 재검증을 수행하는 Skill이다.",
        "범용 AI 에이전트가 plan의 task를 실제 repository 파일에 적용하되, 각 task마다 테스트, 구현, 실패 로그 분석, 두 단계 review, token 기록, 조건부 git commit까지 닫힌 loop로 끝내도록 가르친다."
      ],
      [
        "`pgg-code` is the Skill that implements an approved `pgg-plan` through test-first coding, failure analysis, fixes, and re-verification.",
        "It teaches a general-purpose AI agent to apply planned tasks to real repository files and close each task with tests, implementation, failure-log analysis, two reviews, token records, and a conditional git commit."
      ]
    ),
    targetAgent: md(
      [
        "승인된 plan을 읽고 실제 테스트 코드와 실제 구현 코드를 작성하며, 실패를 분석해 수정하고 재검증하는 AI 개발 에이전트.",
        "`teams on` 환경에서는 메인 에이전트가 모든 코드를 직접 작성하지 않고 task별 fresh subagent에 제한된 handoff를 위임한 뒤 review한다."
      ],
      [
        "An AI development agent that reads the approved plan, writes real tests and real implementation code, analyzes failures, fixes them, and verifies again.",
        "In `teams on`, the main agent does not write all code directly; it delegates bounded task handoffs to fresh subagents and then reviews the result."
      ]
    ),
    triggerConditions: md(
      [
        "`pgg-plan`이 PASS이고 구현 승인이 완료된 후 실행한다.",
        "`poggn/active/{topic_name}/state.json`의 currentFlow, approval, targetVersion, pggGit 정보를 확인한 뒤 시작한다.",
        "승인된 plan/task/Acceptance Criteria가 없거나 targetVersion이 없으면 구현하지 않고 `pgg-plan`으로 되돌린다."
      ],
      [
        "Run after `pgg-plan` is PASS and implementation is approved.",
        "Start only after reading currentFlow, approval, targetVersion, and pggGit from `poggn/active/{topic_name}/state.json`.",
        "If approved plan/tasks/Acceptance Criteria or targetVersion are missing, do not implement; route back to `pgg-plan`."
      ]
    ),
    inputs: md(
      [
        "`poggn/active/{topic_name}/state.json`",
        "`poggn/active/{topic_name}/pgg-plan/` 아래의 승인된 plan, task, Acceptance Criteria, 검증 전략",
        "pgg-add에서 결정되고 pgg-plan에 포함된 currentVersion, targetVersion, bumpType, convention, versionSource",
        "task별 실제 파일 경로, 생성할 테스트, 필요한 검증 단계",
        "작업 전 dirty worktree baseline과 사용자 변경사항"
      ],
      [
        "`poggn/active/{topic_name}/state.json`",
        "Approved plan, tasks, Acceptance Criteria, and verification strategy under `poggn/active/{topic_name}/pgg-plan/`",
        "currentVersion, targetVersion, bumpType, convention, and versionSource decided by pgg-add and included by pgg-plan",
        "Per-task real file paths, tests to create, and verification steps",
        "The dirty-worktree baseline and user changes before work starts"
      ]
    ),
    outputs: md(
      [
        "`poggn/active/{topic_name}/pgg-code/` 아래의 implementation report, task 결과, 실패 로그 분석, review 결과, verify 결과",
        "plan에 명시된 실제 project path의 테스트 코드와 구현 코드 변경",
        "project version bump 결과와 `state.json`의 projectVersionUpdated, versionSource, currentVersion, targetVersion 갱신",
        "`poggn/active/{topic_name}/metrics/token-usage.jsonl`의 task별 token record와 commitSha 연결",
        "task별 commit SHA 또는 commit 생략 사유",
        "pgg-performance 필요 여부와 다음 flow 추천"
      ],
      [
        "Implementation report, task results, failure-log analysis, review results, and verify results under `poggn/active/{topic_name}/pgg-code/`",
        "Test and implementation changes at the real project paths named by the plan",
        "Project version bump result and updated projectVersionUpdated, versionSource, currentVersion, and targetVersion in `state.json`",
        "Per-task token records in `poggn/active/{topic_name}/metrics/token-usage.jsonl` with commitSha linkage",
        "Per-task commit SHA or commit-skip reason",
        "pgg-performance applicability and next-flow recommendation"
      ]
    ),
    absoluteRules: md(
      [
        "항상 `poggn/active/{topic_name}/state.json`을 먼저 읽는다.",
        "pgg-code artifact는 `poggn/active/{topic_name}/pgg-code/` 아래에 저장한다.",
        "애플리케이션 실제 소스코드는 pgg-plan에 명시된 실제 파일 경로에 생성하거나 수정한다.",
        "필수 실행 순서는 실제 테스트 코드 생성, 실제 구현 코드 작성, 테스트 실행, 실패 로그 분석, 수정 후 재실행, project version bump 적용, verify 수행이다.",
        "generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.",
        "repository가 실제 multi-agent runtime을 제공하지 않으면 새 runtime을 임의로 만들지 않는다.",
        "teams/subagent 동작은 Skill 정의와 generated documentation에 표현하고, 기존 runtime command가 있을 때만 기존 구조 안에서 신규 core로 연결한다.",
        "push는 하지 않는다.",
        "기존 사용자 변경사항을 덮어쓰지 않고 task와 무관한 파일을 commit하지 않는다."
      ],
      [
        "Always read `poggn/active/{topic_name}/state.json` first.",
        "Store pgg-code artifacts under `poggn/active/{topic_name}/pgg-code/`.",
        "Create or modify application source files only at the real file paths named by pgg-plan.",
        "The mandatory execution order is: create real tests, write real implementation, run tests, analyze failure logs, fix and rerun, apply the project version bump, then verify.",
        "Update generated Markdown only from TypeScript Skill definitions and the generator; do not patch it by hand.",
        "Do not invent a new multi-agent runtime when the repository does not provide one.",
        "Represent team/subagent behavior in Skill definitions and generated documentation, and connect only through an existing runtime command when one exists.",
        "Do not push.",
        "Do not overwrite existing user changes and do not commit files unrelated to the task."
      ]
    ),
    antiPatterns: md(
      [
        "테스트 없이 구현부터 작성",
        "실패 로그를 읽지 않고 같은 테스트를 반복 실행",
        "review 실패를 무시하고 task 완료 처리",
        "token 기록 전에 task commit 생성",
        "pgg git off인데 commit 시도",
        "git 저장소가 아닌데 commit 시도",
        "generated Markdown 직접 수정",
        "versionSource를 무시하고 package.json만 추정 수정",
        "subagent에게 전체 repository context나 불필요한 이전 대화 context를 전달"
      ],
      [
        "Writing implementation before tests",
        "Rerunning the same tests without reading failure logs",
        "Marking a task complete after a failed review",
        "Creating the task commit before token records",
        "Attempting commits when pgg git is off",
        "Attempting commits outside a git repository",
        "Hand-editing generated Markdown",
        "Ignoring versionSource and blindly editing package.json",
        "Passing full repository context or unnecessary prior conversation context to a subagent"
      ]
    ),
    modeSpecificBehavior: {
      autoOff: md(
        [
          "승인된 pgg-plan과 task를 먼저 확인한다.",
          "승인되지 않았거나 scope/dependency 변경이 필요하면 구현 전에 사용자 승인을 받는다.",
          "각 task 완료 시 테스트 결과, 실패 로그 분석, review 결과, token 기록, commit 결과 또는 생략 사유를 보고한다.",
          "정상 완료 시 마지막 문장은 `다음 flow를 실행하세요: pgg-refactor` 또는 성능 측정 필요 시 `다음 flow를 실행하세요: pgg-performance`이다."
        ],
        [
          "First confirm the approved pgg-plan and tasks.",
          "If approval is missing or scope/dependency changes are required, get user approval before implementing.",
          "For each completed task, report test results, failure-log analysis, review results, token records, and commit SHA or skip reason.",
          "On normal completion, the final sentence is `다음 flow를 실행하세요: pgg-refactor`, or `다음 flow를 실행하세요: pgg-performance` when performance measurement is needed."
        ]
      ),
      autoOn: md(
        [
          "승인된 plan 안에서 테스트 우선 구현 loop를 자율적으로 수행한다.",
          "실패 원인을 추론해 최소 수정으로 재실행한다.",
          "가정, 불확실성, 실패 분석, review 결과, commit 생략 사유를 pgg-code artifact에 기록한다.",
          "성능 측정 필요성이 명확하면 다음 flow를 `pgg-performance`로 추천한다."
        ],
        [
          "Autonomously run the test-first implementation loop within the approved plan.",
          "Infer failure causes, apply the smallest appropriate fix, and rerun verification.",
          "Record assumptions, uncertainty, failure analysis, review results, and commit-skip reasons in pgg-code artifacts.",
          "Recommend `pgg-performance` as the next flow when performance measurement is clearly needed."
        ]
      ),
      teamsOff: md(
        [
          "`teams off`에서는 단일 에이전트가 task별 테스트 생성, 구현, 실패 분석, 수정, review, token 기록, 조건부 commit을 수행한다.",
          "단일 에이전트라도 Review 1: 명세 준수와 Review 2: 코드 품질은 분리해서 기록한다."
        ],
        [
          "In `teams off`, one agent performs per-task test creation, implementation, failure analysis, fixes, reviews, token records, and conditional commits.",
          "Even with one agent, record Review 1: spec compliance and Review 2: code quality separately."
        ]
      ),
      teamsOn: md(
        [
          "`teams on`이고 환경이 지원하면 메인 에이전트가 모든 코드를 직접 작성하지 않고 각 task마다 fresh subagent를 생성하거나 위임한다.",
          "각 subagent는 특정 task, 관련 파일 경로, 관련 Acceptance Criteria, 필요한 검증 단계, version 정보만 받는다.",
          "각 subagent는 깨끗한 context로 시작하고 이전 task나 전체 대화 맥락을 불필요하게 받지 않는다.",
          "subagent 작업 완료 후 메인 에이전트는 Review 1: 명세 준수와 Review 2: 코드 품질을 반드시 수행한다."
        ],
        [
          "In `teams on`, when the environment supports it, the main agent does not write all code directly and delegates each task to a fresh subagent.",
          "Each subagent receives only the specific task, relevant file paths, related Acceptance Criteria, required verification steps, and version information.",
          "Each subagent starts with clean context and does not receive unnecessary prior task or conversation context.",
          "After subagent completion, the main agent must perform Review 1: spec compliance and Review 2: code quality."
        ]
      )
    },
    additionalGuidance: [
      {
        title: { ko: "필수 실행 순서", en: "Mandatory Execution Order" },
        body: md(
          [
            "1. 실제 테스트 코드를 생성한다.",
            "2. 실제 구현 코드를 작성한다.",
            "3. 테스트를 실행한다.",
            "4. 실패 로그를 분석한다.",
            "5. 수정 후 테스트를 재실행한다.",
            "6. project version bump를 적용한다.",
            "7. verify를 수행한다."
          ],
          [
            "1. Create real test code.",
            "2. Write real implementation code.",
            "3. Run tests.",
            "4. Analyze failure logs.",
            "5. Fix and rerun tests.",
            "6. Apply the project version bump.",
            "7. Run verify."
          ]
        )
      },
      {
        title: { ko: "task 단위 실행 순서", en: "Per-Task Execution Order" },
        body: md(
          [
            "1. task 시작을 기록한다.",
            "2. 실제 테스트 코드를 생성한다.",
            "3. 실제 구현 코드를 작성한다.",
            "4. 테스트를 실행한다.",
            "5. 실패 로그를 분석한다.",
            "6. 수정 후 재실행한다.",
            "7. Review 1: 명세 준수를 수행한다.",
            "8. Review 2: 코드 품질을 수행한다.",
            "9. token 기록을 완료한다.",
            "10. git 저장소이고 pgg git = on이면 task commit을 수행한다.",
            "11. task 완료를 보고한다."
          ],
          [
            "1. Record task start.",
            "2. Create real test code.",
            "3. Write real implementation code.",
            "4. Run tests.",
            "5. Analyze failure logs.",
            "6. Fix and rerun.",
            "7. Perform Review 1: spec compliance.",
            "8. Perform Review 2: code quality.",
            "9. Complete token records.",
            "10. If this is a git repository and pgg git = on, create the task commit.",
            "11. Report task completion."
          ]
        )
      },
      {
        title: { ko: "Review 1: 명세 준수", en: "Review 1: Spec Compliance" },
        body: md(
          [
            "task 만족 여부를 확인한다.",
            "Acceptance Criteria 만족 여부를 확인한다.",
            "승인된 plan 준수 여부를 확인한다.",
            "필요한 테스트 생성 여부를 확인한다.",
            "필요한 검증 실행 여부를 확인한다.",
            "version bump task 수행 여부를 확인한다.",
            "실패하면 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다."
          ],
          [
            "Check whether the task is satisfied.",
            "Check whether Acceptance Criteria are satisfied.",
            "Check whether the approved plan was followed.",
            "Check whether required tests were created.",
            "Check whether required verification was run.",
            "Check whether the version bump task was performed.",
            "On failure, return the task for fixes, rerun related tests, and review again."
          ]
        )
      },
      {
        title: { ko: "Review 2: 코드 품질", en: "Review 2: Code Quality" },
        body: md(
          [
            "가독성을 확인한다.",
            "중복을 확인한다.",
            "에러 처리를 확인한다.",
            "네이밍을 확인한다.",
            "책임 분리를 확인한다.",
            "유지보수성을 확인한다.",
            "불필요한 dependency 여부를 확인한다.",
            "실패하면 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다."
          ],
          [
            "Check readability.",
            "Check duplication.",
            "Check error handling.",
            "Check naming.",
            "Check separation of responsibilities.",
            "Check maintainability.",
            "Check for unnecessary dependencies.",
            "On failure, return the task for fixes, rerun related tests, and review again."
          ]
        )
      },
      {
        title: { ko: "Project Version Bump", en: "Project Version Bump" },
        body: md(
          [
            "pgg-add에서 결정되고 pgg-plan에 포함된 targetVersion을 실제 project version에 반영한다.",
            "npm 라이브러리라면 기본적으로 `package.json` version을 targetVersion으로 수정한다.",
            "기존 프로젝트에 다른 version source가 있으면 그 구조를 따른다.",
            "`state.json`에 projectVersionUpdated, versionSource, currentVersion, targetVersion을 기록한다.",
            "version bump 검증은 versionSource의 실제 값이 targetVersion과 일치해야 PASS다."
          ],
          [
            "Apply the targetVersion decided by pgg-add and included by pgg-plan to the real project version.",
            "For npm libraries, update `package.json` version to targetVersion by default.",
            "If the project has another version source, follow that structure.",
            "Record projectVersionUpdated, versionSource, currentVersion, and targetVersion in `state.json`.",
            "Version bump verification passes only when the real versionSource value equals targetVersion."
          ]
        )
      },
      {
        title: { ko: "task별 git commit 규칙", en: "Per-Task Git Commit Rules" },
        body: md(
          [
            "task 1개가 완료될 때마다 commit을 수행한다. 단, pgg git = on이고 git 저장소가 있을 경우에만 commit한다.",
            "git 저장소 확인 명령은 `git rev-parse --is-inside-work-tree`이다.",
            "task commit 조건은 pgg git = on, git 저장소, 해당 task 테스트 통과, 실패 로그 분석과 수정 loop 완료, Review 1 통과, Review 2 통과, 해당 task token 기록 완료다.",
            "pgg git = off이면 commit하지 않고 완료 메시지에 생략 사유를 기록한다.",
            "git 저장소가 아니면 commit하지 않고 완료 메시지에 생략 사유를 기록한다.",
            "commit message 형식은 `{convention}. {version} {message}`이다.",
            "예: `feat. 1.3.0 pgg-code task-1 add login validation test`",
            "권장 footer: `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`",
            "push는 하지 않는다.",
            "task와 무관한 파일을 commit하지 않는다.",
            "작업 전 dirty worktree가 있으면 상태를 기록한다.",
            "commit 실패 시 실패 이유를 완료 메시지에 기록한다.",
            "git identity 문제로 commit이 불가능한 경우 global config를 변경하지 않는다."
          ],
          [
            "Create a commit after each task completes, but only when pgg git = on and the project is a git repository.",
            "Use `git rev-parse --is-inside-work-tree` to check repository status.",
            "A task commit requires pgg git = on, a git repository, passing task tests, completed failure-analysis/fix loop, Review 1 PASS, Review 2 PASS, and completed token records for that task.",
            "When pgg git = off, do not commit and record the skip reason in the completion message.",
            "When this is not a git repository, do not commit and record the skip reason in the completion message.",
            "Commit messages use `{convention}. {version} {message}`.",
            "Example: `feat. 1.3.0 pgg-code task-1 add login validation test`",
            "Recommended footer: `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`",
            "Do not push.",
            "Do not commit files unrelated to the task.",
            "Record dirty worktree state before work starts.",
            "If commit fails, record the failure reason in the completion message.",
            "If git identity prevents commits, do not change global config."
          ]
        )
      },
      {
        title: { ko: "Token Accounting", en: "Token Accounting" },
        body: md(
          [
            "기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
            "token 기록은 task commit 전에 완료되어야 한다.",
            "commit이 생성되면 token record에 commitSha를 연결해야 한다.",
            "task별 token 기록 요약을 pgg-code artifact와 completion message에 포함한다."
          ],
          [
            "The record path is `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
            "Token records must be completed before the task commit.",
            "When a commit is created, link commitSha back into the token records.",
            "Include per-task token summaries in pgg-code artifacts and the completion message."
          ]
        )
      },
      {
        title: { ko: "pgg-performance 유도 조건", en: "pgg-performance Trigger Conditions" },
        body: md(
          [
            "pgg-plan에 성능 기준이 있으면 pgg-performance를 next flow 후보로 추천한다.",
            "성능에 영향을 줄 수 있는 코드가 작성되면 pgg-performance를 추천할 수 있다.",
            "대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 추천할 수 있다.",
            "성능 회귀 가능성이 있거나 테스트만으로 성능 근거가 부족하면 pgg-performance를 추천할 수 있다.",
            "기본 정상 next flow는 pgg-refactor이고, 성능 측정 필요성이 명확하면 pgg-performance를 추천한다."
          ],
          [
            "Recommend pgg-performance as a next-flow candidate when pgg-plan includes performance criteria.",
            "Recommend pgg-performance when the implementation may affect performance.",
            "Recommend pgg-performance for changes involving large data, loops, DB queries, network requests, caching, concurrency, file processing, or bundle size.",
            "Recommend pgg-performance when performance regression is possible or tests alone do not provide performance evidence.",
            "The normal next flow is pgg-refactor; choose pgg-performance when measurement is clearly needed."
          ]
        )
      },
      {
        title: { ko: "완료 산출물", en: "Completion Artifacts" },
        body: md(
          [
            "완료된 task 목록을 포함한다.",
            "task별 테스트 결과를 포함한다.",
            "task별 실패 로그 분석 요약을 포함한다.",
            "task별 review 결과를 포함한다.",
            "task별 token 기록 요약을 포함한다.",
            "task별 commit SHA를 포함한다.",
            "commit 생략 사유를 포함한다.",
            "project version bump 결과를 포함한다.",
            "전체 verify 결과를 포함한다.",
            "pgg-performance 필요 여부를 포함한다.",
            "다음 flow 추천을 포함한다."
          ],
          [
            "Include the completed task list.",
            "Include per-task test results.",
            "Include per-task failure-log analysis summaries.",
            "Include per-task review results.",
            "Include per-task token record summaries.",
            "Include per-task commit SHAs.",
            "Include commit skip reasons.",
            "Include the project version bump result.",
            "Include the overall verify result.",
            "Include whether pgg-performance is needed.",
            "Include the recommended next flow."
          ]
        )
      }
    ],
    requiredPhases: md(
      [
        "context refresh와 dirty worktree baseline 기록",
        "`state.json` 읽기와 승인된 pgg-plan 확인",
        "task별 테스트 우선 구현 loop",
        "task별 실패 로그 분석과 수정 후 재실행",
        "task별 Review 1: 명세 준수",
        "task별 Review 2: 코드 품질",
        "task별 token 기록",
        "조건부 task commit",
        "project version bump 적용",
        "final verify와 docs generation 안정성 확인",
        "pgg-performance 필요 여부 판단",
        "completion message 작성"
      ],
      [
        "Refresh context and record dirty-worktree baseline",
        "Read `state.json` and confirm approved pgg-plan",
        "Run a test-first implementation loop per task",
        "Analyze failures and fix/rerun per task",
        "Run per-task Review 1: spec compliance",
        "Run per-task Review 2: code quality",
        "Record tokens per task",
        "Conditionally create the task commit",
        "Apply the project version bump",
        "Run final verify and docs generation stability check",
        "Decide whether pgg-performance is needed",
        "Write the completion message"
      ]
    ),
    approvalGates: md(
      [
        "승인된 pgg-plan 없이 구현하지 않는다.",
        "auto off에서는 scope 변경이나 dependency 추가 전 승인을 받는다.",
        "review 실패 시 완료 처리하지 않고 수정, 재검증, 재review를 수행한다.",
        "검증 실패 또는 미완료이면 마지막 문장은 `다음 flow를 실행하세요: pgg-code`이다."
      ],
      [
        "Do not implement without an approved pgg-plan.",
        "In auto off, get approval before scope changes or dependency additions.",
        "When review fails, do not complete; fix, re-verify, and review again.",
        "When verification fails or is incomplete, the final sentence is `다음 flow를 실행하세요: pgg-code`."
      ]
    ),
    verificationRequirements: md(
      [
        "typecheck를 실행한다. 저장소에 별도 typecheck script가 없으면 `pnpm build` 또는 실제 package script를 사용한다.",
        "관련 테스트를 실행한다.",
        "docs generation을 실행한다.",
        "docs generation을 재실행해 안정성을 확인한다.",
        "project version source의 version이 targetVersion과 일치하는지 확인한다.",
        "task별 commit은 token 기록 후에만 생성됐는지 확인한다.",
        "pgg git = off와 git 저장소 없음 조건에서 commit 생략 사유가 기록됐는지 확인한다.",
        "completion message 마지막 문장이 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-code` 중 하나인지 확인한다."
      ],
      [
        "Run typecheck. If no separate typecheck script exists, use `pnpm build` or the real package script.",
        "Run relevant tests.",
        "Run docs generation.",
        "Rerun docs generation to verify stability.",
        "Verify that the project version source equals targetVersion.",
        "Verify that per-task commits are created only after token records.",
        "Verify commit-skip reasons for pgg git = off and non-git repositories.",
        "Verify that the completion message final sentence is one of `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-performance`, or `다음 flow를 실행하세요: pgg-code`."
      ]
    ),
    reviewRequirements: md(
      [
        "Review 1: 명세 준수는 task, Acceptance Criteria, 승인된 plan, 테스트 생성, 검증 실행, version bump task 수행 여부를 확인한다.",
        "Review 2: 코드 품질은 가독성, 중복, 에러 처리, 네이밍, 책임 분리, 유지보수성, 불필요한 dependency 여부를 확인한다.",
        "review 실패 시 task를 수정하도록 되돌리고 관련 테스트를 다시 실행한 뒤 다시 review한다.",
        "subagent 작업 완료 후에도 두 단계 review는 메인 에이전트가 수행하고 기록한다."
      ],
      [
        "Review 1: spec compliance checks task satisfaction, Acceptance Criteria, approved plan adherence, test creation, verification execution, and version bump task completion.",
        "Review 2: code quality checks readability, duplication, error handling, naming, separation of responsibilities, maintainability, and unnecessary dependencies.",
        "On review failure, return the task for fixes, rerun related tests, and review again.",
        "Even after subagent work, the main agent performs and records both reviews."
      ]
    ),
    completionMessageContract: md(
      [
        "완료 메시지는 완료된 task 목록, task별 테스트 결과, task별 실패 로그 분석 요약, task별 review 결과, task별 token 기록 요약을 포함한다.",
        "완료 메시지는 task별 commit SHA 또는 commit 생략 사유, project version bump 결과, 전체 verify 결과, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.",
        "기본 정상 완료의 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.",
        "성능 측정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-performance`이다.",
        "실패 또는 미완료 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.",
        "마지막 문장 뒤에는 아무것도 출력하지 않는다."
      ],
      [
        "The completion message includes completed tasks, per-task test results, per-task failure-log summaries, per-task review results, and per-task token summaries.",
        "It includes per-task commit SHAs or commit-skip reasons, project version bump result, overall verify result, whether pgg-performance is needed, and the next-flow recommendation.",
        "On normal completion, the final sentence is exactly `다음 flow를 실행하세요: pgg-refactor`.",
        "When performance measurement is needed, the final sentence is exactly `다음 flow를 실행하세요: pgg-performance`.",
        "On failure or incomplete work, the final sentence is exactly `다음 flow를 실행하세요: pgg-code`.",
        "Print nothing after the final sentence."
      ]
    ),
    tokenAccountingRequirements: md(
      [
        "기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
        "record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.",
        "token 기록은 task commit 전에 완료되어야 한다.",
        "commit이 생성되면 token record에 commitSha를 연결해야 한다.",
        "token 기록 실패 시 task commit을 만들지 않고 실패 사유를 완료 메시지에 기록한다."
      ],
      [
        "The record path is `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
        "Each record includes runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, and measuredAt.",
        "Token records must be completed before the task commit.",
        "When a commit is created, link commitSha back into token records.",
        "If token recording fails, do not create the task commit and record the failure reason in the completion message."
      ]
    ),
    nextFlowRouting: md(
      [
        "기본 정상 완료: `pgg-code` -> `pgg-refactor`.",
        "성능 측정 필요: `pgg-code` -> `pgg-performance`.",
        "실패 또는 미완료: `pgg-code` -> `pgg-code`.",
        "마지막 문장은 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다."
      ],
      [
        "Normal completion: `pgg-code` -> `pgg-refactor`.",
        "Performance measurement needed: `pgg-code` -> `pgg-performance`.",
        "Failure or incomplete work: `pgg-code` -> `pgg-code`.",
        "The final sentence must be one of `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-performance`, or `다음 flow를 실행하세요: pgg-code`."
      ]
    ),
    performanceTriggerGuidance: md(
      [
        "pgg-plan에 성능 기준이 있으면 pgg-performance를 next flow 후보로 추천한다.",
        "성능에 영향을 줄 수 있는 코드가 작성되면 pgg-performance를 next flow 후보로 추천한다.",
        "대량 데이터 처리, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 next flow 후보로 추천한다.",
        "성능 회귀 가능성이 있으면 pgg-performance를 next flow 후보로 추천한다.",
        "테스트만으로 성능 근거가 부족하면 pgg-performance를 next flow 후보로 추천한다."
      ],
      [
        "Recommend pgg-performance as a next-flow candidate when pgg-plan includes performance criteria.",
        "Recommend pgg-performance as a next-flow candidate when the implementation may affect performance.",
        "Recommend pgg-performance for changes involving large data, loops, DB queries, network requests, caching, concurrency, file processing, or bundle size.",
        "Recommend pgg-performance when performance regression is possible.",
        "Recommend pgg-performance when tests alone do not provide enough performance evidence."
      ]
    ),
    gitModeRequirements: md(
      [
        "`pgg git = off`이면 branch 생성, commit, release branch 전환, working branch 삭제, push를 수행하지 않는다.",
        "`pgg git = on`이면 `git rev-parse --is-inside-work-tree`로 git 저장소 여부를 확인한다.",
        "git 저장소가 있으면 task commit 규칙을 적용한다.",
        "git 저장소가 없으면 task commit을 생략하고 사유를 기록한다.",
        "push는 하지 않는다."
      ],
      [
        "When `pgg git = off`, do not create branches, commit, switch release branches, delete working branches, or push.",
        "When `pgg git = on`, check repository status with `git rev-parse --is-inside-work-tree`.",
        "If this is a git repository, apply the per-task commit rules.",
        "If this is not a git repository, skip task commits and record the reason.",
        "Do not push."
      ]
    ),
    versioningRequirements: md(
      [
        "pgg-add에서 결정되고 pgg-plan에 포함된 targetVersion을 실제 project version에 반영한다.",
        "npm 라이브러리라면 기본적으로 `package.json` version을 targetVersion으로 수정한다.",
        "기존 프로젝트에 다른 version source가 있으면 그 구조를 따른다.",
        "`state.json`에 projectVersionUpdated, versionSource, currentVersion, targetVersion을 기록한다.",
        "version format은 `x.x.x`이다."
      ],
      [
        "Apply the targetVersion decided by pgg-add and included by pgg-plan to the real project version.",
        "For npm libraries, update `package.json` version to targetVersion by default.",
        "If the project has another version source, follow that structure.",
        "Record projectVersionUpdated, versionSource, currentVersion, and targetVersion in `state.json`.",
        "The version format is `x.x.x`."
      ]
    ),
    commitMessageRequirements: md(
      [
        "task 1개가 완료될 때마다 commit을 수행한다. 단, pgg git = on이고 git 저장소가 있을 경우에만 commit한다.",
        "commit message 형식은 `{convention}. {version} {message}`이다.",
        "예: `feat. 1.3.0 pgg-code task-1 add login validation test`",
        "권장 footer는 `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
        "token 기록 후 commit 순서를 지킨다.",
        "pgg git = off 또는 git 저장소 없음이면 commit하지 않고 생략 사유를 기록한다.",
        "push는 하지 않는다."
      ],
      [
        "Create a commit after each task completes, but only when pgg git = on and the project is a git repository.",
        "Commit messages use `{convention}. {version} {message}`.",
        "Example: `feat. 1.3.0 pgg-code task-1 add login validation test`",
        "Recommended footers are `PGG-Flow: pgg-code`, `PGG-Task: task-1`, `PGG-Verify: passed`, and `PGG-Token-Usage: poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
        "Preserve the order: token records before commit.",
        "When pgg git = off or this is not a git repository, do not commit and record the skip reason.",
        "Do not push."
      ]
    ),
    generatedDocumentationSections: md(
      [
        "pgg-code 목적",
        "active workspace 사용",
        "테스트 우선 실행 순서",
        "teams on 동작",
        "subagent 위임 규칙",
        "clean context 규칙",
        "Review 1: 명세 준수",
        "Review 2: 코드 품질",
        "실패 분석",
        "수정 후 재실행",
        "project version bump",
        "task별 token 기록",
        "task별 git commit 규칙",
        "pgg git off일 때 commit 생략",
        "git 저장소가 없을 때 commit 생략 기록",
        "push 금지",
        "pgg-performance 유도 조건",
        "final verify",
        "completion message 규격",
        "completionMessageContract",
        "next flow routing"
      ],
      [
        "pgg-code purpose",
        "active workspace usage",
        "test-first execution order",
        "teams on behavior",
        "subagent delegation rules",
        "clean context rules",
        "Review 1: spec compliance",
        "Review 2: code quality",
        "failure analysis",
        "fix and rerun",
        "project version bump",
        "per-task token records",
        "per-task git commit rules",
        "commit skip when pgg git is off",
        "commit skip record when not in a git repository",
        "push prohibition",
        "pgg-performance trigger conditions",
        "final verify",
        "completion message contract",
        "completionMessageContract",
        "next flow routing"
      ]
    )
  }),
  defineSkill({
    id: "pgg-refactor",
    name: { ko: "PGG Refactor", en: "PGG Refactor" },
    purpose: md(
      [
        "`pgg-refactor`는 기능 변경 없이 코드 구조를 개선하는 Skill이다.",
        "동작 변경 없이 구조 개선, 중복 제거, 성능 영향 검토, 가독성 분리, 책임 분리를 수행하고 before / after 결과가 동일함을 증명한다."
      ],
      [
        "`pgg-refactor` improves code structure without feature changes.",
        "It performs structural improvement, duplication removal, performance-impact review, readability separation, and responsibility separation while proving before/after behavior is identical."
      ]
    ),
    targetAgent: md(
      [
        "`pgg-code` PASS 결과를 기준으로 실제 project path를 리팩터링하되 Acceptance Criteria와 public behavior를 바꾸지 않는 AI 개발 에이전트.",
        "refactor 산출물을 `poggn/active/{topic_name}/pgg-refactor/` 아래에 남기고 verification, before / after 비교, diff inspection, token accounting을 닫힌 loop로 완료한다."
      ],
      [
        "An AI development agent that refactors real project paths after `pgg-code` PASS without changing Acceptance Criteria or public behavior.",
        "It stores refactor artifacts under `poggn/active/{topic_name}/pgg-refactor/` and closes the loop with verification, before/after comparison, diff inspection, and token accounting."
      ]
    ),
    triggerConditions: md(
      [
        "기본 flow 위치는 `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`이다.",
        "`pgg-code`가 정상 완료된 뒤 기본 next flow로 실행한다.",
        "`pgg-code` 산출물, 현재 tests, Acceptance Criteria, version metadata, pggGit 상태를 확인한 뒤 시작한다.",
        "동작 변경이나 feature 추가가 필요하면 refactor를 진행하지 않고 `pgg-code`로 되돌린다."
      ],
      [
        "The default flow position is `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`.",
        "Run as the normal next flow after successful `pgg-code` completion.",
        "Start only after checking pgg-code artifacts, current tests, Acceptance Criteria, version metadata, and pggGit state.",
        "If behavior change or feature work is required, do not refactor; route back to `pgg-code`."
      ]
    ),
    inputs: md(
      [
        "`poggn/active/{topic_name}/state.json`",
        "`poggn/active/{topic_name}/pgg-code/` 아래의 구현 결과, 테스트 결과, 실패 로그 분석, review 결과, verify 결과",
        "`poggn/active/{topic_name}/pgg-plan/` 아래의 승인된 Acceptance Criteria와 검증 전략",
        "작업 전 테스트 명령, 현재 동작 정의, before baseline, git diff",
        "public API constraints, generated docs provenance, 사용자 변경사항이 포함된 dirty worktree baseline"
      ],
      [
        "`poggn/active/{topic_name}/state.json`",
        "Implementation results, test results, failure-log analysis, review results, and verify results under `poggn/active/{topic_name}/pgg-code/`",
        "Approved Acceptance Criteria and verification strategy under `poggn/active/{topic_name}/pgg-plan/`",
        "Pre-work test commands, current behavior definition, before baseline, and git diff",
        "Public API constraints, generated-doc provenance, and dirty-worktree baseline including user changes"
      ]
    ),
    outputs: md(
      [
        "`poggn/active/{topic_name}/pgg-refactor/` 아래의 refactor report, before / after 비교 결과, diff inspection 결과, verification 결과",
        "refactor 대상과 변경 전 동작 정의",
        "변경 후 동작 보존 근거",
        "구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용",
        "실행한 테스트와 before / after 동일성 결과",
        "`poggn/active/{topic_name}/metrics/token-usage.jsonl`의 refactor token record",
        "pgg-performance 필요 여부와 다음 flow 추천"
      ],
      [
        "Refactor report, before/after comparison result, diff inspection result, and verification result under `poggn/active/{topic_name}/pgg-refactor/`",
        "Refactor targets and pre-change behavior definition",
        "Evidence that post-change behavior is preserved",
        "Structural improvements, duplication removal, performance improvement or performance-impact decision, readability improvement, and responsibility separation",
        "Executed tests and before/after identity result",
        "Refactor token records in `poggn/active/{topic_name}/metrics/token-usage.jsonl`",
        "Whether pgg-performance is needed and the recommended next flow"
      ]
    ),
    absoluteRules: md(
      [
        "동작 변경 금지.",
        "before / after 결과는 동일해야 한다.",
        "새로운 feature를 추가하지 않는다.",
        "Acceptance Criteria를 변경하지 않는다.",
        "verification은 필수다.",
        "동작이 바뀌면 refactor가 아니다.",
        "generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다.",
        "refactor 산출물은 `poggn/active/{topic_name}/pgg-refactor/` 아래에 저장한다.",
        "기존 사용자 변경사항을 덮어쓰지 않고 refactor와 무관한 파일을 commit하지 않는다."
      ],
      [
        "Do not change behavior.",
        "Before/after results must be identical.",
        "Do not add new features.",
        "Do not change Acceptance Criteria.",
        "Verification is mandatory.",
        "If behavior changes, it is not a refactor.",
        "Update generated Markdown only from TypeScript Skill definitions and the generator; do not patch it by hand.",
        "Store refactor artifacts under `poggn/active/{topic_name}/pgg-refactor/`.",
        "Do not overwrite existing user changes and do not commit files unrelated to the refactor."
      ]
    ),
    antiPatterns: md(
      [
        "동작 변경을 refactor로 포장",
        "새 feature 추가",
        "Acceptance Criteria 수정",
        "before baseline 없이 after만 테스트",
        "테스트 실패를 무시하고 구조 개선 완료 처리",
        "성능 개선을 주장하지만 before / after 성능 근거를 남기지 않음",
        "unrelated cleanup이나 public API break를 섞음",
        "generated Markdown 직접 수정"
      ],
      [
        "Presenting behavior changes as refactors",
        "Adding new features",
        "Changing Acceptance Criteria",
        "Testing only after the change without a before baseline",
        "Marking structural work complete while tests fail",
        "Claiming performance improvement without before/after evidence",
        "Mixing unrelated cleanup or public API breaks",
        "Hand-editing generated Markdown"
      ]
    ),
    modeSpecificBehavior: {
      autoOff: md(
        [
          "refactor 범위, 현재 동작 정의, 실행할 before / after 테스트를 먼저 제시한다.",
          "public API 변경, Acceptance Criteria 변경, feature 추가가 필요하면 refactor를 중단하고 사용자 승인을 요청한 뒤 `pgg-code`로 되돌린다.",
          "완료 시 refactor 대상, 테스트 결과, diff inspection 결과, token 기록, pgg-performance 필요 여부를 보고한다."
        ],
        [
          "Present the refactor scope, current behavior definition, and before/after tests first.",
          "If public API changes, Acceptance Criteria changes, or feature additions are needed, stop the refactor, request approval, and route back to `pgg-code`.",
          "On completion, report refactor targets, test results, diff inspection result, token records, and whether pgg-performance is needed."
        ]
      ),
      autoOn: md(
        [
          "승인된 동작 범위 안에서 refactor만 자율적으로 수행한다.",
          "before baseline과 after result를 비교할 수 없으면 불확실성을 기록하고 가능한 검증을 보강한다.",
          "동작 변경 위험이 발견되면 완료하지 않고 `pgg-refactor` 또는 `pgg-code`로 route한다."
        ],
        [
          "Autonomously perform only refactoring within the approved behavior scope.",
          "If before baseline and after result cannot be compared, record uncertainty and strengthen available verification.",
          "When behavior-change risk is found, do not complete; route to `pgg-refactor` or `pgg-code`."
        ]
      ),
      teamsOff: md(
        [
          "`teams off`에서는 단일 에이전트가 현재 동작 캡처, before 테스트, refactor, after 테스트, 비교, diff inspection, token 기록을 수행한다.",
          "단일 에이전트라도 동작 보존 review와 구조 품질 review를 분리해서 기록한다."
        ],
        [
          "In `teams off`, one agent captures current behavior, runs before tests, refactors, runs after tests, compares results, inspects the diff, and records tokens.",
          "Even with one agent, record behavior-preservation review and structure-quality review separately."
        ]
      ),
      teamsOn: md(
        [
          "`teams on`이고 환경이 지원하면 소프트웨어 아키텍트와 코드 리뷰어 관점의 bounded review를 fresh subagent에 위임할 수 있다.",
          "subagent는 feature 추가나 동작 변경을 제안하지 않고 구조 개선, 중복 제거, 책임 분리, 회귀 위험만 review한다."
        ],
        [
          "In `teams on`, when supported, delegate bounded software-architect and code-reviewer reviews to fresh subagents.",
          "Subagents do not propose feature additions or behavior changes; they review only structure, duplication, responsibility separation, and regression risk."
        ]
      )
    },
    additionalGuidance: [
      {
        title: { ko: "필수 workflow", en: "Mandatory Workflow" },
        body: md(
          [
            "1. 현재 동작을 캡처하거나 정의한다.",
            "2. 가능하다면 refactor 전 기존 테스트를 실행한다.",
            "3. refactoring만 수행한다.",
            "4. refactor 후 동일한 테스트를 다시 실행한다.",
            "5. before / after 동작을 비교한다.",
            "6. diff를 확인하여 feature change가 없는지 검토한다.",
            "7. token을 기록한다.",
            "8. verification 결과를 보고한다."
          ],
          [
            "1. Capture or define current behavior.",
            "2. Run existing tests before the refactor when possible.",
            "3. Perform refactoring only.",
            "4. Rerun the same tests after the refactor.",
            "5. Compare before/after behavior.",
            "6. Inspect the diff for feature changes.",
            "7. Record tokens.",
            "8. Report verification results."
          ]
        )
      },
      {
        title: { ko: "필수 개선 범주", en: "Required Improvement Categories" },
        body: md(
          [
            "구조 개선을 검토하고 수행한다.",
            "중복 제거를 검토하고 수행한다.",
            "성능 개선 또는 성능 영향 여부를 판단한다.",
            "가독성 분리를 검토하고 수행한다.",
            "책임 분리를 검토하고 수행한다."
          ],
          [
            "Review and perform structural improvement.",
            "Review and perform duplication removal.",
            "Decide whether there is performance improvement or performance impact.",
            "Review and perform readability separation.",
            "Review and perform responsibility separation."
          ]
        )
      },
      {
        title: { ko: "before / after 동일성", en: "Before/After Identity" },
        body: md(
          [
            "현재 동작 정의는 관찰 가능한 입력, 출력, 오류, generated output, CLI/API 결과를 포함한다.",
            "before와 after는 가능한 한 동일한 명령과 동일한 fixture로 비교한다.",
            "테스트가 부족하면 부족한 근거를 명시하고 수동 비교 또는 snapshot 비교를 보강한다.",
            "비교 결과가 달라지면 refactor를 완료하지 않는다."
          ],
          [
            "The current behavior definition includes observable inputs, outputs, errors, generated output, and CLI/API results.",
            "Compare before and after with the same commands and fixtures whenever possible.",
            "If tests are insufficient, state the gap and add manual comparison or snapshot comparison.",
            "If comparison results differ, do not complete the refactor."
          ]
        )
      },
      {
        title: { ko: "diff inspection", en: "Diff Inspection" },
        body: md(
          [
            "diff inspection은 feature 추가, Acceptance Criteria 변경, public API break, generated Markdown 직접 수정, unrelated cleanup 여부를 확인한다.",
            "diff report 파일을 생성하면 `poggn/active/{topic_name}/pgg-refactor/` 아래에 저장한다.",
            "before / after 비교 파일이나 diff report 파일이 생성되면 token 기록 대상에 포함한다."
          ],
          [
            "Diff inspection checks for feature additions, Acceptance Criteria changes, public API breaks, hand-edited generated Markdown, and unrelated cleanup.",
            "Store any diff report file under `poggn/active/{topic_name}/pgg-refactor/`.",
            "If before/after comparison files or diff report files are created, include them in token records."
          ]
        )
      },
      {
        title: { ko: "pgg-performance 유도 조건", en: "pgg-performance Trigger Conditions" },
        body: md(
          [
            "성능 개선이 refactor 목적 중 하나이면 pgg-performance를 next flow 후보로 추천한다.",
            "알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 추천한다.",
            "before / after 성능 비교가 필요하면 pgg-performance를 추천한다.",
            "pgg-qa에서 성능 근거 부족 가능성이 있으면 pgg-performance를 추천한다."
          ],
          [
            "Recommend pgg-performance as a next-flow candidate when performance improvement is one refactor goal.",
            "Recommend pgg-performance for algorithm, loop, DB query, caching, concurrency, file-processing, or bundle-size changes.",
            "Recommend pgg-performance when before/after performance comparison is needed.",
            "Recommend pgg-performance when pgg-qa may lack enough performance evidence."
          ]
        )
      },
      {
        title: { ko: "완료 산출물", en: "Completion Artifacts" },
        body: md(
          [
            "refactor 대상을 포함한다.",
            "변경 전 동작 정의를 포함한다.",
            "변경 후 동작 보존 근거를 포함한다.",
            "구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용을 포함한다.",
            "실행한 테스트, before / after 비교 결과, diff inspection 결과를 포함한다.",
            "token 기록, pgg-performance 필요 여부, 다음 flow 추천을 포함한다."
          ],
          [
            "Include refactor targets.",
            "Include the pre-change behavior definition.",
            "Include evidence that post-change behavior is preserved.",
            "Include structure improvement, duplication removal, performance improvement or impact, readability improvement, and responsibility separation.",
            "Include executed tests, before/after comparison result, and diff inspection result.",
            "Include token records, whether pgg-performance is needed, and the recommended next flow."
          ]
        )
      }
    ],
    requiredPhases: md(
      [
        "state와 pgg-code 산출물 확인",
        "refactor 대상과 현재 동작 정의",
        "가능한 refactor 전 테스트 실행",
        "동작 보존 refactoring 수행",
        "동일 테스트 재실행",
        "before / after 비교",
        "feature change 금지 diff inspection",
        "token 기록",
        "final verify와 pgg-performance 필요 여부 판단",
        "completion message 작성"
      ],
      [
        "Check state and pgg-code artifacts",
        "Define refactor targets and current behavior",
        "Run pre-refactor tests when possible",
        "Perform behavior-preserving refactoring",
        "Rerun the same tests",
        "Compare before/after",
        "Inspect the diff for prohibited feature changes",
        "Record tokens",
        "Run final verify and decide whether pgg-performance is needed",
        "Write the completion message"
      ]
    ),
    approvalGates: md(
      [
        "auto off에서는 refactor 범위와 before / after 검증 방법이 명확해진 뒤 변경한다.",
        "Acceptance Criteria 변경, public API 변경, feature 추가가 필요하면 refactor를 중단하고 `pgg-code`로 route한다.",
        "before / after 동일성이 깨지면 완료하지 않고 `pgg-refactor`로 route한다."
      ],
      [
        "In auto off, modify only after refactor scope and before/after verification method are clear.",
        "If Acceptance Criteria changes, public API changes, or feature additions are needed, stop and route to `pgg-code`.",
        "If before/after identity breaks, do not complete; route to `pgg-refactor`."
      ]
    ),
    verificationRequirements: md(
      [
        "typecheck를 실행한다. 저장소에 별도 typecheck script가 없으면 `pnpm build` 또는 실제 package script를 사용한다.",
        "refactor 전 실행한 테스트와 동일한 테스트를 refactor 후 다시 실행한다.",
        "관련 테스트를 실행한다.",
        "docs generation을 실행한다.",
        "docs generation을 재실행해 안정성을 확인한다.",
        "before / after 비교 결과가 동일한지 확인한다.",
        "diff inspection에서 feature change, Acceptance Criteria 변경, generated Markdown 직접 수정이 없는지 확인한다.",
        "token 기록이 `poggn/active/{topic_name}/metrics/token-usage.jsonl`에 남았는지 확인한다."
      ],
      [
        "Run typecheck. If no separate typecheck script exists, use `pnpm build` or the real package script.",
        "Rerun after the refactor the same tests that were run before the refactor.",
        "Run related tests.",
        "Run docs generation.",
        "Rerun docs generation to verify stability.",
        "Verify that before/after comparison results are identical.",
        "Verify through diff inspection that there are no feature changes, Acceptance Criteria changes, or hand-edited generated Markdown.",
        "Verify token records at `poggn/active/{topic_name}/metrics/token-usage.jsonl`."
      ]
    ),
    reviewRequirements: md(
      [
        "동작 보존 review는 before / after 결과 동일성, Acceptance Criteria 불변, public API 불변을 확인한다.",
        "구조 품질 review는 구조 개선, 중복 제거, 성능 영향, 가독성 분리, 책임 분리, 불필요한 추상화 여부를 확인한다.",
        "diff inspection review는 feature change 금지, unrelated cleanup 금지, generated Markdown 직접 수정 금지를 확인한다.",
        "성능 관련 변경이면 pgg-performance 추천 여부를 review한다."
      ],
      [
        "Behavior-preservation review checks before/after identity, unchanged Acceptance Criteria, and unchanged public API.",
        "Structure-quality review checks structural improvement, duplication removal, performance impact, readability separation, responsibility separation, and unnecessary abstraction.",
        "Diff-inspection review checks no feature changes, no unrelated cleanup, and no hand-edited generated Markdown.",
        "For performance-related changes, review whether pgg-performance should be recommended."
      ]
    ),
    completionMessageContract: md(
      [
        "완료 메시지는 refactor 대상, 변경 전 동작 정의, 변경 후 동작 보존 근거를 포함한다.",
        "완료 메시지는 구조 개선, 중복 제거, 성능 개선 또는 성능 영향 여부, 가독성 개선, 책임 분리 내용을 포함한다.",
        "완료 메시지는 실행한 테스트, before / after 비교 결과, diff inspection 결과, token 기록, pgg-performance 필요 여부, 다음 flow 추천을 포함한다.",
        "정상 완료의 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.",
        "성능 재측정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-performance`이다.",
        "refactor 실패 또는 동작 변경 발생 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.",
        "구현 수정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.",
        "마지막 문장 뒤에는 아무것도 출력하지 않는다."
      ],
      [
        "The completion message includes refactor targets, pre-change behavior definition, and evidence that post-change behavior is preserved.",
        "It includes structural improvement, duplication removal, performance improvement or impact, readability improvement, and responsibility separation.",
        "It includes executed tests, before/after comparison result, diff inspection result, token records, whether pgg-performance is needed, and the next-flow recommendation.",
        "On normal completion, the final sentence is exactly `다음 flow를 실행하세요: pgg-qa`.",
        "When performance re-measurement is needed, the final sentence is exactly `다음 flow를 실행하세요: pgg-performance`.",
        "When the refactor fails or behavior changes, the final sentence is exactly `다음 flow를 실행하세요: pgg-refactor`.",
        "When implementation fixes are needed, the final sentence is exactly `다음 flow를 실행하세요: pgg-code`.",
        "Print nothing after the final sentence."
      ]
    ),
    tokenAccountingRequirements: md(
      [
        "기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
        "record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.",
        "refactor 산출물과 실제 refactor 변경사항의 token count를 기록한다.",
        "before / after 비교 파일 또는 diff report 파일이 생성되면 해당 파일도 기록 대상이다.",
        "commit이 생성되면 token record에 commitSha를 연결한다."
      ],
      [
        "The record path is `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
        "Each record includes runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, and measuredAt.",
        "Record token counts for refactor artifacts and actual refactor changes.",
        "If before/after comparison files or diff report files are created, include those files in token records.",
        "When a commit is created, link commitSha back into token records."
      ]
    ),
    nextFlowRouting: md(
      [
        "정상 완료: `pgg-refactor` -> `pgg-qa`.",
        "성능 재측정 필요: `pgg-refactor` -> `pgg-performance`.",
        "refactor 실패 또는 동작 변경 발생: `pgg-refactor` -> `pgg-refactor`.",
        "구현 수정 필요: `pgg-refactor` -> `pgg-code`.",
        "마지막 문장은 `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다."
      ],
      [
        "Normal completion: `pgg-refactor` -> `pgg-qa`.",
        "Performance re-measurement needed: `pgg-refactor` -> `pgg-performance`.",
        "Refactor failure or behavior change: `pgg-refactor` -> `pgg-refactor`.",
        "Implementation fix needed: `pgg-refactor` -> `pgg-code`.",
        "The final sentence must be one of `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-performance`, `다음 flow를 실행하세요: pgg-refactor`, or `다음 flow를 실행하세요: pgg-code`."
      ]
    ),
    performanceTriggerGuidance: md(
      [
        "성능 개선이 refactor 목적 중 하나이면 pgg-performance를 next flow 후보로 추천한다.",
        "알고리즘, 반복문, DB query, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 pgg-performance를 next flow 후보로 추천한다.",
        "before / after 성능 비교가 필요하면 pgg-performance를 next flow 후보로 추천한다.",
        "pgg-qa에서 성능 근거 부족 가능성이 있으면 pgg-performance를 next flow 후보로 추천한다."
      ],
      [
        "Recommend pgg-performance as a next-flow candidate when performance improvement is one refactor goal.",
        "Recommend pgg-performance as a next-flow candidate for algorithm, loop, DB query, caching, concurrency, file-processing, or bundle-size changes.",
        "Recommend pgg-performance as a next-flow candidate when before/after performance comparison is needed.",
        "Recommend pgg-performance as a next-flow candidate when pgg-qa may lack enough performance evidence."
      ]
    ),
    gitModeRequirements: md(
      [
        "`pgg git = off`이면 refactor commit을 만들지 않고 생략 사유를 기록한다.",
        "`pgg git = on`이면 git 저장소 여부를 확인한다.",
        "git 저장소이면 refactor 산출물과 실제 refactor 변경사항을 commit할 수 있다.",
        "commit은 verification, before / after 비교, diff inspection, token 기록이 완료된 뒤에만 생성한다.",
        "git 저장소가 없으면 commit을 생략하고 사유를 기록한다.",
        "push는 하지 않는다."
      ],
      [
        "When `pgg git = off`, do not create a refactor commit and record the skip reason.",
        "When `pgg git = on`, check whether the project is a git repository.",
        "If this is a git repository, refactor artifacts and actual refactor changes may be committed.",
        "Create a commit only after verification, before/after comparison, diff inspection, and token records are complete.",
        "If this is not a git repository, skip commits and record the reason.",
        "Do not push."
      ]
    ),
    commitMessageRequirements: md(
      [
        "pgg git = on이고 git 저장소이면 refactor 산출물과 실제 refactor 변경사항을 commit할 수 있다.",
        "commit message 형식은 `{convention}. {version} {message}`이다.",
        "예: `refactor. 1.3.1 simplify login validation structure`",
        "commit에는 refactor와 무관한 파일을 포함하지 않는다.",
        "verification, before / after 비교, diff inspection, token 기록 후 commit 순서를 지킨다.",
        "pgg git = off이면 commit하지 않는다."
      ],
      [
        "When pgg git = on and this is a git repository, refactor artifacts and actual refactor changes may be committed.",
        "Commit messages use `{convention}. {version} {message}`.",
        "Example: `refactor. 1.3.1 simplify login validation structure`",
        "Do not include files unrelated to the refactor in the commit.",
        "Preserve the order: verification, before/after comparison, diff inspection, token records, then commit.",
        "When pgg git = off, do not commit."
      ]
    ),
    generatedDocumentationSections: md(
      [
        "pgg-refactor 목적",
        "기본 flow 위치",
        "동작 보존",
        "before / after 동일성",
        "feature change 금지",
        "구조 개선",
        "중복 제거",
        "성능 개선",
        "가독성 분리",
        "책임 분리",
        "diff inspection",
        "pgg-performance 유도 조건",
        "final verify",
        "completion message 규격",
        "completionMessageContract",
        "token accounting 규칙",
        "commit 규칙",
        "next flow routing"
      ],
      [
        "pgg-refactor purpose",
        "default flow position",
        "behavior preservation",
        "before/after identity",
        "feature-change prohibition",
        "structure improvement",
        "duplication removal",
        "performance improvement",
        "readability separation",
        "responsibility separation",
        "diff inspection",
        "pgg-performance trigger conditions",
        "final verify",
        "completion message contract",
        "completionMessageContract",
        "token accounting rules",
        "commit rules",
        "next flow routing"
      ]
    )
  }),
  defineSkill({
    id: "pgg-performance",
    name: { ko: "pgg-performance", en: "pgg-performance" },
    legacyAliases: ["pgg-performanc"],
    purpose: md(
      [
        "`pgg-performance`는 AI가 성능 측정이 필요하다고 판단한 경우 실행되는 성능 검증 Skill이다.",
        "구현 또는 리팩토링 결과가 성능에 영향을 줄 수 있을 때 측정 기준을 정의하고, 가능한 benchmark 또는 성능 테스트를 실행하고, 결과를 기록하고, 다음 flow를 결정한다."
      ],
      [
        "`pgg-performance` is the performance verification Skill used when the AI decides performance measurement is needed.",
        "When implementation or refactoring may affect performance, it defines measurement criteria, runs feasible benchmarks or performance tests, records results, and decides the next flow."
      ]
    ),
    targetAgent: md(
      [
        "성능 측정 필요성, 측정 대상, 지표, baseline, benchmark 명령, 결과 비교, 회귀 여부, 다음 flow를 근거 기반으로 기록하는 AI 개발 에이전트.",
        "산출물은 `poggn/active/{topic_name}/pgg-performance/` 아래에 남긴다."
      ],
      [
        "An AI development agent that records performance applicability, targets, metrics, baselines, benchmark commands, result comparison, regression status, and next flow from evidence.",
        "Artifacts are stored under `poggn/active/{topic_name}/pgg-performance/`."
      ]
    ),
    triggerConditions: md(
      [
        "사용자가 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량을 언급하면 실행을 검토한다.",
        "`pgg-plan`에서 성능 기준이 정의되면 실행을 검토한다.",
        "`pgg-code`에서 성능에 영향을 줄 수 있는 코드가 작성되면 실행을 검토한다.",
        "`pgg-refactor`에서 성능 개선이 목적 중 하나이면 실행을 검토한다.",
        "대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 관련 변경이면 실행을 검토한다.",
        "`pgg-qa`에서 성능 근거 부족으로 판단하면 실행한다."
      ],
      [
        "Consider running when the user mentions performance, speed, optimization, response time, throughput, or memory use.",
        "Consider running when `pgg-plan` defines performance criteria.",
        "Consider running when `pgg-code` writes code that may affect performance.",
        "Consider running when performance improvement is one goal of `pgg-refactor`.",
        "Consider running for changes involving large data, loops, DB queries, network requests, caching, concurrency, file processing, or bundle size.",
        "Run when `pgg-qa` determines that performance evidence is insufficient."
      ]
    ),
    inputs: md(
      [
        "`pgg-plan` 성능 기준 또는 성능 기준 부재 사유",
        "`pgg-code` 또는 `pgg-refactor` 변경 evidence",
        "baseline 또는 baseline 측정 방법",
        "실행 가능한 benchmark, 성능 테스트, 또는 측정 불가 사유",
        "현재 mode, pgg git mode, topic state"
      ],
      [
        "`pgg-plan` performance criteria or the reason criteria are absent",
        "`pgg-code` or `pgg-refactor` change evidence",
        "Baseline or baseline measurement method",
        "Runnable benchmark, performance test, or the reason measurement is unavailable",
        "Current mode, pgg git mode, and topic state"
      ]
    ),
    outputs: md(
      [
        "`poggn/active/{topic_name}/pgg-performance/report.md`",
        "성능 측정 필요성 판단 결과",
        "측정 대상, 측정 지표, baseline, 측정 방법",
        "실행한 명령어와 benchmark 또는 성능 테스트 결과",
        "기준 통과 여부와 성능 회귀 여부",
        "생성/수정된 파일, token 기록, 다음 flow 추천"
      ],
      [
        "`poggn/active/{topic_name}/pgg-performance/report.md`",
        "Performance applicability decision",
        "Measurement targets, metrics, baseline, and method",
        "Executed commands and benchmark or performance test results",
        "Criteria pass/fail and performance regression decision",
        "Created/modified files, token records, and next-flow recommendation"
      ]
    ),
    absoluteRules: md(
      [
        "실제 측정 없이 성능이 좋아졌다고 말하지 않는다.",
        "측정 불가 상황을 숨기지 않는다.",
        "임의의 성능 수치를 만들어내지 않는다.",
        "benchmark 조건 없이 결과만 보고하지 않는다.",
        "특정 프로젝트에 과적합된 성능 기준을 일반 규칙처럼 작성하지 않는다.",
        "generated Markdown은 TypeScript Skill 정의와 generator에서만 갱신하고 직접 patch하지 않는다."
      ],
      [
        "Do not claim performance improved without actual measurement.",
        "Do not hide unavailable measurement.",
        "Do not invent performance numbers.",
        "Do not report results without benchmark conditions.",
        "Do not write project-specific thresholds as general rules.",
        "Update generated Markdown only from TypeScript Skill definitions and the generator."
      ]
    ),
    antiPatterns: md(
      [
        "측정 없이 PASS 처리",
        "baseline 없이 개선율 보고",
        "single noisy run만 근거로 결론",
        "측정 불가 사유 없이 benchmark 생략",
        "기능 QA 대신 성능 flow 사용"
      ],
      [
        "Passing without measurement",
        "Reporting improvement percentage without a baseline",
        "Concluding from one noisy run",
        "Skipping benchmarks without recording why measurement is unavailable",
        "Using performance flow as a replacement for functional QA"
      ]
    ),
    modeSpecificBehavior: {
      autoOff: md(
        [
          "성능 측정 필요성을 설명한다.",
          "비용이 큰 benchmark나 장시간 테스트가 필요하면 사용자 승인을 요청한다.",
          "이미 `pgg-plan`에서 승인된 성능 기준이 있으면 그 기준에 따라 진행한다.",
          "측정 불가 상황은 명확히 보고한다."
        ],
        [
          "Explain why performance measurement is needed.",
          "Ask for approval before expensive benchmarks or long-running tests.",
          "If `pgg-plan` already approved performance criteria, proceed with those criteria.",
          "Clearly report when measurement is unavailable."
        ]
      ),
      autoOn: md(
        [
          "AI가 성능 측정 필요성을 판단한다.",
          "합리적인 범위의 성능 측정을 자동으로 수행한다.",
          "측정 불가 시 이유를 명시한다.",
          "임의의 숫자를 만들어내지 않는다."
        ],
        [
          "The AI decides whether performance measurement is needed.",
          "Automatically run reasonable performance measurements.",
          "State the reason when measurement is unavailable.",
          "Do not invent numbers."
        ]
      ),
      teamsOff: md(["`teams off`에서는 단일 에이전트가 같은 성능 검증 계약을 수행한다."], ["In `teams off`, one agent executes the same performance verification contract."]),
      teamsOn: md(
        [
          "`teams on`이면 QA/테스트 엔지니어 관점으로 측정 설계를 검토하고 SRE/운영 엔지니어 관점으로 런타임 위험을 검토한다."
        ],
        [
          "In `teams on`, review measurement design from a QA/test engineer perspective and runtime risk from an SRE/operations perspective."
        ]
      )
    },
    additionalGuidance: [
      {
        title: { ko: "기본 flow와의 관계", en: "Default Flow Relationship" },
        body: md(
          [
            "기본 flow는 `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`이다.",
            "`pgg-performance`는 기본 flow에 항상 포함되지 않는 조건부 helper flow다.",
            "AI 판단에 따라 `pgg-code` 이후 또는 `pgg-refactor` 이후에 실행될 수 있다.",
            "`pgg-performanc`는 compatibility alias로만 인식하고 새 산출물과 next flow는 `pgg-performance`를 사용한다."
          ],
          [
            "The default flow is `pgg-add` -> `pgg-plan` -> `pgg-code` -> `pgg-refactor` -> `pgg-qa`.",
            "`pgg-performance` is a conditional helper flow and is not always part of the default flow.",
            "It may run after `pgg-code` or after `pgg-refactor` based on the AI decision.",
            "`pgg-performanc` is recognized only as a compatibility alias; new artifacts and next-flow routing use `pgg-performance`."
          ]
        )
      },
      {
        title: { ko: "측정 지표 예시", en: "Metric Examples" },
        body: md(
          [
            "응답 시간, 처리량, 메모리 사용량, CPU 사용량, DB query 수, 렌더링 시간, 번들 크기, cold start 시간, 반복 처리 시간을 사용할 수 있다.",
            "지표는 변경의 성능 위험과 직접 연결되어야 하며, 일반 규칙처럼 고정 threshold를 만들지 않는다."
          ],
          [
            "Metrics may include response time, throughput, memory use, CPU use, DB query count, rendering time, bundle size, cold start time, and repeated processing time.",
            "Metrics must connect directly to the performance risk of the change; do not create fixed thresholds as general rules."
          ]
        )
      }
    ],
    requiredPhases: md(
      [
        "1. 성능 측정 필요성 판단",
        "2. 측정 대상 정의",
        "3. 측정 지표 정의",
        "4. baseline 확인",
        "5. 측정 방법 선택",
        "6. 성능 테스트 또는 benchmark 실행",
        "7. 결과 비교",
        "8. 성능 기준 통과 여부 판단",
        "9. token 기록",
        "10. 다음 flow 추천"
      ],
      [
        "1. Decide whether performance measurement is needed",
        "2. Define measurement targets",
        "3. Define measurement metrics",
        "4. Confirm the baseline",
        "5. Choose the measurement method",
        "6. Run performance tests or benchmarks",
        "7. Compare results",
        "8. Decide whether performance criteria pass",
        "9. Record tokens",
        "10. Recommend the next flow"
      ]
    ),
    approvalGates: md(
      [
        "auto off에서 비용이 큰 benchmark, 장시간 테스트, 외부 resource 사용이 필요하면 실행 전 사용자 승인을 받는다.",
        "이미 승인된 성능 기준이 있으면 별도 scope 변경 없이 그 기준에 따라 진행한다.",
        "측정 불가이면 임의 PASS가 아니라 측정 불가 사유와 남은 위험을 report에 기록한다."
      ],
      [
        "In auto off, get user approval before expensive benchmarks, long-running tests, or external resources.",
        "If criteria are already approved, proceed under those criteria without a separate scope change.",
        "When measurement is unavailable, record the reason and remaining risk instead of inventing a PASS."
      ]
    ),
    verificationRequirements: md(
      [
        "typecheck를 실행한다. 저장소에 별도 typecheck script가 없으면 `pnpm build` 또는 실제 package script를 사용한다.",
        "관련 benchmark 또는 성능 테스트를 실행한다.",
        "측정 명령, 환경, 입력 데이터, 반복 횟수 또는 조건을 기록한다.",
        "baseline과 actual result를 비교한다.",
        "docs generation을 실행하고 재실행해 안정성을 확인한다.",
        "측정 불가 항목은 사유를 기록하고 임의 수치를 만들지 않았는지 확인한다."
      ],
      [
        "Run typecheck. If no separate typecheck script exists, use `pnpm build` or the real package script.",
        "Run relevant benchmarks or performance tests.",
        "Record measurement commands, environment, input data, iteration count, or conditions.",
        "Compare baseline and actual result.",
        "Run docs generation and rerun it to verify stability.",
        "For unavailable measurements, record why and verify no numbers were invented."
      ]
    ),
    reviewRequirements: md(
      [
        "성능 측정 필요성 판단이 trigger 조건과 연결되는지 review한다.",
        "측정 대상, 지표, baseline, 측정 방법이 재현 가능한지 review한다.",
        "결과 비교가 benchmark 조건과 함께 기록됐는지 review한다.",
        "성능 기준 통과 여부와 회귀 여부가 실제 결과에 근거하는지 review한다.",
        "측정 불가 사유와 다음 flow 추천이 타당한지 review한다."
      ],
      [
        "Review whether the applicability decision is tied to trigger conditions.",
        "Review whether targets, metrics, baseline, and method are reproducible.",
        "Review whether result comparison includes benchmark conditions.",
        "Review whether pass/fail and regression decisions are based on actual results.",
        "Review whether unavailable-measurement reasons and next-flow recommendations are valid."
      ]
    ),
    completionMessageContract: md(
      [
        "완료 시 `# PGG Flow 완료 보고서` 형식의 구조화된 completion message를 출력한다.",
        "완료 메시지는 성능 측정 필요성 판단 결과, 측정 대상, 측정 지표, baseline, 측정 방법, 실행한 명령어를 포함한다.",
        "benchmark 또는 성능 테스트 결과, 기준 통과 여부, 성능 회귀 여부, 생성/수정된 파일, token 기록, 다음 flow 추천을 포함한다.",
        "`pgg-code` 이후 호출되었고 성능 기준 통과 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.",
        "`pgg-refactor` 이후 호출되었고 성능 기준 통과 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.",
        "성능 기준 실패 + 구현 수정 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-code`이다.",
        "성능 기준 실패 + 구조 개선 필요 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-refactor`이다.",
        "QA에서 성능 근거 부족으로 호출되었고 근거 확보 완료 시 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-qa`이다.",
        "공통 완료 문장 형식은 `다음 flow를 실행하세요: <next-flow-id>`이다.",
        "마지막 문장은 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다.",
        "마지막 문장 뒤에는 아무것도 출력하지 않는다."
      ],
      [
        "On completion, print a structured `# PGG Flow Completion Report` message.",
        "The completion message includes the performance applicability decision, targets, metrics, baseline, method, and executed commands.",
        "It includes benchmark or performance test results, criteria pass/fail, regression status, created/modified files, token records, and next-flow recommendation.",
        "When called after `pgg-code` and criteria pass, the final sentence is exactly `다음 flow를 실행하세요: pgg-refactor`.",
        "When called after `pgg-refactor` and criteria pass, the final sentence is exactly `다음 flow를 실행하세요: pgg-qa`.",
        "When criteria fail and implementation fixes are needed, the final sentence is exactly `다음 flow를 실행하세요: pgg-code`.",
        "When criteria fail and structural improvement is needed, the final sentence is exactly `다음 flow를 실행하세요: pgg-refactor`.",
        "When called by QA for missing evidence and evidence is now collected, the final sentence is exactly `다음 flow를 실행하세요: pgg-qa`.",
        "The common final-sentence format is `다음 flow를 실행하세요: <next-flow-id>`.",
        "The final sentence must be one of `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-qa`, or `다음 flow를 실행하세요: pgg-code`.",
        "Print nothing after the final sentence."
      ]
    ),
    tokenAccountingRequirements: md(
      [
        "기록 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
        "성능 측정 결과 파일이나 benchmark 결과 파일이 생성되면 해당 파일도 기록 대상이다.",
        "record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.",
        "token record는 `pgg-performance` report 생성 또는 수정 후 기록한다.",
        "commit이 생성되면 token record에 commitSha를 연결한다."
      ],
      [
        "The record path is `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
        "If performance result files or benchmark result files are created, record those files too.",
        "Each record includes runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, and measuredAt.",
        "Write token records after creating or modifying the `pgg-performance` report.",
        "When a commit is created, link commitSha back into token records."
      ]
    ),
    nextFlowRouting: md(
      [
        "`pgg-code` 이후 호출되었고 성능 기준 통과: `pgg-refactor`.",
        "`pgg-refactor` 이후 호출되었고 성능 기준 통과: `pgg-qa`.",
        "성능 기준 실패 + 구현 수정 필요: `pgg-code`.",
        "성능 기준 실패 + 구조 개선 필요: `pgg-refactor`.",
        "QA에서 성능 근거 부족으로 호출되었고 근거 확보 완료: `pgg-qa`.",
        "마지막 문장은 `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-qa`, `다음 flow를 실행하세요: pgg-code` 중 하나여야 한다."
      ],
      [
        "Called after `pgg-code` and criteria pass: `pgg-refactor`.",
        "Called after `pgg-refactor` and criteria pass: `pgg-qa`.",
        "Criteria fail and implementation fixes are needed: `pgg-code`.",
        "Criteria fail and structural improvement is needed: `pgg-refactor`.",
        "Called by QA for missing performance evidence and evidence is now collected: `pgg-qa`.",
        "The final sentence must be one of `다음 flow를 실행하세요: pgg-refactor`, `다음 flow를 실행하세요: pgg-qa`, or `다음 flow를 실행하세요: pgg-code`."
      ]
    ),
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    gitModeRequirements: md(
      [
        "`pgg git = off`이면 commit하지 않는다.",
        "`pgg git = on`이고 git 저장소이면 성능 측정 산출물을 commit할 수 있다.",
        "git 저장소가 아니면 commit하지 않고 사유를 기록한다.",
        "push는 하지 않는다."
      ],
      [
        "When `pgg git = off`, do not commit.",
        "When `pgg git = on` and this is a git repository, performance measurement artifacts may be committed.",
        "If this is not a git repository, do not commit and record the reason.",
        "Do not push."
      ]
    ),
    commitMessageRequirements: md(
      [
        "pgg git = on이고 git 저장소이면 성능 측정 산출물을 commit할 수 있다.",
        "commit message 형식은 `{convention}. {version} {message}`이다.",
        "예: `perf. 1.3.1 measure login-flow performance baseline`",
        "pgg git = off이면 commit하지 않는다.",
        "commit에는 성능 측정 산출물과 관련 변경만 포함한다."
      ],
      [
        "When pgg git = on and this is a git repository, performance measurement artifacts may be committed.",
        "Commit messages use `{convention}. {version} {message}`.",
        "Example: `perf. 1.3.1 measure login-flow performance baseline`",
        "When pgg git = off, do not commit.",
        "Include only performance measurement artifacts and related changes in the commit."
      ]
    ),
    generatedDocumentationSections: md(
      [
        "pgg-performance 목적",
        "기본 flow와의 관계",
        "실행 조건",
        "auto off 동작",
        "auto on 동작",
        "성능 측정 필요성 판단",
        "측정 대상",
        "측정 지표",
        "baseline",
        "측정 방법",
        "benchmark 실행",
        "결과 비교",
        "성능 기준 통과 여부",
        "금지사항",
        "completion message 규격",
        "completionMessageContract",
        "token accounting 규칙",
        "commit 규칙",
        "next flow routing"
      ],
      [
        "pgg-performance purpose",
        "default flow relationship",
        "trigger conditions",
        "auto off behavior",
        "auto on behavior",
        "performance applicability decision",
        "measurement target",
        "measurement metrics",
        "baseline",
        "measurement method",
        "benchmark execution",
        "result comparison",
        "performance criteria pass/fail",
        "prohibitions",
        "completion message contract",
        "completionMessageContract",
        "token accounting rules",
        "commit rules",
        "next flow routing"
      ]
    )
  }),
  defineSkill({
    id: "pgg-qa",
    name: { ko: "PGG QA", en: "PGG QA" },
    purpose: md(
      [
        "`pgg-qa`는 PGG Skill Framework의 최종 검증 Skill이다.",
        "단순 테스트 실행이 아니라 TypeScript Skill 정의, generated Markdown, POGGN workspace, version, git lifecycle, completion message, token accounting, 각 flow의 전달 가능성을 검증하고 최종 판정을 PASS 또는 FAIL로 선언한다.",
        "QA PASS인 경우에만 archive/release/push 절차를 수행한다."
      ],
      [
        "`pgg-qa` is the final verification Skill in the PGG Skill Framework.",
        "It does more than run tests: it verifies TypeScript Skill definitions, generated Markdown, the POGGN workspace, versioning, git lifecycle, completion messages, token accounting, and whether each flow is executable by a general-purpose AI agent, then declares PASS or FAIL.",
        "Archive, release, and push steps run only after QA PASS."
      ]
    ),
    targetAgent: md(
      [
        "최종 검증, release readiness, archive 결정, 실패 시 수정 flow routing을 수행하는 AI 개발 에이전트.",
        "QA/테스트 엔지니어 관점과 SRE/운영 엔지니어 관점을 함께 사용해 evidence 기반 판정을 내린다."
      ],
      [
        "An AI development agent responsible for final verification, release readiness, archive decisions, and routing failures to the corrective flow.",
        "It combines QA/test-engineering and SRE/operations perspectives to make evidence-based decisions."
      ]
    ),
    triggerConditions: md(
      [
        "`pgg-refactor` PASS 후 최종 검증이 필요할 때 실행한다.",
        "`pgg-code`, `pgg-refactor`, `pgg-performance` 산출물이 준비되었고 archive/release 가능 여부를 결정해야 할 때 실행한다.",
        "신규 Skill Framework migration처럼 source of truth와 generated docs 안정성을 검증해야 하는 작업에서는 생략하지 않는다."
      ],
      [
        "Run after `pgg-refactor` PASS when final verification is required.",
        "Run when `pgg-code`, `pgg-refactor`, and `pgg-performance` artifacts are ready and archive/release readiness must be decided.",
        "Do not skip this for work such as new Skill Framework migration where source-of-truth and generated-doc stability must be verified."
      ]
    ),
    inputs: md(
      [
        "`poggn/active/{topic_name}` topic workspace",
        "`poggn/active/{topic_name}/state.json` 또는 동등 state/current 문서",
        "pgg-add, pgg-plan, pgg-code, pgg-refactor, pgg-performance 산출물",
        "TypeScript Skill 정의 파일과 generator 파일",
        "generated Markdown 파일과 generator 실행 결과",
        "implementation diff, test 결과, build 결과, docs generation 결과",
        "version state: currentVersion, targetVersion, bumpType, convention, reason, versionSource",
        "token records: `poggn/active/{topic_name}/metrics/token-usage.jsonl`",
        "git state: pgg git mode, git repository 여부, branch, commit, remote"
      ],
      [
        "`poggn/active/{topic_name}` topic workspace",
        "`poggn/active/{topic_name}/state.json` or equivalent state/current document",
        "Artifacts from pgg-add, pgg-plan, pgg-code, pgg-refactor, and pgg-performance",
        "TypeScript Skill definition files and generator files",
        "Generated Markdown files and generator output",
        "Implementation diff, test results, build results, and docs-generation results",
        "Version state: currentVersion, targetVersion, bumpType, convention, reason, versionSource",
        "Token records: `poggn/active/{topic_name}/metrics/token-usage.jsonl`",
        "Git state: pgg git mode, repository status, branches, commits, and remote"
      ]
    ),
    outputs: md(
      [
        "`poggn/active/{topic_name}/pgg-qa/report.md` 최종 QA report",
        "PASS 또는 FAIL 최종 판정",
        "실행한 명령어와 각 명령의 결과 evidence",
        "변경된 TS Skill 정의 파일, generated Markdown 파일, 테스트/snapshot 파일, POGGN artifact 목록",
        "FAIL인 경우 수정해야 할 TS 정의 파일과 이유",
        "PASS인 경우 archive 결과와 release branch/push 결과 또는 생략 사유",
        "completion message. QA PASS 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이고, QA FAIL 마지막 문장은 `다음 flow를 실행하세요: <실패한 flow-id>`이다."
      ],
      [
        "`poggn/active/{topic_name}/pgg-qa/report.md` final QA report",
        "Final PASS or FAIL decision",
        "Executed commands and result evidence for each command",
        "Lists of changed TypeScript Skill definition files, generated Markdown files, test/snapshot files, and POGGN artifacts",
        "For FAIL, the TypeScript definition files that must be fixed and the reasons",
        "For PASS, archive result and release branch/push result or skip reason",
        "Completion message. On QA PASS the final sentence is `다음 flow를 실행하세요: pgg-add`; on QA FAIL it is `다음 flow를 실행하세요: <failed-flow-id>`."
      ]
    ),
    absoluteRules: md(
      [
        "`pgg-qa`는 생략하면 안 된다.",
        "generated Markdown을 직접 수정해서 통과시키면 안 된다.",
        "모든 문서 변경은 TypeScript Skill 정의 또는 generator 변경에서 시작해야 한다.",
        "QA는 단순 테스트 실행이 아니라 Skill 전달 가능성까지 검증한다.",
        "FAIL이면 수정해야 할 TS 정의 파일과 이유를 명시한다.",
        "최종 판정은 반드시 PASS 또는 FAIL이다.",
        "QA FAIL이면 archive 이동, release branch 전환, working branch 삭제, push를 수행하지 않는다.",
        "archive 대상 경로가 이미 존재하면 덮어쓰지 않고 FAIL 또는 BLOCKED로 기록한다."
      ],
      [
        "Do not skip `pgg-qa`.",
        "Do not pass QA by hand-editing generated Markdown.",
        "Every documentation change starts from a TypeScript Skill definition or generator change.",
        "QA verifies Skill transferability, not just test execution.",
        "On FAIL, name the TypeScript definition files to fix and why.",
        "The final decision is always PASS or FAIL.",
        "On QA FAIL, do not archive, switch release branches, delete the working branch, or push.",
        "If the archive destination already exists, do not overwrite it; record FAIL or BLOCKED."
      ]
    ),
    antiPatterns: md(
      [
        "테스트 성공만 보고 Skill 전달 가능성을 검증하지 않음",
        "generated Markdown 직접 patch",
        "TS 정의와 generated Markdown 불일치를 무시",
        "QA FAIL인데 archive/release/push 진행",
        "remote가 없는데 push 성공으로 기록",
        "token accounting이나 completion message contract 누락을 경고만 하고 PASS 처리",
        "`적절히 구현`, `필요한 로직 추가`, `일반적인 방식으로 처리` 같은 모호한 표현을 허용"
      ],
      [
        "Treating test success alone as sufficient without checking Skill transferability",
        "Hand-patching generated Markdown",
        "Ignoring mismatch between TypeScript definitions and generated Markdown",
        "Archiving, releasing, or pushing on QA FAIL",
        "Recording push success when no remote exists",
        "Passing despite missing token accounting or completion-message contracts",
        "Allowing vague phrases such as `implement appropriately`, `add required logic`, or `handle it generally`"
      ]
    ),
    modeSpecificBehavior: {
      autoOff: md(
        [
          "`auto off`에서는 destructive 또는 release-facing 작업 전에 사용자 승인 상태를 확인한다.",
          "승인이 없으면 archive 이동, release branch 전환, working branch 삭제, push를 수행하지 않는다.",
          "불명확한 FAIL 원인은 추측으로 PASS 처리하지 않고 질문 또는 FAIL evidence로 남긴다."
        ],
        [
          "In `auto off`, confirm approval state before destructive or release-facing operations.",
          "Without approval, do not archive, switch release branches, delete the working branch, or push.",
          "Do not turn unclear failures into PASS by assumption; ask or record FAIL evidence."
        ]
      ),
      autoOn: md(
        [
          "`auto on`에서는 repository evidence로 합리적인 검증 순서를 자율적으로 정한다.",
          "가정, 불확실성, 선택 이유, 실행하지 못한 검증과 사유를 QA report에 기록한다.",
          "blocking question은 archive/release 안전성 또는 source-of-truth 판정이 불가능할 때만 사용한다."
        ],
        [
          "In `auto on`, choose a reasonable verification order from repository evidence.",
          "Record assumptions, uncertainty, decision reasons, and unexecuted checks with reasons in the QA report.",
          "Use blocking questions only when archive/release safety or source-of-truth decisions cannot be made."
        ]
      ),
      teamsOff: md(
        ["`teams off`에서는 단일 에이전트가 전체 QA matrix, command verification, release decision을 수행한다."],
        ["In `teams off`, one agent performs the full QA matrix, command verification, and release decision."]
      ),
      teamsOn: md(
        [
          "`teams on`이고 환경이 지원하면 QA/테스트 엔지니어와 SRE/운영 엔지니어 primary agent를 사용한다.",
          "QA/테스트 엔지니어는 test evidence, generated docs stability, acceptance coverage를 검토한다.",
          "SRE/운영 엔지니어는 git lifecycle, release branch, push safety, rollback 위험을 검토한다.",
          "메인 에이전트는 두 검토 결과를 합쳐 PASS/FAIL을 선언한다."
        ],
        [
          "In `teams on`, use the QA/test engineer and SRE/operations engineer primary agents when supported.",
          "The QA/test engineer reviews test evidence, generated-doc stability, and acceptance coverage.",
          "The SRE/operations engineer reviews git lifecycle, release branch, push safety, and rollback risk.",
          "The main agent combines both reviews and declares PASS or FAIL."
        ]
      )
    },
    requiredPhases: md(
      [
        "1. Source of Truth 검증: TS Skill 정의 존재, generated Markdown 생성 여부, 직접 수정 흔적, generator 2회 실행 안정성 확인",
        "2. Skill Framework 검증: PGG 설명, 독립 Skill, 목적/trigger/input/output/단계/금지사항/mode별 동작, 범용 AI 에이전트 실행 가능성 확인",
        "3. Flow completeness 검증: pgg-add, pgg-plan, pgg-code, pgg-refactor, pgg-performance, pgg-qa 각각의 필수 계약 확인",
        "4. POGGN Workspace 검증: active path, process artifact 위치, PASS archive, FAIL active 유지, archive overwrite 방지 확인",
        "5. Version 검증: currentVersion, targetVersion, bumpType, convention, reason, versionSource, project version bump 확인",
        "6. Git Mode / Branch Lifecycle 검증: pgg git off 생략 기록, pgg git on branch/commit/release/push 규칙 확인",
        "7. Completion Message Contract 검증: 모든 flow 완료 메시지 schema와 마지막 문장 규칙 확인",
        "8. Token Accounting 검증: JSONL schema, exact/estimated, source 분리, commitSha, active topic 저장 위치 확인",
        "9. Generated Documentation 검증: 한국어 문서, section coverage, mode/approval/verification/workspace/git/version/branch/commit/token/completion 내용 확인",
        "10. 기술 검증: package.json의 실제 scripts 기준 build, docs generation, dashboard build, tests, version-history verification 실행",
        "11. PASS/FAIL 결정 및 report 작성",
        "12. PASS인 경우에만 archive/release/push 절차 수행"
      ],
      [
        "1. Source-of-truth verification: TypeScript Skill definitions, generated Markdown, hand-edit traces, and two-run generator stability",
        "2. Skill Framework verification: PGG description, independent Skills, purpose/trigger/input/output/steps/prohibitions/mode behavior, and executability by a general-purpose AI agent",
        "3. Flow completeness verification: required contracts for pgg-add, pgg-plan, pgg-code, pgg-refactor, pgg-performance, and pgg-qa",
        "4. POGGN Workspace verification: active path, process artifact locations, PASS archive, FAIL active retention, and archive overwrite prevention",
        "5. Version verification: currentVersion, targetVersion, bumpType, convention, reason, versionSource, and project version bump",
        "6. Git Mode / Branch Lifecycle verification: pgg git off skip records and pgg git on branch/commit/release/push rules",
        "7. Completion Message Contract verification: completion-message schema and final-sentence rule for every flow",
        "8. Token Accounting verification: JSONL schema, exact/estimated method, source separation, commitSha, and active-topic location",
        "9. Generated Documentation verification: Korean docs and coverage for sections, modes, approval, verification, workspace, git, version, branch, commit, token, and completion",
        "10. Technical verification: run build, docs generation, dashboard build, tests, and version-history verification from actual package.json scripts",
        "11. Decide PASS/FAIL and write the report",
        "12. Run archive/release/push steps only on PASS"
      ]
    ),
    approvalGates: md(
      [
        "QA PASS 전에는 archive 이동, final QA/archive commit, release branch 전환, working branch 삭제, push를 승인하지 않는다.",
        "`pgg git = on`, git repository, QA PASS, archive 성공, release branch 준비, remote 존재 조건을 모두 만족할 때만 push를 허용한다.",
        "remote가 없으면 push를 생략하고 사유를 report에 기록한다.",
        "QA FAIL이면 실패한 flow-id를 next flow로 지정하고 release-facing 작업을 중단한다."
      ],
      [
        "Before QA PASS, do not approve archiving, final QA/archive commits, release-branch switches, working-branch deletion, or push.",
        "Push is allowed only when `pgg git = on`, the project is a git repository, QA passed, archive succeeded, the release branch is ready, and a remote exists.",
        "If no remote exists, skip push and record the reason.",
        "On QA FAIL, route to the failed flow-id and stop release-facing work."
      ]
    ),
    verificationRequirements: md(
      [
        "TS Skill 정의가 source of truth이며 `packages/core/src/skill-framework/registry.ts` 또는 관련 TS generator 변경에서 문서 변경이 시작되었는지 확인한다.",
        "generator를 실행해 generated Markdown이 갱신되는지 확인한다.",
        "generator를 같은 입력으로 두 번 실행해 두 번째 실행에서 추가 diff가 없는지 확인한다.",
        "저장소의 실제 `package.json` scripts를 기준으로 `pnpm build`, `pnpm build:readme`, `pnpm build:dashboard`, `pnpm test`, `pnpm test:core`, `pnpm test:dashboard`, `pnpm verify:version-history`를 실행 후보로 삼는다.",
        "별도 `typecheck`, `lint`, `snapshot` script가 없으면 package.json 기준으로 `not_available`과 사유를 기록하고, typecheck는 `pnpm build`, docs generation/snapshot 안정성은 `pnpm build:readme`와 generator 2회 실행으로 검증한다.",
        "기술 검증 실패 시 명령어, exit code, 핵심 로그, 수정 대상 TS 정의 또는 generator 파일을 report에 기록한다."
      ],
      [
        "Verify that TypeScript Skill definitions are the source of truth and documentation changes started from `packages/core/src/skill-framework/registry.ts` or related TypeScript generator changes.",
        "Run the generator and verify generated Markdown updates from it.",
        "Run the generator twice with the same input and verify that the second run adds no diff.",
        "Use actual `package.json` scripts as command candidates: `pnpm build`, `pnpm build:readme`, `pnpm build:dashboard`, `pnpm test`, `pnpm test:core`, `pnpm test:dashboard`, and `pnpm verify:version-history`.",
        "If separate `typecheck`, `lint`, or `snapshot` scripts are absent, record `not_available` with the reason; use `pnpm build` for typecheck and `pnpm build:readme` plus two generator runs for docs-generation/snapshot stability.",
        "On technical verification failure, record command, exit code, key logs, and the TypeScript definition or generator files to fix."
      ]
    ),
    reviewRequirements: md(
      [
        "최종 QA report는 각 검증 영역별 Pass/Fail과 evidence를 포함한다.",
        "FAIL이면 실패한 영역, 실패한 flow-id, 수정해야 할 TS 정의 파일, 수정 이유를 기록한다.",
        "PASS이면 archive/release/push 절차가 실제 조건을 만족했는지 또는 생략 사유가 충분한지 review한다.",
        "남은 위험과 남은 불확실성을 빈칸으로 두지 말고 `없음` 또는 구체적 항목으로 기록한다.",
        "검증 evidence는 파일 경로, 명령어, 생성 결과, diff 안정성, commit SHA 또는 생략 사유처럼 재확인 가능한 형태로 남긴다."
      ],
      [
        "The final QA report includes Pass/Fail and evidence for each verification area.",
        "On FAIL, record the failed area, failed flow-id, TypeScript definition files to fix, and reasons.",
        "On PASS, review whether archive/release/push steps satisfied their conditions or whether skip reasons are sufficient.",
        "Do not leave remaining risks or uncertainty blank; write `none` or concrete items.",
        "Evidence must be reproducible: file paths, commands, generated output, diff stability, commit SHA, or skip reasons."
      ]
    ),
    completionMessageContract: md(
      [
        "pgg-qa 완료 메시지는 `# PGG Flow 완료 보고서` 형식을 사용한다.",
        "Flow ID, 상태(PASS 또는 FAIL), Mode, Teams Mode, PGG Git, Topic, Version, 실행 요약을 포함한다.",
        "실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact를 포함한다.",
        "최종 QA Report table, archive/release/push 결과, 남은 위험, 남은 불확실성을 포함한다.",
        "공통 schema에서 마지막 문장은 `다음 flow를 실행하세요: <next-flow-id>` 형식을 따른다.",
        "QA PASS이면 마지막 문장은 정확히 `다음 flow를 실행하세요: pgg-add`이다.",
        "QA FAIL이면 마지막 문장은 정확히 `다음 flow를 실행하세요: <실패한 flow-id>`이다.",
        "마지막 문장 뒤에는 아무 문장도 출력하지 않는다."
      ],
      [
        "The pgg-qa completion message uses the `# PGG Flow Completion Report` format.",
        "It includes Flow ID, status (PASS or FAIL), Mode, Teams Mode, PGG Git, Topic, Version, and execution summary.",
        "It includes executed commands, changed TypeScript Skill definition files, changed generated Markdown files, changed test/snapshot files, and changed POGGN artifacts.",
        "It includes the final QA Report table, archive/release/push result, remaining risks, and remaining uncertainty.",
        "In the common schema, the final sentence follows `다음 flow를 실행하세요: <next-flow-id>`.",
        "On QA PASS, the final sentence is exactly `다음 flow를 실행하세요: pgg-add`.",
        "On QA FAIL, the final sentence is exactly `다음 flow를 실행하세요: <failed-flow-id>`.",
        "Print nothing after the final sentence."
      ]
    ),
    tokenAccountingRequirements: md(
      [
        "모든 pgg-qa 생성/수정 파일의 token count를 `poggn/active/{topic_name}/metrics/token-usage.jsonl`에 기록한다.",
        "record는 runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, measuredAt을 포함한다.",
        "LLM 생성/수정 파일은 `source: llm`, generator 산출물은 `source: generator`, 도구 산출물은 `source: tool`로 구분한다.",
        "token 측정 방식이 exact인지 estimated인지 `isEstimated`와 tokenizer 값으로 기록한다.",
        "task별 commit이 있으면 commitSha를 채우고, commit이 생략되면 null과 생략 사유를 QA report에 기록한다.",
        "token record는 나중에 데이터로 사용할 수 있는 JSONL이어야 하며 generated Markdown과 LLM 생성 파일을 구분해야 한다."
      ],
      [
        "Record token counts for every file created or modified by pgg-qa in `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
        "Each record includes runId, flowId, taskId, filePath, operation, source, tokenCount, tokenizer, isEstimated, charCount, byteCount, lineCount, contentSha256, commitSha, and measuredAt.",
        "Separate LLM-created/modified files as `source: llm`, generator outputs as `source: generator`, and tool outputs as `source: tool`.",
        "Record whether measurement is exact or estimated through `isEstimated` and tokenizer.",
        "When task commits exist, populate commitSha; when commits are skipped, use null and record the skip reason in the QA report.",
        "Token records must be reusable JSONL data and must distinguish generated Markdown from LLM-created files."
      ]
    ),
    nextFlowRouting: md(
      [
        "QA PASS: archive/release/push 절차를 완료하거나 생략 사유를 기록한 뒤 마지막 문장은 `다음 flow를 실행하세요: pgg-add`이다.",
        "Source of Truth, generated docs, pgg-qa 정의 실패: `다음 flow를 실행하세요: pgg-qa`.",
        "pgg-add 검증 실패: `다음 flow를 실행하세요: pgg-add`.",
        "pgg-plan 검증 실패: `다음 flow를 실행하세요: pgg-plan`.",
        "pgg-code 또는 task별 commit 검증 실패: `다음 flow를 실행하세요: pgg-code`.",
        "pgg-refactor 검증 실패: `다음 flow를 실행하세요: pgg-refactor`.",
        "성능 근거 또는 pgg-performance 검증 실패: `다음 flow를 실행하세요: pgg-performance`."
      ],
      [
        "QA PASS: complete archive/release/push or record skip reasons, then end with `다음 flow를 실행하세요: pgg-add`.",
        "Source-of-truth, generated-docs, or pgg-qa definition failure: `다음 flow를 실행하세요: pgg-qa`.",
        "pgg-add verification failure: `다음 flow를 실행하세요: pgg-add`.",
        "pgg-plan verification failure: `다음 flow를 실행하세요: pgg-plan`.",
        "pgg-code or per-task commit verification failure: `다음 flow를 실행하세요: pgg-code`.",
        "pgg-refactor verification failure: `다음 flow를 실행하세요: pgg-refactor`.",
        "Performance evidence or pgg-performance verification failure: `다음 flow를 실행하세요: pgg-performance`."
      ]
    ),
    performanceTriggerGuidance: md(
      [
        "성능 기준, baseline, benchmark, 대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기 변화가 있으면 pgg-performance evidence를 확인한다.",
        "실제 측정 없이 성능 개선을 주장한 경우 FAIL이다.",
        "측정 불가이면 이유, 대체 검증, 남은 위험을 report에 기록한다.",
        "성능 근거가 부족하면 next flow는 `pgg-performance`이다."
      ],
      [
        "When performance criteria, baselines, benchmarks, large data, loops, DB queries, network requests, caching, concurrency, file processing, or bundle-size changes are present, verify pgg-performance evidence.",
        "Claiming performance improvement without measurement is FAIL.",
        "If measurement is unavailable, record the reason, substitute verification, and remaining risk.",
        "When performance evidence is insufficient, the next flow is `pgg-performance`."
      ]
    ),
    poggnWorkspaceRequirements: md(
      [
        "`pgg-add`가 생성한 `topic_name`과 `poggn/active/{topic_name}` 존재를 확인한다.",
        "각 flow process artifact가 active topic directory 하위에 저장되었는지 확인한다.",
        "`pgg-qa` artifact는 `poggn/active/{topic_name}/pgg-qa/` 하위에 저장한다.",
        "token record 위치는 `poggn/active/{topic_name}/metrics/token-usage.jsonl`이다.",
        "QA PASS 후에는 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.",
        "QA FAIL이면 active 상태를 유지한다.",
        "`poggn/archive/{topic_name}`이 이미 있으면 덮어쓰지 않고 FAIL 또는 BLOCKED evidence로 남긴다."
      ],
      [
        "Verify the `topic_name` and `poggn/active/{topic_name}` created by `pgg-add`.",
        "Verify that every flow process artifact is stored under the active topic directory.",
        "Store `pgg-qa` artifacts under `poggn/active/{topic_name}/pgg-qa/`.",
        "Token records live at `poggn/active/{topic_name}/metrics/token-usage.jsonl`.",
        "After QA PASS, move `poggn/active/{topic_name}` to `poggn/archive/{topic_name}`.",
        "On QA FAIL, keep the active topic in place.",
        "If `poggn/archive/{topic_name}` already exists, do not overwrite it; record FAIL or BLOCKED evidence."
      ]
    ),
    gitModeRequirements: md(
      [
        "`pgg git = off`: branch 생성, commit, release branch 전환, working branch 삭제, push가 모두 생략되었는지 확인하고 생략 사유를 기록한다.",
        "`pgg git = on`: `git rev-parse --is-inside-work-tree`로 git 저장소 여부를 확인한다.",
        "`pgg git = on`이고 git 저장소이면 pgg-add working branch 생성/전환, pgg-code task별 commit, pgg-qa final archive commit, release branch, working branch 삭제, push 규칙을 검증한다.",
        "git 저장소가 아니면 모든 git 작업을 생략하고 사유를 기록한다.",
        "remote가 없으면 push를 생략하고 사유를 기록한다."
      ],
      [
        "`pgg git = off`: verify that branch creation, commits, release-branch switching, working-branch deletion, and push were skipped, and record the reason.",
        "`pgg git = on`: check repository status with `git rev-parse --is-inside-work-tree`.",
        "When `pgg git = on` and the project is a git repository, verify pgg-add working branch creation/switching, pgg-code per-task commits, pgg-qa final archive commit, release branch, working-branch deletion, and push rules.",
        "If the project is not a git repository, skip all git operations and record the reason.",
        "If no remote exists, skip push and record the reason."
      ]
    ),
    branchLifecycleRequirements: md(
      [
        "pgg-add는 `pgg git = on`이고 git 저장소이면 working branch를 생성/전환해야 한다.",
        "기존 branch naming policy가 없으면 working branch는 `pgg/working/{topic_name}`을 사용한다.",
        "QA PASS 후 active artifact를 archive로 이동하고 final QA/archive commit을 생성한다.",
        "commit message 형식은 `{convention}. {version} {message}`이고 예시는 `chore. 1.3.0 archive pgg run login-flow`이다.",
        "기존 release branch policy가 없으면 `release/{topic_name}-v{version}`을 사용한다.",
        "release branch는 working branch의 최종 상태를 포함해야 한다.",
        "release branch 전환 후 working branch를 제거한다.",
        "QA FAIL이면 archive 이동, release branch 전환, working branch 제거, push를 수행하지 않는다."
      ],
      [
        "pgg-add must create or switch to a working branch when `pgg git = on` and the project is a git repository.",
        "When no existing branch naming policy exists, use `pgg/working/{topic_name}`.",
        "After QA PASS, move active artifacts to archive and create the final QA/archive commit.",
        "The commit message format is `{convention}. {version} {message}`; example: `chore. 1.3.0 archive pgg run login-flow`.",
        "When no release branch policy exists, use `release/{topic_name}-v{version}`.",
        "The release branch must include the final working-branch state.",
        "After switching to the release branch, delete the working branch.",
        "On QA FAIL, do not archive, switch release branches, delete the working branch, or push."
      ]
    ),
    versioningRequirements: md(
      [
        "pgg-add 산출물을 기준으로 version 결정 evidence를 확인한다.",
        "version format은 `x.x.x`인지 확인한다.",
        "currentVersion, targetVersion, bumpType, convention, reason, versionSource가 기록되었는지 확인한다.",
        "major/minor/patch 기준이 적용되었는지 확인한다.",
        "pgg-plan에 version bump task가 포함되었는지 확인한다.",
        "pgg-code에서 project version이 targetVersion으로 반영되었는지 확인한다.",
        "npm 라이브러리 또는 npm workspace라면 package.json version이 targetVersion과 일치하는지 확인한다.",
        "다른 version source가 있으면 기존 프로젝트 정책을 따랐는지 확인한다."
      ],
      [
        "Verify version decision evidence from pgg-add artifacts.",
        "Verify that the version format is `x.x.x`.",
        "Verify currentVersion, targetVersion, bumpType, convention, reason, and versionSource.",
        "Verify that major/minor/patch rules were applied.",
        "Verify that pgg-plan includes a version bump task.",
        "Verify that pgg-code applied the project version as targetVersion.",
        "For npm libraries or npm workspaces, verify package.json version equals targetVersion.",
        "If another version source exists, verify it follows the existing project policy."
      ]
    ),
    commitMessageRequirements: md(
      [
        "모든 PGG commit message는 `{convention}. {version} {message}` 형식을 따른다.",
        "pgg-code task별 commit도 같은 형식을 따르며 task 목적이 message에 드러나야 한다.",
        "pgg-code는 task별 commit SHA를 보고해야 한다.",
        "pgg-code는 push하지 않는다.",
        "pgg-qa PASS 후 final QA/archive commit message 예시는 `chore. 1.3.0 archive pgg run login-flow`이다.",
        "pgg git off 또는 git 저장소 없음이면 commit을 만들지 않고 생략 사유를 기록한다."
      ],
      [
        "Every PGG commit message follows `{convention}. {version} {message}`.",
        "pgg-code per-task commits use the same format and expose the task purpose in the message.",
        "pgg-code reports each task commit SHA.",
        "pgg-code does not push.",
        "After pgg-qa PASS, an example final QA/archive commit message is `chore. 1.3.0 archive pgg run login-flow`.",
        "When pgg git is off or the project is not a git repository, do not commit and record the skip reason."
      ]
    ),
    archiveRequirements: md(
      [
        "QA PASS 전에는 active artifact를 archive로 이동하지 않는다.",
        "QA PASS이면 `poggn/active/{topic_name}`을 `poggn/archive/{topic_name}`으로 이동한다.",
        "archive destination이 이미 존재하면 덮어쓰지 않고 FAIL 또는 BLOCKED로 기록한다.",
        "pgg git on이고 git 저장소이면 archive 이동 후 final QA/archive commit을 만든다.",
        "release branch를 생성/전환하고 working branch 최종 상태를 포함하는지 확인한다.",
        "release branch 전환 후 working branch를 제거한다.",
        "remote가 있으면 release branch를 push하고, remote가 없으면 push 생략 사유를 기록한다.",
        "QA FAIL이면 archive/release/push 절차를 수행하지 않는다."
      ],
      [
        "Do not move active artifacts to archive before QA PASS.",
        "On QA PASS, move `poggn/active/{topic_name}` to `poggn/archive/{topic_name}`.",
        "If the archive destination already exists, do not overwrite it; record FAIL or BLOCKED.",
        "When pgg git is on and the project is a git repository, create the final QA/archive commit after archiving.",
        "Create or switch to the release branch and verify it includes the final working state.",
        "After switching to the release branch, delete the working branch.",
        "If a remote exists, push the release branch; otherwise record the push skip reason.",
        "On QA FAIL, do not run archive/release/push steps."
      ]
    ),
    qaRequirements: md(
      [
        "최종 QA Report는 `| Area | Pass/Fail | Evidence |` table을 포함한다.",
        "필수 Area: Source of Truth, Skill Framework, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, pgg-add, pgg-plan, pgg-code, pgg-code Task Commits, pgg-refactor, pgg-performance, pgg-qa, Generated Docs, Technical Checks, Archive / Release / Push.",
        "추가 필수 항목: 실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact, 남은 위험, 남은 불확실성, 최종 판정 PASS 또는 FAIL.",
        "Source of Truth 검증은 TS 정의 존재, generated Markdown 생성, 직접 수정 흔적 부재, generator 2회 실행 안정성을 포함한다.",
        "Skill Framework 검증은 범용 AI 에이전트에게 실행 가능한 workflow로 전달되는지 확인한다.",
        "pgg-add 검증은 요구사항 수집, 기능 목적, Acceptance Criteria, topic_name, active workspace, version 결정, working branch, 코드 작성 금지, 소크라테스식 질문, 승인 gate, auto mode, completion, token, next flow를 포함한다.",
        "pgg-plan 검증은 승인된 설계, active workspace, 검증 전략, test plan, 성공/실패 기준, 경계값/예외/회귀/성능 기준, version bump task, 2~5분 task, 정확한 파일 경로, 완전한 코드, verification, pgg-performance routing을 포함한다.",
        "pgg-code 검증은 실제 테스트 코드, 구현 코드, 테스트 실행, 실패 로그 분석, 수정 후 재실행, project version bump, teams on delegation, clean context, Review 1, Review 2, final verify, task token, task commit, push 금지를 포함한다.",
        "pgg-refactor 검증은 동작 보존, before / after 동일성, feature change 금지, 구조 개선, 중복 제거, 성능 개선, 가독성 분리, 책임 분리, diff inspection, final verify를 포함한다.",
        "pgg-performance 검증은 독립 Skill, 측정 필요성 판단 조건, 지표, baseline, 측정 방법, 결과 비교, 측정 없는 개선 주장 금지, 측정 불가 이유 보고, next flow를 포함한다.",
        "Generated Documentation 검증은 한국어 문서, 필수 section, mode별 동작, 승인 gate, verification, POGGN workspace, pgg git mode, branch lifecycle, versioning, commit message, completion message, token accounting, 모호한 표현 부재를 포함한다."
      ],
      [
        "The final QA Report includes a `| Area | Pass/Fail | Evidence |` table.",
        "Required areas: Source of Truth, Skill Framework, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, pgg-add, pgg-plan, pgg-code, pgg-code Task Commits, pgg-refactor, pgg-performance, pgg-qa, Generated Docs, Technical Checks, Archive / Release / Push.",
        "Additional required items: executed commands, changed TypeScript Skill definition files, changed generated Markdown files, changed test/snapshot files, changed POGGN artifacts, remaining risks, remaining uncertainty, and final decision PASS or FAIL.",
        "Source-of-truth verification includes TypeScript definitions, generated Markdown generation, absence of hand edits, and two-run generator stability.",
        "Skill Framework verification checks whether workflows are executable by a general-purpose AI agent.",
        "pgg-add verification includes requirements, purpose, Acceptance Criteria, topic_name, active workspace, version decision, working branch, no-code rule, Socratic questions, approval gate, auto modes, completion, token, and next flow.",
        "pgg-plan verification includes approved design, active workspace, verification strategy, test plan, success/failure criteria, edge/failure/regression/performance criteria, version bump task, 2-5 minute tasks, exact file paths, complete code, verification, and pgg-performance routing.",
        "pgg-code verification includes real test code, implementation code, test execution, failure-log analysis, rerun after fixes, project version bump, teams-on delegation, clean context, Review 1, Review 2, final verify, task tokens, task commits, and no push.",
        "pgg-refactor verification includes behavior preservation, before/after equivalence, no feature change, structure improvement, duplication removal, performance improvement, readability separation, responsibility separation, diff inspection, and final verify.",
        "pgg-performance verification includes independent Skill status, measurement-need decision conditions, metrics, baseline, method, result comparison, no unmeasured improvement claims, unavailable-measurement reasons, and next flow.",
        "Generated Documentation verification includes Korean docs, required sections, mode-specific behavior, approval gates, verification, POGGN workspace, pgg git mode, branch lifecycle, versioning, commit messages, completion messages, token accounting, and absence of vague phrasing."
      ]
    ),
    additionalGuidance: [
      {
        title: { ko: "Source of Truth 검증", en: "Source of Truth Verification" },
        body: md(
          [
            "`packages/core/src/skill-framework/registry.ts`에 pgg-qa TS Skill 정의가 존재하는지 확인한다.",
            "generated Markdown은 `node packages/cli/dist/index.js update` 또는 저장소 generator에서 생성한다.",
            "generated Markdown 변경 diff가 TS 정의 또는 generator 변경에서 나온 결과인지 확인한다.",
            "generator를 두 번 실행해 두 번째 실행에서 추가 변경이 없는지 확인한다."
          ],
          [
            "Verify that the pgg-qa TypeScript Skill definition exists in `packages/core/src/skill-framework/registry.ts`.",
            "Generate Markdown with `node packages/cli/dist/index.js update` or the repository generator.",
            "Verify that generated Markdown diffs come from TypeScript definitions or generator changes.",
            "Run the generator twice and verify no extra changes appear on the second run."
          ]
        )
      },
      {
        title: { ko: "최종 QA Report 형식", en: "Final QA Report Format" },
        body: md(
          [
            "`| Area | Pass/Fail | Evidence |` table을 사용한다.",
            "Area row는 Source of Truth, Skill Framework, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, pgg-add, pgg-plan, pgg-code, pgg-code Task Commits, pgg-refactor, pgg-performance, pgg-qa, Generated Docs, Technical Checks, Archive / Release / Push를 포함한다.",
            "table 뒤에는 실행한 명령어, 변경된 TS Skill 정의 파일, 변경된 generated Markdown 파일, 변경된 테스트/snapshot 파일, 변경된 POGGN artifact, 남은 위험, 남은 불확실성, 최종 판정: PASS 또는 FAIL을 기록한다."
          ],
          [
            "Use a `| Area | Pass/Fail | Evidence |` table.",
            "Area rows include Source of Truth, Skill Framework, POGGN Workspace, Versioning, Git Mode / Branch Lifecycle, Commit Message Convention, Completion Message Contract, Token Accounting, pgg-add, pgg-plan, pgg-code, pgg-code Task Commits, pgg-refactor, pgg-performance, pgg-qa, Generated Docs, Technical Checks, and Archive / Release / Push.",
            "After the table, record executed commands, changed TypeScript Skill definition files, changed generated Markdown files, changed test/snapshot files, changed POGGN artifacts, remaining risks, remaining uncertainty, and final decision: PASS or FAIL."
          ]
        )
      },
      {
        title: { ko: "기술 검증 명령", en: "Technical Verification Commands" },
        body: md(
          [
            "`pnpm build`: TypeScript build와 typecheck 역할을 수행한다.",
            "`pnpm build:readme`: core build 후 generated README를 갱신한다.",
            "`node packages/cli/dist/index.js update`: managed Skill Markdown과 `.codex` generated docs를 갱신한다.",
            "`pnpm build:dashboard`: dashboard build를 수행한다.",
            "`pnpm test`, `pnpm test:core`, `pnpm test:dashboard`: core/dashboard test를 실행한다.",
            "`pnpm verify:version-history`: version history 보존을 검증한다.",
            "package.json에 별도 lint 또는 snapshot script가 없으면 `not_available`로 기록하고 사유를 남긴다."
          ],
          [
            "`pnpm build`: performs the TypeScript build and typecheck role.",
            "`pnpm build:readme`: builds core and updates the generated README.",
            "`node packages/cli/dist/index.js update`: updates managed Skill Markdown and `.codex` generated docs.",
            "`pnpm build:dashboard`: builds the dashboard.",
            "`pnpm test`, `pnpm test:core`, and `pnpm test:dashboard`: run core/dashboard tests.",
            "`pnpm verify:version-history`: verifies version-history preservation.",
            "If package.json has no separate lint or snapshot script, record `not_available` with the reason."
          ]
        )
      },
      {
        title: { ko: "PASS/FAIL 기준", en: "PASS/FAIL Criteria" },
        body: md(
          [
            "모든 필수 영역이 Pass이고 실패한 명령이 없으며 archive/release/push 조건 또는 생략 사유가 명확하면 PASS이다.",
            "하나라도 필수 영역이 Fail이면 최종 판정은 FAIL이다.",
            "검증을 실행하지 못했는데 대체 evidence나 명확한 `not_available` 사유가 없으면 FAIL이다.",
            "FAIL이면 archive/release/push를 수행하지 않고 next flow를 실패한 flow-id로 지정한다."
          ],
          [
            "PASS requires every required area to pass, no failed command, and clear archive/release/push completion or skip reasons.",
            "If any required area fails, the final decision is FAIL.",
            "If a verification could not run and lacks substitute evidence or a clear `not_available` reason, the decision is FAIL.",
            "On FAIL, do not archive/release/push and set next flow to the failed flow-id."
          ]
        )
      }
    ],
    generatedDocumentationSections: md(
      [
        "pgg-qa 목적",
        "Source of Truth 검증",
        "Skill Framework 검증",
        "POGGN Workspace 검증",
        "Version 검증",
        "Git Mode 검증",
        "Branch Lifecycle 검증",
        "Commit Message Convention 검증",
        "Completion Message Contract 검증",
        "Token Accounting 검증",
        "pgg-add 검증",
        "pgg-plan 검증",
        "pgg-code 검증",
        "pgg-code task commit 검증",
        "pgg-refactor 검증",
        "pgg-performance 검증",
        "Generated Documentation 검증",
        "기술 검증",
        "QA PASS 후 archive/release/push 절차",
        "최종 QA Report 형식",
        "PASS/FAIL 기준",
        "completion message 규격",
        "completionMessageContract",
        "tokenAccountingRequirements",
        "next flow routing"
      ],
      [
        "pgg-qa purpose",
        "Source of Truth verification",
        "Skill Framework verification",
        "POGGN Workspace verification",
        "Version verification",
        "Git Mode verification",
        "Branch Lifecycle verification",
        "Commit Message Convention verification",
        "Completion Message Contract verification",
        "Token Accounting verification",
        "pgg-add verification",
        "pgg-plan verification",
        "pgg-code verification",
        "pgg-code task commit verification",
        "pgg-refactor verification",
        "pgg-performance verification",
        "Generated Documentation verification",
        "Technical verification",
        "Post-PASS archive/release/push procedure",
        "Final QA Report format",
        "PASS/FAIL criteria",
        "completion message format",
        "completionMessageContract",
        "tokenAccountingRequirements",
        "next flow routing"
      ]
    )
  })
] as const satisfies readonly PggSkillDefinition[];

export const PGG_SKILL_DEFINITION_BY_ID = Object.freeze(
  PGG_SKILL_DEFINITIONS.reduce((accumulator, definition) => {
    accumulator[definition.id] = definition;
    for (const alias of definition.legacyAliases ?? []) {
      accumulator[alias] = definition;
    }
    return accumulator;
  }, {} as Record<RegistrySkillLookupName, PggSkillDefinition>)
);

export function validatePggSkillDefinition(definition: PggSkillDefinition): string[] {
  const errors: string[] = [];
  for (const field of REQUIRED_SKILL_DEFINITION_FIELDS) {
    if (definition[field] === undefined || definition[field] === null) {
      errors.push(`${definition.id}: missing ${field}`);
    }
  }
  for (const field of [
    "purpose",
    "targetAgent",
    "triggerConditions",
    "inputs",
    "outputs",
    "absoluteRules",
    "antiPatterns",
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
    "qaRequirements"
  ] as const) {
    const value = definition[field];
    if (!value.ko.length || !value.en.length) {
      errors.push(`${definition.id}: empty localized field ${field}`);
    }
  }
  return errors;
}

export function validatePggSkillRegistry(): string[] {
  return PGG_SKILL_DEFINITIONS.flatMap(validatePggSkillDefinition);
}
