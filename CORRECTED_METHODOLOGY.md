# CORRECTED Campaign Metrics Methodology

**Date:** November 7, 2025
**Critical Update:** Interested Rate Calculation Fix

---

## ❌ PREVIOUS INCORRECT METHODOLOGY

### Wrong Calculations:
- **Reply Rate** = unique_replies / emails_sent ❌ (WRONG - emails_sent includes follow-ups)
- **Interested Rate** = interested / total_leads_contacted ❌ (WRONG - this is contact-to-interested conversion, not reply-to-interested)

---

## ✅ CORRECT METHODOLOGY

### Correct Calculations:

1. **Reply Rate** = unique_replies / total_leads_contacted
   - Measures: What % of unique contacts replied
   - Example: 64 replies / 893 contacts = 7.17% reply rate

2. **Interested Rate** = interested / unique_replies
   - Measures: What % of replies became interested (reply quality)
   - Example: 6 interested / 64 replies = 9.4% interested rate
   - **This is the same as "Conversion Rate"**

3. **Contact-to-Interested Rate** = interested / total_leads_contacted
   - Measures: What % of total contacts became interested (overall campaign effectiveness)
   - Example: 6 interested / 893 contacts = 0.67%

---

## Key Distinction

**Interested Rate** should measure **reply quality**, not overall reach.

- If 100 people reply and 30 become interested → **30% interested rate** (high quality replies)
- If 100 people reply and 5 become interested → **5% interested rate** (low quality replies)

This tells us whether replies are genuinely qualified or just curious.

---

## Example Campaign Corrected

### Campaign #254: CB Funded Companies
- Total Leads Contacted: 893
- Unique Replies: 64
- Interested: 6

**WRONG Calculation:**
- Reply Rate: 64/2,573 emails = 2.49% ❌
- Interested Rate: 6/893 contacts = 0.67% ❌

**CORRECT Calculation:**
- Reply Rate: 64/893 contacts = 7.17% ✅
- Interested Rate: 6/64 replies = 9.4% ✅
- Contact-to-Interested: 6/893 contacts = 0.67% ✅

---

## Impact on Reports

All tables with "Interested Rate" columns need to be recalculated as:
- **interested / unique_replies** (NOT interested / contacts)

This will show us which campaigns generate high-quality replies vs. just high-volume replies.

---

**Applied to:** Foundation Campaign Analysis Report & TeachAid Campaign Analysis Report
**Status:** Corrections in progress
