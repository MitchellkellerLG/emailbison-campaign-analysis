// Pipedream Workflow: Email Bison Reports to Beautiful Google Docs
// This workflow receives report data and creates formatted Google Docs

export default defineComponent({
  name: "Email Bison Report Beautifier",
  description: "Creates beautiful Google Docs from Email Bison intelligence reports",
  props: {
    google_docs: {
      type: "app",
      app: "google_docs",
    },
  },
  async run({ steps, $ }) {
    // Input from the trigger (webhook or manual)
    const { title, content, sections, metrics, criticalInsights } = steps.trigger.event;
    
    // Create new Google Doc
    const doc = await this.google_docs.createDocument({
      title: `${title} - ${new Date().toLocaleDateString()}`,
    });
    
    const documentId = doc.documentId;
    
    // Build requests array for batch update
    const requests = [];
    let currentIndex = 1;
    
    // 1. Add Title with formatting
    const titleText = `${title}\n\n`;
    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: titleText,
      },
    });
    
    requests.push({
      updateTextStyle: {
        range: {
          startIndex: currentIndex,
          endIndex: currentIndex + title.length,
        },
        textStyle: {
          bold: true,
          fontSize: {
            magnitude: 28,
            unit: "PT",
          },
          foregroundColor: {
            color: {
              rgbColor: {
                blue: 0.2,
                green: 0.2,
                red: 0.2,
              },
            },
          },
        },
        fields: "bold,fontSize,foregroundColor",
      },
    });
    
    currentIndex += titleText.length;
    
    // 2. Add Executive Summary Box
    const summaryHeader = "EXECUTIVE SUMMARY\n";
    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: summaryHeader,
      },
    });
    
    requests.push({
      updateTextStyle: {
        range: {
          startIndex: currentIndex,
          endIndex: currentIndex + summaryHeader.length - 1,
        },
        textStyle: {
          bold: true,
          fontSize: {
            magnitude: 14,
            unit: "PT",
          },
          foregroundColor: {
            color: {
              rgbColor: {
                blue: 0.8,
                green: 0.4,
                red: 0.2,
              },
            },
          },
        },
        fields: "bold,fontSize,foregroundColor",
      },
    });
    
    // Add background color for summary section
    requests.push({
      updateParagraphStyle: {
        range: {
          startIndex: currentIndex,
          endIndex: currentIndex + summaryHeader.length,
        },
        paragraphStyle: {
          shading: {
            backgroundColor: {
              color: {
                rgbColor: {
                  blue: 0.95,
                  green: 0.95,
                  red: 0.95,
                },
              },
            },
          },
        },
        fields: "shading",
      },
    });
    
    currentIndex += summaryHeader.length;
    
    // 3. Add Key Metrics Table
    if (metrics) {
      const metricsText = "\nKEY METRICS\n";
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: metricsText,
        },
      });
      
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: currentIndex + 1,
            endIndex: currentIndex + metricsText.length - 1,
          },
          textStyle: {
            bold: true,
            fontSize: {
              magnitude: 12,
              unit: "PT",
            },
          },
          fields: "bold,fontSize",
        },
      });
      
      currentIndex += metricsText.length;
      
      // Add metrics as bullet points
      Object.entries(metrics).forEach(([key, value]) => {
        const metricText = `• ${key.replace(/_/g, ' ').toUpperCase()}: ${value}\n`;
        requests.push({
          insertText: {
            location: { index: currentIndex },
            text: metricText,
          },
        });
        
        // Style the metric value
        const colonIndex = metricText.indexOf(':');
        requests.push({
          updateTextStyle: {
            range: {
              startIndex: currentIndex + colonIndex + 2,
              endIndex: currentIndex + metricText.length - 1,
            },
            textStyle: {
              bold: true,
              foregroundColor: {
                color: {
                  rgbColor: {
                    blue: 0.2,
                    green: 0.6,
                    red: 0.2,
                  },
                },
              },
            },
            fields: "bold,foregroundColor",
          },
        });
        
        currentIndex += metricText.length;
      });
    }
    
    // 4. Add Sections with Special Formatting
    if (sections && Array.isArray(sections)) {
      sections.forEach(section => {
        // Add section header
        const sectionHeader = `\n${section.emoji || ''} ${section.title}\n\n`;
        requests.push({
          insertText: {
            location: { index: currentIndex },
            text: sectionHeader,
          },
        });
        
        requests.push({
          updateTextStyle: {
            range: {
              startIndex: currentIndex + 1,
              endIndex: currentIndex + sectionHeader.length - 2,
            },
            textStyle: {
              bold: true,
              fontSize: {
                magnitude: 16,
                unit: "PT",
              },
              foregroundColor: {
                color: {
                  rgbColor: {
                    blue: 0.4,
                    green: 0.2,
                    red: 0.2,
                  },
                },
              },
            },
            fields: "bold,fontSize,foregroundColor",
          },
        });
        
        currentIndex += sectionHeader.length;
        
        // Add section content
        if (section.content) {
          const contentText = `${section.content}\n\n`;
          requests.push({
            insertText: {
              location: { index: currentIndex },
              text: contentText,
            },
          });
          currentIndex += contentText.length;
        }
      });
    }
    
    // 5. Add Critical Insights with Alert Styling
    if (criticalInsights) {
      const alertHeader = "\n🚨 CRITICAL INSIGHTS\n\n";
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: alertHeader,
        },
      });
      
      requests.push({
        updateTextStyle: {
          range: {
            startIndex: currentIndex + 1,
            endIndex: currentIndex + alertHeader.length - 2,
          },
          textStyle: {
            bold: true,
            fontSize: {
              magnitude: 16,
              unit: "PT",
            },
            foregroundColor: {
              color: {
                rgbColor: {
                  blue: 0.1,
                  green: 0.1,
                  red: 0.8,
                },
              },
            },
          },
          fields: "bold,fontSize,foregroundColor",
        },
      });
      
      currentIndex += alertHeader.length;
      
      // Add critical insights content
      const insightsText = `${criticalInsights}\n\n`;
      requests.push({
        insertText: {
          location: { index: currentIndex },
          text: insightsText,
        },
      });
      
      // Add yellow background for critical insights
      requests.push({
        updateParagraphStyle: {
          range: {
            startIndex: currentIndex,
            endIndex: currentIndex + insightsText.length,
          },
          paragraphStyle: {
            shading: {
              backgroundColor: {
                color: {
                  rgbColor: {
                    blue: 0.8,
                    green: 0.95,
                    red: 1.0,
                  },
                },
              },
            },
          },
          fields: "shading",
        },
      });
      
      currentIndex += insightsText.length;
    }
    
    // 6. Add Footer
    const footer = `\n\n---\nGenerated by Email Bison Intelligence System\n${new Date().toLocaleString()}`;
    requests.push({
      insertText: {
        location: { index: currentIndex },
        text: footer,
      },
    });
    
    requests.push({
      updateTextStyle: {
        range: {
          startIndex: currentIndex,
          endIndex: currentIndex + footer.length,
        },
        textStyle: {
          italic: true,
          fontSize: {
            magnitude: 10,
            unit: "PT",
          },
          foregroundColor: {
            color: {
              rgbColor: {
                blue: 0.5,
                green: 0.5,
                red: 0.5,
              },
            },
          },
        },
        fields: "italic,fontSize,foregroundColor",
      },
    });
    
    // Apply all updates in a single batch
    await this.google_docs.batchUpdateDocument({
      documentId,
      requests,
    });
    
    // Create a shareable link
    const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    
    return {
      success: true,
      documentId,
      documentUrl: docUrl,
      title: title,
      message: `Successfully created Google Doc: ${title}`,
    };
  },
});