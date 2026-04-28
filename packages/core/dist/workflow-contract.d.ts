export declare const CORE_WORKFLOW_SKILLS: readonly ["pgg-add", "pgg-plan", "pgg-code", "pgg-refactor", "pgg-qa"];
export declare const OPTIONAL_AUDIT_SKILLS: readonly ["pgg-token", "pgg-performance"];
export declare const CANONICAL_OPTIONAL_AUDIT_SKILLS: readonly ["pgg-token", "pgg-performance"];
export declare const LEGACY_COMPATIBILITY_SKILLS: readonly [];
export type LegacyCompatibilitySkillName = (typeof LEGACY_COMPATIBILITY_SKILLS)[number];
export declare const WORKFLOW_SKILLS: readonly ["pgg-add", "pgg-plan", "pgg-code", "pgg-refactor", "pgg-qa", "pgg-token", "pgg-performance"];
export type WorkflowSkillName = (typeof WORKFLOW_SKILLS)[number];
export declare const STANDALONE_SKILLS: readonly ["pgg-status", "pgg-verify"];
export type StandaloneSkillName = (typeof STANDALONE_SKILLS)[number];
export declare const GENERATED_SKILLS: readonly ["pgg-add", "pgg-plan", "pgg-code", "pgg-refactor", "pgg-qa", "pgg-token", "pgg-performance", "pgg-status", "pgg-verify"];
export type GeneratedSkillName = WorkflowSkillName | LegacyCompatibilitySkillName | StandaloneSkillName;
export declare const WORKFLOW_FRONTMATTER_STAGES = "proposal | plan | task | implementation | refactor | token | performance | qa";
export declare const WORKFLOW_FRONTMATTER_SKILLS: string;
export declare const README_WORKFLOW_STAGE_SUMMARIES_KO: readonly ["1. `pgg-add`: proposal, 사용자 질문 기록, 전문가 attribution review 생성", "2. `pgg-plan`: plan, task, spec, plan/task review 생성", "3. `pgg-code`: 구현과 diff, code review 기록", "4. `pgg-refactor`: 레거시 제거와 구조 개선, refactor review 기록", "5. `pgg-qa`: `qa/report.md` 검증과 archive 판정"];
export declare const README_WORKFLOW_STAGE_SUMMARIES_EN: readonly ["1. `pgg-add`: create the proposal, the user-question record, and the attributed proposal review", "2. `pgg-plan`: create the plan, task, spec, and plan/task reviews", "3. `pgg-code`: implement the change and record diffs plus the code review", "4. `pgg-refactor`: remove legacy code, improve structure, and record the refactor review", "5. `pgg-qa`: validate `qa/report.md` and decide archive readiness"];
export declare const README_OPTIONAL_AUDIT_SUMMARIES_KO: readonly ["- `pgg-token`: workflow 자산, handoff, helper, generated 문서의 token 비용을 점검할 때만 실행하고, 실제 실행 evidence가 있을 때만 dashboard에 표시하는 optional audit", "- `pgg-performance`: 성능 민감 변경이나 선언된 verification contract가 있을 때만 실행하고, 실제 실행 evidence가 있을 때만 dashboard에 표시하는 optional audit"];
export declare const README_OPTIONAL_AUDIT_SUMMARIES_EN: readonly ["- `pgg-token`: an optional audit used only when workflow assets, handoff, helpers, or generated docs need token-cost review, and shown in the dashboard only when execution evidence exists", "- `pgg-performance`: an optional audit used only when the topic has performance-sensitive changes or a declared verification contract, and shown in the dashboard only when execution evidence exists"];
export declare const MANDATORY_IMPLEMENTATION_CRITERIA_KO: readonly ["중복 제거", "단일 책임", "가독성", "추상화", "일관성", "테스트에 좋은 코드", "예외 처리 필수", "작은 단위 처리", "의존성 관리", "확장성", "네이밍"];
export declare const MANDATORY_IMPLEMENTATION_CRITERIA_EN: readonly ["remove duplication", "keep single responsibility", "optimize readability", "use clear abstraction boundaries", "preserve consistency", "keep the code test-friendly", "handle exceptions explicitly", "prefer small units with one purpose", "keep dependencies loosely coupled", "preserve extensibility under OCP", "use names that make responsibilities obvious"];
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
export declare const PGG_SKILL_DEFINITIONS: readonly [{
    readonly id: "pgg-add";
    readonly name: {
        readonly ko: "pgg-add";
        readonly en: "pgg-add";
    };
    readonly purpose: {
        readonly ko: "요구사항을 발견하고 명세화해 구현 전 승인 가능한 요구사항 정의와 Acceptance Criteria 초안을 만든다.";
        readonly en: "Discover and specify requirements to produce an approvable pre-implementation requirement definition and Acceptance Criteria draft.";
    };
    readonly targetAgent: {
        readonly ko: "제품/요구사항 정리 에이전트";
        readonly en: "Product and requirements agent";
    };
    readonly triggerConditions: LocalizedMarkdown;
    readonly inputs: LocalizedMarkdown;
    readonly outputs: LocalizedMarkdown;
    readonly absoluteRules: LocalizedMarkdown;
    readonly antiPatterns: LocalizedMarkdown;
    readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
    readonly additionalGuidance: readonly [{
        readonly title: {
            readonly ko: "pgg-add 목적";
            readonly en: "pgg-add Purpose";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "코드 작성 금지";
            readonly en: "Code-Writing Prohibition";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "auto off 동작";
            readonly en: "auto off Behavior";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "auto on 동작";
            readonly en: "auto on Behavior";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "소크라테스식 질문";
            readonly en: "Socratic Questions";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "승인 게이트";
            readonly en: "Approval Gate";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "필수 출력 섹션";
            readonly en: "Required Output Sections";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "Acceptance Criteria 초안 작성 규칙";
            readonly en: "Acceptance Criteria Drafting Rules";
        };
        readonly body: LocalizedMarkdown;
    }, {
        readonly title: {
            readonly ko: "Completion Message Routing";
            readonly en: "Completion Message Routing";
        };
        readonly body: LocalizedMarkdown;
    }];
    readonly requiredPhases: LocalizedMarkdown;
    readonly approvalGates: LocalizedMarkdown;
    readonly verificationRequirements: LocalizedMarkdown;
    readonly reviewRequirements: LocalizedMarkdown;
    readonly completionMessageContract: LocalizedMarkdown;
    readonly tokenAccountingRequirements: LocalizedMarkdown;
    readonly nextFlowRouting: LocalizedMarkdown;
    readonly performanceTriggerGuidance: LocalizedMarkdown;
    readonly qaRequirements: LocalizedMarkdown;
    readonly generatedDocumentationSections: LocalizedMarkdown;
}, {
    readonly id: "pgg-plan";
    readonly name: {
        readonly ko: "pgg-plan";
        readonly en: "pgg-plan";
    };
    readonly purpose: {
        readonly ko: "승인된 proposal을 실행 가능한 plan, task, spec으로 전개한다.";
        readonly en: "Turn an approved proposal into executable plan, task, and spec documents.";
    };
    readonly targetAgent: {
        readonly ko: "설계/계획 에이전트";
        readonly en: "Architecture and planning agent";
    };
    readonly triggerConditions: LocalizedMarkdown;
    readonly inputs: LocalizedMarkdown;
    readonly outputs: LocalizedMarkdown;
    readonly absoluteRules: LocalizedMarkdown;
    readonly antiPatterns: LocalizedMarkdown;
    readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
    readonly requiredPhases: LocalizedMarkdown;
    readonly approvalGates: LocalizedMarkdown;
    readonly verificationRequirements: LocalizedMarkdown;
    readonly reviewRequirements: LocalizedMarkdown;
    readonly completionMessageContract: LocalizedMarkdown;
    readonly tokenAccountingRequirements: LocalizedMarkdown;
    readonly nextFlowRouting: LocalizedMarkdown;
    readonly performanceTriggerGuidance: LocalizedMarkdown;
    readonly qaRequirements: LocalizedMarkdown;
    readonly generatedDocumentationSections: LocalizedMarkdown;
}, {
    readonly id: "pgg-code";
    readonly name: {
        readonly ko: "pgg-code";
        readonly en: "pgg-code";
    };
    readonly purpose: {
        readonly ko: "승인된 task/spec에 따라 코드를 구현하고 변경 증거를 남긴다.";
        readonly en: "Implement approved tasks/specs and record change evidence.";
    };
    readonly targetAgent: {
        readonly ko: "구현 에이전트";
        readonly en: "Implementation agent";
    };
    readonly triggerConditions: LocalizedMarkdown;
    readonly inputs: LocalizedMarkdown;
    readonly outputs: LocalizedMarkdown;
    readonly absoluteRules: LocalizedMarkdown;
    readonly antiPatterns: LocalizedMarkdown;
    readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
    readonly requiredPhases: LocalizedMarkdown;
    readonly approvalGates: LocalizedMarkdown;
    readonly verificationRequirements: LocalizedMarkdown;
    readonly reviewRequirements: LocalizedMarkdown;
    readonly completionMessageContract: LocalizedMarkdown;
    readonly tokenAccountingRequirements: LocalizedMarkdown;
    readonly nextFlowRouting: LocalizedMarkdown;
    readonly performanceTriggerGuidance: LocalizedMarkdown;
    readonly qaRequirements: LocalizedMarkdown;
    readonly generatedDocumentationSections: LocalizedMarkdown;
}, {
    readonly id: "pgg-refactor";
    readonly name: {
        readonly ko: "pgg-refactor";
        readonly en: "pgg-refactor";
    };
    readonly purpose: {
        readonly ko: "구현 후 구조를 개선하고 레거시/중복을 제거한다.";
        readonly en: "Improve structure after implementation and remove legacy or duplicated code.";
    };
    readonly targetAgent: {
        readonly ko: "리팩터링 에이전트";
        readonly en: "Refactoring agent";
    };
    readonly triggerConditions: LocalizedMarkdown;
    readonly inputs: LocalizedMarkdown;
    readonly outputs: LocalizedMarkdown;
    readonly absoluteRules: LocalizedMarkdown;
    readonly antiPatterns: LocalizedMarkdown;
    readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
    readonly requiredPhases: LocalizedMarkdown;
    readonly approvalGates: LocalizedMarkdown;
    readonly verificationRequirements: LocalizedMarkdown;
    readonly reviewRequirements: LocalizedMarkdown;
    readonly completionMessageContract: LocalizedMarkdown;
    readonly tokenAccountingRequirements: LocalizedMarkdown;
    readonly nextFlowRouting: LocalizedMarkdown;
    readonly performanceTriggerGuidance: LocalizedMarkdown;
    readonly qaRequirements: LocalizedMarkdown;
    readonly generatedDocumentationSections: LocalizedMarkdown;
}, {
    readonly id: "pgg-performance";
    readonly name: {
        readonly ko: "pgg-performance";
        readonly en: "pgg-performance";
    };
    readonly purpose: {
        readonly ko: "성능 민감 변경의 측정 기준, 실행 결과, 제외 근거를 기록한다.";
        readonly en: "Record measurement criteria, results, and exclusions for performance-sensitive changes.";
    };
    readonly targetAgent: {
        readonly ko: "성능 검증 에이전트";
        readonly en: "Performance verification agent";
    };
    readonly triggerConditions: LocalizedMarkdown;
    readonly inputs: LocalizedMarkdown;
    readonly outputs: LocalizedMarkdown;
    readonly absoluteRules: LocalizedMarkdown;
    readonly antiPatterns: LocalizedMarkdown;
    readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
    readonly requiredPhases: LocalizedMarkdown;
    readonly approvalGates: LocalizedMarkdown;
    readonly verificationRequirements: LocalizedMarkdown;
    readonly reviewRequirements: LocalizedMarkdown;
    readonly completionMessageContract: LocalizedMarkdown;
    readonly tokenAccountingRequirements: LocalizedMarkdown;
    readonly nextFlowRouting: LocalizedMarkdown;
    readonly performanceTriggerGuidance: LocalizedMarkdown;
    readonly qaRequirements: LocalizedMarkdown;
    readonly generatedDocumentationSections: LocalizedMarkdown;
}, {
    readonly id: "pgg-qa";
    readonly name: {
        readonly ko: "pgg-qa";
        readonly en: "pgg-qa";
    };
    readonly purpose: {
        readonly ko: "전체 flow 결과를 검증하고 pass/fail/archive readiness를 판정한다.";
        readonly en: "Verify the full flow result and decide pass/fail/archive readiness.";
    };
    readonly targetAgent: {
        readonly ko: "QA 검증 에이전트";
        readonly en: "QA verification agent";
    };
    readonly triggerConditions: LocalizedMarkdown;
    readonly inputs: LocalizedMarkdown;
    readonly outputs: LocalizedMarkdown;
    readonly absoluteRules: LocalizedMarkdown;
    readonly antiPatterns: LocalizedMarkdown;
    readonly modeSpecificBehavior: PggSkillModeSpecificBehavior;
    readonly requiredPhases: LocalizedMarkdown;
    readonly approvalGates: LocalizedMarkdown;
    readonly verificationRequirements: LocalizedMarkdown;
    readonly reviewRequirements: LocalizedMarkdown;
    readonly completionMessageContract: LocalizedMarkdown;
    readonly tokenAccountingRequirements: LocalizedMarkdown;
    readonly nextFlowRouting: LocalizedMarkdown;
    readonly performanceTriggerGuidance: LocalizedMarkdown;
    readonly qaRequirements: LocalizedMarkdown;
    readonly generatedDocumentationSections: LocalizedMarkdown;
}];
export declare const PGG_SKILL_DEFINITION_BY_ID: Record<PggSkillDefinition["id"] | LegacyCompatibilitySkillName, PggSkillDefinition>;
