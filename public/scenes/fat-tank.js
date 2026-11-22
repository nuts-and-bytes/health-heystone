// fat-tank: 练腹肌时，身体从统一的「全身脂肪」油箱里调用能量，各处管道一起降，不只是肚子。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  const TANK = { x: 46, y: -136, w: 94, h: 108 };
  const PIPES = [
    { x: 64, lb: '脸' },
    { x: 93, lb: '臂' },
    { x: 122, lb: '肚' },
  ];

  function drawTank(g, level, dropT) {
    // pipes underneath
    for (let i = 0; i < PIPES.length; i++) {
      const p = PIPES[i];
      ln(g, p.x, TANK.y + TANK.h, p.x, -8, 2.4, C.ink);
      text(g, p.lb, p.x, 16, 10, C.muted);
      if (dropT > 0) {
        const phase = (dropT * 1.4 + i * 0.28) % 1;
        const dy = lerp(TANK.y + TANK.h + 4, -8, phase);
        circle(g, p.x, dy, 2.8);
        g.fillStyle = OR();
        g.fill();
      }
    }
    // outer tank
    rr(g, TANK.x, TANK.y, TANK.w, TANK.h, 8);
    inkFill(g, C.paper, 1.6);
    // orange liquid inside
    const pad = 4;
    const maxH = TANK.h - pad * 2;
    const lh = Math.max(8, maxH * level);
    rr(g, TANK.x + pad, TANK.y + TANK.h - pad - lh, TANK.w - pad * 2, lh, 5);
    g.fillStyle = OR();
    g.fill();
    text(g, '全身脂肪', TANK.x + TANK.w / 2, TANK.y - 10, 10, C.muted);
  }

  SC['fat-tank'] = {
    dur: 6.2,
    width: 390,
    label: '小人在旁边做腹肌动作，但旁边的「全身脂肪」油箱液面整体下降，脸、手臂和肚子三条管道一起流出小滴，说明不能局部减脂。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let level = 0.82;
      let dropT = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [10, -96], head: [7, -114], hB: [-4, -54] }), pulse(t, 5.8, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const workW = E.soft(seg(T, 0.25, 0.7)) * (1 - E.soft(seg(T, 4.1, 4.6)));
        const rep = Math.sin(Math.max(0, T - 0.6) * 3.8) * 0.5 + 0.5;
        // vigorous core crunch / knee-raise standing workout (clean joints, no ground clip)
        const crunchA = P({
          head: [9, -106], chest: [5, -84], hip: [-1, -56],
          kF: [22, -36], kB: [6, -28], fF: [16, -12], fB: [-6, -2],
          hF: [22, -92], hB: [6, -74],
        });
        const crunchB = P({
          head: [4, -114], chest: [1, -90], hip: [0, -58],
          kF: [10, -30], kB: [2, -30], fF: [8, -2], fB: [-6, -2],
          hF: [16, -68], hB: [-4, -58],
        });
        pose = mix(pose, mix(crunchB, crunchA, rep), workW);
        const wipe = E.soft(seg(T, 4.6, 4.95)) * (1 - E.soft(seg(T, 5.4, 5.75)));
        pose = mix(pose, P({ hF: [12, -106], hB: [-6, -54], head: [4, -114] }), wipe);
        level = lerp(0.82, 0.56, E.soft(seg(T, 0.7, 4.2)) * fade);
        dropT = workW > 0.2 ? T : 0;
      }

      drawTank(g, level, dropT);
      fig(g, pose, -88, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      text(g, '卷腹中', -88, 16, 10, C.muted);
    },
  };
})();
