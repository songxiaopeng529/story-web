# 白色系首页：四种视觉与互动方向

阶段：静态设计探索，未修改 src、public 或现有首页。按 frontend-design 的单一视觉重心原则，四版只改变主视觉与相应字体气质，不扩展栏目内容。

## 头像

来源：https://github.com/songxiaopeng529/
公开 API 返回头像：https://avatars.githubusercontent.com/u/188959302?v=4
已保存原图：[github-avatar.jpg](assets/github-avatar.jpg)。生成时作为唯一参考图片，只用于头像，不作为主视觉。概念图里的头像可能有生成偏差，尺寸也尚未统一；实际实现应直接加载原图并统一为 36–40px 圆形头像，不使用截图中的再生成头像。

## 共同规范

白 #FFFFFF；纸白 #F5F5F4；浅灰 #D9DBDE；石墨 #242629。保留左上单行“让想法，慢慢成形。”、顶部头像和首页／文章／作品三个入口。没有底部小字、CTA、卡片和装饰标签。水墨版用宋体气质中文，其余为干净的无衬线中文；以字体、材料与留白区分风格。

## 互动提案（未实现）

用户提及指针／鼠标／屏幕互动：此处按鼠标或触摸驱动主视觉理解，保留系统指针；文字与 Header 不随主视觉一起晃动。

- 已认可的纸雕：鼠标在主视觉范围内靠近时，附近边缘轻微抬起，投影随角度变化。需要参数化纸面网格与灯光才能真实改变轮廓和阴影；图片位移只能做预览级视差，不能等同真实折叠。手机采用轻触响应，若加入拖动则限定横向，保留纵向页面滚动。
- 水墨留白：首次以路径遮罩显露笔触；鼠标靠近时局部边缘轻微晕开再恢复，避免整幅墨迹反复扭曲。可用原始笔触纹理加局部遮罩／shader，参数有界。
- 建筑浮雕：几何主体稳定，鼠标只小范围改变灯光与观察角度，体现投影变化。用简单几何建模，不把凹凸形体仅做成图片晃动。
- 金属悬浮装置：指针接近产生轻微受力，悬片绕挂点摆动并带阻尼回归，触屏轻触可拨动。概念图中的连接是视觉示意，实际建模要修正悬挂连接与支点，不能直接宣称物理平衡成立。
- 细线生成艺术：使用参数化曲线原生绘制，鼠标附近的线条轻微排开，离开后阻尼回弹；手机横向拖动或轻触形成局部波纹，纵向拖动正常滚动。相较复杂材质重建，曲线方案更容易保持设计稿与实际互动的一致性。

共同护栏：动态幅度有界；无持续鼠标尾迹；不替换指针；不遮挡文字；不依赖 hover 才能导航。减少动态偏好直接静态，后台暂停，移动端降低复杂度；不申请陀螺仪权限。

## 生成记录

工具：内置 image_gen，每种方向独立生成。以下图片已逐张查看并保存。四张都是单页概念图，不是已实现页面的截图，也不是动画视频。

### 水墨留白

[设计图](mockups/home-white-ink-v1.png)

