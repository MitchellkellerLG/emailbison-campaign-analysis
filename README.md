# EmailBison Campaign Analysis

Campaign performance analysis, methodology, and client updates for LaunchClub's EmailBison workspaces.

**Repository:** https://github.com/MitchellkellerLG/emailbison-campaign-analysis

---

## 🚀 Quick Start

**New here?** → Read [START_HERE.md](START_HERE.md)

**Need methodology?** → See [EmailBison_Campaign_Analysis_Guidelines.md](EmailBison_Campaign_Analysis_Guidelines.md)

**Starting an analysis?** → Copy [Workspace_Analysis_Template.md](Workspace_Analysis_Template.md)

---

## 📊 Workspaces

### Foundation (ID: 7)
LaunchClub's Reddit audience growth campaigns targeting SEO agencies, marketing software companies, and gaming publishers.

**Latest:** [Foundation_Campaign_Analysis_Report.md](Foundation_Campaign_Analysis_Report.md)

### TeachAid (ID: 17)
AI teaching assistant campaigns targeting educators globally (NZ, USA, Canada, South Africa).

**Latest Reports:**
- [TeachAid_Campaign_Analysis_Report.md](TeachAid_Campaign_Analysis_Report.md)
- [Client Update - November 2025](TeachAid_Client_Update_November_2025_CORRECTED.md)

**Campaign Copy:**
- [NZ Principals Campaign](NZ_Principals_Campaign_Copy.md)

---

## 📚 Core Methodology (v2.0)

**Updated:** November 7, 2025

### Critical Metric Formulas

```
Reply Rate = unique_replies / total_leads_contacted
Interested Rate = interested / unique_replies  ← REPLY QUALITY METRIC
Contact-to-Interested = interested / total_leads_contacted
```

**⚠️ Common Mistake:**
"Interested Rate" measures **reply quality** (what % of replies become interested), NOT overall campaign reach. Do not calculate as interested/contacts.

See [EmailBison_Campaign_Analysis_Guidelines.md](EmailBison_Campaign_Analysis_Guidelines.md) for complete methodology.

---

## 📁 Repository Structure

**Current (Pre-Migration):**
```
.
├── START_HERE.md                                    ⭐ Navigation hub
├── EmailBison_Campaign_Analysis_Guidelines.md      ⭐ Methodology reference
├── Workspace_Analysis_Template.md                   ⭐ Report template
├── Foundation_Campaign_Analysis_Report.md
├── TeachAid_Campaign_Analysis_Report.md
├── TeachAid_Client_Update_November_2025_CORRECTED.md
└── NZ_Principals_Campaign_Copy.md
```

**Planned (See GITHUB_STRUCTURE.md):**
```
guidelines/          ← Methodology docs
foundation/
  ├── reports/       ← Analysis reports
  └── copy/          ← Campaign email sequences
teachaid/
  ├── reports/       ← Analysis reports
  ├── client-updates/← Client-facing updates
  └── copy/          ← Campaign email sequences
archived/            ← Deprecated methodology and reports
```

---

## 🎯 Common Tasks

### Analyze Foundation Campaigns
```javascript
// 1. Switch workspace
mcp__bison_mcp__emailbison_rotate_workspace({ workspace_name: "Foundation" })

// 2. Get active campaigns
mcp__bison_mcp__emailbison_list_campaigns({ status: "active" })

// 3. Use template for structure
// Copy: Workspace_Analysis_Template.md
// Reference: EmailBison_Campaign_Analysis_Guidelines.md
```

### Generate TeachAid Client Update
```javascript
// 1. Switch workspace
mcp__bison_mcp__emailbison_rotate_workspace({ workspace_name: "TeachAid" })

// 2. Get ALL active campaigns
mcp__bison_mcp__emailbison_list_campaigns({ status: "active" })

// 3. Focus on: Live campaigns, new launches, key metrics
// Reference example: TeachAid_Client_Update_November_2025_CORRECTED.md
```

### Extract Campaign Copy
```javascript
// Get email sequences
mcp__bison_mcp__emailbison_view_campaign_sequence_steps({
  campaign_id: 199
})

// Document all steps with spintax variations
// Reference example: NZ_Principals_Campaign_Copy.md
```

---

## 📈 Performance Benchmarks

