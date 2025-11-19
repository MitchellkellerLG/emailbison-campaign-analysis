# Segment Analysis API - Example Response

## Overview

The Segment Analysis system enables performance analysis by firmographic segments (industry, company size, seniority) to identify which target personas respond best to campaigns.

## API Endpoint

```
GET /api/clients/[id]/segments?type={segment_type}
```

### Parameters

- `id` (path parameter): Workspace ID (e.g., `123`)
- `type` (query parameter): Segment type - `industry`, `company_size`, or `seniority`

### Example Request

```bash
curl "http://localhost:3000/api/clients/123/segments?type=industry"
```

## Example Response: Industry Segmentation

```json
{
  "segments": [
    {
      "segment_type": "industry",
      "segment_value": "SaaS",
      "total_sent": 1542,
      "total_replies": 218,
      "total_interested": 108,
      "reply_rate": 14.14,
      "interest_rate": 49.54
    },
    {
      "segment_type": "industry",
      "segment_value": "Infrastructure",
      "total_sent": 892,
      "total_replies": 107,
      "total_interested": 54,
      "reply_rate": 12.0,
      "interest_rate": 50.47
    },
    {
      "segment_type": "industry",
      "segment_value": "Education",
      "total_sent": 1127,
      "total_replies": 126,
      "total_interested": 60,
      "reply_rate": 11.18,
      "interest_rate": 47.62
    },
    {
      "segment_type": "industry",
      "segment_value": "Gaming",
      "total_sent": 743,
      "total_replies": 73,
      "total_interested": 33,
      "reply_rate": 9.83,
      "interest_rate": 45.21
    },
    {
      "segment_type": "industry",
      "segment_value": "Healthcare",
      "total_sent": 456,
      "total_replies": 41,
      "total_interested": 17,
      "reply_rate": 8.99,
      "interest_rate": 41.46
    },
    {
      "segment_type": "industry",
      "segment_value": "Finance",
      "total_sent": 465,
      "total_replies": 40,
      "total_interested": 16,
      "reply_rate": 8.6,
      "interest_rate": 40.0
    },
    {
      "segment_type": "industry",
      "segment_value": "Unknown",
      "total_sent": 330,
      "total_replies": 24,
      "total_interested": 9,
      "reply_rate": 7.27,
      "interest_rate": 37.5
    }
  ],
  "segment_type": "industry",
  "summary": {
    "total_segments": 7,
    "best_performer": {
      "segment_value": "SaaS",
      "reply_rate": 14.14
    },
    "worst_performer": {
      "segment_value": "Unknown",
      "reply_rate": 7.27
    }
  },
  "timestamp": "2025-11-19T19:00:00.000Z"
}
```

## Example Response: Seniority Segmentation

```bash
curl "http://localhost:3000/api/clients/123/segments?type=seniority"
```

```json
{
  "segments": [
    {
      "segment_type": "seniority",
      "segment_value": "C-Level",
      "total_sent": 450,
      "total_replies": 72,
      "total_interested": 42,
      "reply_rate": 16.0,
      "interest_rate": 58.33
    },
    {
      "segment_type": "seniority",
      "segment_value": "VP",
      "total_sent": 892,
      "total_replies": 125,
      "total_interested": 65,
      "reply_rate": 14.01,
      "interest_rate": 52.0
    },
    {
      "segment_type": "seniority",
      "segment_value": "Director",
      "total_sent": 1240,
      "total_replies": 148,
      "total_interested": 68,
      "reply_rate": 11.94,
      "interest_rate": 45.95
    },
    {
      "segment_type": "seniority",
      "segment_value": "Manager",
      "total_sent": 1567,
      "total_replies": 156,
      "total_interested": 64,
      "reply_rate": 9.95,
      "interest_rate": 41.03
    },
    {
      "segment_type": "seniority",
      "segment_value": "IC",
      "total_sent": 1006,
      "total_replies": 80,
      "total_interested": 28,
      "reply_rate": 7.95,
      "interest_rate": 35.0
    },
    {
      "segment_type": "seniority",
      "segment_value": "Unknown",
      "total_sent": 400,
      "total_replies": 28,
      "total_interested": 10,
      "reply_rate": 7.0,
      "interest_rate": 35.71
    }
  ],
  "segment_type": "seniority",
  "summary": {
    "total_segments": 6,
    "best_performer": {
      "segment_value": "C-Level",
      "reply_rate": 16.0
    },
    "worst_performer": {
      "segment_value": "Unknown",
      "reply_rate": 7.0
    }
  },
  "timestamp": "2025-11-19T19:00:00.000Z"
}
```

