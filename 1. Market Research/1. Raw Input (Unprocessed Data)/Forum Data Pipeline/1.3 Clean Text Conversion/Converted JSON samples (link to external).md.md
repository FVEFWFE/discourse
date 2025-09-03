MAYBE this is usable:

The user wants just the SOP for "1.3 Clean Text Conversion" - they don't want all the other stuff I included about GitHub structure, Claude processing, etc. They just want the specific procedure for converting HTML to clean text. Let me create a focused SOP just for that step.

## **File: 1.3 Clean Text Conversion - SOP.md**

```markdown
# 1.3 Clean Text Conversion - Standard Operating Procedure

## Purpose
Convert raw HTML forum files into clean, structured JSON format for analysis.

## Overview
- **Input:** HTML files (~100GB, 2,800 threads)
- **Output:** Clean JSON files (~10GB)
- **Processing Time:** 48-72 hours
- **Preservation:** Keep original HTML files

## Directory Setup
```
/MongerMapsData/
├── /0_raw_html/          # Original files (DO NOT DELETE)
├── /1_cleaned_json/      # Extracted content
├── /2_compressed/        # Optional: Gzipped versions
└── /logs/                # Processing logs
```

## Step 1: Install Requirements
```bash
pip install beautifulsoup4 lxml
```

## Step 2: The Extraction Script
```python
# clean_html_to_json.py

import os
import json
import re
from bs4 import BeautifulSoup
from datetime import datetime
import hashlib

def extract_post_content(html_content):
    """Extract only meaningful content from HTML"""
    soup = BeautifulSoup(html_content, 'lxml')
    
    posts = []
    
    # Extract each post
    for post in soup.find_all('li', class_='postbitlegacy'):
        post_data = {}
        
        # Post ID
        post_id = post.get('id', '')
        if post_id:
            post_data['post_id'] = post_id.replace('post_', '')
        
        # Username
        username = post.find('a', class_='username')
        if username:
            post_data['username'] = username.text.strip()
        
        # Date
        date = post.find('span', class_='date')
        if date:
            post_data['date'] = date.text.strip()
        
        # Post content
        content = post.find('blockquote', class_='postcontent')
        if content:
            text = content.get_text(separator='\n', strip=True)
            post_data['content'] = text
            # Create hash for deduplication
            post_data['content_hash'] = hashlib.md5(text.encode()).hexdigest()[:8]
        
        # User post count (credibility indicator)
        user_info = post.find('div', title=re.compile(r'Posts: \d+'))
        if user_info:
            match = re.search(r'Posts: (\d+)', user_info.get('title', ''))
            if match:
                post_data['user_post_count'] = int(match.group(1))
        
        # Only add if content exists
        if 'content' in post_data and post_data['content']:
            posts.append(post_data)
    
    # Extract thread info
    thread_info = {}
    thread_title = soup.find('span', class_='threadtitle')
    if thread_title:
        thread_info['title'] = thread_title.text.strip()
    
    return {
        'thread': thread_info,
        'posts': posts,
        'post_count': len(posts)
    }

def process_file(html_path, output_dir):
    """Process single HTML file"""
    try:
        # Read HTML
        with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        
        # Extract content
        data = extract_post_content(html)
        
        if data['posts']:  # Only save if posts found
            # Create output path
            relative_path = os.path.relpath(html_path, start='0_raw_html')
            json_path = os.path.join(output_dir, relative_path.replace('.html', '.json'))
            
            # Create directory if needed
            os.makedirs(os.path.dirname(json_path), exist_ok=True)
            
            # Save JSON
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            return True, len(data['posts'])
        
        return False, 0
        
    except Exception as e:
        log_error(f"Error processing {html_path}: {e}")
        return False, 0

def log_error(message):
    """Log errors to file"""
    with open('logs/conversion_errors.log', 'a') as f:
        f.write(f"{datetime.now()}: {message}\n")

def main():
    """Main processing function"""
    input_dir = '0_raw_html'
    output_dir = '1_cleaned_json'
    
    # Create directories
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk(input_dir):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files to process")
    
    # Process files
    successful = 0
    total_posts = 0
    
    for i, file_path in enumerate(html_files, 1):
        success, post_count = process_file(file_path, output_dir)
        
        if success:
            successful += 1
            total_posts += post_count
        
        # Progress update
        if i % 100 == 0:
            print(f"Processed {i}/{len(html_files)} files...")
            print(f"  Successful: {successful}")
            print(f"  Total posts: {total_posts}")
    
    # Final report
    print(f"\nConversion Complete!")
    print(f"Files processed: {successful}/{len(html_files)}")
    print(f"Total posts extracted: {total_posts}")
    print(f"Average posts per file: {total_posts/successful if successful else 0:.1f}")

