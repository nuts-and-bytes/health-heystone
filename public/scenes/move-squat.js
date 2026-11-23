// move-squat: 深幅坐站起立 / 徒手深蹲示范（明显屈髋深蹲至椅面 + 手臂水平前伸）
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

  function drawChair(g) {
    const x = -78, y = -42, w = 44, h = 8;
    rr(g, x, y, w, h, 3);
    inkFill(g, C.paper, 1.5);
    ln(g, x + 5, y + h, x + 5, 0, 2, C.ink);
    ln(g, x + w - 5, y + h, x + w - 5, 0, 2, C.ink);
    ln(g, x + 5, y - 38, x + 5, y, 2, C.ink);
    text(g, '参考椅', x + w / 2, 16, 10, C.muted);
  }

  SC['move-squat'] = {
    dur: 5.6,
    width: 340,
    label: '小人示范深幅坐站起立：双臂水平前伸，臀部大幅向后坐向椅面再发力站起。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let rep = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [7, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const w = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.9, 5.4)));
        const cyc = (Math.sin((T - 0.5) * 3.2 - Math.PI / 2) + 1) * 0.5;
        rep = cyc * w;
        const deepSquat = P({
          head: [12, -78],
          chest: [6, -60],
          hip: [-22, -38],
          kF: [18, -36],
          kB: [10, -36],
          fF: [12, -2],
          fB: [-2, -2],
          hF: [42, -58],
          hB: [30, -58],
          hang: 0,
        });
        pose = mix(pose, deepSquat, rep);
      }

      drawChair(g);
      fig(g, pose, 18, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      if (rep > 0.25) {
        ln(g, -24, -40, -24, -76, 2.4, OR());
        ln(g, -29, -46, -24, -40, 2.2, OR());
        ln(g, -19, -46, -24, -40, 2.2, OR());
        text(g, '屈髋坐低', -24, -84, 10, OR());
      }
      text(g, '深蹲 / 坐站起立', 22, 16, 10, C.muted);
    },
  };
})();
