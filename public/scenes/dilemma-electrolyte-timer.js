// dilemma-electrolyte-timer: 常规 1 小时内运动喝白水就够，超 1 小时暴汗或高温户外再补电解质。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, sparks, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawBottles(g, longK) {
    // left: <60 min plain water
    rr(g, 14, -96, 56, 76, 8);
    inkFill(g, longK < 0.5 ? C.butterSoft : C.paper, 1.5);
    text(g, '≤1小时', 42, -74, 9.5, C.muted);
    text(g, '白开水', 42, -48, 11, longK < 0.5 ? OR() : C.ink);
    text(g, '完全够用', 42, 14, 9, C.muted);

    // right: >60 min heavy sweat electrolyte
    rr(g, 88, -96, 62, 76, 8);
    inkFill(g, longK >= 0.5 ? C.butterSoft : C.paper, 1.5);
    text(g, '>1小时暴汗', 119, -74, 9, C.muted);
    text(g, '电解质', 119, -48, 11, longK >= 0.5 ? OR() : C.ink);
    text(g, '按需补充', 119, 14, 9, C.muted);
  }

  SC['dilemma-electrolyte-timer'] = {
    dur: 5.0,
    width: 390,
    label: '小橙对照运动时长：1小时内常规出汗指向白开水，超过1小时暴汗再切换到电解质水。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let longK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -76], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        longK = E.soft(seg(T, 1.8, 2.5)) * fade;
        sparkK = seg(T, 2.5, 3.2);
        const pointL = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.7, 2.1)));
        pose = mix(pose, P({ hF: [36, -72], hB: [-6, -54], head: [8, -114] }), pointL);
        const pointR = E.soft(seg(T, 2.1, 2.6)) * (1 - E.soft(seg(T, 4.2, 4.6)));
        pose = mix(pose, P({ hF: [56, -72], hB: [-4, -54], head: [10, -114] }), pointR);
      }

      drawBottles(g, longK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 119, -62, sparkK, 12, 5);
    },
  };
})();
