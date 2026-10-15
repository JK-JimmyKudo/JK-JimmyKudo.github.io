# scripts · 项目工具脚本

这两个脚本之前放在系统临时目录里，重启后被清理过，所以挪到项目里长期保留。

## make-covers.py —— 重新生成项目封面卡

生成 `public/images/app-*.png`（900×900），也就是「精选项目」轮播里那 12 张封面卡。
卡片版式固定：项目配色对角渐变 + 强调色柔光 + 两层细环 + 垂直居中的白色圆角图块，**底板不带文字**。

```bash
cd portfolio
python3 scripts/make-covers.py                 # 重新生成全部 12 张
python3 scripts/make-covers.py --only beichen  # 只重生成某一张（名字见脚本里的 CARDS）
python3 scripts/make-covers.py --dry-run       # 只打印计划
```

图块来源分三种，脚本会自动判断：

| 来源 | 适用项目 | 说明 |
| --- | --- | --- |
| `appstore` | 01 / 03 / 04 / 05 / 06 / 12 | 走 App Store 官方接口取 1024px 图标，缓存在 `scripts/.icon-cache/`；**首次运行需要联网** |
| `glyph` | 08 / 09 / 10 / 11 | 没有官方图标，用线性图形占位（仪表盘 / 手机 / 立方体 / 立方体+人形） |
| `image` | 02 / 07 | 用过你提供的图标。把原图放进 `scripts/src-icons/`（命名 `beichen.png`、`linlehui.png`）就会用源文件；没有源文件时会从现有封面里裁出图块复用，保证不会把已有封面弄坏 |

依赖：Pillow（`python3 -c "import PIL"` 能过就行）。改配色/加项目时，同步改脚本顶部的 `CARDS` 和 `src/data.js`。

## verify-page.mjs —— 渲染核对 + 截图

用本机 Chrome 无头模式打开本地页面，打印关键信息并截图，用来做「改完必须真机渲染验证」这一步。

```bash
cd portfolio
npm run dev -- --port 5175            # 另开一个终端
node scripts/verify-page.mjs                                    # 首页项目区块：卡片数 + 封面加载情况
node scripts/verify-page.mjs --hash '#project/beichen'          # 项目详情页：标题/分类/时间/角色/经历条数
node scripts/verify-page.mjs --hash '#project/beichen' --width 420 --out /tmp/detail-mobile.png
```

注意两点：

1. 截图前脚本会先滚到页面底部再回顶部。站点的显现动画靠 IntersectionObserver，没进过视口的区块停在透明状态，直接截长图会是空白。
2. 预览页面内容变了但文件名没变时，Chrome 可能吃缓存；脚本每次用独立的临时 profile，正常不会踩到。