```text
Use case: ui-mockup. Create ONE full desktop personal website homepage design image, landscape 1536x1024 composition, flat frontal screenshot, no device frame. Input image is ONLY the owner's GitHub AVATAR reference: use this exact anime illustration of a glasses-wearing person driving with a fluffy cat in a rainy car, faithfully miniaturized into a small 40px circular avatar at x70 y55. Do not make the avatar scene into the hero. A bright neutral-white #FFFFFF page, very generous negative space, charcoal #242629 typography. Top right navigation in precise Chinese "首页" "文章" "作品", regular refined 18px type, 46px gaps, only 首页 underlined. At x80 and y240, one strong single-line slogan EXACT "让想法，慢慢成形。" in dark charcoal, around 58px, optically beautiful letter spacing; it must stay on a single line, away from hero artwork. ONLY header, slogan and one central artistic visual. No name, no subtitle, no footer, no buttons, no stats, no decorative labels, no fake cursor, no borders or cards, no presentation captions, no logos strip. Personal digital studio, cultivated and imaginative. The composition must feel highly intentional with the headline balanced against the art in the lower-right. ART DIRECTION: Contemporary monochrome ink gesture, visual poetry of thought becoming a stroke. Hero is one magnificent expressive black-ink gesture sweeping through the right half and lower middle of the page, a loose incomplete asymmetrical arc with a long tapered sweep, NOT a closed Zen circle or a recognizable letter. Rich opaque-black ink at one edge transitions into dry-brush strands and delicately diluted gray feathering on white. It looks like an expert's deliberate abstract brush artwork photographed from above, genuine organic texture, strong motion yet spacious, not a messy splatter, no traditional landscape, no mountains, no calligraphy words. The ink gesture occupies x700–1400 y370–850, with a little reach into lower-left space, no overlap with slogan. Headline in sophisticated contemporary Chinese Song-style serif, medium contrast, regular weight, not calligraphy; header stays clean sans. White everywhere else, absolutely no parchment/beige tint. Flat ink graphic, no 3D object or floor shadow. Gallery-editorial restraint and expressive material contrast.
```

### 建筑浮雕

[设计图](mockups/home-white-relief-v1.png)

```text
Use case: ui-mockup. Create ONE full desktop personal website homepage design image, landscape 1536x1024 composition, flat frontal screenshot, no device frame. Input image is ONLY the owner's GitHub AVATAR reference: use this exact anime illustration of a glasses-wearing person driving with a fluffy cat in a rainy car, faithfully miniaturized into a small 40px circular avatar at x70 y55. Do not make the avatar scene into the hero. A bright neutral-white #FFFFFF page, very generous negative space, charcoal #242629 typography. Top right navigation in precise Chinese "首页" "文章" "作品", regular refined 18px type, 46px gaps, only 首页 underlined. At x80 and y240, one strong single-line slogan EXACT "让想法，慢慢成形。" in dark charcoal, around 58px, optically beautiful letter spacing; it must stay on a single line, away from hero artwork. ONLY header, slogan and one central artistic visual. No name, no subtitle, no footer, no buttons, no stats, no decorative labels, no fake cursor, no borders or cards, no presentation captions, no logos strip. Personal digital studio, cultivated and imaginative. The composition must feel highly intentional with the headline balanced against the art in the lower-right. ART DIRECTION: Architectural white bas-relief, a topographic thought-space carved directly into a continuous white page. Hero on right is a large sharply composed sculptural relief of 6 or 7 broad offset rectangular terraces, a sunken square transitioning into an asymmetric rising angular ridge, like a refined unbuilt architect's plaster model. Cropped close enough to feel monumental but the whole main silhouette remains readable. Matte white mineral/plaster surfaces, exceptionally crisp beveled edges, restrained natural concrete-like fine texture, NO spirals, no paper curls. Directional daylight grazes from top left, making long pale-gray shadows and darker occlusion in inner steps; white-on-white volume must be beautifully legible. Right-side artwork around x760–1460 y300–900, its shadows softly disappear into pure white. Headline: clean elegant modern Chinese sans-serif regular/light weight, around58px. The geometry expresses deliberate construction, quiet precision and spatial depth, not a busy architectural cityscape. No windows, no plants, no room interior, no annotations.
```

### 金属悬浮装置

[设计图](mockups/home-white-mobile-v1.png)

