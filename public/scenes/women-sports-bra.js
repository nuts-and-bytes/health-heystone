// women-sports-bra: 运动时必穿合适支撑度的运动内衣护悬韧带，练完换回宽松舒适款、睡觉解开。
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

  function drawSwitch(g, nightK) {
    rr(g, 16, -114, 58, 76, 10);
    inkFill(g, nightK < 0.5 ? C.butterSoft : C.paper, 1.5);
    text(g, '运动时', 45, -88, 9.5, C.muted);
    text(g, '稳支撑', 45, -62, 11, nightK < 0.5 ? OR() : C.ink);
    text(g, '护悬韧带', 45, 14, 9, C.muted);

    rr(g, 86, -114, 58, 76, 10);
    inkFill(g, nightK >= 0.5 ? C.butterSoft : C.paper, 1.5);
    text(g, '日常/睡', 115, -88, 9.5, C.muted);
    text(g, '换宽松', 115, -62, 11, nightK >= 0.5 ? OR() : C.ink);
    text(g, '不勒不压', 115, 14, 9, C.muted);
  }

  SC['women-sports-bra'] = {
    dur: 5.0,
    width: 390,
    label: '小橙区分运动与日常两种场景：运动时穿稳支撑护韧带，练完和睡觉换宽松放松。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let nightK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -76], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        nightK = E.soft(seg(T, 1.8, 2.5)) * fade;
        sparkK = seg(T, 2.5, 3.2);
        const p1 = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.7, 2.1)));
        pose = mix(pose, P({ hF: [36, -78], hB: [-6, -54], head: [8, -114] }), p1);
        const p2 = E.soft(seg(T, 2.2, 2.7)) * (1 - E.soft(seg(T, 4.2, 4.6)));
        pose = mix(pose, P({ hF: [56, -78], hB: [-4, -54], head: [10, -114] }), p2);
      }

      drawSwitch(g, nightK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 115, -72, sparkK, 12, 5);
    },
  };
})();
