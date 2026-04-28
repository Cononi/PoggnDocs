// Deprecated legacy contract.
// New code must import from `./skill-framework/index.js`; this file remains until
// pgg-qa PASS confirms legacy removal is safe.
export const CORE_WORKFLOW_SKILLS = [
  "pgg-add",
  "pgg-plan",
  "pgg-code",
  "pgg-refactor",
  "pgg-qa"
] as const;

export const OPTIONAL_AUDIT_SKILLS = ["pgg-token", "pgg-performance"] as const;
export const CANONICAL_OPTIONAL_AUDIT_SKILLS = OPTIONAL_AUDIT_SKILLS;
export const LEGACY_COMPATIBILITY_SKILLS = [] as const;
export type LegacyCompatibilitySkillName = (typeof LEGACY_COMPATIBILITY_SKILLS)[number];

export const WORKFLOW_SKILLS = [...CORE_WORKFLOW_SKILLS, ...CANONICAL_OPTIONAL_AUDIT_SKILLS] as const;

export type WorkflowSkillName = (typeof WORKFLOW_SKILLS)[number];

export const STANDALONE_SKILLS = ["pgg-status", "pgg-verify"] as const;

export type StandaloneSkillName = (typeof STANDALONE_SKILLS)[number];

export const GENERATED_SKILLS = [...WORKFLOW_SKILLS, ...LEGACY_COMPATIBILITY_SKILLS, ...STANDALONE_SKILLS] as const;

export type GeneratedSkillName = WorkflowSkillName | LegacyCompatibilitySkillName | StandaloneSkillName;

export const WORKFLOW_FRONTMATTER_STAGES =
  "proposal | plan | task | implementation | refactor | token | performance | qa";

export const WORKFLOW_FRONTMATTER_SKILLS = WORKFLOW_SKILLS.join(" | ");

export const README_WORKFLOW_STAGE_SUMMARIES_KO = [
  "1. `pgg-add`: proposal, 사용자 질문 기록, 전문가 attribution review 생성",
  "2. `pgg-plan`: plan, task, spec, plan/task review 생성",
  "3. `pgg-code`: 구현과 diff, code review 기록",
  "4. `pgg-refactor`: 레거시 제거와 구조 개선, refactor review 기록",
  "5. `pgg-qa`: `qa/report.md` 검증과 archive 판정"
] as const;

export const README_WORKFLOW_STAGE_SUMMARIES_EN = [
  "1. `pgg-add`: create the proposal, the user-question record, and the attributed proposal review",
  "2. `pgg-plan`: create the plan, task, spec, and plan/task reviews",
  "3. `pgg-code`: implement the change and record diffs plus the code review",
  "4. `pgg-refactor`: remove legacy code, improve structure, and record the refactor review",
  "5. `pgg-qa`: validate `qa/report.md` and decide archive readiness"
] as const;

export const README_OPTIONAL_AUDIT_SUMMARIES_KO = [
  "- `pgg-token`: workflow 자산, handoff, helper, generated 문서의 token 비용을 점검할 때만 실행하고, 실제 실행 evidence가 있을 때만 dashboard에 표시하는 optional audit",
  "- `pgg-performance`: 성능 민감 변경이나 선언된 verification contract가 있을 때만 실행하고, 실제 실행 evidence가 있을 때만 dashboard에 표시하는 optional audit"
] as const;

export const README_OPTIONAL_AUDIT_SUMMARIES_EN = [
  "- `pgg-token`: an optional audit used only when workflow assets, handoff, helpers, or generated docs need token-cost review, and shown in the dashboard only when execution evidence exists",
  "- `pgg-performance`: an optional audit used only when the topic has performance-sensitive changes or a declared verification contract, and shown in the dashboard only when execution evidence exists"
] as const;

export const MANDATORY_IMPLEMENTATION_CRITERIA_KO = [
  "중복 제거",
  "단일 책임",
  "가독성",
  "추상화",
  "일관성",
  "테스트에 좋은 코드",
  "예외 처리 필수",
  "작은 단위 처리",
  "의존성 관리",
  "확장성",
  "네이밍"
] as const;

export const MANDATORY_IMPLEMENTATION_CRITERIA_EN = [
  "remove duplication",
  "keep single responsibility",
  "optimize readability",
  "use clear abstraction boundaries",
  "preserve consistency",
  "keep the code test-friendly",
  "handle exceptions explicitly",
  "prefer small units with one purpose",
  "keep dependencies loosely coupled",
  "preserve extensibility under OCP",
  "use names that make responsibilities obvious"
] as const;

export type PggSkillLanguage = "ko" | "en";
export type LocalizedText = Record<PggSkillLanguage, string>;
export type LocalizedMarkdown = Record<PggSkillLanguage, readonly string[]>;

export interface PggSkillModeSpecificBehavior {
  autoOff: LocalizedMarkdown;
  autoOn: LocalizedMarkdown;
  teamsOff: LocalizedMarkdown;
  teamsOn: LocalizedMarkdown;
}

export interface PggSkillGuidanceSection {
  title: LocalizedText;
  body: LocalizedMarkdown;
}

export interface PggSkillDefinition {
  id: WorkflowSkillName;
  name: LocalizedText;
  legacyAliases?: readonly LegacyCompatibilitySkillName[];
  purpose: LocalizedText;
  targetAgent: LocalizedText;
  triggerConditions: LocalizedMarkdown;
  inputs: LocalizedMarkdown;
  outputs: LocalizedMarkdown;
  absoluteRules: LocalizedMarkdown;
  antiPatterns: LocalizedMarkdown;
  modeSpecificBehavior: PggSkillModeSpecificBehavior;
  additionalGuidance?: readonly PggSkillGuidanceSection[];
  requiredPhases: LocalizedMarkdown;
  approvalGates: LocalizedMarkdown;
  verificationRequirements: LocalizedMarkdown;
  reviewRequirements: LocalizedMarkdown;
  completionMessageContract: LocalizedMarkdown;
  tokenAccountingRequirements: LocalizedMarkdown;
  nextFlowRouting: LocalizedMarkdown;
  performanceTriggerGuidance: LocalizedMarkdown;
  qaRequirements: LocalizedMarkdown;
  generatedDocumentationSections: LocalizedMarkdown;
}

