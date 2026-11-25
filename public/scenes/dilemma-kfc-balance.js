// dilemma-kfc-balance: 练完吃 KFC/麦当劳不会白练——天平看的是长期总账，不是单顿快餐。
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

  function drawScale(g, tilt, okK) {
    const cx = 78, by = 0, topY = -88;
    // base & pillar
    ln(g, cx - 26, by, cx + 26, by, 2, C.ink);
    ln(g, cx, by, cx, topY, 2, C.ink);
    circle(g, cx, topY, 4);
    inkFill(g, C.paper, 1.5);

    g.save();
    g.translate(cx, topY);
    g.rotate(tilt);
    ln(g, -68, 0, 68, 0, 2, C.ink);

    // left pan: burger
    ln(g, -62, 0, -62, 24, 1.3, C.ink);
    ln(g, -80, 24, -44, 24, 1.6, C.ink);
    rr(g, -74, 10, 24, 12, 6);
    inkFill(g, C.paper, 1.5);
    ln(g, -73, 17, -51, 17, 2.2, OR());
    text(g, '一顿快餐', -62, 39, 9.5, C.muted);

    // right pan: 7-day ledger + dumbbell
    ln(g, 62, 0, 62, 24, 1.3, C.ink);
    ln(g, 42, 24, 82, 24, 1.6, C.ink);
    rr(g, 48, 2, 28, 20, 4);
    inkFill(g, okK > 0.4 ? C.butterSoft : C.paper, 1.5);
    ln(g, 53, 9, 71, 9, 1.4, C.ink);
    ln(g, 53, 15, 67, 15, 1.4, OR());
    text(g, '一周总账', 62, 39, 9.5, C.ink);
    g.restore();

    if (okK > 0.05) {
      g.save();
      g.globalAlpha = okK;
      rr(g, cx - 34, topY - 40, 68, 22, 11);
      inkFill(g, C.paper, 1.4);
      text(g, '✓ 没白练', cx, topY - 25, 10.5, OR());
      g.restore();
    }
  }

  SC['dilemma-kfc-balance'] = {
    dur: 5.6,
    width: 390,
    label: '小橙把一顿快餐放上天平左盘，天平短暂倾斜，随后补上一周总热量与训练账本，天平稳稳回正。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [14, -62], hB: [-6, -54] }), t);
      let tilt = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        tilt = Math.sin(t * 1.6) * 0.05;
        pose = mix(pose, P({ hF: [22, -78], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        const drop = E.soft(seg(T, 0.25, 1.1));
        const balance = E.soft(seg(T, 1.9, 3.0));
        tilt = (-0.26 * drop + 0.26 * balance) * fade;
        okK = E.soft(seg(T, 3.0, 3.5)) * fade;
        sparkK = seg(T, 3.1, 3.8);

        const putLeft = E.soft(seg(T, 0.2, 0.7)) * (1 - E.soft(seg(T, 1.2, 1.6)));
        pose = mix(pose, P({ hF: [42, -88], hB: [-4, -56], head: [10, -112] }), putLeft);

        const cheer = E.soft(seg(T, 3.0, 3.5)) * (1 - E.soft(seg(T, 4.7, 5.1)));
        pose = mix(pose, P({ hF: [18, -134], hB: [-14, -128], head: [4, -116] }), cheer);
      }

      drawScale(g, tilt, okK);
      fig(g, pose, -82, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 78, -118, sparkK, 14, 6);
    },
  };
})();
