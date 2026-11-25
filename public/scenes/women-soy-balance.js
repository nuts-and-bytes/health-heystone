// women-soy-balance: 喝豆浆吃豆腐不会把雌激素吃高或吃出乳腺结节，大豆异黄酮是温和双向调节。
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

  function drawSoy(g, steadyK) {
    // warm soy milk cup
    rr(g, 16, -66, 36, 46, 6);
    inkFill(g, C.paper, 1.5);
    rr(g, 20, -48, 28, 24, 4);
    g.fillStyle = C.butterSoft;
    g.fill();
    text(g, '豆浆', 34, -32, 9.5, C.ink);
    text(g, '日常饮食', 34, 14, 9, C.muted);

    // balance meter staying in safe green/orange middle
    rr(g, 66, -108, 86, 86, 10);
    inkFill(g, C.paper, 1.5);
    text(g, '激素调节阀', 109, -90, 9.5, C.ink);
    ln(g, 78, -62, 140, -62, 2.2, C.line || '#d6d3d1');
    const bx = 109 + (1 - steadyK) * 18;
    circle(g, bx, -62, 6.5);
    g.fillStyle = OR();
    g.fill();
    g.strokeStyle = C.ink;
    g.lineWidth = 1.6;
    g.stroke();
    text(g, steadyK > 0.5 ? '稳在安全区 ✓' : '温和双向调节', 109, -36, 9, steadyK > 0.5 ? OR() : C.muted);
  }

  SC['women-soy-balance'] = {
    dur: 5.0,
    width: 390,
    label: '小橙端起一杯热豆浆，激素调节阀稳稳回到安全中区，日常豆制品完全放心。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let steadyK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -76], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        steadyK = E.soft(seg(T, 0.5, 1.8)) * fade;
        sparkK = seg(T, 1.9, 2.6);
        const sip = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 2.5, 3.0)));
        pose = mix(pose, P({ hF: [36, -86], hB: [-4, -54], head: [6, -114] }), sip);
      }

      drawSoy(g, steadyK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 109, -62, sparkK, 12, 5);
    },
  };
})();
