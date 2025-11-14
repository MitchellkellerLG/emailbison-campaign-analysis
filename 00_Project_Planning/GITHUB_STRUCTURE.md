# GitHub Repository Structure Plan

**Repository:** emailbison-campaign-analysis
**Purpose:** Campaign analysis reports, methodology, and client updates
**Maintained by:** LaunchClub Campaign Team

---

## Planned Directory Structure

```
emailbison-campaign-analysis/
│
├── README.md                                    # Overview of repository
├── METHODOLOGY.md                               # Link to guidelines, changelog
│
├── guidelines/
│   ├── EmailBison_Campaign_Analysis_Guidelines.md
│   ├── Workspace_Analysis_Template.md
│   └── CORRECTED_METHODOLOGY.md
│
├── foundation/
│   ├── reports/
│   │   ├── Foundation_Campaign_Analysis_Report.md
│   │   └── Foundation_Campaign_Analysis_Report_Archive_[Date].md
│   ├── copy/
│   │   └── [Campaign copy documentation]
│   └── data/
│       └── [Raw data exports if needed]
│
├── teachaid/
│   ├── reports/
│   │   ├── TeachAid_Campaign_Analysis_Report.md
│   │   └── TeachAid_Campaign_Analysis_Report_Archive_[Date].md
│   ├── client-updates/
│   │   ├── TeachAid_Client_Update_November_2025.md
│   │   └── TeachAid_Client_Update_[Month]_[Year].md
│   ├── copy/
│   │   ├── NZ_Principals_Campaign_Copy.md
│   │   └── [Other campaign copy documentation]
│   └── data/
│       └── [Raw data exports if needed]
│
├── archived/
│   ├── old-methodology/
│   │   └── [Deprecated calculation methods]
│   └── deprecated-reports/
│       └── [Old reports with incorrect calculations]
│
└── assets/
    ├── templates/
    │   └── Workspace_Analysis_Template.md
    └── images/
        └── [Charts, graphs, screenshots if needed]
```

---

## File Naming Conventions

### Analysis Reports
```
[Workspace]_Campaign_Analysis_Report.md
[Workspace]_Campaign_Analysis_Report_Archive_[YYYY-MM-DD].md
```

### Client Updates
```
[Workspace]_Client_Update_[Month]_[Year].md
```

### Campaign Copy Documentation
```
[Geography]_[Audience]_Campaign_Copy.md
[Campaign_ID]_[Campaign_Name]_Copy.md
```

### Data Exports
```
[Workspace]_campaigns_[YYYY-MM-DD].json
[Workspace]_campaigns_[YYYY-MM-DD].csv
```

---

## Migration Plan

### Phase 1: Reorganize Current Files ✅
- [x] Create CORRECTED_METHODOLOGY.md
- [x] Create EmailBison_Campaign_Analysis_Guidelines.md
- [x] Create Workspace_Analysis_Template.md
- [x] Create GITHUB_STRUCTURE.md

### Phase 2: Create Directory Structure
```bash
mkdir -p guidelines foundation/reports foundation/copy teachaid/reports teachaid/client-updates teachaid/copy archived/old-methodology assets/templates
```

### Phase 3: Move Existing Files
```bash
# Move guidelines
mv EmailBison_Campaign_Analysis_Guidelines.md guidelines/
mv Workspace_Analysis_Template.md guidelines/
mv CORRECTED_METHODOLOGY.md guidelines/

# Move Foundation reports
mv Foundation_Campaign_Analysis_Report.md foundation/reports/

# Move TeachAid reports and updates
mv TeachAid_Campaign_Analysis_Report.md teachaid/reports/
mv TeachAid_Client_Update_November_2025.md teachaid/client-updates/
mv TeachAid_Client_Update_November_2025_CORRECTED.md teachaid/client-updates/

# Move campaign copy
mv NZ_Principals_Campaign_Copy.md teachaid/copy/

# Archive old methodology notes
mv corrected_reply_rates.md archived/old-methodology/
```

