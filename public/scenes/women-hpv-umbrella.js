// women-hpv-umbrella: 超过 26 岁或有过性生活，HPV 疫苗依然能挡住尚未感染的高危型别，再配定期筛查。
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

  function drawUmbrella(g, openK, rainT) {
    const ux = 66, uy = -102;
    const span = lerp(16, 58, openK);
    // umbrella handle
    ln(g, ux, uy, ux, -24, 2, C.ink);
    // canopy
    g.beginPath();
    g.moveTo(ux - span, uy + 14);
    g.quadraticCurveTo(ux, uy - 24, ux + span, uy + 14);
    g.closePath();
    inkFill(g, openK > 0.5 ? C.butterSoft : C.paper, 1.8);
    text(g, openK > 0.5 ? '防未感染型别 ✓' : 'HPV 保护伞', ux, uy + 32, 9.5, openK > 0.5 ? OR() : C.muted);

    // falling drops deflected when open
    for (let i = 0; i < 4; i++) {
      const p = (rainT * 1.2 + i * 0.27) % 1;
      const rx = ux - 36 + i * 24;
      const ry = -146 + p * (openK > 0.5 ? 34 : 96);
      circle(g, rx, ry, 2.4);
      g.fillStyle = OR();
      g.fill();
    }

    // screening badge
    rr(g, 18, -22, 96, 22, 11);
    inkFill(g, C.paper, 1.3);
    text(g, '疫苗 + 定期筛查', 66, -7, 9, C.ink);
  }

  SC['women-hpv-umbrella'] = {
    dur: 5.2,
    width: 390,
    label: '小橙撑开 HPV 保护伞挡住雨点，同时亮出“疫苗 + 定期筛查”双保险提示。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let openK = 0.15, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [22, -88], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        openK = lerp(0.15, 1, E.soft(seg(T, 0.4, 1.3)) * fade);
        sparkK = seg(T, 1.4, 2.1);
        const hold = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 4.3, 4.8)));
        pose = mix(pose, P({ hF: [52, -76], hB: [-6, -54], head: [8, -114] }), hold);
      }

      drawUmbrella(g, openK, t);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 66, -118, sparkK, 14, 5);
    },
  };
})();
