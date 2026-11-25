// women-flora-shield: 阴道有自净菌群保护盾，日常温清水外洗即可，别用洗液反复冲洗破坏微生态。
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

  function drawShield(g, blockK) {
    // crossed-out chemical wash bottle on left
    rr(g, 14, -104, 34, 48, 6);
    inkFill(g, C.paper, 1.4);
    text(g, '洗液', 31, -76, 9, C.muted);
    if (blockK > 0.1) {
      g.save();
      g.globalAlpha = blockK;
      ln(g, 12, -106, 50, -54, 2.4, '#E5484D');
      g.restore();
    }

    // healthy microflora shield on right
    const sx = 104, sy = -74;
    g.beginPath();
    g.moveTo(sx, sy - 38);
    g.lineTo(sx + 34, sy - 24);
    g.lineTo(sx + 28, sy + 18);
    g.quadraticCurveTo(sx, sy + 40, sx, sy + 40);
    g.quadraticCurveTo(sx, sy + 40, sx - 28, sy + 18);
    g.lineTo(sx - 34, sy - 24);
    g.closePath();
    inkFill(g, blockK > 0.4 ? C.butterSoft : C.paper, 1.8);

    // friendly flora dots inside
    circle(g, sx - 10, sy - 8, 3.2);
    circle(g, sx + 10, sy - 4, 3.2);
    circle(g, sx, sy + 10, 3.2);
    g.fillStyle = OR();
    g.fill();
    text(g, '自净菌群盾', sx, 14, 9.5, C.ink);
    text(g, blockK > 0.4 ? '温清水外洗 ✓' : '别破坏平衡', sx, sy - 46, 9.5, blockK > 0.4 ? OR() : C.muted);
  }

  SC['women-flora-shield'] = {
    dur: 5.0,
    width: 390,
    label: '小橙拦住强力洗液，守住有益菌群保护盾，提示日常温清水外洗即可。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let blockK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [22, -78], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        blockK = E.soft(seg(T, 0.4, 1.2)) * fade;
        sparkK = seg(T, 1.6, 2.3);

        const stopHand = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 2.2, 2.7)));
        pose = mix(pose, P({ hF: [42, -88], hB: [-6, -54], head: [8, -114] }), stopHand);
      }

      drawShield(g, blockK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 104, -74, sparkK, 14, 5);
    },
  };
})();
