// dilemma-eight-cups: 不必死磕每天 8 杯水，看口渴感和淡柠檬尿色卡就够了。
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

  function drawCups(g, crossK, checkK) {
    // 8 cups row crossed lightly
    rr(g, 14, -124, 96, 26, 13);
    inkFill(g, C.paper, 1.4);
    text(g, '死磕 8 杯水', 62, -107, 9.5, C.muted);
    if (crossK > 0.05) {
      g.save();
      g.globalAlpha = crossK;
      ln(g, 20, -111, 104, -111, 2.2, OR());
      g.restore();
    }

    // practical glass + pale-lemon color card
    rr(g, 20, -78, 36, 56, 6);
    inkFill(g, C.paper, 1.5);
    rr(g, 25, -48, 26, 22, 4);
    g.fillStyle = C.butterSoft;
    g.fill();
    text(g, '渴了喝', 38, 14, 9.5, C.ink);

    rr(g, 70, -78, 66, 56, 8);
    inkFill(g, checkK > 0.4 ? C.butterSoft : C.paper, 1.5);
    circle(g, 103, -54, 11);
    g.fillStyle = '#FEF08A';
    g.fill();
    g.strokeStyle = C.ink;
    g.lineWidth = 1.4;
    g.stroke();
    text(g, '淡柠檬色 ✓', 103, -30, 9, checkK > 0.4 ? OR() : C.ink);
    text(g, '水够标准', 103, 14, 9.5, C.muted);
  }

  SC['dilemma-eight-cups'] = {
    dur: 5.0,
    width: 390,
    label: '小橙划掉“死磕8杯水”标签，拿起水杯小口喝水并对照淡柠檬色达标卡。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let crossK = 0, checkK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -76], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        crossK = E.soft(seg(T, 0.3, 0.9)) * fade;
        checkK = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.3, 3.0);

        const wave = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.3, 1.7)));
        pose = mix(pose, P({ hF: [42, -108], hB: [-4, -54], head: [8, -114] }), wave);
        const point = E.soft(seg(T, 1.8, 2.4)) * (1 - E.soft(seg(T, 4.1, 4.6)));
        pose = mix(pose, P({ hF: [46, -64], hB: [-6, -54], head: [10, -112] }), point);
      }

      drawCups(g, crossK, checkK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 103, -54, sparkK, 12, 5);
    },
  };
})();
