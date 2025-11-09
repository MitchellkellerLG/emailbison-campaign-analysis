# 🚀 START HERE - EmailBison Campaign Analysis Quick Reference

**Last Updated:** November 7, 2025
**For:** Campaign analysis workflow

---

## ⚡ Quick Links

### 📖 When Starting a New Analysis
**Use this:** [Workspace_Analysis_Template.md](Workspace_Analysis_Template.md)
- Copy this template for every new workspace analysis
- All sections pre-structured
- Correct formulas already in place

### 📊 Methodology Reference (How to Calculate Metrics)
**Use this:** [EmailBison_Campaign_Analysis_Guidelines.md](EmailBison_Campaign_Analysis_Guidelines.md)
- **CRITICAL:** Interested Rate = interested / unique_replies (NOT contacts!)
- Performance tiers (what's "good" vs "exceptional")
- Quality checklist before publishing
- MCP tools reference

### 🏗️ Repository Organization
**Use this:** [GITHUB_STRUCTURE.md](GITHUB_STRUCTURE.md)
- Where to save different file types
- Naming conventions
- Migration plan for reorganizing files

---

## 🎯 Common Tasks

### "I Need to Analyze Foundation Campaigns"
1. Open: `Workspace_Analysis_Template.md`
2. Reference: `EmailBison_Campaign_Analysis_Guidelines.md`
3. Use MCP: Switch to Foundation workspace
4. Pull active campaigns
5. Save as: `foundation/reports/Foundation_Campaign_Analysis_Report.md`

### "I Need to Analyze TeachAid Campaigns"
1. Open: `Workspace_Analysis_Template.md`
2. Reference: `EmailBison_Campaign_Analysis_Guidelines.md`
3. Use MCP: Switch to TeachAid workspace
4. Pull active campaigns
5. Save as: `teachaid/reports/TeachAid_Campaign_Analysis_Report.md`

### "I Need to Create a Client Update"
1. Look at: `TeachAid_Client_Update_November_2025_CORRECTED.md` (as example)
2. Focus on: Live campaigns only
3. Highlight: New launches, key metrics, strategic recommendations
4. Save as: `teachaid/client-updates/TeachAid_Client_Update_[Month]_[Year].md`

### "I Need Campaign Copy from EmailBison"
1. Use MCP tool: `mcp__bison_mcp__emailbison_view_campaign_sequence_steps`
2. Document all steps with spintax
3. Save as: `[workspace]/copy/[Campaign_Name]_Copy.md`
4. Example: `teachaid/copy/NZ_Principals_Campaign_Copy.md`

### "I Forgot the Correct Formula"
**Open:** `EmailBison_Campaign_Analysis_Guidelines.md` → Section: "Core Metric Definitions"

**Quick Reference:**
```
Reply Rate = unique_replies / total_leads_contacted
Interested Rate = interested / unique_replies  ← REPLY QUALITY
Contact-to-Interested = interested / total_leads_contacted
```

---

## 📂 Current File Locations (Before Migration)

### Analysis Reports
- Foundation: `Foundation_Campaign_Analysis_Report.md`
- TeachAid: `TeachAid_Campaign_Analysis_Report.md`

### Client Updates
- Latest: `TeachAid_Client_Update_November_2025_CORRECTED.md`

### Campaign Copy
- NZ Principals: `NZ_Principals_Campaign_Copy.md`

### Methodology Docs
- Main Guidelines: `EmailBison_Campaign_Analysis_Guidelines.md` ⭐
- Template: `Workspace_Analysis_Template.md`
- Methodology Fix: `CORRECTED_METHODOLOGY.md`
- Old notes: `corrected_reply_rates.md` (archived)

---

## 📂 Future File Locations (After Migration - Per GITHUB_STRUCTURE.md)

```
guidelines/
  ├── EmailBison_Campaign_Analysis_Guidelines.md  ⭐ YOUR GO-TO REFERENCE
  ├── Workspace_Analysis_Template.md              ⭐ COPY THIS FOR NEW REPORTS
  └── CORRECTED_METHODOLOGY.md

foundation/
  ├── reports/
  │   └── Foundation_Campaign_Analysis_Report.md
  └── copy/

teachaid/
  ├── reports/
  │   └── TeachAid_Campaign_Analysis_Report.md
  ├── client-updates/
  │   └── TeachAid_Client_Update_[Month]_[Year].md
  └── copy/
      └── NZ_Principals_Campaign_Copy.md
```

---

## ⚠️ Critical Reminders

### Always Remember:
1. **Interested Rate** = interested / replies (measures reply QUALITY)
2. **Reply Rate** = replies / contacts (NOT emails_sent)
3. Note sample sizes (2 replies = 100% is not statistically significant)
4. Segment by geography and audience type
5. Include methodology note in every report

### Before Publishing Any Report:
- [ ] Reply rates from `total_leads_contacted` ✅
- [ ] Interested rates from `unique_replies` ✅
- [ ] Sample sizes noted ✅
- [ ] Methodology note at top ✅
- [ ] Geographic segmentation ✅
- [ ] Audience type segmentation ✅

---

## 🔗 GitHub Repository

**URL:** https://github.com/MitchellkellerLG/emailbison-campaign-analysis

**Latest Commits:**
- Foundational guidelines and structure (Nov 7, 2025)
- Methodology corrections (Nov 7, 2025)
- Complete TeachAid update with all 15 active campaigns (Nov 7, 2025)

---

## 📞 Need Help?

### "I'm confused about a metric calculation"
→ Open: `EmailBison_Campaign_Analysis_Guidelines.md`
→ Search for the metric name

### "I don't know how to structure my report"
→ Copy: `Workspace_Analysis_Template.md`
→ Fill in the blanks

### "I need an example"
→ Look at: `TeachAid_Client_Update_November_2025_CORRECTED.md`
→ Or: `NZ_Principals_Campaign_Copy.md`

### "I want to reorganize the repository"
→ Follow: `GITHUB_STRUCTURE.md` → Migration Plan

---

## 🎓 Learning Path

**New to EmailBison Analysis?**
1. Read: `EmailBison_Campaign_Analysis_Guidelines.md` (10 min)
2. Review: `TeachAid_Client_Update_November_2025_CORRECTED.md` (example)
3. Copy: `Workspace_Analysis_Template.md`
4. Practice: Analyze one workspace

**Already Familiar?**
1. Use: `Workspace_Analysis_Template.md` directly
2. Reference: `EmailBison_Campaign_Analysis_Guidelines.md` as needed
3. Check: Quality checklist before publishing

---

## 🔄 Workflow Cheat Sheet

### Standard Campaign Analysis Workflow:
```
1. Switch workspace in EmailBison MCP
   ↓
2. Copy Workspace_Analysis_Template.md
   ↓
3. Pull campaigns data (list_campaigns, campaign_details)
   ↓
4. Calculate metrics (follow Guidelines.md formulas)
   ↓
5. Fill in template sections
   ↓
6. Run quality checklist
   ↓
7. Save to appropriate directory
   ↓
8. Git commit and push
```

### MCP Tools Quick Reference:
```javascript
// Switch workspace
mcp__bison_mcp__emailbison_rotate_workspace({ workspace_name: "TeachAid" })

// List campaigns
mcp__bison_mcp__emailbison_list_campaigns({ status: "active" })

// Get campaign details
mcp__bison_mcp__emailbison_campaign_details({ id: 293 })

// Get email sequences
mcp__bison_mcp__emailbison_view_campaign_sequence_steps({ campaign_id: 199 })
```

---

**🌟 MOST IMPORTANT FILES:**
1. **EmailBison_Campaign_Analysis_Guidelines.md** - Your methodology bible
2. **Workspace_Analysis_Template.md** - Your starting point for every analysis
3. **This file (START_HERE.md)** - Your navigation hub

---

*Bookmark this file for quick access to everything you need!*
