# Remakes src/og/fonts: static TTF instances of the site's variable fonts, for the share cards
# (src/og/og.mjs). satori reads TTF, OTF or WOFF but not WOFF2, and draws a variable font only at its
# default axes. Run after updating @fontsource-variable/*:  pip install fonttools brotli
#   python3 scripts/og-fonts.py
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

FONTS = 'node_modules/@fontsource-variable/'
OUT = 'src/og/fonts/'

def make(src, axes, out):
    font = instancer.instantiateVariableFont(TTFont(FONTS + src), axes)
    font.flavor = None
    font.save(OUT + out)

make('bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2',
     {'opsz': 96, 'wght': 650, 'wdth': 100}, 'bricolage-grotesque-650.ttf')
make('geist/files/geist-latin-wght-normal.woff2', {'wght': 400}, 'geist-400.ttf')
make('geist/files/geist-latin-wght-normal.woff2', {'wght': 600}, 'geist-600.ttf')
