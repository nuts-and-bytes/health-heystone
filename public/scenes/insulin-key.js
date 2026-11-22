// insulin-key: 胰岛素是给细胞开门的门禁卡，把血液里的糖送进细胞当燃料。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, tick, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawCell(g, doorOpen, sugarIn) {
    const x = 44, y = -132, w = 114, h = 114;
    rr(g, x, y, w, h, 14);
    inkFill(g, C.paper, 1.6);
    text(g, '细胞房间', x + w / 2, y + 20, 10, C.ink);
    // door on left wall
    const doorH = lerp(34, 6, doorOpen);
    ln(g, x, y + 48, x, y + 48 + doorH, 3.2, C.ink);
    // sugar cubes inside
    if (sugarIn > 0.1) {
      const sx = lerp(x - 36, x + 54, sugarIn);
      rr(g, sx, y + 60, 16, 16, 3);
      inkFill(g, C.paper, 1.4);
      text(g, '糖', sx + 8, y + 72, 9, C.ink);
    }
    text(g, '细胞', x + w / 2, 16, 10, C.muted);
  }

  function drawKeyCard(g, k) {
    const x = lerp(-46, 22, k);
    const y = -82;
    rr(g, x, y, 32, 20, 4);
    inkFill(g, OR(), 1.5, C.ink);
    text(g, '胰岛素', x + 16, y - 6, 9, OR());
  }

  SC['insulin-key'] = {
    dur: 6.0,
    width: 390,
    label: '小人递出橙色胰岛素门禁卡刷开细胞大门，血液里的糖块顺利进入细胞供能。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let keyK = 0, doorOpen = 0, sugarIn = 0, tickK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        keyK = E.soft(seg(T, 0.3, 1.4)) * (1 - E.soft(seg(T, 4.4, 5.1))) * fade;
        doorOpen = E.soft(seg(T, 1.35, 1.9)) * (1 - E.soft(seg(T, 4.1, 4.7))) * fade;
        sugarIn = E.soft(seg(T, 1.9, 3.4)) * fade;
        tickK = seg(T, 3.5, 4.0) * fade;
        const reach = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 4.3, 4.8)));
        pose = mix(pose, P({ hF: [28, -82], hB: [-4, -54], head: [8, -114] }), reach);
      }

      drawCell(g, doorOpen, sugarIn);
      drawKeyCard(g, keyK);
      fig(g, pose, -86, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      tick(g, 134, -144, tickK, 1.6, OR());
    },
  };
})();
