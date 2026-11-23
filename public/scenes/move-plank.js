// move-plank: 核心稳定示范（抬手屈膝交替稳定躯干，不折腰）
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawMat(g) {
    rr(g, -110, -6, 220, 8, 4);
    inkFill(g, C.paper, 1.4);
    text(g, '保持躯干一条直线', 0, 16, 10, C.muted);
  }

  SC['move-plank'] = {
    dur: 5.6,
    width: 340,
    label: '小人示范稳定核心动作：收紧腹部、交替慢抬手臂与膝盖，保持脊柱中立不塌腰。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let active = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [7, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        active = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.9, 5.4)));
        const cyc = (Math.sin((T - 0.5) * 3.0) + 1) * 0.5;
        const holdA = P({
          head: [4, -112], chest: [2, -88], hip: [0, -58],
          kF: [20, -40], kB: [2, -30], fF: [16, -16], fB: [-4, -2],
          hF: [24, -102], hB: [-4, -58],
        });
        const holdB = P({
          head: [4, -112], chest: [2, -88], hip: [0, -58],
          kF: [4, -30], kB: [18, -40], fF: [6, -2], fB: [12, -16],
          hF: [12, -60], hB: [16, -92],
        });
        pose = mix(pose, mix(holdA, holdB, cyc), active);
      }

      drawMat(g);
      fig(g, pose, 0, -4, { wave: S.wave, wt: S.wt, held: chestDot });
      if (active > 0.3) {
        // orange core stability line along spine
        ln(g, -26, -96, -26, -54, 2.5, OR());
        text(g, '核心收紧', -66, -74, 10, OR());
      }
    },
  };
})();