### Foundation Workspace
- **Best Reply Rate:** 7.19% (Campaign #209 - SEO Engagers)
- **Best Interested Rate:** 33.6% (Campaign #209 - from replies)
- **Overall Reply Rate:** 4.45%
- **Overall Interested Rate:** 22.9% (from replies)

### TeachAid Workspace
- **Best Reply Rate:** 33.80% (Campaign #306 - Reply Followup)
- **Best Interested Rate:** 70.8% (Campaign #306 - from replies)
- **Warm Data Performance:** 28.6% interested rate (CRM trial signups)
- **Overall Reply Rate:** 3.72%
- **Overall Interested Rate:** 21.4% (from replies)

**Key Finding:** TeachAid converts replies to interested at 2X the rate of Foundation (49.5% vs 22.9%), suggesting better product-market fit in education vertical.

---

## 🔄 Changelog

### v2.0 (November 7, 2025) - CRITICAL METHODOLOGY FIX
- **FIXED:** Interested Rate calculation (now interested/replies, was interested/contacts)
- Added comprehensive analysis guidelines
- Created workspace analysis template
- Added 15-campaign TeachAid update (was missing 9 campaigns)
- Created repository structure plan
- Added START_HERE.md navigation hub

### v1.0 (November 4-7, 2025)
- Initial Foundation workspace analysis
- Initial TeachAid workspace analysis
- Reply rate methodology correction (contacts not emails_sent)
- NZ Principals campaign copy documentation

---

## 📋 Quality Checklist

Before publishing any campaign analysis:

- [ ] Reply rates calculated from `total_leads_contacted` (NOT emails_sent)
- [ ] Interested rates calculated from `unique_replies` (NOT contacts)
- [ ] Sample sizes noted for statistical significance
- [ ] Methodology note included at report top
- [ ] Geographic segmentation included
- [ ] Audience type segmentation included
- [ ] Strategic recommendations included
- [ ] Files saved to correct location

---

## 🛠️ Tools & Technologies

- **EmailBison MCP:** Campaign data access via Model Context Protocol
- **GitHub:** Version control and collaboration
- **Markdown:** All documentation and reports

---

## 📞 Support

**Questions about methodology?**
→ See [EmailBison_Campaign_Analysis_Guidelines.md](EmailBison_Campaign_Analysis_Guidelines.md)

**Need an example?**
→ Review [TeachAid_Client_Update_November_2025_CORRECTED.md](TeachAid_Client_Update_November_2025_CORRECTED.md)

**Want to reorganize repository?**
→ Follow [GITHUB_STRUCTURE.md](GITHUB_STRUCTURE.md) migration plan

---

## 🎓 Learning Resources

### For New Analysts:
1. Read: [START_HERE.md](START_HERE.md) (5 min)
2. Study: [EmailBison_Campaign_Analysis_Guidelines.md](EmailBison_Campaign_Analysis_Guidelines.md) (10 min)
3. Review: Example reports
4. Practice: Copy template and analyze one workspace

### For Experienced Users:
- Quick reference: [START_HERE.md](START_HERE.md)
- Template: [Workspace_Analysis_Template.md](Workspace_Analysis_Template.md)
- Quality check: Guidelines checklist section

---

## 🔐 Access

**EmailBison Workspaces:**
- Foundation (ID: 7)
- TeachAid (ID: 17)

**GitHub Repository:**
https://github.com/MitchellkellerLG/emailbison-campaign-analysis

---

## 📝 Contributing

When adding new analyses:

1. ✅ Use `Workspace_Analysis_Template.md` as starting point
2. ✅ Follow `EmailBison_Campaign_Analysis_Guidelines.md` methodology
3. ✅ Verify all calculations with quality checklist
4. ✅ Use naming conventions from `GITHUB_STRUCTURE.md`
5. ✅ Commit with descriptive message including key metrics

---

## 🏆 Key Findings to Date

### Foundation Workspace Winners:
1. **SEO Engagers (#209):** 7.19% reply rate, 33.6% interested rate
2. **CB Funded (#254):** 7.17% reply rate, 9.4% interested rate
3. **Product Hunt (#262):** 6.52% reply rate, 40.7% interested rate

**Winning Formula:** "Weird one" opener + Reddit value prop + Plain text + No tracking

### TeachAid Workspace Winners:
1. **CRM Trial Signups (#293):** 7.01% reply rate, 28.6% interested rate
2. **Reply Followups (#306):** 33.80% reply rate, 70.8% interested rate
3. **NZ Teachers (#305):** 6.63% reply rate, 63.9% interested rate

**Winning Formula:** Warm data + Teacher focus (not principals) + Geographic targeting (NZ > all)

---

**Maintained by:** LaunchClub Campaign Team

**Last Updated:** November 7, 2025
