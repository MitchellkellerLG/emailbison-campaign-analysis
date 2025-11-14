#!/usr/bin/env python3
"""
Send Email Bison Reports to Pipedream for Google Docs Creation
"""

import requests
import json
import re
from pathlib import Path
import time

# Configure your Pipedream webhook URL here
PIPEDREAM_WEBHOOK_URL = "YOUR_PIPEDREAM_WEBHOOK_URL_HERE"  # You'll get this from Pipedream

class ReportProcessor:
    def __init__(self, reports_dir="Client Reports"):
        self.reports_dir = Path(reports_dir)
        
    def parse_markdown_report(self, file_path):
        """Parse a markdown report and extract structured data"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title
        title_match = re.search(r'^# (.+?)$', content, re.MULTILINE)
        title = title_match.group(1) if title_match else "Intelligence Report"
        
        # Extract executive summary
        exec_summary_match = re.search(
            r'## Executive Summary\n\n(.+?)(?=\n##|\Z)', 
            content, 
            re.DOTALL
        )
        exec_summary = exec_summary_match.group(1).strip() if exec_summary_match else ""
        
        # Extract metrics
        metrics = {}
        
        # Reply rate
        reply_rate_match = re.search(r'\*\*Reply Rate:\*\* ([0-9.]+%)', content)
        if reply_rate_match:
            metrics['reply_rate'] = reply_rate_match.group(1)
        
        # Interested leads
        interested_match = re.search(r'\*\*Interested:\*\* (\d+)', content)
        if interested_match:
            metrics['interested_leads'] = interested_match.group(1)
        
        # Email volume
        emails_sent_match = re.search(r'(\d+(?:,\d+)*)\s+emails?\s+sent', content, re.IGNORECASE)
        if emails_sent_match:
            metrics['emails_sent'] = emails_sent_match.group(1)
        
        # Infrastructure
        accounts_match = re.search(r'(\d+)\s+(?:total\s+)?(?:sender\s+)?accounts?', content, re.IGNORECASE)
        if accounts_match:
            metrics['total_accounts'] = accounts_match.group(1)
        
        # Extract sections
        sections = []
        section_pattern = r'^## (.+?)$'
        
        for match in re.finditer(section_pattern, content, re.MULTILINE):
            section_title = match.group(1)
            section_start = match.end()
            
            # Find the next section or end of content
            next_section = re.search(r'^## ', content[section_start:], re.MULTILINE)
            section_end = section_start + next_section.start() if next_section else len(content)
            
            section_content = content[section_start:section_end].strip()
            
            # Check for emoji in section title
            emoji_match = re.match(r'^([🎯🔬💼📊🎪🚀⚠️📈💎🔮📋🏆🚨]+)\s*(.+)$', section_title)
            
            if emoji_match:
                sections.append({
                    'emoji': emoji_match.group(1),
                    'title': emoji_match.group(2),
                    'content': section_content
                })
            else:
                sections.append({
                    'emoji': '',
                    'title': section_title,
                    'content': section_content
                })
        
        # Extract critical insights
        critical_match = re.search(
            r'## 🚨 CRITICAL INSIGHTS\n\n(.+?)(?=\n---|\Z)', 
            content, 
            re.DOTALL
        )
        critical_insights = critical_match.group(1).strip() if critical_match else ""
        
        return {
            'title': title,
            'content': content,
            'executiveSummary': exec_summary,
            'metrics': metrics,
            'sections': sections,
            'criticalInsights': critical_insights
        }
    
    def send_to_pipedream(self, report_data):
        """Send report data to Pipedream webhook"""
        try:
            response = requests.post(
                PIPEDREAM_WEBHOOK_URL,
                json=report_data,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error sending to Pipedream: {e}")
            return None
    
    def process_all_reports(self):
        """Process and send all reports to Pipedream"""
        report_files = list(self.reports_dir.glob("*Intelligence Report*.md"))
        
        print(f"Found {len(report_files)} reports to process")
        print("=" * 50)
        
        results = []
        
        for i, report_file in enumerate(report_files, 1):
            print(f"\n[{i}/{len(report_files)}] Processing: {report_file.name}")
            
            # Parse the report
            report_data = self.parse_markdown_report(report_file)
            
            print(f"  - Title: {report_data['title']}")
            print(f"  - Sections: {len(report_data['sections'])}")
            print(f"  - Metrics: {len(report_data['metrics'])}")
            
            # Send to Pipedream
            if PIPEDREAM_WEBHOOK_URL != "YOUR_PIPEDREAM_WEBHOOK_URL_HERE":
                print("  Sending to Pipedream...")
                result = self.send_to_pipedream(report_data)
                
                if result:
                    print("  Successfully sent to Pipedream!")
                    if 'documentUrl' in result:
                        print(f"  Google Doc: {result['documentUrl']}")
                    results.append({
                        'file': report_file.name,
                        'title': report_data['title'],
                        'status': 'success',
                        'result': result
                    })
                else:
                    print("  Failed to send to Pipedream")
                    results.append({
                        'file': report_file.name,
                        'title': report_data['title'],
                        'status': 'failed'
                    })
                
                # Rate limiting - be nice to Pipedream
                time.sleep(1)
            else:
                print("  Webhook URL not configured - saving to local file")
                # Save to local file for testing
                output_file = Path('pipedream_payloads') / f"{report_file.stem}_payload.json"
                output_file.parent.mkdir(exist_ok=True)
                
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(report_data, f, indent=2)
                
                results.append({
                    'file': report_file.name,
                    'title': report_data['title'],
                    'status': 'saved_locally',
                    'output_file': str(output_file)
                })
        
        # Summary
        print("\n" + "=" * 50)
        print("SUMMARY")
        print("=" * 50)
        
        success_count = sum(1 for r in results if r['status'] == 'success')
        failed_count = sum(1 for r in results if r['status'] == 'failed')
        local_count = sum(1 for r in results if r['status'] == 'saved_locally')
        
        print(f"Successful: {success_count}")
        print(f"Failed: {failed_count}")
        print(f"Saved locally: {local_count}")
        print(f"Total processed: {len(results)}")
        
        # Save results summary
        summary_file = Path('pipedream_results_summary.json')
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump({
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
                'total_reports': len(results),
                'successful': success_count,
                'failed': failed_count,
                'saved_locally': local_count,
                'results': results
            }, f, indent=2)
        
        print(f"\nResults summary saved to: {summary_file}")
        
        return results

def main():
    print("Email Bison Reports -> Pipedream -> Google Docs")
    print("=" * 50)
    
    if PIPEDREAM_WEBHOOK_URL == "YOUR_PIPEDREAM_WEBHOOK_URL_HERE":
        print("\nWARNING: Pipedream webhook URL not configured!")
        print("Please update PIPEDREAM_WEBHOOK_URL in this script.")
        print("For now, reports will be saved to local JSON files.\n")
        print("Processing reports to JSON files...")
    
    processor = ReportProcessor()
    processor.process_all_reports()
    
    print("\nDone! Your reports are ready for beautiful Google Docs creation.")

if __name__ == "__main__":
    main()