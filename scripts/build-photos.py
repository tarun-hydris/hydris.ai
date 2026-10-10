"""Grade source photographs into one consistent colour look, as a responsive WebP set and manifest.

Usage:  python scripts/build-photos.py ["<source folder>"]
        (default source: E:/Startup/Hydris/website/0. assets/photos, one <name>.jpg per entry below)
Adding a photo: drop <name>.jpg in the source folder, add a line to PHOTOS, rerun.
Output: public/photos/<name>-<width>.webp and src/lib/photos.js
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else r'E:/Startup/Hydris/website/0. assets/photos'
OUT = os.path.join(HERE, '..', 'public', 'photos')
MANIFEST = os.path.join(HERE, '..', 'src', 'lib', 'photos.js')

# name -> accessible description ('' = decorative texture, hidden from assistive tech)
PHOTOS = {
    # Plants and people
    'operators':        'Two experienced operators leaning over machinery in a plant, lit by warm window light',
    'hands-valve':      'Gloved hands fitting a valve onto a water line',
    'stairway':         'Looking down a metal stairway onto circular clarifier tanks',
    'outfall':          'Treated water pouring from a row of outfall pipes',
    'plant-night':      'A water treatment plant lit at night, seen from above',
    'plant-fog':        'Aerial view of a treatment plant with domed tanks in morning mist',
    'plant-bw':         'Black and white aerial view of a large treatment plant with many circular clarifiers',
    # Aerials
    'aerial-rust':      'Aerial view of an industrial site with clarifier tanks and process buildings',
    'aerial-river':     'Aerial view of a clarifier and buildings beside a river',
    'aerial-green':     'Aerial view of circular tanks within a green field',
    'aerial-bank':      'Aerial view of a treatment plant beside a river embankment',
    'riverside':        'Aerial view of a riverside plant with rectangular settling basins and circular clarifiers',
    'clarifiers':       'Aerial view of six circular clarifier and settling tanks',
    'clarifiers-twin':  'Two circular clarifiers joined by a walkway at a hillside treatment plant',
    'clarifier-teal':   'Aerial view of a circular clarifier with a bridge arm',
    'clarifier-top':    'A circular clarifier seen from directly above, its bridge reaching to the centre well',
    'clarifier-detail': 'Looking straight down on the centre well of a clarifier as its bridge crosses the frame',
    'clarifier-snow':   'A clarifier in winter seen from above, a dark circle of water in a field of snow',
    'aeration':         'Aerial view of an aeration basin with bubbling diffusers',
    'tanks-grid':       'Aerial view of two clarifiers beside a grid of aeration tanks',
    'basins':           'Aerial view of aeration basins and two large clarifiers',
    # Water surfaces (decorative textures)
    'water-caustic-dark':  '',
    'water-caustic-light': '',
    'water-caustic-sand':  '',
    'water-ripple':        '',
    'water-surface':       '',
    'water-night':         '',
    'water-dusk':          '',
    'water-deep':          '',
    # Water and abstract studies (2026-10-10). Already graded by their makers, so they get a lighter touch.
    'water-blue':       '',
    'water-copper':     '',
    'water-sunset':     '',
    'ripple-rings':     '',
    'drop-rise':        'A drop rising from dark water, light breaking into colour across the ripples',
    'drop-splash':      '',
    'drop-mono':        'A single drop rising from a ring of ripples',
    'drop-crown':       'A crown of water thrown up by a falling drop',
    'drops-falling':    'Drops falling in a line into still blue water',
    'drops-falling-2':  '',
    'glass-layers':     'Layers of translucent blue glass blocks stacked in depth, an abstract picture of a layered system',
    'crew-rounds':      'Operators at work on a clarifier bridge, seen from above',
    'crew-clarifier':   'A crew on the bridge of a large clarifier, seen from the air',
    'crew-weir':        'Operators checking the weir channel at the edge of a clarifier',
    'data-terrain':     'An abstract landscape of thousands of small columns rising and falling like a data surface',
}
LIGHT = {'water-blue', 'water-copper', 'water-sunset', 'ripple-rings', 'drop-rise', 'drop-splash', 'drop-mono',
         'drop-crown', 'drops-falling', 'drops-falling-2', 'glass-layers', 'data-terrain'}

# The Hydris grade: colour kept, saturation eased, a gentle S-curve and cool, deep-water shadows,
# so photographs from many cameras sit together beside the monochrome interface.
SHADOW = np.array([10, 24, 36], dtype=np.float32) / 255
WIDTHS = [640, 1024, 1600, 2000]
MAX_LANDSCAPE, MAX_PORTRAIT = 2000, 1400

def tame_greens(im):
    """Grass and trees are the loudest thing in an aerial: pull them back and towards teal."""
    hsv = np.asarray(im.convert('HSV'), dtype=np.float32)
    h = hsv[..., 0] * (360 / 255)
    w = np.clip(1 - np.abs(h - 105) / 55, 0, 1) ** 0.8                  # 50 to 160 degrees, peak at 105
    hsv[..., 1] *= 1 - 0.62 * w
    hsv[..., 0] = ((h + 14 * w) % 360) * (255 / 360)
    hsv[..., 2] *= 1 - 0.14 * w
    return Image.fromarray(np.clip(hsv, 0, 255).astype(np.uint8), 'HSV').convert('RGB')

def grade(im, strength=1.0):
    a = np.asarray(im, dtype=np.float32) / 255
    if strength >= 1:
        im = tame_greens(im)
    a0 = a
    a = np.asarray(im, dtype=np.float32) / 255
    luma = lambda x: x[..., 0] * 0.2126 + x[..., 1] * 0.7152 + x[..., 2] * 0.0722
    L = luma(a)
    lo, hi = np.percentile(L, [0.4, 99.6])
    g = np.clip((a - lo) / max(hi - lo, 1e-3), 0, 1)                      # levels, same for every channel
    L = luma(g)[..., None]
    g = L + (g - L) * 0.8                                                 # ease saturation
    g = np.clip(g, 0, 1)
    g = g * g * (3 - 2 * g) * 0.32 + g * 0.68                            # gentle S-curve
    L = luma(g)[..., None]
    w = (1 - L) ** 2.2 * 0.22
    g = g + (SHADOW - g) * w                                              # cool shadows
    g = g * 0.985 + 0.006
    out = a0 + (g - a0) * strength
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))

os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):  # rebuild from scratch so removed photos do not linger
    if f.endswith('.webp'):
        os.remove(os.path.join(OUT, f))

manifest = {}
for name, alt in PHOTOS.items():
    im = Image.open(os.path.join(SRC, f'{name}.jpg'))
    im = ImageOps.exif_transpose(im).convert('RGB')
    W0, H0 = im.size
    cap = MAX_PORTRAIT if H0 > W0 else MAX_LANDSCAPE
    top = min(W0, cap)
    im = im.resize((top, round(H0 * top / W0)), Image.LANCZOS)
    duo = grade(im, 0.45 if name in LIGHT else 1.0)
    W, H = duo.size
    sizes = [w for w in WIDTHS if w < W] + [W]
    for w in sizes:
        out = duo if w == W else duo.resize((w, round(H * w / W)), Image.LANCZOS)
        out.save(os.path.join(OUT, f'{name}-{w}.webp'), 'WEBP', quality=74, method=6)
    tiny = duo.resize((24, max(1, round(H * 24 / W))), Image.LANCZOS)
    buf = io.BytesIO()
    tiny.save(buf, 'WEBP', quality=40)
    avg = duo.resize((1, 1), Image.BOX).getpixel((0, 0))
    manifest[name] = {
        'w': sizes, 'W': W, 'H': H,
        'bg': '#%02x%02x%02x' % avg,
        'lqip': 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode(),
        'alt': alt,
    }
    print(f'{name:20s} {W0}x{H0} -> {W}x{H} {sizes}')

with open(MANIFEST, 'w', encoding='utf8', newline='\n') as f:
    f.write('// Generated by scripts/build-photos.py. Do not edit by hand.\n')
    f.write('export const PHOTOS = ' + json.dumps(manifest, indent=1) + ';\n')
