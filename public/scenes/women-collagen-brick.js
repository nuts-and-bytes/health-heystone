// women-collagen-brick: 喝下去的胶原蛋白会被拆成氨基酸小砖块，防晒+睡眠+均衡蛋白才是真抗老地基。
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

  function drawBricks(g, splitK) {
    // top collagen bottle / chain splitting into 3 small bricks
    text(g, '胶原蛋白饮', 82, -124, 9.5, C.muted);
    for (let i = 0; i < 3; i++) {
      const bx = 46 + i * 26 + (i - 1) * splitK * 12;
      const by = lerp(-108, -72, splitK);
      rr(g, bx, by, 20, 14, 3);
      inkFill(g, C.butterSoft, 1.4);
    }
    text(g, splitK > 0.5 ? '拆成普通氨基酸' : '整条吞下去？', 82, -46, 9, C.ink);

    // bottom 3 real pillars
    const pillars = ['防晒', '睡眠', '三餐蛋白'];
    for (let i = 0; i < 3; i++) {
      const px = 14 + i * 48;
      rr(g, px, -28, 42, 24, 6);
      inkFill(g, splitK > 0.6 ? C.butterSoft : C.paper, 1.4);
      text(g, pillars[i], px + 21, -12, 8.5, splitK > 0.6 ? OR() : C.ink);
    }
  }

  SC['women-collagen-brick'] = {
    dur: 5.2,
    width: 390,
    label: '胶原蛋白被拆成小块氨基酸，小橙指向底部的防晒、睡眠与三餐蛋白三大真地基。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let splitK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        splitK = E.soft(seg(T, 0.5, 2.0)) * fade;
        sparkK = seg(T, 2.3, 3.0);
        const point = E.soft(seg(T, 1.8, 2.4)) * (1 - E.soft(seg(T, 4.2, 4.7)));
        pose = mix(pose, P({ hF: [42, -38], hB: [-6, -54], head: [10, -110] }), point);
      }

      drawBricks(g, splitK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 82, -20, sparkK, 12, 5);
    },
  };
})();
