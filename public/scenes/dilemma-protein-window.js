// dilemma-protein-window: 别被 30 分钟蛋白窗口吓到，全天三餐吃够蛋白更关键。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, sparks, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawMeals(g, filledCount, crossK) {
    // old 30min myth badge crossed out
    rr(g, 18, -126, 86, 26, 13);
    inkFill(g, C.paper, 1.4);
    text(g, '30分钟必喝', 61, -109, 9.5, C.muted);
    if (crossK > 0.05) {
      g.save();
      g.globalAlpha = crossK;
      ln(g, 24, -113, 98, -113, 2.4, OR());
      g.restore();
    }

    // 3 daily meal protein blocks
    const labels = ['早', '午', '晚'];
    for (let i = 0; i < 3; i++) {
      const bx = 16 + i * 44;
      const filled = i < filledCount;
      rr(g, bx, -76, 36, 56, 8);
      inkFill(g, filled ? C.butterSoft : C.paper, 1.6);
      if (filled) {
        rr(g, bx + 5, -56, 26, 31, 4);
        g.fillStyle = OR();
        g.fill();
      }
      text(g, labels[i], bx + 18, -82, 9.5, filled ? OR() : C.muted);
    }
    text(g, '全天总蛋白吃够 ✓', 80, 14, 10, C.ink);
  }

  SC['dilemma-protein-window'] = {
    dur: 5.4,
    width: 390,
    label: '小橙划掉“30分钟必喝”焦虑标签，依次把早中晚三餐的橙色蛋白格稳稳填满。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let count = 1, crossK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [22, -88], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        crossK = E.soft(seg(T, 0.3, 0.9)) * fade;
        if (T < 1.2) count = 0;
        else if (T < 2.1) count = 1;
        else if (T < 3.0) count = 2;
        else count = 3;
        sparkK = seg(T, 3.1, 3.8);

        const waveHand = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.2, 1.6)));
        pose = mix(pose, P({ hF: [42, -108], hB: [-6, -54], head: [8, -114] }), waveHand);
        const cheer = E.soft(seg(T, 3.1, 3.6)) * (1 - E.soft(seg(T, 4.6, 5.0)));
        pose = mix(pose, P({ hF: [16, -130], hB: [-12, -126], head: [2, -116] }), cheer);
      }

      drawMeals(g, count, crossK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 122, -68, sparkK, 12, 5);
    },
  };
})();
