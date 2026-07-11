# Severity and Evidence

Assign severity from user impact and certainty, not from rule wording alone.

## Severity

| Level | Meaning | JianghuJS examples |
|---|---|---|
| P0 | Immediate security, permission, or destructive data risk | Unauthorized mutation, production data loss, permission bypass, destructive resource rewrite |
| P1 | Page cannot compile or a core workflow is broken | Invalid v7 mode, missing page identity, unresolved required include, action cannot invoke its method, both targets requested but one cannot build |
| P2 | Important partial regression or compatibility defect | Wrong mobile layout/action, incorrect filter/pagination, host component resource missing, generated behavior differs for one path |
| P3 | Maintainability or low-impact consistency issue | Redundant compatibility field, unclear structure, non-blocking documentation or convention drift |

Do not report style preferences as P1/P2. Raise severity when a structural issue changes permissions, writes, routing, or data behavior.

## Evidence levels

Label the strongest evidence available:

| Evidence | Supports | Does not prove |
|---|---|---|
| Static | Syntax, field presence, reference search, obvious mode conflict | Successful compile, database state, runtime interaction |
| Compiler | Both target builds, generated structure, compiler exceptions | Real database permissions or browser behavior |
| Database | Table fields, resources, page records, query/mutation behavior | Visual and client interaction correctness |
| Runtime | Browser behavior, requests, layout, interaction | Unexercised roles, devices, or data states |

Use “unknown” when required evidence is absent. Do not turn an unexecuted check into a confirmed pass.

## Error ownership

Classify findings before recommending a fix:

- **Config defect**: the init-json violates its version/mode contract or references missing project code.
- **Compiler defect**: valid semantic input produces incorrect or inconsistent generated output.
- **Project dependency defect**: required include, component, service, schema, or runtime package is absent or incompatible.
- **Business ambiguity**: the repository does not establish intended permissions, identity, or workflow.
- **Legacy risk**: an old structure remains fragile but is not currently proven broken.

Do not “fix” a compiler defect by permanently editing generated HTML. Do not invent a business rule to close an ambiguity.

## Findings format

For each finding provide:

1. Severity and concise title.
2. Source file and tight line reference.
3. The violated behavior or contract.
4. Concrete impact.
5. Evidence used.
6. Minimal correction direction when clear.

After findings, list open questions, unperformed validation, and residual risk. If there are no findings, state that before the test gaps.

