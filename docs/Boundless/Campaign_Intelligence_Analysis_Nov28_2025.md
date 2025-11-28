# Boundless Workspace - Campaign Intelligence Analysis

**Generated:** November 28, 2025
**Workspace:** Boundless (ID: 19)
**Methodology:** [EmailBison Campaign Analysis Guidelines v2.0](../README.md)

---

## Executive Summary

| Metric | Value | Rating |
|--------|-------|--------|
| **Total Campaigns** | 11 (8 outbound, 3 reply followup) | - |
| **Total Contacts** | 6,135 | - |
| **Total Replies** | 236 unique | - |
| **Total Interested** | 16 | - |
| **Overall Reply Rate** | 3.85% | Good |
| **Overall Interested Rate** | 6.78% | Poor |
| **Overall Contact-to-Interested** | 0.26% | - |

### Portfolio Classification

| Classification | Count | % of Total | Description |
|----------------|-------|------------|-------------|
| WINNER | 1 | 9% | Reply 4%+ AND Interested 20%+ |
| HIGH VOLUME | 2 | 18% | Reply 4%+ but Interested <20% |
| HIGH QUALITY | 1 | 9% | Reply <4% but Interested 20%+ |
| UNDERPERFORMER | 4 | 36% | Reply <2% OR Interested <10% |
| TOO EARLY | 3 | 27% | Insufficient data |

---

## Campaign-by-Campaign Analysis

### CAMPAIGN #1: Toronto GEO Campaign

> **ID:** 375 | **Status:** Paused | **Classification:** WINNER

#### Metrics

| Metric | Value | Tier |
|--------|-------|------|
| Contacts | 1,614 | - |
| Unique Replies | 79 | - |
| Interested | 10 | - |
| Reply Rate | 4.89% | Strong |
| Interested Rate | 12.66% | Good |
| Contact-to-Interested | 0.62% | - |
| Completion | 21.94% | - |

#### Sequence Summary

- **Steps:** 3 + 3 variants
- **Wait pattern:** 2 days → 3 days → 1 day
- **Plain text:** Yes | **Open tracking:** No

#### Copy Snapshot

**Subject Lines (Variants):**
- "make a wish" / "magic wand"
- "Jays heartbreak" / "blue jays blues"
- "you have a magic coin"

<details>
<summary><strong>Step 1 Opening</strong></summary>

```
{FIRST_NAME}, Saw you're a fellow LA Dodgers victim so wanted to ask. If you could wave a magic wand and have 50k-10m in your account in the next 7 days to {HOOK} - How much ROI could you get out of it in 18-36 months?

Dead serious btw.
```

</details>

<details>
<summary><strong>Step 2 Opening</strong></summary>

```
Wow {FIRST_NAME}, completely forgot to mention. Toronto founders are raising 50k-$1M in capital to:
- {BODY}
- {BODY_2}
- {BODY_3}

We've already helped companies like DYLN and Bamblu secure funding in just 72 hours. 1 form. 90+% approval.
```

</details>

**CTA Style:** "Are you exploring any capital options for growth right now?"

#### Why It Works

| Element | What's Working |
|---------|---------------|
| **Local Identity Hook** | "Fellow LA Dodgers victim" / "Jays heartbreak" creates instant rapport |
| **Magic Wand Framework** | Hypothetical question removes sales pressure |
| **Specific Social Proof** | Named companies (DYLN, Bamblu) + "72 hours" + "90+% approval" |
| **Personalized Capital** | Uses {HOOK} variable for custom funding ranges |
| **Route-Around CTA** | Step 3 asks "Should I connect with someone else?" |

#### Replicable Elements

- Sports/local culture hooks for geographic targeting
- "Magic wand" hypothetical framing
- Named case studies with speed stats
- Personalized capital amounts per lead

---

### CAMPAIGN #2: Ecom High Inventory Count

> **ID:** 378 | **Status:** Active | **Classification:** HIGH VOLUME

#### Metrics

| Metric | Value | Tier |
|--------|-------|------|
| Contacts | 1,259 | - |
| Unique Replies | 53 | - |
| Interested | 1 | - |
| Reply Rate | 4.21% | Strong |
| Interested Rate | 1.89% | Poor |
| Contact-to-Interested | 0.08% | - |
| Completion | 41.4% | - |

#### Why High Volume but Low Quality

| Issue | Impact |
|-------|--------|
| Strong reply rate (4.21%) | Copy is engaging |
| Poor interested rate (1.89%) | Replies aren't converting |
| Generic ecom messaging | Lacks local/personal hook |
| Missing elements | No sports hook, no named case studies |

