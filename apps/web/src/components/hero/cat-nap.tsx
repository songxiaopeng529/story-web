/**
 * 文章页彩蛋：一只蜷缩睡觉的橘猫，与首页主视觉是「同一个世界」。
 * 静态小插画，自带样式，不依赖首页的动画体系。
 */
export function CatNap() {
  return (
    <svg
      aria-hidden="true"
      className="cat-nap"
      fill="none"
      viewBox="0 0 200 150"
    >
      {/* 身体（猫面包） */}
      <path
        d="M100 128 Q42 128 48 92 Q54 58 100 58 Q146 58 152 92 Q158 128 100 128 Z"
        fill="#e8913a"
        stroke="#4a3b2e"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      {/* 身上花纹 */}
      <path
        d="M118 66 Q126 76 124 88"
        stroke="#b96722"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M134 72 Q141 82 139 94"
        stroke="#b96722"
        strokeLinecap="round"
        strokeWidth="3"
      />
      {/* 头（埋进身体里） */}
      <circle
        cx="72"
        cy="88"
        fill="#e8913a"
        r="27"
        stroke="#4a3b2e"
        strokeWidth="3.5"
      />
      <path
        d="M52 72 L50 52 L66 62 Z"
        fill="#e8913a"
        stroke="#4a3b2e"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      <path
        d="M92 72 L94 52 L78 62 Z"
        fill="#e8913a"
        stroke="#4a3b2e"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      {/* 睡着的眼睛 */}
      <path
        d="M58 88 Q63 92 68 88"
        stroke="#4a3b2e"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <path
        d="M78 88 Q83 92 88 88"
        stroke="#4a3b2e"
        strokeLinecap="round"
        strokeWidth="3"
      />
      {/* 鼻子 */}
      <path
        d="M70 98 L75 98 L72.5 102 Z"
        fill="#d07a28"
        stroke="#4a3b2e"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {/* 尾巴绕到身前 */}
      <path
        d="M150 100 Q168 118 140 126 Q112 132 84 124"
        stroke="#e8913a"
        strokeLinecap="round"
        strokeWidth="14"
      />
      <path
        d="M84 124 Q76 121 72 114"
        stroke="#b96722"
        strokeLinecap="round"
        strokeWidth="14"
      />
      {/* Z z */}
      <path
        d="M148 34 L160 34 L148 46 L160 46"
        stroke="#8a7f6e"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      />
      <path
        d="M168 14 L176 14 L168 22 L176 22"
        stroke="#8a7f6e"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  );
}