const COMMON_MODE_SPECIFIC_BEHAVIOR: PggSkillModeSpecificBehavior = {
  autoOff: {
    ko: [
      "사용자 중심, 승인 기반으로 진행한다.",
      "요구사항이 불명확하면 질문하고 승인 전 다음 단계로 진행하지 않는다.",
      "조용히 다음 flow로 넘어가지 않는다."
    ],
    en: [
      "Run user-centered and approval-based.",
      "Ask when requirements are unclear and do not advance before approval.",
      "Do not silently move to the next flow."
    ]
  },
  autoOn: {
    ko: [
      "자율 실행하되 최적 답안을 추론한 근거를 남긴다.",
      "가정, 불확실성, 선택 이유를 completion message에 포함한다.",
      "blocking question은 꼭 필요한 경우에만 사용한다."
    ],
    en: [
      "Execute autonomously and record why the chosen answer is best.",
      "Include assumptions, uncertainty, and choice rationale in the completion message.",
      "Use blocking questions only when necessary."
    ]
  },
  teamsOff: {
    ko: ["단일 에이전트가 전체 flow를 수행한다."],
    en: ["A single agent executes the full flow."]
  },
  teamsOn: {
    ko: [
      "환경이 지원하면 task별 fresh subagent에 bounded work를 위임한다.",
      "subagent는 독립 context로 시작하고 parent가 맡긴 범위만 처리한다.",
      "task 완료 후 parent가 review를 수행한다."
    ],
    en: [
      "When the environment supports it, delegate bounded task work to fresh subagents.",
      "Subagents start with independent context and handle only the parent-assigned scope.",
      "The parent reviews the result after each task."
    ]
  }
};

const COMMON_VERIFICATION_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "필요한 테스트를 생성하거나 기존 테스트를 보강한다.",
    "선언된 verification command가 있으면 실행한다.",
    "실패 로그를 분석하고 수정 후 재실행한다.",
    "before / after 비교와 diff inspection을 수행한다.",
    "final verify 결과를 completion message에 기록한다."
  ],
  en: [
    "Create required tests or strengthen existing tests.",
    "Run declared verification commands when available.",
    "Analyze failure logs, fix the issue, and rerun.",
    "Perform before/after comparison and diff inspection.",
    "Record final verify results in the completion message."
  ]
};

const COMMON_COMPLETION_MESSAGE_CONTRACT: LocalizedMarkdown = {
  ko: [
    "모든 flow 완료 시 아래 schema의 정형화된 완료 메시지를 출력한다.",
    "",
    "```md",
    "# PGG Flow 완료 보고서",
    "",
    "## Flow",
    "- Flow ID:",
    "- 상태: PASS | FAIL | PARTIAL | BLOCKED",
    "- Mode:",
    "- Teams Mode:",
    "- 실행 요약:",
    "",
    "## 주요 산출물",
    "- ...",
    "",
    "## 생성/수정된 파일",
    "| 파일 경로 | 작업 유형 | 설명 |",
    "|---|---|---|",
    "|  | created / modified / generated |  |",
    "",
    "## Token 기록",
    "| 파일 경로 | 토큰 수 | 측정 방식 | 추정 여부 |",
    "|---|---:|---|---|",
    "|  |  | exact / estimated | true / false |",
    "",
    "## 검증 결과",
    "- 실행한 명령어:",
    "- 결과:",
    "- 실패 로그 요약:",
    "- 재실행 여부:",
    "",
    "## 남은 위험",
    "- ...",
    "",
    "## 남은 불확실성",
    "- ...",
    "",
    "## 다음 Flow",
    "- 추천 다음 flow:",
    "- 추천 이유:",
    "",
    "다음 flow를 실행하세요: <next-flow-id>",
    "```",
    "",
    "마지막 문장은 반드시 `다음 flow를 실행하세요: <next-flow-id>` 형식이어야 한다.",
    "마지막 문장 뒤에는 아무 문장도 출력하지 않는다."
  ],
  en: [
    "Every flow completion prints the structured completion message below.",
    "",
    "```md",
    "# PGG Flow Completion Report",
    "",
    "## Flow",
    "- Flow ID:",
    "- Status: PASS | FAIL | PARTIAL | BLOCKED",
    "- Mode:",
    "- Teams Mode:",
    "- Execution Summary:",
    "",
    "## Key Artifacts",
    "- ...",
    "",
    "## Created/Modified Files",
    "| File Path | Operation | Description |",
    "|---|---|---|",
    "|  | created / modified / generated |  |",
    "",
    "## Token Records",
    "| File Path | Token Count | Measurement | Estimated |",
    "|---|---:|---|---|",
    "|  |  | exact / estimated | true / false |",
    "",
    "## Verification Results",
    "- Commands Run:",
    "- Result:",
    "- Failure Log Summary:",
    "- Rerun:",
    "",
    "## Remaining Risks",
    "- ...",
    "",
    "## Remaining Uncertainty",
    "- ...",
    "",
    "## Next Flow",
    "- Recommended next flow:",
    "- Recommendation reason:",
    "",
    "다음 flow를 실행하세요: <next-flow-id>",
    "```",
    "",
    "The final sentence must exactly match `다음 flow를 실행하세요: <next-flow-id>`.",
    "Nothing may be printed after that final sentence."
  ]
};

