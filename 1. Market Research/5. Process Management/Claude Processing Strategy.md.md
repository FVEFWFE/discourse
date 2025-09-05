The user is asking about using Claude Opus 4.1 web agent to process their massive forum data via GitHub. They want a comprehensive prompt and README to ensure Claude processes the data properly and allocates tokens efficiently.

This is a complex data processing task involving 2.6M posts. They need clear instructions for Claude to:
1. Process the data systematically
2. Not waste tokens on redundant analysis
3. Extract the key insights they need
4. Fill in their market research frameworks

I should create both:
1. A GitHub README that structures the data and provides clear instructions
2. A master prompt for Claude that gives it the full context and specific tasks

## **Using Claude Opus 4.1 Web Agent for Processing**

Given the scale (2.6M posts), using Claude makes sense, but needs careful orchestration. Here's the complete setup:

## **GitHub Repository README.md**

```markdown
# ISG Forum Data Processing for Market Research

## ⚠️ IMPORTANT: Processing Instructions for Claude

This repository contains structured forum data for market research analysis. Due to the massive scale (2.6M posts), intelligent processing is critical.

## Repository Structure
```
/isg-market-research/
├── /0_samples/              # START HERE - Representative samples
│   ├── high_value_threads.json    # 100 most engaged threads
│   ├── pain_focused_posts.json    # 1000 posts mentioning problems
│   ├── success_stories.json       # 500 positive outcomes
│   └── README_samples.md          # Sample selection methodology
│
├── /1_extraction_frameworks/  # Use these prompts for analysis
│   ├── psychographic_extraction.md
│   ├── specific_data_points.md
│   └── triangulation_synthesis.md
│
├── /2_processed_data/        # Intermediate analysis results
│   ├── extracted_pains.json
│   ├── extracted_desires.json
│   ├── extracted_objections.json
│   └── language_patterns.json
│
├── /3_market_research_templates/  # FILL THESE IN
│   ├── Doc1_BrandScript_EMPTY.md
│   ├── Doc2_Messaging_EMPTY.md
│   ├── Doc3_OneLiner_EMPTY.md
│   ├── Doc4_ValuePillars_EMPTY.md
│   ├── Doc5_AvatarSummary_EMPTY.md
│   └── Doc6_Competitive_EMPTY.md
│
└── /4_final_outputs/         # Your completed frameworks
    └── [Will be populated after processing]
```

## Processing Workflow

### Phase 1: Understand the Sample (START HERE)
1. Read `/0_samples/README_samples.md` to understand data structure
2. Analyze `high_value_threads.json` for patterns
3. DO NOT process all 2.6M posts directly

### Phase 2: Extract Core Patterns
1. Use frameworks in `/1_extraction_frameworks/`
2. Focus on pattern recognition, not individual posts
3. Save findings to `/2_processed_data/`

### Phase 3: Fill Market Research Templates
1. Use extracted patterns to complete templates in `/3_market_research_templates/`
2. Every claim needs evidence (quote + frequency)
3. Save completed versions to `/4_final_outputs/`

## Token Management Strategy

### DO:
- Process samples first (10K posts max per analysis)
- Summarize patterns before moving to next batch
- Build cumulative insights document
- Focus on high-frequency patterns

### DON'T:
- Try to read all 2.6M posts
- Analyze posts individually
- Generate long summaries of raw data
- Process without structure

## Critical Success Metrics
- [ ] Identify top 100 pains/problems
- [ ] Extract top 100 desires/aspirations
- [ ] Find top 50 objections
- [ ] Discover 20+ competitor mentions
- [ ] Complete all 6 market research documents

## Data Priority Order
1. **Highest Value**: Posts with 50+ replies
2. **Problem Indicators**: Posts with "help", "problem", "issue"
3. **Success Indicators**: Posts with "worked", "success", "recommend"
4. **Financial Data**: Posts mentioning prices/costs
5. **Competitor Intel**: Posts comparing solutions

## Output Requirements
Each completed document must have:
- Minimum 20 verbatim quotes as evidence
- Frequency counts for patterns
- Clear ranking by importance
- Actionable insights
```

## **Master Prompt for Claude Opus 4.1**