```text
Use case: ui-mockup. Create ONE full desktop personal website homepage design image, landscape 1536x1024 composition, flat frontal screenshot, no device frame. Input image is ONLY the owner's GitHub AVATAR reference: use this exact anime illustration of a glasses-wearing person driving with a fluffy cat in a rainy car, faithfully miniaturized into a small 40px circular avatar at x70 y55. Do not make the avatar scene into the hero. A bright neutral-white #FFFFFF page, very generous negative space, charcoal #242629 typography. Top right navigation in precise Chinese "首页" "文章" "作品", regular refined 18px type, 46px gaps, only 首页 underlined. At x80 and y240, one strong single-line slogan EXACT "让想法，慢慢成形。" in dark charcoal, around 58px, optically beautiful letter spacing; it must stay on a single line, away from hero artwork. ONLY header, slogan and one central artistic visual. No name, no subtitle, no footer, no buttons, no stats, no decorative labels, no fake cursor, no borders or cards, no presentation captions, no logos strip. Personal digital studio, cultivated and imaginative. The composition must feel highly intentional with the headline balanced against the art in the lower-right. ART DIRECTION: Kinetic silver mobile in a pure white daylight gallery, a precise yet playful balance sculpture. The hero on right is a delicate freestanding mobile consisting of a thin dark polished-steel bowed stem on a small minimal white base, and three elegantly curved fine rods balancing five organic oblong petal-like plates, some brushed matte silver, some soft pearl white, one charcoal. Realistic mechanically plausible balance and attachments. Reflective yet restrained cool silver, NOT liquid chrome blobs, NOT glass, NOT a mirror donut, NOT balloons. A very airy arrangement with substantial empty white between suspended pieces. Beautiful fine lines versus smooth broad leaf shapes, asymmetric balanced composition, subtle overlapping soft shadows on white floor, a small amount of polished edge gleam. Center-right x790–1340 y270–890, entire mobile silhouette visible, no overlap with the single-line slogan. Headline clean refined Chinese sans-serif regular weight. The image should evoke a collector's edition design object, a personally crafted moving idea, lightness and precision. No room or gallery frame, no display labels or pedestal block, no other furniture. Avatar must stay very small around40px, not an oversized portrait.
```

### 细线生成艺术

[设计图](mockups/home-white-lines-v1.png)

```text
Use case: ui-mockup. Create ONE full desktop personal website homepage design image, landscape 1536x1024 composition, flat frontal screenshot, no device frame. Input image is ONLY the owner's GitHub AVATAR reference: use this exact anime illustration of a glasses-wearing person driving with a fluffy cat in a rainy car, faithfully miniaturized into a small 40px circular avatar at x70 y55. Do not make the avatar scene into the hero. A bright neutral-white #FFFFFF page, very generous negative space, charcoal #242629 typography. Top right navigation in precise Chinese "首页" "文章" "作品", regular refined 18px type, 46px gaps, only 首页 underlined. At x80 and y240, one strong single-line slogan EXACT "让想法，慢慢成形。" in dark charcoal, around 58px, optically beautiful letter spacing; it must stay on a single line, away from hero artwork. ONLY header, slogan and one central artistic visual. No name, no subtitle, no footer, no buttons, no stats, no decorative labels, no fake cursor, no borders or cards, no presentation captions, no logos strip. Personal digital studio, cultivated and imaginative. The composition must feel highly intentional with the headline balanced against the art in the lower-right. ART DIRECTION: Computational line poetry, a delicate generative drawing on a bright-white canvas. The hero in the right half and lower center is one graceful three-dimensional flowing ribbon surface described entirely by 80–120 extremely fine charcoal and silver-gray parallel contour curves, forming a twisting open saddle-wave. Lines are crisp, visibly separated, organic yet mathematically harmonious; densify at folds and open into airy spaces at the crest, optical depth without solid shading. Not a wireframe sphere, torus, topographic map, network graph, fuzzy fur or chaotic scribble. No filled 3D surface, no floor shadow. The ribbon has one high lifted crest at right and a lower taper that lightly extends left below the slogan, occupying x580–1430 y330–870. A restrained digital drawing, like a piece of music rendered as a sculptural line field, a programmer's personal sense of craft. Headline clean regular Chinese geometric sans-serif dark graphite. Only black/gray lines on pure white, no colored lights, no borders or axes, no extra labels. Extreme precision, quiet generative elegance. Avatar must stay very small around40px, not an oversized portrait.
```


