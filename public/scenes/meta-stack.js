// meta-stack: 荟萃分析 = 把许多独立小研究合在一起重新算，得出更稳的大结论。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, tick, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  const CARDS = [
    { x0: -12, y0: -140, bar: 12 },
    { x0: 46, y0: -152, bar: 24 },
    { x0: 102, y0: -134, bar: 18 },
    { x0: 18, y0: -92, bar: 20 },
    { x0: 84, y0: -86, bar: 16 },
  ];

  function smallCard(g, x, y, bar, alpha) {
    if (alpha <= 0.01) return;
    g.save();
    g.globalAlpha = alpha;
    rr(g, x, y, 36, 44, 4);
    inkFill(g, C.paper, 1.3);
    ln(g, x + 7, y + 12, x + 28, y + 12, 1.2, C.soft);
    ln(g, x + 7, y + 19, x + 24, y + 19, 1.2, C.soft);
    rr(g, x + 7, y + 27, bar, 7, 2);
    g.fillStyle = C.ink;
    g.fill();
    g.restore();
  }

  function bigCard(g, riseK, tickK) {
    if (riseK <= 0.01) return;
    const x = 18, y = lerp(-48, -142, riseK), w = 104, h = 114;
    g.save();
    g.globalAlpha = Math.min(1, riseK * 1.4);
    rr(g, x, y, w, h, 8);
    inkFill(g, C.paper, 1.7);
    text(g, '综合结论', x + w / 2, y + 20, 10, OR());
    ln(g, x + 16, y + 36, x + w - 16, y + 36, 1.3, C.soft);
    ln(g, x + 16, y + 48, x + w - 26, y + 48, 1.3, C.soft);
    // orange combined bar
    rr(g, x + 16, y + 66, 72 * riseK, 16, 4);
    g.fillStyle = OR();
    g.fill();
    tick(g, x + w - 18, y + h - 18, tickK, 1.6, OR());
    g.restore();
  }

  SC['meta-stack'] = {
    dur: 6.0,
    width: 380,
    label: '小人把散落的五份小研究卡片收拢叠在一起，升起一张橙色标出的综合大结论。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let gather = 0, riseK = 0, tickK = 0, cardsAlpha = 1;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        gather = E.soft(seg(T, 0.5, 2.2)) * fade;
        cardsAlpha = 1 - E.soft(seg(T, 2.2, 2.65)) * fade;
        riseK = E.back(seg(T, 2.35, 3.1)) * fade;
        tickK = seg(T, 3.2, 3.7) * fade;
        const sweep = E.soft(seg(T, 0.4, 0.9)) * (1 - E.soft(seg(T, 2.0, 2.4)));
        pose = mix(pose, P({ hF: [28, -90], hB: [8, -82], head: [8, -114] }), sweep);
        const cheer = E.back(seg(T, 3.3, 3.7)) * (1 - E.soft(seg(T, 4.5, 4.9)));
        pose = mix(pose, P({ hF: [18, -128], hB: [-6, -56], head: [5, -116] }), cheer);
      }

      for (const c of CARDS) {
        const x = lerp(c.x0, 52, gather);
        const y = lerp(c.y0, -64, gather);
        smallCard(g, x, y, c.bar, cardsAlpha);
      }
      bigCard(g, riseK, tickK);
      fig(g, pose, -88, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      text(g, '单项研究 → 荟萃分析', 62, 16, 10, C.muted);
    },
  };
})();
