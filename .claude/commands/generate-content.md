# /generate-content Command

**Status:** Template - Implementation Pending (Phase 4)

## Purpose
Orchestrates full pipeline from Fireflies transcripts to Typefully drafts.

## Usage
```
/generate-content [date-range]
```

## Pipeline Steps
1. Invoke transcript-extractor with date range
2. Invoke content-ideator on new transcripts
3. Invoke data-enricher for authority statements
4.Invoke content-writer for all queued briefs
5. Invoke content-anonymizer on private drafts
6. Invoke content-editor for scoring and Typefully publishing

## Error Handling
- Halt immediately on failures
- Report which stage failed
- Provide troubleshooting guidance

## Output
- Progress updates per stage
- Summary of content created
- Links to Typefully drafts

## Next Steps
Implement full command during Phase 4 (Task 4.2)
