// dilemma-order-switch: 增肌保肌优先「先力量、后有氧」，把精力最满的时段留给抗阻动作更稳更安全。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, sparks, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawOrderBoard(g, swapK, okK) {
    const x = 16, y = -126, w = 136, h = 114;

    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '同场训练顺序切换板', x + w / 2, y + 17, 9.2, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // Two slots that swap smoothly from [Cardio top, Weights bottom] -> [Weights top, Cardio bottom]
    const topY = y + 32;
    const botY = y + 72;
    const weightsY = lerp(botY, topY, swapK);
    const cardioY = lerp(topY, botY, swapK);

    // Cardio card (drawn first so weights glides over nicely)
    rr(g, x + 12, cardioY, w - 24, 32, 7);
    inkFill(g, swapK > 0.5 ? '#F5F5F4' : '#FEF2F2', 1.3);
    text(g, swapK > 0.5 ? '② 后有氧 · 慢跑/爬坡' : '① 先跑 40 分有氧', x + w / 2, cardioY + 13, 8.5, swapK > 0.5 ? C.ink : '#B91C1C');
    text(g, swapK > 0.5 ? '中低强度稳步燃脂' : '糖原与精力先耗空', x + w / 2, cardioY + 25, 7.6, C.muted);

    // Weights card
    rr(g, x + 12, weightsY, w - 24, 32, 7);
    inkFill(g, okK > 0.3 ? C.butterSoft : C.paper, 1.5);
    text(g, swapK > 0.5 ? '① 先力量 · 精力满格' : '② 后举铁 · 易疲惫代偿', x + w / 2, weightsY + 13, 8.6, okK > 0.3 ? OR() : C.ink);
    text(g, swapK > 0.5 ? '动作稳 · 增肌保肌优先' : '重量掉一截易拉伤', x + w / 2, weightsY + 25, 7.6, okK > 0.3 ? C.ink : C.muted);

    text(g, '备战长跑/耐力赛时再把有氧放前面', x + w / 2, 14, 8.3, C.muted);
  }

  SC['dilemma-order-switch'] = {
    dur: 5.2,
    width: 390,
    label: '小橙将同场训练顺序板从先有氧后举铁拨换为先力量后有氧，点亮精力满格与保肌稳态提示。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let swapK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        swapK = E.soft(seg(T, 0.6, 1.8)) * fade;
        okK = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.2, 2.9);

        const push = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 2.0, 2.5)));
        pose = mix(pose, P({ hF: [36, lerp(-46, -86, swapK)], hB: [-6, -54], head: [8, -114] }), push);

        const cheer = E.soft(seg(T, 2.4, 3.0)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [22, -124], hB: [-12, -118], head: [2, -116] }), cheer);
      }

      drawOrderBoard(g, swapK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -82, sparkK, 12, 5);
    },
  };
})();
