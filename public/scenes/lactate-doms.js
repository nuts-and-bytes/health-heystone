// lactate-doms: 运动后乳酸约 1 小时就排空了；第二天的酸痛来自肌纤维微损伤修复。
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

  function drawBeaker(g, level) {
    const x = 18, y = -94, w = 54, h = 76;
    rr(g, x, y, w, h, 6);
    inkFill(g, C.paper, 1.5);
    if (level > 0.02) {
      const lh = Math.max(3, (h - 8) * level);
      rr(g, x + 4, y + h - 4 - lh, w - 8, lh, 4);
      g.fillStyle = OR();
      g.fill();
    }
    text(g, '乳酸', x + w / 2, 16, 10, C.muted);
  }

  function drawClock(g, angle) {
    const cx = 45, cy = -132, r = 18;
    circle(g, cx, cy, r);
    inkFill(g, C.paper, 1.5);
    ln(g, cx, cy, cx, cy - 11, 1.5, C.ink);
    ln(g, cx, cy, cx + Math.sin(angle) * 12, cy - Math.cos(angle) * 12, 1.6, OR());
    text(g, '1小时', cx, cy - 25, 10, C.muted);
  }

  function drawMuscleCard(g, showK, healK) {
    if (showK <= 0.01) return;
    g.save();
    g.globalAlpha = showK;
    const x = 96, y = -138, w = 78, h = 92;
    rr(g, x, y, w, h, 8);
    inkFill(g, C.paper, 1.5);
    text(g, '第二天', x + w / 2, y + 16, 10, C.ink);
    // muscle fiber lines
    for (let i = 0; i < 3; i++) {
      const ly = y + 38 + i * 16;
      ln(g, x + 12, ly, x + w - 12, ly, 2, C.ink);
    }
    // tiny crack zigzag in middle that gets stitched
    const mx = x + w / 2, my = y + 54;
    if (healK < 0.8) {
      ln(g, mx - 4, my - 10, mx + 3, my, 1.5, C.ink);
      ln(g, mx + 3, my, mx - 3, my + 10, 1.5, C.ink);
    } else {
      ln(g, mx - 7, my, mx + 7, my, 1.6, C.ink);
      ln(g, mx, my - 7, mx, my + 7, 1.6, C.ink);
    }
    text(g, '微损伤修复', x + w / 2, y + h - 8, 9, C.muted);
    g.restore();
  }

  SC['lactate-doms'] = {
    dur: 6.6,
    width: 390,
    label: '时钟转过一小时，烧杯里的橙色乳酸迅速排空；随后第二天卡片翻出，展示肌肉微损伤正在修复。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let level = 0.85, angle = 0, cardK = 0, healK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const drain = E.soft(seg(T, 0.4, 2.3));
        level = lerp(0.85, 0, drain) * fade + 0.85 * (1 - fade);
        angle = drain * Math.PI * 2;
        cardK = E.soft(seg(T, 2.5, 3.0)) * fade;
        healK = seg(T, 3.8, 4.6);
        sparkK = seg(T, 4.3, 5.0);
        const point = E.soft(seg(T, 0.5, 0.9)) * (1 - E.soft(seg(T, 2.1, 2.5)));
        pose = mix(pose, P({ hF: [26, -86], hB: [-4, -54], head: [8, -114] }), point);
        const stretch = E.soft(seg(T, 3.0, 3.5)) * (1 - E.soft(seg(T, 5.2, 5.7)));
        pose = mix(pose, P({ hF: [14, -126], hB: [-8, -120], head: [2, -116] }), stretch);
      }

      drawBeaker(g, level);
      drawClock(g, angle);
      drawMuscleCard(g, cardK, healK);
      fig(g, pose, -82, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 135, -84, sparkK, 12, 5);
    },
  };
})();
