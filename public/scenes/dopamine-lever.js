// dopamine-lever: 多巴胺不是单纯的「快乐」，而是拉响「期待与渴望」的发动机；刷手机/高糖越频繁，阈值越高。
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

  function drawMachine(g, leverAng, barLevel) {
    const x = 18, y = -126, w = 88, h = 114;
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '期待值', x + w / 2, y + 20, 10, C.ink);
    // meter inside
    rr(g, x + 28, y + 32, 32, 66, 6);
    inkFill(g, C.paper, 1.3);
    const lh = Math.max(8, 60 * barLevel);
    rr(g, x + 31, y + 95 - lh, 26, lh, 4);
    g.fillStyle = OR();
    g.fill();
    // lever on left side of machine
    const lx = x, ly = y + 66;
    const tipX = lx - 24 * Math.cos(leverAng);
    const tipY = ly - 24 * Math.sin(leverAng);
    ln(g, lx, ly, tipX, tipY, 2.4, C.ink);
    circle(g, tipX, tipY, 5.5);
    inkFill(g, OR(), 1.4, C.ink);
    text(g, '多巴胺拉杆', x + w / 2, 16, 10, C.muted);
  }

  SC['dopamine-lever'] = {
    dur: 6.0,
    width: 380,
    label: '小人拉动橙色多巴胺拉杆，期待值瞬间飙升又回落，说明多巴胺驱动的是期待与行动。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let leverAng = 0.65, barLevel = 0.3, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 5.8, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const pull = E.soft(seg(T, 0.4, 1.0)) * (1 - E.soft(seg(T, 1.6, 2.2)));
        leverAng = lerp(0.65, -0.65, pull);
        const spike = E.back(seg(T, 0.9, 1.5)) * (1 - E.soft(seg(T, 2.6, 4.4)));
        barLevel = lerp(0.3, 0.3 + 0.62 * spike, fade);
        pose = mix(pose, P({ hF: [28, -68], hB: [-4, -54], head: [8, -113] }), pull);
        sparkK = seg(T, 1.0, 1.7);
      }

      drawMachine(g, leverAng, barLevel);
      fig(g, pose, -46, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 62, -138, sparkK, 14, 5);
    },
  };
})();