```markdown
# Market Research Data Processing Task

You have access to a GitHub repository containing forum data from 2.6M posts. Your goal is to extract market research intelligence and complete strategic frameworks.

## Context
- Industry: Mongering/adult services
- Data: International Sex Guide forum posts
- Purpose: Build product MongerMaps.io (verified provider directory)
- Approach: Extract psychology, not just surface data

## Processing Instructions

### Step 1: Orientation (10 minutes)
1. Read the repository README.md completely
2. Understand the folder structure
3. Review sample data structure in `/0_samples/`
4. DO NOT attempt to process all raw data

### Step 2: Pattern Extraction (2 hours)
Using `/0_samples/high_value_threads.json`:

1. Apply psychographic extraction framework to identify:
   - Pain points (frequency + intensity)
   - Desires (stated vs hidden)
   - Current solutions (what works/fails)
   - Objections to paying for solutions
   - Language patterns (exact words they use)

2. Apply specific data points extraction:
   - Questions (what they don't know)
   - Complaints (what frustrates them)
   - Recommendations (what they value)
   - Success patterns (what works)
   - Price discussions (willingness to pay)

3. Save patterns to `/2_processed_data/` with structure:
```json
{
  "pattern": "description",
  "frequency": number,
  "evidence": ["quote1", "quote2"],
  "insight": "what this means"
}
```

### Step 3: Framework Population (3 hours)

Fill each document in `/3_market_research_templates/`:

#### Doc 1 - BrandScript
- Character: Who they are now vs who they want to be
- Problem: External, Internal, Philosophical
- Use THEIR language from extraction

#### Doc 2 - Messaging Hierarchy  
- Pull verbatim language patterns
- Organize by emotional intensity
- Include frequency counts

#### Doc 3 - One-Liner Testing
- Generate 10 variants using their language
- Score each by pattern match
- Select top 3 for testing

#### Doc 4 - Value Pillars
- Match pillars to top 5 pains
- Include 5+ quotes per pillar
- Find differentiators vs existing solutions

#### Doc 5 - Avatar Summary
- Quick reference of all key patterns
- One-page executive summary
- Include "magic words" list

#### Doc 6 - Competitive Intelligence
- Extract all competitor mentions
- Why people switch
- Gaps in current solutions

### Step 4: Validation (30 minutes)
- Ensure every claim has evidence
- Check pattern frequency counts
- Verify language matches source
- Confirm insights are actionable

## Quality Checks

Before marking a document complete, verify:
- [ ] Minimum 20 verbatim quotes included
- [ ] Patterns ranked by frequency
- [ ] Language is theirs, not cleaned up
- [ ] Insights lead to product decisions
- [ ] No speculation beyond data

## Efficiency Rules

1. **Sample First**: Work with `/0_samples/` before touching raw data
2. **Pattern Focus**: Look for patterns affecting >5% of posts
3. **Evidence Trail**: Every insight links to specific quotes
4. **Cumulative Building**: Each document builds on previous
5. **Stop When Complete**: Don't over-analyze

## Expected Outputs

By end of processing:
1. Six completed market research documents
2. Extracted pattern database
3. Executive summary of findings
4. Specific product recommendations
5. Implementation priorities

## Time Allocation
- Hour 1: Orientation and initial pattern recognition
- Hour 2-3: Deep extraction and pattern analysis
- Hour 4-5: Framework population
- Hour 6: Review and validation

Remember: You're finding the NON-OBVIOUS insights that only analyzing this scale of data can reveal. Focus on patterns invisible to someone reading individual threads.
```

## **Execution Strategy**

```markdown
# How to Execute with Claude

## Option A: Single Session (Recommended)
1. Upload repository as ZIP to Claude
2. Provide master prompt
3. Let Claude work through systematically
4. Cost: ~$50-100
5. Time: 4-6 hours

## Option B: Phased Approach
1. Session 1: Pattern extraction only
2. Session 2: Fill Docs 1-3
3. Session 3: Fill Docs 4-6
4. Cost: ~$30 per session
5. Benefit: Review between phases

## Option C: Hybrid Approach
1. You: Run extraction scripts locally
2. You: Create pattern summaries
3. Claude: Analyze patterns and fill frameworks
4. Cost: ~$20-30
5. Benefit: Most control, lowest cost
```

This approach maximizes Claude's analytical capabilities while managing token costs effectively. The key is pre-structuring the data so Claude focuses on insight generation rather than data processing.