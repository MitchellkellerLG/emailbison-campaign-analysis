# EmailBison Campaign Intelligence Project

## 📋 Overview
This repository contains comprehensive campaign analysis, reporting tools, and automation scripts for EmailBison email marketing campaigns across multiple client workspaces.

## 📁 Project Structure

```
📁 EmailBison Campaign Intelligence/
│
├── 📁 01_Documentation/        # Core project documentation
│   ├── README.md               # This file
│   ├── CLAUDE.md              # Claude AI instructions
│   └── FOLDER_REORGANIZATION_PLAN.md
│
├── 📁 02_Configuration/        # Configuration files
│   ├── claude_desktop_config.json
│   └── pipedream-mcp-setup.md
│
├── 📁 03_Scripts/             # Automation scripts
│   ├── 📁 analysis/           # Lead analysis scripts
│   ├── 📁 reporting/          # Report generation scripts
│   └── 📁 integrations/       # External service integrations
│
├── 📁 04_Prompts/             # AI prompts and templates
│   └── 📁 bison/              # EmailBison-specific prompts
│
├── 📁 05_Reports/             # All generated reports
│   ├── 📁 2025-09-28_Latest/  # Most recent analysis
│   ├── 📁 Client_Reports/     # Client-specific reports
│   ├── 📁 General_Reports/    # Cross-client insights
│   └── 📁 Archive/            # Historical reports
│
├── 📁 06_Data/                # Data exports and payloads
│   ├── 📁 exports/            # JSON exports
│   ├── 📁 payloads/           # API payloads
│   └── 📁 temp/               # Temporary files
│
├── 📁 07_Tools/               # Utilities and references
│   └── Bison_MCP_tools.md
│
└── 📁 08_Archive/             # Old/deprecated files
```

## 🚀 Quick Start

### Running Analysis Scripts
```bash
# Analyze leads
python 03_Scripts/analysis/analyze_leads.py

# Generate reports
python 03_Scripts/reporting/create_master_report.py
```

### Key Reports
- **Latest Campaign Analysis**: `05_Reports/2025-09-28_Latest/ULTIMATE_EMAILBISON_DEEP_ANALYSIS_2025-09-28.md`
- **Complete Email Copy**: `05_Reports/2025-09-28_Latest/COMPLETE_EMAILBISON_CAMPAIGN_COPY_2025-09-28.md`

## 📊 Key Findings

### Top Performing Campaigns
1. **Coherence Brighton Event**: 33.33% reply rate
2. **Estruxture ALL IN Event**: 18.33% reply rate
3. **TeachAid NZ Principals**: 14.29% reply rate

### Winning Patterns
- Event-based campaigns perform 8-30x better
- Opening line: "{Odd one|Weird one} {FIRST_NAME}..."
- Social proof early with big names
- Specific metrics drive engagement

## 🔧 Configuration

### EmailBison API Setup
See `02_Configuration/pipedream-mcp-setup.md` for API configuration.

### Claude AI Integration
Refer to `01_Documentation/CLAUDE.md` for AI assistant setup.

## 📈 Client Workspaces

1. Cleanlab (AI/ML)
2. Coherence (Gaming)
3. ContentGrow (Content Marketing)
4. Estruxture (Infrastructure)
5. Foundation (B2B Tech)
6. Ikeuchi (Print Tech)
7. TeachAid (Education)
8. LeadGrow (Sales/Marketing)
9. And 6 more...

## 📝 Maintenance

- **Weekly**: Archive reports older than 30 days
- **Monthly**: Review and consolidate similar reports
- **Quarterly**: Full archive and structure optimization

## 🤝 Contributing

When adding new files:
- Scripts go in `03_Scripts/[category]/`
- Reports go in `05_Reports/[type]/`
- Use consistent naming: `Component_Description_YYYY-MM-DD.ext`

## 📞 Support

For questions or issues, refer to the documentation in `01_Documentation/` or check the prompts in `04_Prompts/bison/` for automation examples.

---
Last Updated: September 29, 2025