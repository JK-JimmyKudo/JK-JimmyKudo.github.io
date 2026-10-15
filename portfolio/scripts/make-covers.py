#!/usr/bin/env python3
"""重新生成 portfolio/public/images/app-*.png 项目封面卡（900x900）。

卡片版式：项目配色对角渐变 + 强调色柔光 + 两层细环 + 垂直居中的白色圆角图块（无文字标签）。
图块内容按项目来源分三种：
  appstore  从 App Store 官方接口取 1024px 图标（需要联网，图标缓存在脚本目录）
  glyph     没有官方图标时，用线性图形占位（后台 / 小程序 / SDK）
  image     用户提供的图标文件（放在 scripts/src-icons/ 下）

用法：
  python3 scripts/make-covers.py                 # 重新生成全部
  python3 scripts/make-covers.py --only beichen  # 只重生成某一张
  python3 scripts/make-covers.py --dry-run       # 只看会做什么，不写文件
"""
import argparse
import json
import os
import sys
import urllib.request

from PIL import Image, ImageDraw, ImageFilter

W = H = 900
ICON_SIZE = 420
ICON_CENTER = (450, 450)
ICON_RADIUS_RATIO = 0.24
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CACHE_DIR = os.path.join(SCRIPT_DIR, '.icon-cache')
SRC_ICON_DIR = os.path.join(SCRIPT_DIR, 'src-icons')
OUT_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'public', 'images')

# name -> 卡片定义（accent / 渐变停靠点取自 src/data.js 里对应项目的 gradient、accent）
CARDS = [
    dict(name='zhixiaoban', out='app-zhixiaoban.png', accent='#8fb7ff',
         stops=['#16223a', '#0b1020', '#101a33'], app_id=6648756146),
    dict(name='beichen', out='app-beichen.png', accent='#b39aff',
         stops=['#1c162e', '#0c0a18', '#181230'], image='beichen.png'),
    dict(name='kangyun', out='app-kangyun.png', accent='#7fe3d0',
         stops=['#0e2428', '#0a1417', '#10262c'], app_id=1232482394),
    dict(name='kangqiao', out='app-kangqiao.png', accent='#9ec2ff',
         stops=['#1b2a44', '#0b1220', '#16263f'], app_id=1232153261),
    dict(name='zhonglv', out='app-zhonglv.png', accent='#7fe0a8',
         stops=['#16382c', '#08170f', '#14332a'], app_id=1637809815),
    dict(name='lingzhi', out='app-lingzhi.png', accent='#f0c17a',
         stops=['#241d33', '#0c0a12', '#1c1730'], app_id=1385502150),
    dict(name='linlehui', out='app-linlehui.png', accent='#ff9a5c',
         stops=['#33201a', '#150d0a', '#2b1712'], image='linlehui.png'),
    dict(name='cucc-admin', out='app-cucc-admin.png', accent='#5fd8e0',
         stops=['#0f2a30', '#071114', '#0e262c'], glyph='dashboard'),
    dict(name='pm-miniprogram', out='app-pm-miniprogram.png', accent='#a8e06a',
         stops=['#1d2a12', '#0a1006', '#1a2610'], glyph='miniprogram'),
    dict(name='pm-sdk', out='app-pm-sdk.png', accent='#c0a6ff',
         stops=['#241a33', '#0d0a14', '#201830'], glyph='sdk'),
    dict(name='owner-sdk', out='app-owner-sdk.png', accent='#ffb0a0',
         stops=['#331d1a', '#140b09', '#2b1714'], glyph='sdk-owner'),
    dict(name='laikang-junzhu', out='app-laikang-junzhu.png', accent='#f58ab6',
         stops=['#2c1626', '#12080f', '#26131f'], app_id=6444098110),
]


def hex2rgb(value):
    value = value.lstrip('#')
    return tuple(int(value[i:i + 2], 16) for i in (0, 2, 4))


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_image(stops, size=96):
    """对角渐变：先画小图再放大，避免 81 万次逐像素循环。"""
    small = Image.new('RGB', (size, size))
    px = small.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size - 2)
            color = stops[-1][1]
            for i in range(len(stops) - 1):
                p0, c0 = stops[i]
                p1, c1 = stops[i + 1]
                if p0 <= t <= p1:
                    k = (t - p0) / (p1 - p0) if p1 > p0 else 0
                    color = lerp(c0, c1, k)
                    break
            px[x, y] = color
    return small.resize((W, H), Image.BICUBIC)


