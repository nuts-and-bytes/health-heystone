// move-push: 扶墙俯卧撑 / 上肢推拉动作示范（肩下沉、慢下慢推）
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
    rr(g, 54, -142, 16, 142, 3);
    inkFill(g, C.paper, 1.6);
    text(g, '墙面', 62, 16, 10, C.muted);
  }

  SC['move-push'] = {
    dur: 5.6,
    width: 340,
    label: '小人双手扶墙示范俯卧撑：身体保持直线向墙靠近再稳稳推回。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let pushK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [8, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const w = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.9, 5.4)));
        const cyc = (Math.sin((T - 0.5) * 3.4 - Math.PI / 2) + 1) * 0.5;
        pushK = cyc * w;
        const start = P({
          head: [10, -112], chest: [8, -88], hip: [0, -58],
          kF: [2, -30], kB: [-4, -30], fF: [-4, -2], fB: [-12, -2],
          hF: [42, -88], hB: [34, -84],
        });
        const inPose = P({
          head: [26, -106], chest: [22, -84], hip: [10, -56],
          kF: [6, -30], kB: [0, -30], fF: [-4, -2], fB: [-12, -2],
          hF: [42, -88], hB: [34, -84],
        });
        pose = mix(pose, mix(start, inPose, cyc), w);
      }

      drawWall(g);
      fig(g, pose, 12, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      if (pushK > 0.2) {
        ln(g, -42, -86, -18, -86, 2.2, OR());
        text(g, '慢推', -48, -96, 10, OR());
      }
      text(g, '扶墙俯卧撑', -12, 16, 10, C.muted);
    },
  };
})();
