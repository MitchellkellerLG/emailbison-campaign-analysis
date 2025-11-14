# /analyze-campaigns Command

**Status:** Template - Implementation Pending (Phase 4)

## Purpose
Pull campaign performance data for authority statement enrichment (can be run standalone).

## Usage
```
/analyze-campaigns [client-name]
```

## Functionality
- Query EmailBison for specified client workspace
- Calculate reply rates for all campaigns
- Identify high performers (>8% reply rate)
- Save to `/content/private/authority-statements.md`

## Output
- Campaign performance summary
- High-performing campaigns flagged
- Data ready for content-writer use

## Next Steps
Implement full command during Phase 4 (Task 4.3)