#### Action

Apply Toronto campaign elements:
- [ ] Add local/cultural hooks
- [ ] Include named case studies
- [ ] Use {HOOK} personalization for capital amounts

---

### CAMPAIGN #3: Ecom Growth Angle

> **ID:** 379 | **Status:** Paused | **Classification:** HIGH VOLUME

#### Metrics

| Metric | Value | Tier |
|--------|-------|------|
| Contacts | 1,104 | - |
| Unique Replies | 40 | - |
| Interested | 0 | - |
| Reply Rate | 3.62% | Good |
| Interested Rate | 0% | Poor |
| Completion | 61.74% | - |

#### Why It's Underperforming

- 40 replies but 0 interested = **qualification problem**
- Copy generates curiosity but not qualified intent
- Missing the personal/local hook that Toronto has
- Generic "holiday season" angle attracting tire-kickers

#### Action

- [x] Keep paused (already paused)
- [ ] Reallocate leads to Tariff angle campaigns

---

### CAMPAIGN #4: First Time Founders

> **ID:** 392 | **Status:** Active | **Classification:** HIGH QUALITY

#### Metrics

| Metric | Value | Tier |
|--------|-------|------|
| Contacts | 1,023 | - |
| Unique Replies | 21 | - |
| Interested | 4 | - |
| Reply Rate | 2.05% | Good |
| Interested Rate | 19.05% | Good (near Strong) |
| Contact-to-Interested | 0.39% | - |
| Completion | 12.71% | - |

#### Why It Works (Relatively)

- **Highly personalized:** Subject line AND body use dynamic {HOOK} variables
- **Pattern interrupt:** "odd one" / "strange one" / "wild one"
- **Self-deprecation:** "Totally forgot to mention"
- **Short copy:** Very brief, conversational

#### Action

- [ ] Continue running - good interested rate means quality audience
- [ ] Scale throttle from 300/day to 400/day

---

### CAMPAIGN #5: Bombora List

> **ID:** 391 | **Status:** Active | **Classification:** UNDERPERFORMER

#### Metrics

| Metric | Value | Tier |
|--------|-------|------|
| Contacts | 711 | - |
| Unique Replies | 20 | - |
| Interested | 0 | - |
| Reply Rate | 2.81% | Good |
| Interested Rate | 0% | Poor |
| Completion | 13.4% | - |

#### Why It's Failing

> **URGENT:** Copy uses placeholder variables like `{business growth idea}` and `{negative outcome}` - incomplete personalization

- Step 2 has incomplete copy: "idea 1", "idea 2", "idea 3" placeholders
- Bombora intent data may not be translating to qualified interest

#### Action

- [ ] **URGENT:** Fix incomplete copy in Step 2
- [ ] Review lead enrichment - ensure {HOOK} variables are populated
- [ ] Consider pausing until copy is fixed

---

### CAMPAIGN #6: Tariffs Angle

> **ID:** 388 | **Status:** Active | **Classification:** UNDERPERFORMER (improving)

#### Metrics

| Metric | Value | Tier |
|--------|-------|------|
| Contacts | 215 | - |
| Unique Replies | 3 | - |
| Interested | 1 | - |
| Reply Rate | 1.40% | Poor |
| Interested Rate | 33.33% | Exceptional |
| Contact-to-Interested | 0.47% | - |
| Completion | 58.79% | - |

#### Why Interested Rate Is Exceptional

- **Timely angle:** Tariffs are a current pain point
- **Choice-based CTA:** "All three are valid. Curious what you'd pick?"
- **Problem-aware:** Copy speaks directly to tariff impact on margins

#### Action

- [ ] Continue running - exceptional interested rate
- [ ] Monitor for reply rate improvement as volume increases

---

### CAMPAIGN #7: Tariff Expansion List

> **ID:** 397 | **Status:** Active | **Classification:** TOO EARLY

| Metric | Value |
|--------|-------|
| Contacts | 16 |
| Completion | 0.41% |

Strong copy with urgency (P.S. line). Too early to evaluate.

---

### CAMPAIGN #8: US SAM.gov Campaign

> **ID:** 399 | **Status:** Active | **Classification:** TOO EARLY

| Metric | Value |
|--------|-------|
| Contacts | 70 |
| Completion | 12.3% |

Government contractor audience - different ICP than ecom. Too early to evaluate.

---

### CAMPAIGNS #9-11: Reply Followup Subsequences

