#!/usr/bin/env python3
"""
Email Bison Reports to Google Docs Beautifier
Uses Pipedream MCP integration to create beautiful Google Docs
"""

import json
import re
from pathlib import Path
from datetime import datetime

class ReportBeautifier:
    def __init__(self, reports_dir="Client Reports"):
        self.reports_dir = Path(reports_dir)
        self.reports = list(self.reports_dir.glob("*Intelligence Report*.md"))
        
    def parse_report(self, report_path):
        """Parse markdown report and extract key metrics"""
        with open(report_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract key information
        title = re.search(r'^# (.+?)$', content, re.MULTILINE)
        title = title.group(1) if title else "Intelligence Report"
        
        # Extract metrics
        reply_rate = re.search(r'\*\*Reply Rate:\*\* ([0-9.]+%)', content)
        reply_rate = reply_rate.group(1) if reply_rate else "N/A"
        
        interested = re.search(r'\*\*Interested:\*\* (\d+)', content)
        interested = interested.group(1) if interested else "0"
        
        # Extract executive summary
        exec_summary = re.search(r'## Executive Summary\n\n(.+?)\n\n##', content, re.DOTALL)
        exec_summary = exec_summary.group(1) if exec_summary else ""
        
        # Extract critical insights
        critical = re.search(r'## 🚨 CRITICAL INSIGHTS\n\n(.+?)(\n\n---|\Z)', content, re.DOTALL)
        critical = critical.group(1) if critical else ""
        
        return {
            "title": title,
            "file_path": str(report_path),
            "content": content,
            "metrics": {
                "reply_rate": reply_rate,
                "interested_leads": interested,
            },
            "executive_summary": exec_summary,
            "critical_insights": critical,
            "sections": self._extract_sections(content)
        }
    
    def _extract_sections(self, content):
        """Extract all sections with their content"""
        sections = []
        
        # Split by ## headers
        parts = re.split(r'^## ', content, flags=re.MULTILINE)[1:]
        
        for part in parts:
            lines = part.split('\n', 1)
            if len(lines) >= 2:
                header = lines[0].strip()
                body = lines[1].strip()
                
                # Check if it's a special section with emoji
                emoji_match = re.match(r'^(.*?)\s*(.+)$', header)
                if emoji_match and any(char in emoji_match.group(1) for char in '🎯🔬💼📊🎪🚀⚠️📈💎🔮📋🏆🚨'):
                    sections.append({
                        "emoji": emoji_match.group(1),
                        "title": emoji_match.group(2),
                        "content": body,
                        "type": "special"
                    })
                else:
                    sections.append({
                        "title": header,
                        "content": body,
                        "type": "standard"
                    })
        
        return sections
    
    def create_docs_structure(self, report_data):
        """Create structure for Google Docs with formatting instructions"""
        
        doc_structure = {
            "title": report_data["title"],
            "elements": []
        }
        
        # Title page
        doc_structure["elements"].append({
            "type": "title_page",
            "content": {
                "title": report_data["title"],
                "date": datetime.now().strftime("%B %d, %Y"),
                "subtitle": "Email Bison Intelligence Analysis"
            }
        })
        
        # Executive Summary Box
        doc_structure["elements"].append({
            "type": "highlight_box",
            "style": "blue",
            "content": {
                "title": "Executive Summary",
                "text": report_data["executive_summary"],
                "metrics": [
                    {"label": "Reply Rate", "value": report_data["metrics"]["reply_rate"]},
                    {"label": "Interested Leads", "value": report_data["metrics"]["interested_leads"]}
                ]
            }
        })
        
        # Process each section
        for section in report_data["sections"]:
            if section["type"] == "special":
                # Special sections with emojis get custom styling
                doc_structure["elements"].append({
                    "type": "special_section",
                    "emoji": section["emoji"],
                    "title": section["title"],
                    "content": self._format_section_content(section["content"])
                })
            else:
                # Standard sections
                doc_structure["elements"].append({
                    "type": "section",
                    "title": section["title"],
                    "content": self._format_section_content(section["content"])
                })
        
        # Critical Insights (if present)
        if report_data["critical_insights"]:
            doc_structure["elements"].append({
                "type": "alert_box",
                "style": "red",
                "content": {
                    "title": "🚨 CRITICAL INSIGHTS",
                    "text": report_data["critical_insights"]
                }
            })
        
        return doc_structure
    
    def _format_section_content(self, content):
        """Format section content with proper structures"""
        formatted = []
        
        # Split into paragraphs and lists
        lines = content.split('\n')
        current_list = []
        current_para = []
        
        for line in lines:
            line = line.strip()
            
            # Check if it's a list item
            if re.match(r'^[-*\d+\.]\s+', line):
                # Save current paragraph
                if current_para:
                    formatted.append({
                        "type": "paragraph",
                        "text": ' '.join(current_para)
                    })
                    current_para = []
                
                # Add to current list
                list_item = re.sub(r'^[-*\d+\.]\s+', '', line)
                current_list.append(list_item)
            else:
                # Save current list
                if current_list:
                    formatted.append({
                        "type": "list",
                        "items": current_list
                    })
                    current_list = []
                
                # Add to paragraph
                if line:
                    current_para.append(line)
                elif current_para:
                    # Empty line = new paragraph
                    formatted.append({
                        "type": "paragraph",
                        "text": ' '.join(current_para)
                    })
                    current_para = []
        
        # Don't forget the last paragraph/list
        if current_para:
            formatted.append({
                "type": "paragraph",
                "text": ' '.join(current_para)
            })
        if current_list:
            formatted.append({
                "type": "list",
                "items": current_list
            })
        
        return formatted
    
    def generate_pipedream_payload(self, report_data):
        """Generate payload for Pipedream workflow"""
        doc_structure = self.create_docs_structure(report_data)
        
        return {
            "action": "create_beautiful_report",
            "report_type": "intelligence",
            "document": doc_structure,
            "formatting": {
                "theme": "professional_blue",
                "include_charts": True,
                "include_toc": True,
                "page_numbers": True
            },
            "metadata": {
                "source": "Email Bison Intelligence Analysis",
                "generated_at": datetime.now().isoformat(),
                "version": "1.0"
            }
        }
    
    def process_all_reports(self):
        """Process all reports and prepare for Google Docs creation"""
        results = []
        
        for report_path in self.reports:
            print(f"Processing: {report_path.name}")
            
            # Parse report
            report_data = self.parse_report(report_path)
            
            # Generate Pipedream payload
            payload = self.generate_pipedream_payload(report_data)
            
            results.append({
                "file": report_path.name,
                "title": report_data["title"],
                "payload": payload
            })
        
        return results

def main():
    """Main execution function"""
    beautifier = ReportBeautifier()
    
    print("🎨 Email Bison Report Beautifier")
    print("=" * 50)
    print(f"Found {len(beautifier.reports)} reports to process\n")
    
    results = beautifier.process_all_reports()
    
    # Save payloads for Pipedream
    output_dir = Path("pipedream_payloads")
    output_dir.mkdir(exist_ok=True)
    
    for result in results:
        output_file = output_dir / f"{result['title'].replace(' ', '_')}_payload.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result['payload'], f, indent=2)
        
        print(f"✅ Created payload for: {result['title']}")
        print(f"   Saved to: {output_file}")
    
    print(f"\n✨ All {len(results)} reports processed!")
    print("\nNext steps:")
    print("1. Use these payloads with your Pipedream Google Docs workflow")
    print("2. Each payload contains structured data for beautiful formatting")
    print("3. The Pipedream workflow should create styled Google Docs")
    
    # Create a master index
    index_path = output_dir / "index.json"
    with open(index_path, 'w', encoding='utf-8') as f:
        json.dump({
            "reports": [
                {
                    "title": r['title'],
                    "file": r['file'],
                    "payload_file": f"{r['title'].replace(' ', '_')}_payload.json"
                }
                for r in results
            ],
            "generated_at": datetime.now().isoformat(),
            "total_reports": len(results)
        }, f, indent=2)
    
    print(f"\n📋 Master index created: {index_path}")

if __name__ == "__main__":
    main()