def radial_glow(cx, cy, radius, color, alpha=110):
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    steps = 64
    for i in range(steps, 0, -1):
        r = radius * i / steps
        a = int(alpha * (1 - i / steps) ** 1.6)
        if a > 0:
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (a,))
    return layer.filter(ImageFilter.GaussianBlur(40))


def rounded_tile(size, radius_ratio, fill):
    scale = 4
    mask = Image.new('L', (size * scale, size * scale), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size * scale - 1, size * scale - 1], round(size * radius_ratio * scale), fill=255)
    tile = Image.new('RGBA', (size, size), fill)
    tile.putalpha(mask.resize((size, size), Image.LANCZOS))
    return tile


def glyph_tile(kind, accent):
    """没有官方图标时的线性占位图形。"""
    S = ICON_SIZE
    tile = rounded_tile(S, ICON_RADIUS_RATIO, (255, 255, 255, 255))
    d = ImageDraw.Draw(tile)
    c, soft, lw = accent + (255,), accent + (70,), 9

    if kind == 'dashboard':
        d.rounded_rectangle([92, 108, 328, 312], 16, outline=c, width=lw)
        d.line([92, 152, 328, 152], fill=c, width=lw)
        d.ellipse([108, 122, 124, 138], fill=soft)
        d.rounded_rectangle([118, 178, 186, 286], 10, outline=c, width=7)
        for x, top in ((222, 236), (256, 208), (290, 258)):
            d.line([x, 286, x, top], fill=c, width=15)
    elif kind == 'miniprogram':
        d.rounded_rectangle([152, 92, 268, 328], 30, outline=c, width=lw)
        d.line([190, 300, 230, 300], fill=c, width=7)
        for bx, by in ((178, 148), (216, 148), (178, 186), (216, 186)):
            d.rounded_rectangle([bx, by, bx + 30, by + 30], 8, outline=c, width=7)
    elif kind in ('sdk', 'sdk-owner'):
        s = 0.82 if kind == 'sdk-owner' else 1.0
        cx, cy = 210, (168 if kind == 'sdk-owner' else 204)
        top = [(cx, cy - 104 * s), (cx + 90 * s, cy - 52 * s), (cx, cy), (cx - 90 * s, cy - 52 * s)]
        left = [(cx - 90 * s, cy - 52 * s), (cx, cy), (cx, cy + 104 * s), (cx - 90 * s, cy + 52 * s)]
        right = [(cx + 90 * s, cy - 52 * s), (cx, cy), (cx, cy + 104 * s), (cx + 90 * s, cy + 52 * s)]
        d.polygon(top, fill=soft)
        for poly in (top, left, right):
            d.line(poly + [poly[0]], fill=c, width=lw, joint='curve')
        if kind == 'sdk-owner':
            d.ellipse([190, 274, 230, 314], outline=c, width=8)
            d.arc([170, 306, 250, 372], start=200, end=340, fill=c, width=8)
    return tile


def fetch_appstore_icon(app_id):
    """从 App Store 官方接口取 1024px 图标（带本地缓存）。"""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cached = os.path.join(CACHE_DIR, f'{app_id}.png')
    if os.path.exists(cached):
        print(f'  图标缓存命中 {os.path.basename(cached)}')
        return Image.open(cached).convert('RGB')

    lookup = f'https://itunes.apple.com/lookup?id={app_id}&country=cn'
    with urllib.request.urlopen(lookup, timeout=30) as resp:
        payload = json.load(resp)
    if not payload.get('resultCount'):
        raise RuntimeError(f'App Store 查不到 id={app_id}')
    item = payload['results'][0]
    url = (item.get('artworkUrl512') or item['artworkUrl100']).replace(
        '/512x512bb.jpg', '/1024x1024bb.png')
    print(f'  下载 {item["trackName"]} 图标 …')
    with urllib.request.urlopen(url, timeout=30) as resp:
        data = resp.read()
    with open(cached, 'wb') as fh:
        fh.write(data)
    return Image.open(cached).convert('RGB')


