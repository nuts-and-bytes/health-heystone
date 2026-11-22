// rct-lottery: 随机对照试验 = 用抽签把人公平分成「做」和「不做」两组再比较。
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

  function drawBox(g, shake) {
    const x = -28 + shake, y = -94, w = 54, h = 44;
    rr(g, x, y, w, h, 6);
    inkFill(g, OR(), 1.6, C.ink);
    // slot on top
    ln(g, x + 14, y + 7, x + w - 14, y + 7, 2.2, C.paper);
    text(g, '随机抽签', x + w / 2, y + 29, 10, C.paper);
  }

  function drawGroup(g, x, title, count, barH, tickK) {
    rr(g, x, -42, 64, 34, 6);
    inkFill(g, C.paper, 1.4);
    text(g, title, x + 32, 16, 10, C.muted);
    // mini participant dots inside box
    for (let i = 0; i < count; i++) {
      circle(g, x + 16 + i * 16, -25, 4.2);
      inkFill(g, C.paper, 1.3);
    }
    // result bar above box
    if (barH > 1) {
      rr(g, x + 20, -48 - barH, 24, barH, 4);
      inkFill(g, tickK > 0 ? OR() : C.paper, 1.4, C.ink);
      if (tickK > 0) tick(g, x + 32, -56 - barH, tickK, 1.5, OR());
    }
  }

  SC['rct-lottery'] = {
    dur: 6.2,
    width: 390,
    label: '小人摇动橙色抽签盒，把参与者随机分成「做」和「不做」两组，最后对比两组的柱子高度。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let shake = 0, nA = 0, nB = 0, barA = 0, barB = 0, tickK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [8, -114] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const shakeW = E.soft(seg(T, 0.3, 0.6)) * (1 - E.soft(seg(T, 1.5, 1.8)));
        shake = Math.sin(T * 28) * 3 * shakeW;
        const reach = E.soft(seg(T, 0.25, 0.6)) * (1 - E.soft(seg(T, 1.6, 2.0)));
        pose = mix(pose, P({ hF: [30, -82], hB: [10, -78], head: [8, -113] }), reach);
        const splitP = seg(T, 1.5, 3.0) * fade;
        nA = Math.min(3, Math.floor(splitP * 3.5));
        nB = Math.min(3, Math.floor(splitP * 3.2));
        const res = E.soft(seg(T, 3.1, 4.1)) * fade;
        barA = 54 * res;
        barB = 22 * res;
        tickK = seg(T, 4.0, 4.5) * fade;
      }

      drawGroup(g, 38, '做（实验组）', nA, barA, tickK);
      drawGroup(g, 114, '不做（对照）', nB, barB, 0);
      drawBox(g, shake);
      fig(g, pose, -102, 0, { wave: S.wave, wt: S.wt, held: chestDot });
    },
  };
})();
