// move-squat: 坐站起立 / 深蹲动作示范（重心稳住，膝盖顺脚尖方向，臀部向后坐）
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
    const x = -72, y = -46, w = 40, h = 8;
    rr(g, x, y, w, h, 3);
    inkFill(g, C.paper, 1.5);
    ln(g, x + 5, y + h, x + 5, 0, 2, C.ink);
    ln(g, x + w - 5, y + h, x + w - 5, 0, 2, C.ink);
    ln(g, x + 5, y - 34, x + 5, y, 2, C.ink);
    text(g, '参考椅', x + w / 2, 16, 10, C.muted);
  }

  SC['move-squat'] = {
    dur: 5.6,
    width: 340,
    label: '小人示范坐站起立与深蹲：手臂前伸保持平衡，臀部向后微坐再稳稳站起，重复三次。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let rep = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [7, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const w = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.9, 5.4)));
        const cyc = (Math.sin((T - 0.5) * 3.4 - Math.PI / 2) + 1) * 0.5;
        rep = cyc * w;
        const squat = P({
          head: [10, -88], chest: [6, -68], hip: [-14, -44],
          kF: [18, -38], kB: [10, -38], fF: [10, -2], fB: [-4, -2],
          hF: [36, -66], hB: [24, -66],
        });
        pose = mix(pose, squat, rep);
      }

      drawChair(g);
      fig(g, pose, 16, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      // orange cue arrow showing hip back & up
      if (rep > 0.2) {
        ln(g, -22, -46, -22, -74, 2.2, OR());
        text(g, '臀向后坐', -22, -82, 10, OR());
      }
      text(g, '深蹲 / 坐站起立', 22, 16, 10, C.muted);
    },
  };
})();