def extract_tile_from_card(path):
    """没有源图标文件时，从已生成的封面里裁出中间图块复用（保证可重复生成而不会更差）。"""
    if not os.path.exists(path):
        return None
    card = Image.open(path).convert('RGB')
    if card.size != (W, H):
        return None
    box = (ICON_CENTER[0] - ICON_SIZE // 2, ICON_CENTER[1] - ICON_SIZE // 2,
           ICON_CENTER[0] + ICON_SIZE // 2, ICON_CENTER[1] + ICON_SIZE // 2)
    return card.crop(box)


def tile_for(card, out_path, dry_run):
    accent = hex2rgb(card['accent'])
    if card.get('app_id'):
        if dry_run:
            return None
        icon = fetch_appstore_icon(card['app_id'])
        icon = icon.resize((ICON_SIZE, ICON_SIZE), Image.LANCZOS).convert('RGBA')
        mask = rounded_tile(ICON_SIZE, ICON_RADIUS_RATIO, (255, 255, 255, 255)).getchannel('A')
        icon.putalpha(mask)
        return icon
    if card.get('glyph'):
        return glyph_tile(card['glyph'], accent)

    # image：优先用 scripts/src-icons/ 下的源文件，没有就从现有封面里裁
    src = os.path.join(SRC_ICON_DIR, card['image'])
    if os.path.exists(src):
        icon = Image.open(src).convert('RGB').resize((ICON_SIZE, ICON_SIZE), Image.LANCZOS).convert('RGBA')
        mask = rounded_tile(ICON_SIZE, ICON_RADIUS_RATIO, (255, 255, 255, 255)).getchannel('A')
        icon.putalpha(mask)
        return icon
    fallback = extract_tile_from_card(out_path)
    if fallback is None:
        print(f'  ! 跳过：找不到 {src}，也没有可复用的现有封面')
        return None
    print(f'  · 用现有封面里的图块复用（把原图放到 {os.path.relpath(src, os.path.dirname(SCRIPT_DIR))} 可换回源文件）')
    return fallback.convert('RGBA')


def build(card, out_dir, dry_run=False):
    out_path = os.path.join(out_dir, card['out'])
    print(f'{card["name"]}:')
    accent = hex2rgb(card['accent'])
    stops = [(0.0, hex2rgb(card['stops'][0])), (0.55, hex2rgb(card['stops'][1])), (1.0, hex2rgb(card['stops'][2]))]

    tile = tile_for(card, out_path, dry_run)
    if tile is None and not dry_run:
        return False
    if dry_run:
        print('  （dry-run，未写文件）')
        return True

    base = gradient_image(stops).convert('RGBA')
    base.alpha_composite(radial_glow(600, 250, 340, accent, alpha=110))
    over = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    for radius, alpha in ((258, 60), (300, 26)):
        d.ellipse([ICON_CENTER[0] - radius, ICON_CENTER[1] - radius,
                   ICON_CENTER[0] + radius, ICON_CENTER[1] + radius],
                  outline=accent + (alpha,), width=2)
    base.alpha_composite(over)
    base.alpha_composite(radial_glow(ICON_CENTER[0], ICON_CENTER[1], 330, accent, alpha=90))
    base.alpha_composite(tile, (ICON_CENTER[0] - ICON_SIZE // 2, ICON_CENTER[1] - ICON_SIZE // 2))
    base.convert('RGB').save(out_path, optimize=True)
    print(f'  ✓ {os.path.relpath(out_path, os.path.dirname(SCRIPT_DIR))} ({os.path.getsize(out_path) // 1024} KB)')
    return True


def main():
    parser = argparse.ArgumentParser(description='重新生成项目封面卡')
    parser.add_argument('--only', help='只处理这些项目名，逗号分隔（name 见脚本里的 CARDS）')
    parser.add_argument('--out-dir', default=OUT_DIR, help='输出目录，默认 portfolio/public/images')
    parser.add_argument('--dry-run', action='store_true', help='只打印计划，不写文件')
    args = parser.parse_args()

    wanted = {s.strip() for s in args.only.split(',')} if args.only else None
    cards = [c for c in CARDS if not wanted or c['name'] in wanted]
    if not cards:
        print('没有匹配的项目名')
        return 1

    os.makedirs(args.out_dir, exist_ok=True)
    ok = 0
    for card in cards:
        try:
            if build(card, args.out_dir, args.dry_run):
                ok += 1
        except Exception as exc:  # 单张失败不影响其它卡片
            print(f'  ! {card["name"]} 生成失败：{exc}')
    print(f'\n完成 {ok}/{len(cards)} 张')
    return 0 if ok == len(cards) else 2


if __name__ == '__main__':
    sys.exit(main())
