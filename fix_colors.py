import re

# Read the file
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace colors with Nike palette
replacements = {
    '#E8461A': '#EA553B',  # Nike orange/red
    '#C93B14': '#D14028',  # Darker orange
    '#F26035': '#FF6B4F',  # Light orange
    '#E8E1D0': '#E5E5E5',  # Light gray
    '#F5F4F0': '#F5F5F5',  # Off-white
    '#1E1E1E': '#111111',  # Dark
    'bg-[#111111]': 'bg-black',
    'text-[#111111]': 'text-black',
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Write back
with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Colors updated to Nike palette!")