if __name__ == "__main__":
    main()
```

## Step 3: Run the Conversion
```bash
python clean_html_to_json.py
```

## Step 4: Verify Output

### Sample Check
Manually inspect 5-10 random JSON files to verify:
- Content is properly extracted
- No HTML tags remain
- Special characters handled correctly
- Post structure is consistent

### Quick Validation Script
```python
# validate_conversion.py

import json
import os
import random

def validate_sample(json_dir, sample_size=10):
    """Validate random sample of converted files"""
    json_files = []
    for root, dirs, files in os.walk(json_dir):
        json_files.extend([os.path.join(root, f) for f in files if f.endswith('.json')])
    
    sample = random.sample(json_files, min(sample_size, len(json_files)))
    
    for file_path in sample:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"\nFile: {file_path}")
        print(f"  Thread: {data.get('thread', {}).get('title', 'No title')}")
        print(f"  Posts: {len(data.get('posts', []))}")
        
        if data.get('posts'):
            first_post = data['posts'][0]
            print(f"  Sample post by: {first_post.get('username', 'Unknown')}")
            print(f"  Content preview: {first_post.get('content', '')[:100]}...")

validate_sample('1_cleaned_json')
```

## Step 5: Create Summary Report
```python
# create_summary.py

def create_conversion_summary():
    """Generate summary statistics"""
    
    stats = {
        'total_files': 0,
        'total_posts': 0,
        'unique_users': set(),
        'date_range': [],
        'posts_by_section': {}
    }
    
    for root, dirs, files in os.walk('1_cleaned_json'):
        for file in files:
            if file.endswith('.json'):
                stats['total_files'] += 1
                
                with open(os.path.join(root, file), 'r') as f:
                    data = json.load(f)
                
                stats['total_posts'] += len(data.get('posts', []))
                
                for post in data.get('posts', []):
                    if 'username' in post:
                        stats['unique_users'].add(post['username'])
                    if 'date' in post:
                        stats['date_range'].append(post['date'])
                
                # Track by section
                section = root.split(os.sep)[1] if len(root.split(os.sep)) > 1 else 'root'
                stats['posts_by_section'][section] = stats['posts_by_section'].get(section, 0) + len(data.get('posts', []))
    
    # Save summary
    with open('1_cleaned_json/CONVERSION_SUMMARY.json', 'w') as f:
        json.dump({
            'total_files': stats['total_files'],
            'total_posts': stats['total_posts'],
            'unique_users': len(stats['unique_users']),
            'sections': stats['posts_by_section']
        }, f, indent=2)
    
    print(f"Summary created: {stats['total_files']} files, {stats['total_posts']} posts")

create_conversion_summary()
```

## Expected Output Structure
```
1_cleaned_json/
├── CONVERSION_SUMMARY.json
├── Bangkok/
│   ├── thread_123.json
│   └── thread_124.json
├── Manila/
│   └── thread_456.json
└── [other_sections]/
```

## Output JSON Format
```json
{
  "thread": {
    "title": "Thread Title Here"
  },
  "posts": [
    {
      "post_id": "2954197",
      "username": "User123",
      "date": "10-19-24 10:36",
      "content": "Post content here...",
      "content_hash": "a3f2d8e1",
      "user_post_count": 234
    }
  ],
  "post_count": 15
}
```

## Troubleshooting

### Common Issues
1. **Encoding errors**: Use `errors='ignore'` when reading HTML
2. **Memory issues**: Process files in smaller batches
3. **Missing content**: Check if HTML structure changed
4. **Slow processing**: Use multiprocessing for speed

### Error Log Location
Check `logs/conversion_errors.log` for any files that failed to process.

## Completion Checklist
- [ ] All HTML files processed
- [ ] JSON files created successfully
- [ ] Validation passed
- [ ] Summary report generated
- [ ] Error log reviewed
- [ ] Original HTML files preserved
```

This focused SOP covers just the clean text conversion step - taking raw HTML and converting it to clean JSON, ready for the next stages of analysis.