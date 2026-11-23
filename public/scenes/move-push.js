// move-push: 真正的 30 度斜身扶墙俯卧撑（双脚退后、身体斜倾，手肘弯曲胸口贴墙再推直）
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
    rr(g, 66, -152, 18, 152, 3);
    inkFill(g, C.paper, 1.6);
    text(g, '墙面', 75, 16, 10, C.muted);
  }

  SC['move-push'] = {
    dur: 5.6,
    width: 340,
    label: '小人双脚退后斜身撑墙，手肘弯曲让胸口贴近墙面再稳稳推回，示范扶墙俯卧撑。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const leanStart = P({
        head: [26, -108],
        chest: [18, -86],
        hip: [-2, -56],
        kF: [-14, -28],
        kB: [-20, -28],
        fF: [-28, -2],
        fB: [-36, -2],
        hF: [56, -86],
        hB: [54, -82],
        hang: 0,
      });
      let pose = breathe(leanStart, t);
      let pushK = 0;

      if (T < 0) {
        pose = mix(pose, P({ ...leanStart, head: [28, -110] }), pulse(t, 5.5, 2, 2));
      } else {
        const w = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.9, 5.4)));
        const cyc = (Math.sin((T - 0.5) * 3.2 - Math.PI / 2) + 1) * 0.5;
        pushK = cyc * w;
        const leanIn = P({
          head: [46, -98],
          chest: [38, -78],
          hip: [12, -52],
          kF: [-6, -26],
          kB: [-12, -26],
          fF: [-28, -2],
          fB: [-36, -2],
          hF: [56, -84],
          hB: [54, -80],
          hang: 0,
        });
        pose = mix(pose, leanIn, pushK);
      }

      drawWall(g);
      fig(g, pose, 10, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      if (pushK > 0.25) {
        ln(g, -46, -84, -14, -84, 2.4, OR());
        ln(g, -22, -89, -14, -84, 2.2, OR());
        ln(g, -22, -79, -14, -84, 2.2, OR());
        text(g, '胸近墙再推', -48, -96, 10, OR());
      }
      text(g, '斜身扶墙俯卧撑', -14, 16, 10, C.muted);
    },
  };
})();
