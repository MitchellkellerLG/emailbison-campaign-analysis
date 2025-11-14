# Pipedream MCP Setup for Google Docs Integration

## Option 1: Direct Pipedream Integration (Recommended)

### 1. Create Pipedream Workflow for Google Docs
```javascript
// Create a new Pipedream workflow with these steps:

// Step 1: Webhook Trigger
// This receives data from Claude Code

// Step 2: Parse Report Data
export default defineComponent({
  async run({ steps, $ }) {
    const reportData = steps.trigger.event.body;
    
    // Parse markdown report
    const sections = reportData.markdown.split('##');
    
    return {
      title: reportData.title,
      workspace: reportData.workspace,
      sections: sections,
      metrics: reportData.metrics
    };
  }
});

// Step 3: Create/Update Google Doc
export default defineComponent({
  props: {
    google_docs: {
      type: "app",
      app: "google_docs",
    }
  },
  async run({ steps, $ }) {
    // Create new document
    const doc = await this.google_docs.documents.create({
      title: steps.parse_report.$return_value.title,
    });
    
    // Build formatted content
    const requests = [
      {
        insertText: {
          location: { index: 1 },
          text: steps.parse_report.$return_value.title + "\n\n"
        }
      },
      {
        updateTextStyle: {
          range: {
            startIndex: 1,
            endIndex: steps.parse_report.$return_value.title.length + 1
          },
          textStyle: {
            bold: true,
            fontSize: { magnitude: 24, unit: 'PT' }
          },
          fields: 'bold,fontSize'
        }
      }
    ];
    
    // Add sections with formatting
    let currentIndex = steps.parse_report.$return_value.title.length + 3;
    
    for (const section of steps.parse_report.$return_value.sections) {
      // Add section content and formatting
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: section + "\n\n"
        }
      });
      currentIndex += section.length + 2;
    }
    
    // Apply all formatting
    await this.google_docs.documents.batchUpdate({
      documentId: doc.documentId,
      requests: requests
    });
    
    return {
      documentId: doc.documentId,
      documentUrl: `https://docs.google.com/document/d/${doc.documentId}/edit`
    };
  }
});
```

### 2. Create Local HTTP Endpoint
Since Pipedream MCPs aren't directly available, create a simple HTTP interface:

```python
# pipedream_connector.py
import requests
import json

PIPEDREAM_WEBHOOK_URL = "YOUR_PIPEDREAM_WEBHOOK_URL"

def create_google_doc_report(markdown_content, title, workspace, metrics):
    """Send report data to Pipedream for Google Docs creation"""
    
    payload = {
        "title": title,
        "workspace": workspace,
        "markdown": markdown_content,
        "metrics": metrics,
        "timestamp": datetime.now().isoformat()
    }
    
    response = requests.post(PIPEDREAM_WEBHOOK_URL, json=payload)
    return response.json()
```

## Option 2: Direct Google API Integration

### 1. Install Google Client Library
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### 2. Create Service Account
1. Go to Google Cloud Console
2. Create new project or select existing
3. Enable Google Docs API
4. Create service account
5. Download credentials JSON

### 3. Create Report Generator
```python
# google_docs_reporter.py
from google.oauth2 import service_account
from googleapiclient.discovery import build
import markdown2
import re

class GoogleDocsReporter:
    def __init__(self, credentials_file):
        self.creds = service_account.Credentials.from_service_account_file(
            credentials_file,
            scopes=['https://www.googleapis.com/auth/documents']
        )
        self.service = build('docs', 'v1', credentials=self.creds)
    
    def create_report(self, markdown_file_path, title):
        # Read markdown
        with open(markdown_file_path, 'r') as f:
            markdown_content = f.read()
        
        # Create document
        doc = self.service.documents().create(body={'title': title}).execute()
        doc_id = doc.get('documentId')
        
        # Convert markdown to Google Docs format
        requests = self._markdown_to_docs_requests(markdown_content)
        
        # Apply formatting
        self.service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()
        
        return f"https://docs.google.com/document/d/{doc_id}/edit"
    
    def _markdown_to_docs_requests(self, markdown):
        # Convert markdown to Google Docs API requests
        requests = []
        
        # Parse markdown and create formatted requests
        lines = markdown.split('\n')
        current_index = 1
        
        for line in lines:
            # Headers
            if line.startswith('# '):
                text = line[2:] + '\n'
                requests.extend([
                    {
                        'insertText': {
                            'location': {'index': current_index},
                            'text': text
                        }
                    },
                    {
                        'updateParagraphStyle': {
                            'range': {
                                'startIndex': current_index,
                                'endIndex': current_index + len(text)
                            },
                            'paragraphStyle': {
                                'namedStyleType': 'HEADING_1'
                            },
                            'fields': 'namedStyleType'
                        }
                    }
                ])
                current_index += len(text)
            
            # Add more formatting rules...
            
        return requests
```

## Option 3: Use Existing Tools

### Create a Shell Script
```bash
#!/bin/bash
# report_to_docs.sh

# Use pandoc to convert markdown to docx
pandoc "$1" -o temp_report.docx

# Use Google Drive CLI to upload
gdrive upload temp_report.docx --parent YOUR_FOLDER_ID

# Clean up
rm temp_report.docx
```

## Recommended Approach for You:

1. **Create Pipedream Workflow** with:
   - Webhook trigger
   - Google Docs integration
   - Formatting logic

2. **Create Local Script** to send reports:
```python
import requests
import json
import glob

def upload_report_to_google_docs(report_path):
    with open(report_path, 'r') as f:
        content = f.read()
    
    # Extract title from first line
    title = content.split('\n')[0].replace('# ', '')
    
    # Send to Pipedream
    response = requests.post(
        'YOUR_PIPEDREAM_WEBHOOK_URL',
        json={
            'title': title,
            'content': content,
            'format': 'markdown'
        }
    )
    
    return response.json()['documentUrl']

# Process all reports
for report in glob.glob('Client Reports/*.md'):
    doc_url = upload_report_to_google_docs(report)
    print(f"Created: {doc_url}")
```

Would you like me to:
1. Create the complete Pipedream workflow code?
2. Build a Python script for direct Google Docs API?
3. Set up a different integration approach?

The Pipedream webhook approach is probably easiest since you already have Pipedream access!