# 虚拟模特转头素材

## 当前状态

人物参考图：`virtual-model-v1.png`（1536 × 1024）。这是一张新生成的虚拟女模特照片，不是 3D 模型或视频。左右转头关键帧的两次生成请求均返回 `usage_limit_reached`，没有输出新图片。网站当前使用的仍是旧人物重建序列。

## 制作目标

制作一个约 5 秒的单镜头胸像转头视频，用于网页滚动控制。以参考图为唯一人物身份依据，保持短黑发、琥珀透明眼罩、金属高领外套、暖红背景和橙色光效。人物头部从画面左侧约 30 度缓慢转到正面，再到画面右侧约 20 度。动作幅度先保守，避免大角度带来明显身份变化。

镜头、焦距、构图、背景、灯光和肩膀位置保持固定。全程闭嘴、平静表情，无说话、无挥手、无推拉镜头、无切镜头。保留完整头顶和双肩。眼罩必须是同一件配饰，随头部一起转动，不能融化或变形。

## 图生视频提示词

Use the supplied image as the exact identity and visual reference. A single locked-camera cinematic fashion portrait of the same fictional adult woman. She slowly turns her head from a subtle three-quarter view facing the left side of the frame, through a frontal view, toward a subtle three-quarter view facing the right side of the frame. Small, natural head rotation only, approximately 30 degrees left to 20 degrees right. Her shoulders remain still. Preserve her exact facial proportions, skin tone, sleek short black bob, sheer amber visor with a fine illuminated edge, and metallic high-collar jacket throughout. The visor rotates rigidly with her head. Neutral expression, closed lips. The camera, framing, focal length, background, light positions and exposure are completely static. Warm ember-red studio background and restrained orange cinematic lighting, matching the source image. Natural continuous motion, detailed realistic skin and hair. One continuous five-second shot. No camera orbit, no zoom, no cut, no background movement, no talking, no hair transformation, no identity drift, no visor deformation, no text or logo.

## 输出与接入

优先保留图生视频工具导出的原始 MP4，无音乐、无字幕。目标为至少 1080p（若工具支持），保留源图比例或在生成前明确适配网站宽高比。下载原文件，不通过聊天软件压缩转发。

接入前检查视频开头、中间和结尾的五官、眼罩、发型、肩膀位置是否一致。只有稳定的素材才用于网页；视频不是仅凭提示词即可保证成功的产物。序列帧方案需根据实际清晰度和内存测试决定帧数及尺寸，不把低分辨率图片放大后称为原生高清。

网站的滚动进度映射到素材时间（或帧索引），向上滚动逆向恢复。保留静态首帧用于加载失败和减少动态效果的场景。

## 2026-09-13 后续结果

图像额度恢复后已生成并保存 `virtual-model-left.png`、`virtual-model-front.png` 和 `virtual-model-right.png`，与原始 `virtual-model-v1.png` 一起构成四张 1536 × 1024 角度参考。

`turn-study.mp4` 是用这四张图进行光流插值的内部失败试作。早中晚九帧检查显示鼻子、嘴、眼罩存在严重重影和局部变形，尤其正面到右侧的过渡。此文件不是合格交付视频，不应接入网站或宣传为图生视频模型的输出。网站未因此替换素材。

下一步需要具备身份一致性与运动生成能力的图生视频服务；当前会话未发现直接可调用的该类生成工具。已有高清参考图和上述提示词可供外部服务使用。
