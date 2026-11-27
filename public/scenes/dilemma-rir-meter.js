// dilemma-rir-meter: 力量训练不必组组练到绝对力竭，保留 1–3 次余力（RIR）增肌效果几乎一样，疲劳更低、关节更稳。
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

  function drawRirGauge(g, dialK, okK) {
    const x = 18, y = -126, w = 132, h = 114;

    // outer card
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '单组努力度 · RIR 刻度尺', x + w / 2, y + 17, 9.2, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // top red failure zone
    rr(g, x + 10, y + 30, w - 20, 26, 6);
    inkFill(g, dialK < 0.45 ? '#FEF2F2' : C.paper, 1.2);
    text(g, 'RIR 0 · 组组绝对力竭', x + w / 2 + 4, y + 41, 8.4, dialK < 0.45 ? '#B91C1C' : C.muted);
    text(g, '疲劳骤升 · 易动作变形', x + w / 2 + 4, y + 52, 7.6, C.muted);

    // middle sweet-spot RIR 1-3 zone
    rr(g, x + 10, y + 62, w - 20, 42, 7);
    inkFill(g, okK > 0.3 ? C.butterSoft : C.paper, 1.5);
    text(g, okK > 0.3 ? '✓ RIR 1–3 黄金增肌区' : 'RIR 1–3 留 1–3 次余力', x + w / 2 + 4, y + 78, 9, okK > 0.3 ? OR() : C.ink);
    text(g, '增肌几乎一致 · 总容量更高', x + w / 2 + 4, y + 94, 7.9, okK > 0.3 ? C.ink : C.muted);

    // vertical slider track on the left inside the card
    const tx = x + 19, ty1 = y + 36, ty2 = y + 96;
    ln(g, tx, ty1, tx, ty2, 2.2, C.line || '#d6d3d1');
    const knobY = lerp(ty1 + 7, ty2 - 14, dialK);
    circle(g, tx, knobY, 5.2);
    inkFill(g, dialK > 0.45 ? OR() : '#B91C1C', 1.4);

    text(g, '动作标准 + 渐进超负荷才是核心', x + w / 2, 14, 8.6, C.muted);
  }

  SC['dilemma-rir-meter'] = {
    dur: 5.2,
    width: 390,
    label: '小橙把努力度滑块从高疲劳的绝对力竭区拨到RIR 1到3黄金增肌区，点亮高容量与恢复平衡提示。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let dialK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        dialK = E.soft(seg(T, 0.6, 1.8)) * fade;
        okK = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.3, 3.0);

        const slide = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 2.0, 2.5)));
        pose = mix(pose, P({ hF: [36, lerp(-88, -50, dialK)], hB: [-6, -54], head: [8, -114] }), slide);

        const cheer = E.soft(seg(T, 2.4, 3.0)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [22, -124], hB: [-12, -118], head: [2, -116] }), cheer);
      }

      drawRirGauge(g, dialK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -52, sparkK, 12, 5);
    },
  };
})();
