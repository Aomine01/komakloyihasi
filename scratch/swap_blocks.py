import re

file_path = 'components/sections/StatisticsPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract Gender Breakdown
pattern_gender = r"(?s)( +\{/\* Gender Breakdown \*/\}.*?)(?= +\{/\* Regional Table \*/\})"
match_gender = re.search(pattern_gender, content)
if not match_gender:
    print('Gender breakdown not found!')
    exit(1)
gender_str = match_gender.group(1)

# 2. Extract Pie chart
pattern_pie = r"(?s)( +\{/\* Pie chart — Left side now \*/\}.*?)(?= +\{/\* Bar chart — Right side now with Year Toggle \*/\})"
match_pie = re.search(pattern_pie, content)
if not match_pie:
    print('Pie chart not found!')
    exit(1)
pie_str = match_pie.group(1)

# 3. Swap them
content = content.replace(gender_str, "PLACEHOLDER_GENDER")
content = content.replace(pie_str, "PLACEHOLDER_PIE")

content = content.replace("PLACEHOLDER_GENDER", pie_str)
content = content.replace("PLACEHOLDER_PIE", gender_str)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Swapped successfully!')