const COMMON_TOKEN_ACCOUNTING_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "LLM이 생성하거나 수정한 파일별 token 수를 기록한다.",
    "exact 측정인지 estimated 측정인지 기록한다.",
    "tokenizer, charCount, byteCount, lineCount, contentSha256, commitSha를 기록한다.",
    "기존 metrics/run data 구조가 있으면 우선 사용하고, 없으면 `.pgg/metrics/token-usage.jsonl`을 사용한다.",
    "",
    "```json",
    "{",
    "  \"runId\": \"string\",",
    "  \"flowId\": \"string\",",
    "  \"taskId\": \"string | null\",",
    "  \"filePath\": \"string\",",
    "  \"operation\": \"created | modified | generated\",",
    "  \"source\": \"llm | generator | tool\",",
    "  \"tokenCount\": 0,",
    "  \"tokenizer\": \"string\",",
    "  \"isEstimated\": false,",
    "  \"charCount\": 0,",
    "  \"byteCount\": 0,",
    "  \"lineCount\": 0,",
    "  \"contentSha256\": \"string\",",
    "  \"commitSha\": \"string | null\",",
    "  \"measuredAt\": \"ISO-8601 timestamp\"",
    "}",
    "```"
  ],
  en: [
    "Record token counts for every file created or modified by the LLM.",
    "Record whether the measurement is exact or estimated.",
    "Record tokenizer, charCount, byteCount, lineCount, contentSha256, and commitSha.",
    "Prefer the existing metrics/run-data structure, otherwise use `.pgg/metrics/token-usage.jsonl`.",
    "",
    "```json",
    "{",
    "  \"runId\": \"string\",",
    "  \"flowId\": \"string\",",
    "  \"taskId\": \"string | null\",",
    "  \"filePath\": \"string\",",
    "  \"operation\": \"created | modified | generated\",",
    "  \"source\": \"llm | generator | tool\",",
    "  \"tokenCount\": 0,",
    "  \"tokenizer\": \"string\",",
    "  \"isEstimated\": false,",
    "  \"charCount\": 0,",
    "  \"byteCount\": 0,",
    "  \"lineCount\": 0,",
    "  \"contentSha256\": \"string\",",
    "  \"commitSha\": \"string | null\",",
    "  \"measuredAt\": \"ISO-8601 timestamp\"",
    "}",
    "```"
  ]
};

const COMMON_PERFORMANCE_TRIGGER_GUIDANCE: LocalizedMarkdown = {
  ko: [
    "사용자가 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량을 언급하면 `pgg-performance`를 고려한다.",
    "성능 기준이 plan에 있거나 code/refactor가 대량 데이터, 반복문, DB query, 네트워크 요청, 캐싱, 동시성, 파일 처리, 번들 크기에 영향을 주면 `pgg-performance`를 고려한다.",
    "QA에서 성능 근거가 부족하면 `pgg-performance`를 추천한다."
  ],
  en: [
    "Consider `pgg-performance` when the user mentions performance, speed, optimization, response time, throughput, or memory usage.",
    "Consider `pgg-performance` when the plan defines performance criteria or code/refactor touches large data, loops, DB queries, network calls, caching, concurrency, file processing, or bundle size.",
    "Recommend `pgg-performance` when QA lacks performance evidence."
  ]
};

const COMMON_QA_REQUIREMENTS: LocalizedMarkdown = {
  ko: [
    "TypeScript 정의가 source of truth인지 확인한다.",
    "generated Markdown이 TS 정의에서 생성되었는지 확인한다.",
    "각 Skill이 범용 AI 에이전트에게 실행 가능한 지침인지 확인한다.",
    "모든 flow가 completion message contract와 token accounting을 갖는지 확인한다.",
    "`pgg-performance`와 `pgg-code` task별 commit 규칙, generated docs 안정성, 기술 검증 통과 여부를 확인한다."
  ],
  en: [
    "Verify that TypeScript definitions are the source of truth.",
    "Verify that generated Markdown came from the TS definitions.",
    "Verify that each Skill is executable guidance for general-purpose AI agents.",
    "Verify that every flow has the completion message contract and token accounting.",
    "Verify `pgg-performance`, pgg-code task-level commit rules, generated-doc stability, and technical verification."
  ]
};

const COMMON_GENERATED_DOCUMENTATION_SECTIONS: LocalizedMarkdown = {
  ko: [
    "Skill Definition",
    "Mode-Specific Behavior",
    "Completion Message Contract",
    "Token Accounting",
    "Next Flow Routing",
    "Verification Requirements",
    "QA Requirements"
  ],
  en: [
    "Skill Definition",
    "Mode-Specific Behavior",
    "Completion Message Contract",
    "Token Accounting",
    "Next Flow Routing",
    "Verification Requirements",
    "QA Requirements"
  ]
};

function localizedList(ko: readonly string[], en: readonly string[]): LocalizedMarkdown {
  return { ko, en };
}

const PGG_ADD_MODE_SPECIFIC_BEHAVIOR: PggSkillModeSpecificBehavior = {
  autoOff: localizedList(
    [
      "구현 코드를 한 줄도 작성하지 않는다.",
      "설계 출력, proposal 확정, plan 이동, 코드 작성 전에 먼저 소크라테스식 질문을 한다.",
      "한 번에 최대 5개의 질문만 한다.",
      "질문은 사용자 목표, 최소 동작, 실패 시 동작, 보안 제약, 데이터 저장 필요 여부, 권한 요구사항, 성공 조건, 제외 범위를 드러내야 한다.",
      "단순히 “뭘 만들까요?”라고 묻지 않는다.",
      "설계 문서는 요구사항 수집 결과, 기능 목적, 포함/제외 범위, Acceptance Criteria 초안처럼 작은 단위로 나누어 보여준다.",
      "각 작은 단위의 승인 상태를 기록하고, 승인 전 다음 단위로 넘어가지 않는다.",
      "승인 미완료 또는 요구사항 불충분 상태에서는 completion message의 추천 next flow를 `pgg-add`로 둔다."
    ],
    [
      "Do not write a single line of implementation code.",
      "Ask Socratic questions before producing design output, finalizing a proposal, moving to plan, or writing code.",
      "Ask at most five questions at a time.",
      "Questions must uncover the user goal, minimum behavior, failure behavior, security constraints, data-storage needs, permission requirements, success conditions, and out-of-scope items.",
      "Do not ask only “What should I build?”",
      "Present design documents in small units such as requirement-collection result, feature purpose, in/out scope, and Acceptance Criteria draft.",
      "Record approval state for each small unit and do not move to the next unit before approval.",
      "When approval is incomplete or requirements are insufficient, set the completion message recommended next flow to `pgg-add`."
    ]
  ),
  autoOn: localizedList(
    [
      "가능한 요구사항을 자동 추론한다.",
      "기능 목적을 작성한다.",
      "Acceptance Criteria 초안을 작성한다.",
      "가정, 불확실성, 선택 이유를 반드시 포함한다.",
      "정말 필요한 경우가 아니라면 blocking question을 하지 않는다.",
      "추론이 제품 안전, 보안, 데이터 손실, 외부 비용, 권한 경계에 영향을 주면 blocking question으로 중단한다."
    ],
    [
      "Infer likely requirements automatically.",
      "Write the feature purpose.",
      "Draft Acceptance Criteria.",
      "Always include assumptions, uncertainty, and choice rationale.",
      "Avoid blocking questions unless they are truly required.",
      "Stop for a blocking question when an inference affects product safety, security, data loss, external cost, or permission boundaries."
    ]
  ),
  teamsOff: COMMON_MODE_SPECIFIC_BEHAVIOR.teamsOff,
  teamsOn: COMMON_MODE_SPECIFIC_BEHAVIOR.teamsOn
};

