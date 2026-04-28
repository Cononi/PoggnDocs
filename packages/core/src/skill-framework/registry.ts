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
    purpose: md(["승인된 plan과 task를 repository의 실제 코드로 구현한다."], ["Implement the approved plan and tasks in the repository."]),
    targetAgent: md(["구현, adapter 연결, generator 연결, 테스트 추가를 수행하는 AI 개발 에이전트."], ["An AI development agent that implements, wires adapters/generators, and adds tests."]),
    triggerConditions: md(["`pgg-plan`이 PASS이고 구현 승인이 완료된 후 실행한다."], ["Run after `pgg-plan` is PASS and implementation is approved."]),
    inputs: md(["approved plan", "task list", "source-of-truth TypeScript definitions", "legacy classification"], ["approved plan", "task list", "source-of-truth TypeScript definitions", "legacy classification"]),
    outputs: md(["code changes", "registry/generator wiring", "tests", "token records", "implementation index"], ["code changes", "registry/generator wiring", "tests", "token records", "implementation index"]),
    absoluteRules: md(["generated Markdown은 generator를 통해서만 변경한다.", "public API/CLI entry는 가능하면 유지하고 신규 core로 연결한다."], ["Change generated Markdown only through the generator.", "Preserve public API/CLI entries where possible by routing them to the new core."]),
    antiPatterns: md(["legacy 파일 무작정 삭제", "TypeScript 정의 대신 Markdown 직접 수정", "검증 없이 완료 처리"], ["Blindly deleting legacy files", "Editing Markdown instead of TypeScript definitions", "Completing without verification"]),
    requiredPhases: md(["context refresh", "implementation", "generator wiring", "test update", "verification", "review"], ["context refresh", "implementation", "generator wiring", "test update", "verification", "review"]),
    approvalGates: md(["auto off에서는 scope 변경이나 dependency 추가 전 승인을 받는다."], ["In auto off, get approval before scope changes or dependency additions."]),
    verificationRequirements: md(["typecheck/build/test/docs generation을 저장소 script 기준으로 실행한다."], ["Run typecheck/build/test/docs generation using repository scripts."]),
    reviewRequirements: md(["diff, regression risk, generated output provenance, test coverage를 review한다."], ["Review diff, regression risk, generated output provenance, and test coverage."]),
    nextFlowRouting: md(["PASS이면 `pgg-refactor`를 추천한다.", "성능 측정이 필요하면 `pgg-performance`를 조건부로 추천한다."], ["Recommend `pgg-refactor` on PASS.", "Conditionally recommend `pgg-performance` when measurement is needed."])
  }),
  defineSkill({
    id: "pgg-refactor",
    name: { ko: "PGG Refactor", en: "PGG Refactor" },
    purpose: md(["기능 구현 후 legacy adapter, 중복, 구조적 부채를 줄인다."], ["Reduce legacy adapters, duplication, and structural debt after implementation."]),
    targetAgent: md(["동작 보존 refactor와 legacy migration 정리를 수행하는 AI 개발 에이전트."], ["An AI development agent that performs behavior-preserving refactors and legacy migration cleanup."]),
    triggerConditions: md(["`pgg-code` PASS 후 구조 정리가 필요할 때 실행한다."], ["Run after `pgg-code` PASS when structural cleanup is needed."]),
    inputs: md(["implementation diff", "legacy classification", "tests", "public API constraints"], ["implementation diff", "legacy classification", "tests", "public API constraints"]),
    outputs: md(["refactor changes", "updated legacy classification", "verification results"], ["refactor changes", "updated legacy classification", "verification results"]),
    absoluteRules: md(["동작 보존 여부를 검증한다.", "`pgg-qa` PASS 전 제거 후보를 성급히 삭제하지 않는다."], ["Verify behavior preservation.", "Do not prematurely remove migration candidates before `pgg-qa` PASS."]),
    antiPatterns: md(["unrelated cleanup", "public API break", "테스트 없이 구조 변경"], ["Unrelated cleanup", "Public API breaks", "Structural changes without tests"]),
    requiredPhases: md(["diff review", "legacy classification update", "refactor", "regression verification"], ["diff review", "legacy classification update", "refactor", "regression verification"]),
    approvalGates: md(["auto off에서는 public API 변경이나 제거 전 승인을 받는다."], ["In auto off, get approval before public API changes or removals."]),
    verificationRequirements: md(["refactor 전후 behavior가 테스트와 generated output으로 일치해야 한다."], ["Behavior before and after refactor must match through tests and generated output."]),
    reviewRequirements: md(["불필요한 추상화, hidden behavior change, legacy removal timing을 review한다."], ["Review unnecessary abstraction, hidden behavior changes, and legacy removal timing."]),
    nextFlowRouting: md(["PASS이면 `pgg-qa`를 추천한다.", "성능 회귀 우려가 있으면 `pgg-performance`를 조건부로 추천한다."], ["Recommend `pgg-qa` on PASS.", "Conditionally recommend `pgg-performance` if performance regression is a concern."])
  }),
  defineSkill({
    id: "pgg-performance",
    name: { ko: "PGG Performance", en: "PGG Performance" },
    legacyAliases: ["pgg-performanc"],
    purpose: md(["성능 측정이 필요한 topic에서만 baseline과 결과를 비교한다."], ["Compare baselines and results only for topics requiring performance measurement."]),
    targetAgent: md(["성능 기준, 측정 명령, 결과 해석을 기록하는 AI 개발 에이전트."], ["An AI development agent that records performance criteria, measurement commands, and interpretation."]),
    triggerConditions: md(["성능 요구사항, 성능 회귀 가능성, 측정 요청이 있을 때만 실행한다."], ["Run only when there is a performance requirement, regression risk, or measurement request."]),
    inputs: md(["performance criteria", "measurement commands", "baseline", "current implementation"], ["performance criteria", "measurement commands", "baseline", "current implementation"]),
    outputs: md(["performance report", "baseline comparison", "risk decision"], ["performance report", "baseline comparison", "risk decision"]),
    absoluteRules: md(["근거 없는 성능 개선 주장을 하지 않는다.", "측정 명령과 환경을 기록한다."], ["Do not claim performance improvement without evidence.", "Record measurement commands and environment."]),
    antiPatterns: md(["측정 없이 PASS 처리", "single noisy run만 근거로 결론", "기능 QA 대신 성능 flow 사용"], ["Passing without measurement", "Concluding from one noisy run", "Using performance flow as a replacement for functional QA"]),
    requiredPhases: md(["criteria check", "baseline capture", "measurement", "comparison", "recommendation"], ["criteria check", "baseline capture", "measurement", "comparison", "recommendation"]),
    approvalGates: md(["측정 비용이 크거나 external resource가 필요하면 실행 전 승인받는다."], ["Get approval before expensive measurements or external resources."]),
    verificationRequirements: md(["측정 재현 명령, 결과, 해석을 report에 포함한다."], ["Include reproducible commands, results, and interpretation in the report."]),
    reviewRequirements: md(["측정 신뢰도, baseline 적합성, 기능 영향 여부를 review한다."], ["Review measurement reliability, baseline fit, and functional impact."]),
    nextFlowRouting: md(["PASS이면 원래 pending flow로 복귀하거나 `pgg-qa`를 추천한다."], ["On PASS, return to the pending flow or recommend `pgg-qa`."])
  }),
  defineSkill({
    id: "pgg-qa",
    name: { ko: "PGG QA", en: "PGG QA" },
    purpose: md(["구현 결과를 검증하고 PASS인 경우 archive/release 절차를 수행한다."], ["Verify the implementation and perform archive/release steps on PASS."]),
    targetAgent: md(["최종 검증, release readiness, archive 결정을 수행하는 AI 개발 에이전트."], ["An AI development agent that performs final verification, release readiness checks, and archive decisions."]),
    triggerConditions: md(["`pgg-refactor` PASS 후 또는 검증 준비가 완료된 후 실행한다."], ["Run after `pgg-refactor` PASS or when verification is ready."]),
    inputs: md(["implementation diff", "tests", "generated docs", "version state", "token records", "git state"], ["implementation diff", "tests", "generated docs", "version state", "token records", "git state"]),
    outputs: md(["QA report", "PASS/FAIL decision", "archive state", "release branch decision", "completion message"], ["QA report", "PASS/FAIL decision", "archive state", "release branch decision", "completion message"]),
    absoluteRules: md(["PASS 전 archive, release branch 전환, working branch 제거, push를 하지 않는다.", "실패한 검증을 숨기지 않는다."], ["Do not archive, switch release branches, delete working branches, or push before PASS.", "Do not hide failed verification."]),
    antiPatterns: md(["테스트 실패 무시", "generated Markdown 직접 patch", "QA FAIL인데 release 진행"], ["Ignoring test failures", "Hand-patching generated Markdown", "Releasing on QA FAIL"]),
    requiredPhases: md(["artifact review", "command verification", "generated docs stability check", "version check", "git/archive decision"], ["artifact review", "command verification", "generated docs stability check", "version check", "git/archive decision"]),
    approvalGates: md(["push는 pgg git on, git repository, QA PASS, remote 존재 조건을 모두 만족해야 한다."], ["Push requires pgg git on, git repository, QA PASS, and an available remote."]),
    verificationRequirements: md(["관련 package script, docs generation 재실행 안정성, version match를 확인한다."], ["Verify relevant package scripts, docs generation rerun stability, and version match."]),
    reviewRequirements: md(["남은 위험, 불확실성, 실패 로그, release readiness를 review한다."], ["Review remaining risks, uncertainty, failure logs, and release readiness."]),
    nextFlowRouting: md(["PASS이면 완료 또는 다음 release 절차를 추천한다.", "FAIL/BLOCKED이면 실패 원인 해결 flow를 추천한다."], ["On PASS, recommend completion or the next release procedure.", "On FAIL/BLOCKED, recommend the corrective flow."])
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
