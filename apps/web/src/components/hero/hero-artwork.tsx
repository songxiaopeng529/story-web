import type { CSSProperties } from "react";

/**
 * 首页主视觉插画：暖阳午后的窗边，一个少年和一只橘猫。
 * 纯 SVG 原创绘制，按「背景 → 少年 → 猫 → 光尘」分层，
 * 供 HeroScene 做逐笔绘制、分层视差和眼神跟随。
 */
export function HeroArtwork() {
  return (
    <svg
      aria-label="窗边的少年与猫"
      className="hero-art"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      viewBox="0 0 1200 800"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe9bd" />
          <stop offset="1" stopColor="#ffd98f" />
        </linearGradient>
        <filter id="hero-paper" height="100%" width="100%" x="0" y="0">
          <feTurbulence
            baseFrequency="0.9"
            numOctaves="2"
            result="n"
            type="fractalNoise"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.28  0 0 0 0 0.22  0 0 0 0 0.15  0 0 0 0.05 0"
          />
        </filter>
      </defs>

      {/* ===== L0 背景 ===== */}
      <g className="layer layer-bg">
        <rect className="soft" fill="#f7eedc" height="800" width="1200" x="0" y="0" />
        <rect className="soft fill-only" fill="#e9cba3" height="180" width="1200" x="0" y="620" />
        {/* 地板缝 */}
        <path className="draw stroke-only" d="M0 672 Q300 668 620 672 T1200 670" pathLength={1} />
        <path className="draw stroke-only" d="M0 728 Q350 724 700 728 T1200 726" pathLength={1} />
        <path className="draw stroke-only" d="M0 776 Q400 772 760 776 T1200 774" pathLength={1} />
        <path className="draw stroke-only" d="M0 620 L1200 620" pathLength={1} />
        {/* 窗 */}
        <rect className="draw" fill="#b98a5e" height="356" pathLength={1} rx="18" width="330" x="92" y="82" />
        <rect className="draw" fill="url(#hero-sky)" height="316" pathLength={1} rx="10" width="290" x="112" y="102" />
        <circle className="draw" cx="196" cy="192" fill="#ffc978" pathLength={1} r="42" />
        <path className="draw stroke-only" d="M112 318 Q200 280 290 312 T402 300" pathLength={1} />
        <path className="draw stroke-only" d="M257 102 L257 418" pathLength={1} />
        <path className="draw stroke-only" d="M112 260 L402 260" pathLength={1} />
        {/* 窗台 */}
        <rect className="draw" fill="#a67c52" height="18" pathLength={1} rx="9" width="370" x="72" y="438" />
        {/* 光 */}
        <path className="soft fill-only" d="M402 300 L740 800 L560 800 L402 430 Z" fill="#f6d9a0" style={{ "--o": 0.55 } as CSSProperties} />
        <path className="soft fill-only" d="M470 640 L860 640 L930 792 L580 792 Z" fill="#f2d49b" style={{ "--o": 0.5 } as CSSProperties} />
        {/* 窗台上的植物 */}
        <g className="plant">
          <path className="draw" d="M322 438 L330 396 L372 396 L380 438 Z" fill="#c17850" pathLength={1} />
          <path className="draw stroke-only" d="M351 396 Q340 360 318 352" pathLength={1} />
          <path className="draw stroke-only" d="M351 396 Q352 356 372 344" pathLength={1} />
          <path className="draw stroke-only" d="M351 396 Q364 368 388 366" pathLength={1} />
          <path className="draw" d="M318 352 Q306 336 320 330 Q334 338 318 352 Z" fill="#7fa36b" pathLength={1} />
          <path className="draw" d="M372 344 Q372 324 390 324 Q392 342 372 344 Z" fill="#8fb377" pathLength={1} />
          <path className="draw" d="M388 366 Q404 356 412 368 Q400 380 388 366 Z" fill="#7fa36b" pathLength={1} />
        </g>
        {/* 墙上的画 */}
        <g className="picture">
          <rect className="draw" fill="#b98a5e" height="112" pathLength={1} rx="10" width="142" x="994" y="168" />
          <rect className="draw" fill="#fff3d9" height="84" pathLength={1} rx="6" width="114" x="1008" y="182" />
          <circle className="soft color-only" cx="1040" cy="212" fill="#ffc978" r="12" />
          <path className="draw stroke-only" d="M1008 252 Q1040 222 1068 244 T1122 240" pathLength={1} />
        </g>
      </g>

      {/* ===== L1 少年 ===== */}
      <g className="layer layer-boy">
        <g className="boy-breath">
          {/* 坐垫 */}
          <ellipse className="draw" cx="622" cy="716" fill="#d9734f" pathLength={1} rx="182" ry="42" />
          <path className="draw stroke-only" d="M460 716 Q622 762 784 716" pathLength={1} />
          {/* 书堆 */}
          <g className="books">
            <rect className="draw" fill="#7a8ba0" height="18" pathLength={1} rx="6" width="98" x="432" y="688" />
            <rect className="draw" fill="#e8c15a" height="18" pathLength={1} rx="6" width="86" x="440" y="670" />
            <rect className="draw" fill="#c17850" height="18" pathLength={1} rx="6" width="74" x="448" y="652" />
          </g>
          {/* 盘腿 */}
          <path className="draw" d="M498 700 Q496 628 622 628 Q748 628 746 700 Q622 738 498 700 Z" fill="#6b6a80" pathLength={1} />
          <path className="draw stroke-only" d="M622 640 Q626 672 620 700" pathLength={1} />
          <ellipse className="draw" cx="505" cy="692" fill="#ede4d0" pathLength={1} rx="22" ry="13" />
          <ellipse className="draw" cx="739" cy="692" fill="#ede4d0" pathLength={1} rx="22" ry="13" />
          {/* 脖子（在头后面） */}
          <path className="draw" d="M604 428 L640 428 L640 468 Q622 478 604 468 Z" fill="#f6cfa8" pathLength={1} />
          {/* 毛衣 */}
          <path className="draw" d="M546 478 Q502 522 506 642 L738 642 Q742 522 698 478 Q622 448 546 478 Z" fill="#7a8ba0" pathLength={1} />
          <path className="draw" d="M594 456 Q622 474 650 456 Q646 478 622 480 Q598 478 594 456 Z" fill="#ede4d0" pathLength={1} />
          {/* 袖子与手 */}
          <path className="draw stroke-only" d="M556 500 Q514 562 532 626" pathLength={1} stroke="#7a8ba0" strokeWidth="42" />
          <path className="draw stroke-only" d="M688 500 Q730 562 712 626" pathLength={1} stroke="#7a8ba0" strokeWidth="42" />
          <path className="draw stroke-only color-only" d="M560 508 Q528 560 540 612" pathLength={1} stroke="#64748c" strokeWidth="2.5" />
          <path className="draw stroke-only color-only" d="M684 508 Q716 560 704 612" pathLength={1} stroke="#64748c" strokeWidth="2.5" />
          <path className="draw stroke-only" d="M520 616 Q534 626 548 616" pathLength={1} strokeWidth="4" />
          <path className="draw stroke-only" d="M696 616 Q710 626 724 616" pathLength={1} strokeWidth="4" />
          <circle className="draw" cx="534" cy="630" fill="#f6cfa8" pathLength={1} r="15" />
          <circle className="draw" cx="710" cy="630" fill="#f6cfa8" pathLength={1} r="15" />
          {/* 头 */}
          <path className="draw" d="M622 284 Q694 284 696 360 Q694 436 622 442 Q550 436 548 360 Q550 284 622 284 Z" fill="#f6cfa8" pathLength={1} />
          <path className="draw" d="M548 366 Q534 362 536 376 Q538 390 552 386 Z" fill="#f6cfa8" pathLength={1} />
          <path className="draw" d="M696 366 Q710 362 708 376 Q706 390 692 386 Z" fill="#f6cfa8" pathLength={1} />
          {/* 头发 */}
          <path className="draw" d="M544 372 Q530 252 622 248 Q714 252 700 372 L686 346 L676 376 L658 344 L642 380 L624 344 L606 380 L590 346 L576 374 L562 348 Z" fill="#3b3a45" pathLength={1} />
          <path className="draw stroke-only" d="M622 248 Q640 216 668 220" pathLength={1} />
          {/* 眉毛 */}
          <path className="draw stroke-only" d="M572 350 Q588 342 604 348" pathLength={1} />
          <path className="draw stroke-only" d="M640 348 Q656 342 672 350" pathLength={1} />
          {/* 眼睛 */}
          <g className="eye eye-l">
            <ellipse className="draw" cx="588" cy="378" fill="#fffdf7" pathLength={1} rx="16" ry="19" />
            <g className="pupil pupil-boy color-only">
              <circle cx="588" cy="380" fill="#3b3a45" r="7.5" />
              <circle cx="585" cy="376" fill="#fffdf7" r="2.6" />
            </g>
            <path className="draw stroke-only" d="M572 366 Q588 356 604 366" pathLength={1} />
          </g>
          <g className="eye eye-r">
            <ellipse className="draw" cx="656" cy="378" fill="#fffdf7" pathLength={1} rx="16" ry="19" />
            <g className="pupil pupil-boy color-only">
              <circle cx="656" cy="380" fill="#3b3a45" r="7.5" />
              <circle cx="653" cy="376" fill="#fffdf7" r="2.6" />
            </g>
            <path className="draw stroke-only" d="M640 366 Q656 356 672 366" pathLength={1} />
          </g>
          {/* 鼻子与嘴 */}
          <path className="draw stroke-only" d="M620 402 Q626 408 620 412" pathLength={1} />
          <path className="draw stroke-only" d="M608 422 Q622 434 638 421" pathLength={1} />
          {/* 腮红（上色阶段才出现） */}
          <ellipse className="soft color-only" cx="570" cy="404" fill="#f0a08a" opacity="0.55" rx="11" ry="5.5" style={{ "--o": 0.55 } as CSSProperties} transform="rotate(-8 570 404)" />
          <ellipse className="soft color-only" cx="674" cy="404" fill="#f0a08a" opacity="0.55" rx="11" ry="5.5" style={{ "--o": 0.55 } as CSSProperties} transform="rotate(8 674 404)" />
        </g>
      </g>

      {/* ===== L2 猫 ===== */}
      <g className="layer layer-cat">
        {/* 地毯 */}
        <ellipse className="draw" cx="876" cy="716" fill="#e8b98a" pathLength={1} rx="120" ry="24" />
        <path className="draw stroke-only" d="M770 716 Q876 736 982 716" pathLength={1} />
        {/* 身体 */}
        <path className="draw" d="M872 700 Q800 700 810 624 Q816 560 872 556 Q928 560 934 624 Q944 700 872 700 Z" fill="#e8913a" pathLength={1} />
        <path className="soft color-only" d="M872 700 Q838 700 842 648 Q846 610 872 606 Q898 610 902 648 Q906 700 872 700 Z" fill="#f6ddb8" />
        <path className="draw stroke-only color-only" d="M820 600 Q836 606 852 600" pathLength={1} />
        <path className="draw stroke-only color-only" d="M818 632 Q834 638 850 633" pathLength={1} />
        {/* 头 */}
        <circle className="draw" cx="872" cy="508" fill="#e8913a" pathLength={1} r="52" />
        <path className="draw" d="M836 470 L844 424 L872 456 Z" fill="#e8913a" pathLength={1} />
        <path className="draw" d="M908 470 L900 424 L872 456 Z" fill="#e8913a" pathLength={1} />
        <path className="soft color-only" d="M844 462 L849 438 L863 454 Z" fill="#f0a08a" />
        <path className="soft color-only" d="M900 462 L895 438 L881 454 Z" fill="#f0a08a" />
        <path className="draw stroke-only color-only" d="M862 468 L862 482" pathLength={1} />
        <path className="draw stroke-only color-only" d="M872 466 L872 482" pathLength={1} />
        <path className="draw stroke-only color-only" d="M882 468 L882 482" pathLength={1} />
        {/* 眼睛 */}
        <g className="eye eye-cat-l">
          <ellipse className="draw" cx="852" cy="504" fill="#fffdf7" pathLength={1} rx="10" ry="12" />
          <g className="pupil pupil-cat color-only">
            <circle cx="852" cy="506" fill="#3b3a45" r="5" />
            <circle cx="850" cy="503" fill="#fffdf7" r="1.8" />
          </g>
        </g>
        <g className="eye eye-cat-r">
          <ellipse className="draw" cx="892" cy="504" fill="#fffdf7" pathLength={1} rx="10" ry="12" />
          <g className="pupil pupil-cat color-only">
            <circle cx="892" cy="506" fill="#3b3a45" r="5" />
            <circle cx="890" cy="503" fill="#fffdf7" r="1.8" />
          </g>
        </g>
        {/* 鼻子与嘴 */}
        <path className="draw" d="M867 522 L877 522 L872 529 Z" fill="#d07a28" pathLength={1} />
        <path className="draw stroke-only" d="M872 529 Q872 536 864 537" pathLength={1} />
        <path className="draw stroke-only" d="M872 529 Q872 536 880 537" pathLength={1} />
        {/* 胡须 */}
        <path className="draw stroke-only" d="M842 520 Q822 516 806 510" pathLength={1} />
        <path className="draw stroke-only" d="M842 528 Q824 528 808 528" pathLength={1} />
        <path className="draw stroke-only" d="M902 520 Q922 516 938 510" pathLength={1} />
        <path className="draw stroke-only" d="M902 528 Q924 528 940 528" pathLength={1} />
        {/* 尾巴 */}
        <g className="cat-tail">
          <path className="draw stroke-only" d="M928 664 Q1002 686 986 726 Q972 752 922 732" pathLength={1} stroke="#e8913a" strokeWidth="26" />
          <path className="draw stroke-only color-only" d="M922 732 Q912 726 906 716" pathLength={1} stroke="#b96722" strokeWidth="26" />
        </g>
      </g>

      {/* ===== L3 光尘 ===== */}
      <g className="layer layer-dust">
        <circle className="soft dust" cx="520" cy="300" fill="#e8c15a" r="3.2" />
        <circle className="soft dust" cx="610" cy="220" fill="#e8c15a" r="2.4" />
        <circle className="soft dust" cx="700" cy="350" fill="#f0d9a8" r="3.6" />
        <circle className="soft dust" cx="480" cy="460" fill="#f0d9a8" r="2.6" />
        <circle className="soft dust" cx="820" cy="300" fill="#e8c15a" r="2.8" />
        <circle className="soft dust" cx="980" cy="420" fill="#f0d9a8" r="3" />
      </g>

      {/* 铅笔光标（起稿阶段跟随笔尖） */}
      <g className="pencil" opacity="0">
        <path d="M0 0 L6 -14 L-6 -14 Z" fill="#f0d9b8" stroke="#4a3b2e" strokeWidth="2" />
        <path d="M0 0 L2.5 -6 L-2.5 -6 Z" fill="#4a3b2e" />
        <rect fill="#e8c15a" height="20" stroke="#4a3b2e" strokeWidth="2" width="12" x="-6" y="-34" />
        <rect fill="#b98a5e" height="4" width="12" x="-6" y="-34" />
        <rect fill="#f0a08a" height="7" stroke="#4a3b2e" strokeWidth="2" width="12" x="-6" y="-41" />
      </g>

      {/* 纸纹 */}
      <rect className="soft" filter="url(#hero-paper)" height="800" opacity="0.5" width="1200" x="0" y="0" />
    </svg>
  );
}