const PGG_ADD_ADDITIONAL_GUIDANCE = [
  {
    title: { ko: "pgg-add 목적", en: "pgg-add Purpose" },
    body: localizedList(
      [
        "`pgg-add`는 요구사항을 발견하고 명세화하는 Skill이다.",
        "`pgg-add`는 코드를 작성하는 Skill이 아니다.",
        "범용 AI 에이전트가 모호한 사용자 요청을 바로 구현하지 않고, 승인 가능한 요구사항 정의 workflow로 전환하도록 가르친다.",
        "필수 단계는 요구 사항 수집, 기능 목적 정의, Acceptance Criteria 초안 작성이다."
      ],
      [
        "`pgg-add` is the Skill for discovering and specifying requirements.",
        "`pgg-add` is not a code-writing Skill.",
        "It teaches general-purpose AI agents to convert vague user requests into an approvable requirement-definition workflow instead of immediately implementing.",
        "The required steps are requirement gathering, feature-purpose definition, and Acceptance Criteria drafting."
      ]
    )
  },
  {
    title: { ko: "코드 작성 금지", en: "Code-Writing Prohibition" },
    body: localizedList(
      [
        "`pgg-add` 실행 중에는 애플리케이션 코드, 테스트 코드, 마이그레이션, 설정 변경을 작성하지 않는다.",
        "허용되는 산출물은 요구사항 발견과 proposal 단계 문서, 사용자 질문 기록, approval 상태, token accounting 기록으로 제한한다.",
        "구현이 필요하다고 판단되면 completion message에서 `pgg-plan` 또는 `pgg-add`로 routing만 남기고 구현은 후속 flow에 맡긴다."
      ],
      [
        "During `pgg-add`, do not write application code, test code, migrations, or configuration changes.",
        "Allowed artifacts are limited to requirement discovery, proposal-stage documents, user-question records, approval state, and token-accounting records.",
        "When implementation is needed, only route to `pgg-plan` or `pgg-add` in the completion message and leave implementation to later flows."
      ]
    )
  },
  {
    title: { ko: "auto off 동작", en: "auto off Behavior" },
    body: localizedList(
      [
        "모호한 요청을 받으면 구현하지 않고 먼저 최대 5개의 소크라테스식 질문을 한다.",
        "질문은 사용자 목표, 최소 동작, 실패 시 동작, 보안/권한/데이터 저장 제약, 성공 조건, 제외 범위 중 아직 드러나지 않은 항목을 우선한다.",
        "설계 출력은 작은 단위로 제시하고, 각 단위마다 승인 또는 수정 요청을 받은 뒤 다음 단위로 이동한다.",
        "승인되지 않은 단위가 있거나 요구사항이 불충분하면 completion message의 마지막 문장을 `다음 flow를 실행하세요: pgg-add`로 끝낸다."
      ],
      [
        "For vague requests, do not implement; first ask at most five Socratic questions.",
        "Prioritize questions that uncover missing user goals, minimum behavior, failure behavior, security/permission/data-storage constraints, success conditions, and out-of-scope items.",
        "Present design output in small units and move forward only after each unit is approved or corrected.",
        "If any unit is unapproved or requirements are insufficient, end the completion message with `다음 flow를 실행하세요: pgg-add`."
      ]
    )
  },
  {
    title: { ko: "auto on 동작", en: "auto on Behavior" },
    body: localizedList(
      [
        "가능한 요구사항을 자동 추론하되 가정, 불확실성, 선택 이유를 명시한다.",
        "blocking question은 제품 안전, 보안, 데이터 손실, 외부 비용, 권한 경계처럼 잘못 추론하면 위험한 경우로 제한한다.",
        "추론한 요구사항도 포함 범위, 제외 범위, 리스크, Acceptance Criteria 초안으로 구조화한다."
      ],
      [
        "Infer likely requirements while explicitly recording assumptions, uncertainty, and choice rationale.",
        "Limit blocking questions to cases where a wrong inference could affect product safety, security, data loss, external cost, or permission boundaries.",
        "Structure inferred requirements into in scope, out of scope, risks, and Acceptance Criteria draft."
      ]
    )
  },
  {
    title: { ko: "소크라테스식 질문", en: "Socratic Questions" },
    body: localizedList(
      [
        "모호한 요청을 받으면 먼저 숨겨진 요구사항과 제약 조건을 끌어내는 질문을 한다.",
        "필수 질문 예시는 “이 기능의 최소 동작은 무엇인가요?”, “실패했을 때 사용자에게 어떤 일이 발생해야 하나요?”, “이 기능이 절대 하면 안 되는 행동은 무엇인가요?”, “어떤 데이터 저장, 인증, 권한, 보안 요구사항이 있나요?”, “성공 여부를 무엇으로 판단해야 하나요?”이다.",
        "질문 답변은 사용자 질문 기록과 요구사항 수집 결과에 분리해서 남긴다."
      ],
      [
        "For vague requests, first ask questions that expose hidden requirements and constraints.",
        "Required example questions are “What is the minimum behavior for this feature?”, “What should happen to the user when it fails?”, “What must this feature never do?”, “What data storage, authentication, permission, or security requirements exist?”, and “How should success be judged?”",
        "Keep question answers separate from the requirement-collection result in the user-question record."
      ]
    )
  },
  {
    title: { ko: "승인 게이트", en: "Approval Gate" },
    body: localizedList(
      [
        "auto off에서는 사용자 승인 없이 다음 단계로 진행하지 않는다.",
        "auto off에서는 설계 출력이나 코드 작성 전에 반드시 질문한다.",
        "설계 문서는 작은 단위로 나누어 사용자에게 보여주고 각 작은 단위마다 `approved | changes-requested | pending` 중 하나로 승인 상태를 기록한다.",
        "승인되지 않은 단위가 있으면 `pgg-plan`으로 routing하지 않는다."
      ],
      [
        "In auto off, do not advance to the next stage without user approval.",
        "In auto off, ask before design output or code writing.",
        "Split design documents into small units for the user and record each unit as `approved | changes-requested | pending`.",
        "Do not route to `pgg-plan` while any unit is unapproved."
      ]
    )
  },
  {
    title: { ko: "필수 출력 섹션", en: "Required Output Sections" },
    body: localizedList(
      [
        "산출물에는 요구사항 수집 결과, 기능 목적, 포함 범위, 제외 범위, 가정, 리스크, Acceptance Criteria 초안, 승인 상태를 포함한다.",
        "승인 상태는 전체 상태와 작은 단위별 상태를 모두 포함한다.",
        "성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량 요구가 언급되면 성능 요구사항으로 기록하고 이후 `pgg-plan` 또는 `pgg-code`에서 `pgg-performance` 실행 필요성을 판단할 수 있게 표시한다."
      ],
      [
        "Outputs include requirement-collection results, feature purpose, in scope, out of scope, assumptions, risks, Acceptance Criteria draft, and approval state.",
        "Approval state includes both the overall state and per-small-unit state.",
        "When performance, speed, optimization, response time, throughput, or memory-use requirements are mentioned, record them as performance requirements and mark them so `pgg-plan` or `pgg-code` can decide whether `pgg-performance` is required."
      ]
    )
  },
  {
    title: { ko: "Acceptance Criteria 초안 작성 규칙", en: "Acceptance Criteria Drafting Rules" },
    body: localizedList(
      [
        "Acceptance Criteria는 구현 방법이 아니라 관찰 가능한 사용자/시스템 동작으로 작성한다.",
        "최소 성공 동작, 실패 시 동작, 권한/보안 제약, 데이터 저장 여부, 제외 범위 위반 방지를 포함한다.",
        "불확실한 기준은 확정값처럼 쓰지 않고 가정 또는 불확실성으로 표시한다."
      ],
      [
        "Write Acceptance Criteria as observable user or system behavior, not implementation method.",
        "Include minimum successful behavior, failure behavior, permission/security constraints, data-storage expectations, and prevention of out-of-scope behavior.",
        "Mark uncertain criteria as assumptions or uncertainty instead of writing them as confirmed facts."
      ]
    )
  },
  {
    title: { ko: "Completion Message Routing", en: "Completion Message Routing" },
    body: localizedList(
      [
        "정상 완료 시 추천 next flow는 `pgg-plan`이다.",
        "요구사항 불충분 또는 승인 미완료 시 추천 next flow는 `pgg-add`이다.",
        "마지막 문장은 반드시 `다음 flow를 실행하세요: pgg-plan` 또는 `다음 flow를 실행하세요: pgg-add` 중 하나여야 한다."
      ],
      [
        "On normal completion, the recommended next flow is `pgg-plan`.",
        "When requirements are insufficient or approval is incomplete, the recommended next flow is `pgg-add`.",
        "The final sentence must be exactly either `다음 flow를 실행하세요: pgg-plan` or `다음 flow를 실행하세요: pgg-add`."
      ]
    )
  }
] as const satisfies readonly PggSkillGuidanceSection[];

