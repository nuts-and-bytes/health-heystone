// dilemma-zero-cola: 无糖可乐解馋不飙血糖，但日常补水还是交给白开水大水壶。
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

  function drawMeter(g, sugarJump, waterK) {
    // 0-cal can
    rr(g, 14, -68, 30, 56, 6);
    inkFill(g, C.paper, 1.5);
    text(g, '0卡', 29, -36, 10, OR());
    text(g, '解馋', 29, 14, 9.5, C.muted);

    // blood sugar mini graph
    rr(g, 58, -118, 96, 62, 8);
    inkFill(g, C.paper, 1.5);
    text(g, '血糖波动', 106, -101, 9.5, C.ink);
    g.beginPath();
    g.moveTo(68, -74);
    g.lineTo(94, -74);
    g.lineTo(108, -74 - sugarJump * 16);
    g.lineTo(142, -74);
    g.strokeStyle = OR();
    g.lineWidth = 2;
    g.stroke();

    // daily water pitcher
    rr(g, 84, -44, 52, 42, 8);
    inkFill(g, waterK > 0.3 ? C.butterSoft : C.paper, 1.5);
    text(g, '白开水', 110, -19, 10, waterK > 0.3 ? OR() : C.ink);
    text(g, '主力补水', 110, 14, 9.5, C.muted);
  }

  SC['dilemma-zero-cola'] = {
    dur: 5.2,
    width: 390,
    label: '小橙拿起0卡饮料，血糖线几乎平稳；随后指向旁边的白开水壶，提醒解馋可以但别当水喝。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let jump = 0.08, waterK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -72], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        jump = 0.08 + Math.sin(seg(T, 0.5, 1.6) * Math.PI) * 0.14;
        waterK = E.soft(seg(T, 2.0, 2.7)) * fade;
        sparkK = seg(T, 2.4, 3.0);

        const sip = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.6, 2.0)));
        pose = mix(pose, P({ hF: [28, -96], hB: [-4, -54], head: [6, -112] }), sip);
        const pointWater = E.soft(seg(T, 2.1, 2.6)) * (1 - E.soft(seg(T, 4.2, 4.7)));
        pose = mix(pose, P({ hF: [56, -54], hB: [-6, -54], head: [10, -112] }), pointWater);
      }

      drawMeter(g, jump, waterK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 110, -34, sparkK, 12, 5);
    },
  };
})();