| Campaign | ID | Contacts | Status |
|----------|-----|----------|--------|
| 4 Subsequence | 393 | 3 | Followup |
| 3 Subsequence | 394 | 0 | Followup |
| 2 Subsequence | 395 | 0 | Followup |

Automated followup sequences - not evaluated as outbound campaigns.

---

## Why Winners Work - Pattern Summary

### Pattern 1: Local/Cultural Identity Hooks

**What it is:** Using sports teams, city references, or cultural moments to create instant rapport

**Winner Examples:**
- "Saw you're a fellow LA Dodgers victim"
- "Jays heartbreak"
- "Fellow Toronto company here"

**Why it works:**
- Creates in-group feeling immediately
- Differentiates from generic cold email
- Shows research/personalization effort

---

### Pattern 2: Magic Wand Hypothetical Framework

**What it is:** Asking "If you could wave a magic wand and get X, what would you do with it?"

**Why it works:**
- Removes sales pressure (hypothetical framing)
- Gets prospect imagining positive outcomes
- Opens conversation without asking for commitment

---

### Pattern 3: Named Social Proof with Speed Stats

**What it is:** Citing specific company names + turnaround time

**Winner Example:**
```
We've already helped companies like DYLN and Bamblu secure funding in just 72 hours. 1 form. 90+% approval.
```

**Why it works:**
- Named companies = credibility (can be verified)
- "72 hours" = urgency and capability
- "90+% approval" = reduces perceived risk

---

### Pattern 4: Reverse Psychology CTA

**What it is:** Phrasing CTAs as negatives

**Examples:**
- "Quick email back and forth on this sound awful?"
- "Open to exploring this on your side or not really?"
- "Opposed to a conversation around this?"

---

## Winning Formula

```
SUBJECT: [Pattern interrupt] or [Personalized {HOOK}]

OPENING: [Local/cultural hook if geographic targeting]

BODY: If you could [magic wand hypothetical] and get [specific capital range]
to [specific use case] - how much would you [positive outcome]?

SOCIAL PROOF: We've helped [NAMED COMPANIES] secure funding in [TIMEFRAME].
[APPROVAL RATE].

CTA: [Reverse psychology phrasing] or [Choice-based question]

STRUCTURE: 2-3 steps, 2-3 day waits, thread replies
```

---

## Actions Summary

### Scale These Winners

| Campaign | Current | Recommended | Rationale |
|----------|---------|-------------|-----------|
| Toronto GEO (375) | Paused | Resume at 300/day | 4.89% reply, 12.66% interested |
| First Time Founders (392) | 300/day | 400/day | 19.05% interested rate |

### Fix These with Winning Formula

| Campaign | Issue | Fix |
|----------|-------|-----|
| Bombora List (391) | Placeholder copy | Complete copy with actual bullet points |
| High Inventory (378) | No local hooks | Add case studies, geographic personalization |
| Ecom Growth (379) | 0% interested | Pause permanently, reallocate leads |

### Watch These (Too Early)

| Campaign | Contacts | Note |
|----------|----------|------|
| Tariff Expansion (397) | 16 | Strong copy - let it run |
| US SAM.gov (399) | 70 | New ICP - monitor closely |
| Tariffs Angle (388) | 215 | 33% interested - potential winner |

---

## Appendix: Raw Metrics Table

| ID | Campaign | Contacts | Replies | Interested | Reply % | Int % | Class |
|----|----------|----------|---------|------------|---------|-------|-------|
| 375 | Toronto GEO | 1,614 | 79 | 10 | 4.89% | 12.66% | WINNER |
| 378 | High Inventory | 1,259 | 53 | 1 | 4.21% | 1.89% | HIGH VOL |
| 379 | Ecom Growth | 1,104 | 40 | 0 | 3.62% | 0% | HIGH VOL |
| 392 | First Time Founders | 1,023 | 21 | 4 | 2.05% | 19.05% | HIGH QUAL |
| 391 | Bombora List | 711 | 20 | 0 | 2.81% | 0% | UNDER |
| 388 | Tariffs Angle | 215 | 3 | 1 | 1.40% | 33.33% | UNDER* |
| 399 | US SAM.gov | 70 | 0 | 0 | 0% | N/A | TOO EARLY |
| 397 | Tariff Expansion | 16 | 0 | 0 | 0% | N/A | TOO EARLY |

*Tariffs Angle has exceptional 33% interested rate but poor reply rate - sample size still small

---

*Analysis generated using EmailBison Campaign Analysis Guidelines v2.0*
