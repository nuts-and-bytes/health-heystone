// gut-city: 肠道菌群像肚子里的十万亿房客，吃进膳食纤维（蔬菜全谷物）它们才长得好。
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

  function drawGut(g, feedK, happyK) {
    const x = 14, y = -114, w = 136, h = 92;
    rr(g, x, y, w, h, 24);
    inkFill(g, C.paper, 1.6);
    text(g, '肠道菌群社区', x + w / 2, 16, 10, C.muted);
    // fiber pellets falling in
    if (feedK > 0.05 && feedK < 0.95) {
      for (let i = 0; i < 3; i++) {
        const py = lerp(y - 26, y + 34, Math.min(1, feedK * 1.4 - i * 0.15));
        circle(g, x + 42 + i * 24, py, 3.8);
        g.fillStyle = OR();
        g.fill();
      }
    }
    // little friendly gut microbes bouncing & growing when fed
    const baseR = lerp(5.5, 9, happyK);
    const coords = [
      [x + 36, y + 58],
      [x + 68, y + 48],
      [x + 100, y + 60],
      [x + 54, y + 72],
      [x + 88, y + 36],
    ];
    for (let i = 0; i < coords.length; i++) {
      const [cx, cy] = coords[i];
      const bounce = happyK > 0.2 ? Math.sin(happyK * Math.PI * 3 + i) * 3 : 0;
      circle(g, cx, cy - Math.abs(bounce), baseR);
      inkFill(g, i % 2 === 0 ? OR() : C.paper, 1.3, C.ink);
    }
    text(g, '膳食纤维', x + w / 2, y - 34, 10, OR());
  }

  SC['gut-city'] = {
    dur: 6.0,
    width: 390,
    label: '小人往肠道菌群社区投喂橙色膳食纤维，有益菌群立刻活跃饱满起来。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let feedK = 0, happyK = 0, tickK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        feedK = E.soft(seg(T, 0.4, 2.2));
        happyK = E.soft(seg(T, 1.6, 3.6)) * fade;
        tickK = seg(T, 3.5, 4.1) * fade;
        const toss = E.soft(seg(T, 0.3, 0.85)) * (1 - E.soft(seg(T, 1.6, 2.1)));
        pose = mix(pose, P({ hF: [24, -104], hB: [-4, -54], head: [8, -115] }), toss);
      }

      drawGut(g, feedK, happyK);
      fig(g, pose, -72, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      tick(g, 134, -124, tickK, 1.6, OR());
    },
  };
})();
