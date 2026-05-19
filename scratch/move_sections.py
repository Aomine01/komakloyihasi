import re

file_path = 'components/sections/StatisticsPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Extract Data Grid section
pattern_data_grid = r"(?s)( +\{/\* ── Data Grid \(Gender & Bar Chart\) ── \*/\}.*?</section>\n)"
match_data_grid = re.search(pattern_data_grid, content)
if not match_data_grid:
    print('Data grid section not found!')
    exit(1)

data_grid_str = match_data_grid.group(1)

# Remove Data Grid from original location
content = content.replace(data_grid_str, '')

# 2. Insert Data Grid before Charts Row
pattern_charts_row = r"( +\{/\* ── Charts Row \(Pie & Table\) ── \*/\})"
content = re.sub(pattern_charts_row, lambda m: data_grid_str + '\n' + m.group(1), content, count=1)

# 3. Fix margins
content = content.replace(
    '{/* ── Data Grid (Gender & Bar Chart) ── */}\n      <section className="px-6 max-w-7xl mx-auto pb-16">',
    '{/* ── Data Grid (Gender & Table) ── */}\n      <section className="px-6 max-w-7xl mx-auto mb-10">'
)
content = content.replace(
    '{/* ── Til taqsimoti & Ta\'minot turi ── */}\n      <section className="px-6 max-w-7xl mx-auto mb-10">',
    '{/* ── Til taqsimoti & Ta\'minot turi ── */}\n      <section className="px-6 max-w-7xl mx-auto pb-16">'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
