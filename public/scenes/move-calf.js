// move-calf: 扶墙提踵与勾脚尖示范（练小腿与脚踝稳定）
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

  function drawWall(g) {
    rr(g, 58, -140, 14, 140, 3);
    inkFill(g, C.paper, 1.5);
  }

  SC['move-calf'] = {
    dur: 5.4,
    width: 340,
    label: '小人轻扶墙面反复踮起脚尖再缓慢落下，示范小腿提踵练习。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let lift = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [8, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const w = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.7, 5.2)));
        const cyc = (Math.sin((T - 0.5) * 3.6 - Math.PI / 2) + 1) * 0.5;
        lift = cyc * w;
        const baseHold = P({
          head: [6, -114], chest: [2, -90], hip: [0, -58],
          hF: [42, -88], hB: [-4, -54],
        });
        const tipToe = P({
          head: [6, -124], chest: [2, -100], hip: [0, -68],
          kF: [8, -38], kB: [0, -38], fF: [8, -10], fB: [-4, -10],
          hF: [42, -94], hB: [-4, -62],
        });
        pose = mix(pose, mix(baseHold, tipToe, cyc), w);
      }

      drawWall(g);
      fig(g, pose, 14, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      if (lift > 0.25) {
        ln(g, -24, -10, -24, -36, 2.2, OR());
        text(g, '踮起 2 秒', -52, -20, 10, OR());
      }
      text(g, '扶墙提踵', 10, 16, 10, C.muted);
    },
  };
})();
