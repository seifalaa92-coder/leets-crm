import re

# Read the file
with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace empty font classes with font-display for headings and buttons
# Pattern matches className=" ... " that doesn't have font- specified
content = re.sub(
    r'className="([^"]*)text-\[clamp\(',
    r'className="font-display \1text-[clamp(',
    content
)

# Fix double font-display
content = content.replace('font-display font-display', 'font-display')

# Replace stat values and labels
content = re.sub(
    r'<div className="([^"]*) text-4xl',
    r'<div className="font-display \1 text-4xl',
    content
)
content = re.sub(
    r'<div className="([^"]*) text-white/60 text-sm',
    r'<div className="font-body \1 text-white/60 text-sm',
    content
)

# Replace body text paragraphs
content = re.sub(
    r'<p className="text-base',
    r'<p className="font-body text-base',
    content
)
content = re.sub(
    r'<p className="text-lg',
    r'<p className="font-body text-lg',
    content
)
content = re.sub(
    r'<p className="text-xl',
    r'<p className="font-body text-xl',
    content
)

# Fix specific text colors with body font
content = re.sub(
    r'<p className="font-body text-\[#2D2D2D\]',
    r'<p className="font-body text-[#2D2D2D]',
    content
)

# Write back
with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Font classes updated!")
