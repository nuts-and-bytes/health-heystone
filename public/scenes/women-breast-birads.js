// women-breast-birads: 乳腺增生极常见，看懂 BI-RADS 分级：1–2 类定期复查别恐慌，4 类及以上挂乳腺外科。
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

  function drawBirads(g, hiK) {
    const x = 18, y = -124, w = 126, h = 104;
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '乳腺超声 BI-RADS', x + w / 2, y + 18, 9.5, C.ink);

    rr(g, x + 10, y + 28, w - 20, 26, 6);
    inkFill(g, hiK > 0.3 ? C.butterSoft : C.paper, 1.3);
    text(g, '1–2类 · 良性定期复查 ✓', x + w / 2, y + 45, 9, hiK > 0.3 ? OR() : C.ink);

    rr(g, x + 10, y + 62, w - 20, 28, 6);
    inkFill(g, '#FEF2F2', 1.3);
    text(g, '4类+ / 硬块 → 挂乳腺外科', x + w / 2, y + 80, 8.5, '#B91C1C');
  }

  SC['women-breast-birads'] = {
    dur: 5.0,
    width: 390,
    label: '小橙指着 BI-RADS 分级表：1–2类良性增生按期复查即可，4类及以上及时挂乳腺外科。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let hiK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        hiK = E.soft(seg(T, 0.4, 1.3)) * fade;
        sparkK = seg(T, 1.5, 2.2);
        const point = E.soft(seg(T, 0.4, 0.9)) * (1 - E.soft(seg(T, 3.8, 4.3)));
        pose = mix(pose, P({ hF: [44, -82], hB: [-6, -54], head: [8, -114] }), point);
      }

      drawBirads(g, hiK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 81, -82, sparkK, 12, 5);
    },
  };
})();