export const PGG_SKILL_DEFINITIONS = [
  {
    id: "pgg-add",
    name: { ko: "pgg-add", en: "pgg-add" },
    purpose: {
      ko: "요구사항을 발견하고 명세화해 구현 전 승인 가능한 요구사항 정의와 Acceptance Criteria 초안을 만든다.",
      en: "Discover and specify requirements to produce an approvable pre-implementation requirement definition and Acceptance Criteria draft."
    },
    targetAgent: { ko: "제품/요구사항 정리 에이전트", en: "Product and requirements agent" },
    triggerConditions: localizedList(
      [
        "새 요구사항, 새 topic, 또는 기존 topic의 scope 재정의가 필요할 때 실행한다.",
        "“로그인 만들어줘”, “결제 기능 추가해줘”, “대시보드 만들어줘”처럼 모호한 구현 요청도 먼저 요구사항 발견 대상으로 처리한다."
      ],
      [
        "Run for a new requirement, a new topic, or when an existing topic needs scope reframing.",
        "Treat vague implementation requests such as “build login”, “add payments”, or “make a dashboard” as requirement-discovery work first."
      ]
    ),
    inputs: localizedList(["사용자 요청", "기존 코드베이스 context", "제약 조건"], ["User request", "Existing codebase context", "Constraints"]),
    outputs: localizedList(
      [
        "proposal.md",
        "proposal review",
        "state/current.md",
        "요구사항 수집 결과",
        "기능 목적",
        "포함 범위",
        "제외 범위",
        "가정",
        "리스크",
        "Acceptance Criteria 초안",
        "승인 상태"
      ],
      [
        "proposal.md",
        "proposal review",
        "state/current.md",
        "Requirement-collection results",
        "Feature purpose",
        "In scope",
        "Out of scope",
        "Assumptions",
        "Risks",
        "Acceptance Criteria draft",
        "Approval state"
      ]
    ),
    absoluteRules: localizedList(
      [
        "pgg-add 단계에서는 구현 코드를 작성하면 안 된다.",
        "요구사항 발견과 명세화 외의 구현 산출물을 만들지 않는다.",
        "불명확한 요구사항은 승인 없이 확정하지 않는다.",
        "auto off에서는 사용자 승인 없이 다음 단계로 진행하면 안 된다.",
        "auto off에서는 설계 출력이나 코드 작성 전에 반드시 질문해야 한다.",
        "단순히 “뭘 만들까요?”라고 묻는 것은 금지한다.",
        "프로젝트별 구현 세부에 과적합하지 않는다."
      ],
      [
        "Do not write implementation code during `pgg-add`.",
        "Do not create implementation artifacts outside requirement discovery and specification.",
        "Do not finalize unclear requirements without approval.",
        "In auto off, do not advance to the next step without user approval.",
        "In auto off, ask before design output or code writing.",
        "Do not merely ask “What should I build?”",
        "Do not overfit to project-specific implementation details."
      ]
    ),
    antiPatterns: localizedList(
      [
        "질문 없이 scope를 넓히기",
        "proposal 없이 plan/code로 이동하기",
        "auto off에서 승인 없이 설계 단위를 확정하기",
        "요구사항 발견 단계에서 구현 코드 작성하기",
        "성공 조건, 실패 조건, 보안/권한 제약 없이 Acceptance Criteria 작성하기"
      ],
      [
        "Expanding scope without asking",
        "Moving to plan/code without a proposal",
        "Finalizing a design unit without approval in auto off",
        "Writing implementation code during requirement discovery",
        "Writing Acceptance Criteria without success conditions, failure conditions, or security/permission constraints"
      ]
    ),
    modeSpecificBehavior: PGG_ADD_MODE_SPECIFIC_BEHAVIOR,
    additionalGuidance: PGG_ADD_ADDITIONAL_GUIDANCE,
    requiredPhases: localizedList(
      [
        "1. 요구 사항 수집: 사용자 목표, 최소 동작, 실패 시 동작, 보안/권한/데이터 제약, 성공 조건, 제외 범위를 수집한다.",
        "2. 기능 목적 정의: 기능이 해결할 문제와 사용자/시스템 관점의 목적을 한 단위로 정리한다.",
        "3. Acceptance Criteria 초안 작성: 구현 방법이 아니라 관찰 가능한 동작과 승인 상태를 작성한다."
      ],
      [
        "1. Gather requirements: collect user goals, minimum behavior, failure behavior, security/permission/data constraints, success conditions, and out-of-scope items.",
        "2. Define the feature purpose: summarize the problem and purpose from the user/system perspective as one unit.",
        "3. Draft Acceptance Criteria: write observable behavior and approval state, not implementation method."
      ]
    ),
    approvalGates: localizedList(
      [
        "auto off에서는 proposal 승인 전 `pgg-plan`으로 이동하지 않는다.",
        "auto off에서는 작은 설계 단위별 승인을 받은 뒤 다음 단위로 넘어간다.",
        "승인 상태가 미완료이면 completion message에서 `다음 flow를 실행하세요: pgg-add`로 routing한다."
      ],
      [
        "In auto off, do not move to `pgg-plan` before proposal approval.",
        "In auto off, advance design one small approved unit at a time.",
        "When approval is incomplete, route with `다음 flow를 실행하세요: pgg-add` in the completion message."
      ]
    ),
    verificationRequirements: COMMON_VERIFICATION_REQUIREMENTS,
    reviewRequirements: localizedList(
      [
        "proposal review는 문제 정의, 범위, 성공 기준을 검토한다.",
        "Socratic 질문이 사용자 목표, 최소 동작, 실패 시 동작, 보안/권한/데이터 제약, 성공 조건, 제외 범위를 충분히 드러냈는지 확인한다.",
        "Acceptance Criteria 초안이 관찰 가능한 동작과 승인 상태를 포함하는지 확인한다."
      ],
      [
        "Proposal review checks problem framing, scope, and success criteria.",
        "Verify that Socratic questions sufficiently exposed the user goal, minimum behavior, failure behavior, security/permission/data constraints, success conditions, and out-of-scope items.",
        "Verify that the Acceptance Criteria draft contains observable behavior and approval state."
      ]
    ),
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    nextFlowRouting: localizedList(
      ["정상 완료: `pgg-add` -> `pgg-plan`", "요구사항 불충분 또는 승인 미완료: `pgg-add` -> `pgg-add`"],
      ["Normal completion: `pgg-add` -> `pgg-plan`", "Insufficient requirements or incomplete approval: `pgg-add` -> `pgg-add`"]
    ),
    performanceTriggerGuidance: localizedList(
      [
        "사용자가 성능, 속도, 최적화, 응답 시간, 처리량, 메모리 사용량을 요구사항으로 언급하면 성능 요구사항으로 기록한다.",
        "성능 요구사항은 이후 `pgg-plan` 또는 `pgg-code` 단계에서 `pgg-performance` 실행 필요성을 판단할 수 있도록 표시한다.",
        ...COMMON_PERFORMANCE_TRIGGER_GUIDANCE.ko
      ],
      [
        "When the user mentions performance, speed, optimization, response time, throughput, or memory use as a requirement, record it as a performance requirement.",
        "Mark performance requirements so later `pgg-plan` or `pgg-code` can decide whether `pgg-performance` is required.",
        ...COMMON_PERFORMANCE_TRIGGER_GUIDANCE.en
      ]
    ),
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: localizedList(
      [
        "pgg-add 목적",
        "코드 작성 금지",
        "auto off 동작",
        "auto on 동작",
        "소크라테스식 질문",
        "승인 게이트",
        "필수 출력 섹션",
        "Acceptance Criteria 초안 작성 규칙",
        "completion message 규격",
        "token accounting 규칙",
        "next flow routing",
        ...COMMON_GENERATED_DOCUMENTATION_SECTIONS.ko
      ],
      [
        "pgg-add purpose",
        "code-writing prohibition",
        "auto off behavior",
        "auto on behavior",
        "Socratic questions",
        "approval gate",
        "required output sections",
        "Acceptance Criteria draft rules",
        "completion message contract",
        "token accounting rules",
        "next flow routing",
        ...COMMON_GENERATED_DOCUMENTATION_SECTIONS.en
      ]
    )
  },
  {
    id: "pgg-plan",
    name: { ko: "pgg-plan", en: "pgg-plan" },
    purpose: { ko: "승인된 proposal을 실행 가능한 plan, task, spec으로 전개한다.", en: "Turn an approved proposal into executable plan, task, and spec documents." },
    targetAgent: { ko: "설계/계획 에이전트", en: "Architecture and planning agent" },
    triggerConditions: localizedList(["proposal이 승인되고 구현 전 계획이 필요할 때 실행한다."], ["Run after proposal approval when implementation planning is needed."]),
    inputs: localizedList(["proposal.md", "proposal review", "state/current.md"], ["proposal.md", "proposal review", "state/current.md"]),
    outputs: localizedList(["plan.md", "task.md", "spec/*/*.md", "plan/task reviews"], ["plan.md", "task.md", "spec/*/*.md", "plan/task reviews"]),
    absoluteRules: localizedList(["구현하지 않는다.", "spec 없는 task를 만들지 않는다."], ["Do not implement.", "Do not create tasks without specs."]),
    antiPatterns: localizedList(["구현 세부를 task 없이 바로 수정하기", "성공 기준 없는 task 작성"], ["Editing implementation details without tasks", "Writing tasks without success criteria"]),
    modeSpecificBehavior: COMMON_MODE_SPECIFIC_BEHAVIOR,
    requiredPhases: localizedList(["설계", "task 분해", "spec 작성", "review"], ["Design", "Task decomposition", "Spec writing", "Review"]),
    approvalGates: localizedList(["auto off에서는 task/spec 승인 전 `pgg-code`로 이동하지 않는다."], ["In auto off, do not move to `pgg-code` before task/spec approval."]),
    verificationRequirements: COMMON_VERIFICATION_REQUIREMENTS,
    reviewRequirements: localizedList(["plan review와 task review를 분리한다."], ["Keep plan review and task review separate."]),
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    nextFlowRouting: localizedList(["기본 routing: `pgg-plan` -> `pgg-code`"], ["Default routing: `pgg-plan` -> `pgg-code`"]),
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: COMMON_GENERATED_DOCUMENTATION_SECTIONS
  },
  {
    id: "pgg-code",
    name: { ko: "pgg-code", en: "pgg-code" },
    purpose: { ko: "승인된 task/spec에 따라 코드를 구현하고 변경 증거를 남긴다.", en: "Implement approved tasks/specs and record change evidence." },
    targetAgent: { ko: "구현 에이전트", en: "Implementation agent" },
    triggerConditions: localizedList(["plan/task/spec가 준비되고 구현이 필요할 때 실행한다."], ["Run when plan/task/spec are ready and implementation is needed."]),
    inputs: localizedList(["plan.md", "task.md", "spec/*/*.md", "state/current.md"], ["plan.md", "task.md", "spec/*/*.md", "state/current.md"]),
    outputs: localizedList(["코드 변경", "implementation/index.md", "code review", "diff metadata"], ["Code changes", "implementation/index.md", "code review", "diff metadata"]),
    absoluteRules: localizedList(["승인되지 않은 scope를 구현하지 않는다.", "task별 commit 규칙을 유지한다."], ["Do not implement unapproved scope.", "Preserve task-level commit rules."]),
    antiPatterns: localizedList(["task 외 변경 섞기", "검증 없는 완료 처리"], ["Mixing unrelated changes into a task", "Marking completion without verification"]),
    modeSpecificBehavior: COMMON_MODE_SPECIFIC_BEHAVIOR,
    requiredPhases: localizedList(["구현", "diff inspection", "test/update", "code review"], ["Implementation", "Diff inspection", "Test/update", "Code review"]),
    approvalGates: localizedList(["auto off에서는 구현 전 task 승인 여부를 확인한다."], ["In auto off, confirm task approval before implementation."]),
    verificationRequirements: COMMON_VERIFICATION_REQUIREMENTS,
    reviewRequirements: localizedList(["code review는 정확성, 회귀, 테스트 누락, 유지보수 위험을 우선한다."], ["Code review prioritizes correctness, regressions, missing tests, and maintainability risk."]),
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    nextFlowRouting: localizedList(["기본 routing: `pgg-code` -> `pgg-performance` | `pgg-refactor` | `pgg-qa` | `pgg-code`"], ["Default routing: `pgg-code` -> `pgg-performance` | `pgg-refactor` | `pgg-qa` | `pgg-code`"]),
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: COMMON_GENERATED_DOCUMENTATION_SECTIONS
  },
  {
    id: "pgg-refactor",
    name: { ko: "pgg-refactor", en: "pgg-refactor" },
    purpose: { ko: "구현 후 구조를 개선하고 레거시/중복을 제거한다.", en: "Improve structure after implementation and remove legacy or duplicated code." },
    targetAgent: { ko: "리팩터링 에이전트", en: "Refactoring agent" },
    triggerConditions: localizedList(["구현 후 구조 개선, 중복 제거, 레거시 제거가 필요할 때 실행한다."], ["Run after implementation when structure cleanup, duplication removal, or legacy removal is needed."]),
    inputs: localizedList(["implementation/index.md", "code review", "diff metadata"], ["implementation/index.md", "code review", "diff metadata"]),
    outputs: localizedList(["refactor 변경", "refactor review", "updated implementation evidence"], ["Refactor changes", "refactor review", "updated implementation evidence"]),
    absoluteRules: localizedList(["제품 scope를 넓히지 않는다.", "대체 근거 없이 코드를 제거하지 않는다."], ["Do not widen product scope.", "Do not remove code without replacement or removal evidence."]),
    antiPatterns: localizedList(["동작 변경을 리팩터링으로 숨기기", "검증 없이 dead code로 판단하기"], ["Hiding behavior changes as refactor", "Calling code dead without verification"]),
    modeSpecificBehavior: COMMON_MODE_SPECIFIC_BEHAVIOR,
    requiredPhases: localizedList(["구조 분석", "리팩터링", "회귀 검증", "refactor review"], ["Structure analysis", "Refactor", "Regression verification", "Refactor review"]),
    approvalGates: localizedList(["auto off에서는 refactor 범위 승인 전 변경하지 않는다."], ["In auto off, do not change code before refactor scope approval."]),
    verificationRequirements: COMMON_VERIFICATION_REQUIREMENTS,
    reviewRequirements: localizedList(["refactor review는 회귀 위험과 제거 근거를 검토한다."], ["Refactor review checks regression risk and removal evidence."]),
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    nextFlowRouting: localizedList(["기본 routing: `pgg-refactor` -> `pgg-performance` | `pgg-qa`"], ["Default routing: `pgg-refactor` -> `pgg-performance` | `pgg-qa`"]),
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: COMMON_GENERATED_DOCUMENTATION_SECTIONS
  },
  {
    id: "pgg-performance",
    name: { ko: "pgg-performance", en: "pgg-performance" },
    purpose: { ko: "성능 민감 변경의 측정 기준, 실행 결과, 제외 근거를 기록한다.", en: "Record measurement criteria, results, and exclusions for performance-sensitive changes." },
    targetAgent: { ko: "성능 검증 에이전트", en: "Performance verification agent" },
    triggerConditions: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    inputs: localizedList(["plan/task/spec", "implementation evidence", "declared verification command"], ["plan/task/spec", "implementation evidence", "declared verification command"]),
    outputs: localizedList(["performance/report.md", "baseline/target/actual result", "exclusion evidence"], ["performance/report.md", "baseline/target/actual result", "exclusion evidence"]),
    absoluteRules: localizedList(["숫자를 지어내지 않는다.", "측정 불가 항목은 제외 근거를 남긴다."], ["Do not invent numbers.", "Record exclusion evidence for unmeasurable items."]),
    antiPatterns: localizedList(["근거 없는 최적화 주장", "baseline 없이 개선율 보고"], ["Unsupported optimization claims", "Reporting improvement percentage without a baseline"]),
    modeSpecificBehavior: COMMON_MODE_SPECIFIC_BEHAVIOR,
    requiredPhases: localizedList(["applicability 판단", "baseline 확인", "측정 실행", "결과 비교"], ["Applicability decision", "Baseline check", "Measurement execution", "Result comparison"]),
    approvalGates: localizedList(["auto off에서는 측정 범위와 명령 승인 전 실행하지 않는다."], ["In auto off, do not run measurement before scope and command approval."]),
    verificationRequirements: COMMON_VERIFICATION_REQUIREMENTS,
    reviewRequirements: localizedList(["performance review는 측정 방법, 재현성, 운영 위험을 검토한다."], ["Performance review checks method, reproducibility, and operational risk."]),
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    nextFlowRouting: localizedList(["기본 routing: `pgg-performance` -> `pgg-code` | `pgg-refactor` | `pgg-qa`"], ["Default routing: `pgg-performance` -> `pgg-code` | `pgg-refactor` | `pgg-qa`"]),
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: COMMON_GENERATED_DOCUMENTATION_SECTIONS
  },
  {
    id: "pgg-qa",
    name: { ko: "pgg-qa", en: "pgg-qa" },
    purpose: { ko: "전체 flow 결과를 검증하고 pass/fail/archive readiness를 판정한다.", en: "Verify the full flow result and decide pass/fail/archive readiness." },
    targetAgent: { ko: "QA 검증 에이전트", en: "QA verification agent" },
    triggerConditions: localizedList(["구현, refactor, 필요한 performance evidence가 준비된 뒤 실행한다."], ["Run after implementation, refactor, and required performance evidence are ready."]),
    inputs: localizedList(["all stage artifacts", "reviews", "verification evidence", "token records"], ["all stage artifacts", "reviews", "verification evidence", "token records"]),
    outputs: localizedList(["qa/report.md", "final decision", "archive or return routing"], ["qa/report.md", "final decision", "archive or return routing"]),
    absoluteRules: localizedList(["실패한 topic을 archive하지 않는다.", "generated Markdown 직접 수정 여부를 확인한다."], ["Do not archive failing topics.", "Check whether generated Markdown was manually edited."]),
    antiPatterns: localizedList(["검증 실패를 pass로 처리", "성능 근거 부족을 무시"], ["Treating failed verification as pass", "Ignoring missing performance evidence"]),
    modeSpecificBehavior: COMMON_MODE_SPECIFIC_BEHAVIOR,
    requiredPhases: localizedList(["artifact completeness", "technical verification", "review validation", "final decision"], ["Artifact completeness", "Technical verification", "Review validation", "Final decision"]),
    approvalGates: localizedList(["QA fail 또는 blocked면 archive하지 않고 실패한 flow로 routing한다."], ["On QA fail or blocked, do not archive and route back to the failed flow."]),
    verificationRequirements: COMMON_VERIFICATION_REQUIREMENTS,
    reviewRequirements: localizedList(["QA review는 source-of-truth, generated docs, completion contract, token accounting을 확인한다."], ["QA review checks source of truth, generated docs, completion contract, and token accounting."]),
    completionMessageContract: COMMON_COMPLETION_MESSAGE_CONTRACT,
    tokenAccountingRequirements: COMMON_TOKEN_ACCOUNTING_REQUIREMENTS,
    nextFlowRouting: localizedList(["기본 routing: `pgg-qa` -> `pgg-add` | 실패한 flow-id"], ["Default routing: `pgg-qa` -> `pgg-add` | failed flow id"]),
    performanceTriggerGuidance: COMMON_PERFORMANCE_TRIGGER_GUIDANCE,
    qaRequirements: COMMON_QA_REQUIREMENTS,
    generatedDocumentationSections: COMMON_GENERATED_DOCUMENTATION_SECTIONS
  }
] as const satisfies readonly PggSkillDefinition[];

export const PGG_SKILL_DEFINITION_BY_ID = Object.fromEntries(
  PGG_SKILL_DEFINITIONS.flatMap((definition: PggSkillDefinition) => [
    [definition.id, definition],
    ...(definition.legacyAliases ?? []).map((alias: LegacyCompatibilitySkillName) => [alias, definition] as const)
  ])
) as Record<PggSkillDefinition["id"] | LegacyCompatibilitySkillName, PggSkillDefinition>;