## Example Response: Company Size Segmentation

```bash
curl "http://localhost:3000/api/clients/123/segments?type=company_size"
```

```json
{
  "segments": [
    {
      "segment_type": "company_size",
      "segment_value": "Unknown",
      "total_sent": 5555,
      "total_replies": 609,
      "total_interested": 277,
      "reply_rate": 10.96,
      "interest_rate": 45.48
    }
  ],
  "segment_type": "company_size",
  "summary": {
    "total_segments": 1,
    "best_performer": {
      "segment_value": "Unknown",
      "reply_rate": 10.96
    },
    "worst_performer": {
      "segment_value": "Unknown",
      "reply_rate": 10.96
    }
  },
  "timestamp": "2025-11-19T19:00:00.000Z"
}
```

**Note**: Most leads are classified as "Unknown" company size because the current Lead data model doesn't include `employee_count` field. This can be enhanced with data enrichment services in the future.

## Error Responses

### Invalid Workspace ID

```bash
curl "http://localhost:3000/api/clients/abc/segments?type=industry"
```

```json
{
  "error": "Invalid workspace ID",
  "message": "Workspace ID must be a positive integer"
}
```

**Status**: `400 Bad Request`

### Missing Type Parameter

```bash
curl "http://localhost:3000/api/clients/123/segments"
```

```json
{
  "error": "Missing required parameter",
  "message": "Query parameter \"type\" is required. Must be one of: industry, company_size, seniority"
}
```

**Status**: `400 Bad Request`

### Invalid Type Parameter

```bash
curl "http://localhost:3000/api/clients/123/segments?type=department"
```

```json
{
  "error": "Invalid segment type",
  "message": "Invalid segment type \"department\". Must be one of: industry, company_size, seniority"
}
```

**Status**: `400 Bad Request`

## Key Insights from Example Data

### Industry Analysis
- **SaaS** has the highest reply rate (14.14%) and strong interest conversion (49.54%)
- **Infrastructure** shows excellent interest rate (50.47%) despite lower reply rate
- **Finance** and **Healthcare** show lower engagement across all metrics
- **Unknown** classification indicates leads without clear industry signals

### Seniority Analysis
- **C-Level** executives show highest reply rates (16.0%) and interest rates (58.33%)
- Clear correlation: higher seniority = higher engagement
- **VP** and **Director** levels maintain solid performance
- **IC** (Individual Contributors) show lowest engagement, suggesting focus on decision-makers

### Recommendations Based on Example Data
1. **Prioritize SaaS and Infrastructure** industries for maximum engagement
2. **Target C-Level and VP** roles for highest conversion rates
3. **Investigate "Unknown" classifications** - improve data enrichment
4. **Consider reducing IC targeting** unless specific use case requires it

## Test Coverage

The segment analysis system has comprehensive test coverage:
- **Statement Coverage**: 94.64%
- **Branch Coverage**: 87.5%
- **Function Coverage**: 100%
- **Line Coverage**: 94.54%

All tests passed (20/20) ✓

## Implementation Files

- **Service**: `/lib/services/segment-analysis.ts`
- **API Route**: `/app/api/clients/[id]/segments/route.ts`
- **Tests**: `/lib/services/__tests__/segment-analysis.test.ts`
- **Types**: `/lib/types/bison.ts` (Segment interface)