### Phase 4: Update README.md
Create comprehensive README with:
- Repository purpose
- Methodology overview
- Directory structure explanation
- How to use templates
- Contribution guidelines
- Changelog

### Phase 5: Git Commit and Push
```bash
git add .
git commit -m "Restructure repository with proper directory hierarchy and methodology guidelines"
git push origin main
```

---

## README.md Template

```markdown
# EmailBison Campaign Analysis

Campaign performance analysis, methodology, and client updates for LaunchClub's EmailBison workspaces.

## 📊 Workspaces

- **Foundation** - LaunchClub's Reddit audience growth campaigns
- **TeachAid** - Educational AI teaching assistant campaigns

## 📚 Methodology

**Current Version:** 2.0 (Updated November 7, 2025)

### Core Metrics

- **Reply Rate** = unique_replies / total_leads_contacted
- **Interested Rate** = interested / unique_replies (reply quality metric)
- **Contact-to-Interested** = interested / total_leads_contacted

See [guidelines/EmailBison_Campaign_Analysis_Guidelines.md](guidelines/EmailBison_Campaign_Analysis_Guidelines.md) for complete methodology.

## 📁 Repository Structure

- `guidelines/` - Analysis methodology and templates
- `foundation/` - Foundation workspace reports and campaign copy
- `teachaid/` - TeachAid workspace reports, client updates, and campaign copy
- `archived/` - Deprecated reports and old methodology
- `assets/` - Templates and supporting materials

## 🚀 Quick Start

1. Review methodology: `guidelines/EmailBison_Campaign_Analysis_Guidelines.md`
2. Use template: `guidelines/Workspace_Analysis_Template.md`
3. Check examples: `foundation/reports/` or `teachaid/reports/`

## 📈 Latest Reports

### Foundation
- [Campaign Analysis Report](foundation/reports/Foundation_Campaign_Analysis_Report.md)

### TeachAid
- [Campaign Analysis Report](teachaid/reports/TeachAid_Campaign_Analysis_Report.md)
- [November 2025 Client Update](teachaid/client-updates/TeachAid_Client_Update_November_2025_CORRECTED.md)

## 🔄 Changelog

### v2.0 (November 7, 2025)
- **CRITICAL FIX:** Corrected interested rate calculation (interested/replies not interested/contacts)
- Reorganized repository structure
- Added comprehensive analysis guidelines
- Created workspace analysis template

### v1.0 (November 4, 2025)
- Initial repository setup
- Foundation and TeachAid campaign analysis
- Reply rate methodology correction

## 📝 Contributing

When creating new analysis reports:

1. Use `Workspace_Analysis_Template.md` as starting point
2. Follow naming conventions in `GITHUB_STRUCTURE.md`
3. Ensure all calculations follow `EmailBison_Campaign_Analysis_Guidelines.md`
4. Verify quality checklist before committing

## 📧 Contact

LaunchClub Campaign Team
```

---

## Git Commands Reference

### Initial Setup (One Time)
```bash
cd "C:\Users\mitch\Desktop\Claude Code Projects"

# Create directory structure
mkdir -p guidelines foundation/reports foundation/copy teachaid/reports teachaid/client-updates teachaid/copy archived/old-methodology assets/templates

# Move files (Windows - use 'move' instead of 'mv')
# Or do this manually in file explorer
```

### Regular Workflow
```bash
# Check status
git status

# Add new/modified files
git add .

# Commit with descriptive message
git commit -m "Add [description of changes]"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

---

## Maintenance Schedule

### Weekly
- [ ] Update client update documents with latest campaign data
- [ ] Archive old reports if methodology changes

### Monthly
- [ ] Review and update analysis guidelines if needed
- [ ] Generate comprehensive monthly reports

### Quarterly
- [ ] Review repository structure
- [ ] Archive outdated reports
- [ ] Update README with latest findings

---

**Status:** Planning phase - ready to implement
**Next Steps:** Execute Phase 2-5 migration plan
**Maintained by:** LaunchClub Campaign Team
