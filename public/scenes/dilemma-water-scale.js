// dilemma-water-scale: 大餐/经期/新手重了 2 斤——拧开水滴阀，多余水分排掉，秤针自然回落。
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

  function drawDial(g, angle, badge) {
    const cx = 78, cy = -74, r = 42;
    circle(g, cx, cy, r);
    inkFill(g, C.paper, 1.8);
    // ticks
    for (let i = -3; i <= 3; i++) {
      const a = i * 0.38;
      ln(g, cx + Math.sin(a) * 32, cy - Math.cos(a) * 32, cx + Math.sin(a) * 38, cy - Math.cos(a) * 38, 1.3, C.ink);
    }
    // needle
    ln(g, cx, cy, cx + Math.sin(angle) * 30, cy - Math.cos(angle) * 30, 2.2, OR());
    circle(g, cx, cy, 4);
    inkFill(g, C.ink, 1);
    text(g, '体重秤', cx, 16, 10, C.muted);
    if (badge) {
      rr(g, cx - 34, cy - 68, 68, 22, 11);
      inkFill(g, C.paper, 1.4);
      text(g, badge, cx, cy - 53, 10, badge.includes('水') ? OR() : C.ink);
    }
  }

  function drawDrops(g, drainK) {
    if (drainK <= 0.02 || drainK >= 0.98) return;
    for (let i = 0; i < 4; i++) {
      const p = (drainK * 1.4 + i * 0.22) % 1;
      const dx = 132 + i * 10;
      const dy = -96 + p * 86;
      g.save();
      g.globalAlpha = 1 - p;
      circle(g, dx, dy, 3.2);
      g.fillStyle = OR();
      g.fill();
      g.restore();
    }
  }

  SC['dilemma-water-scale'] = {
    dur: 5.8,
    width: 390,
    label: '秤针先飙到+2斤，随后水分排出，指针自然回落原位。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let angle = 0.05, drainK = 0, sparkK = 0, badge = '';

      if (T < 0) {
        angle = 0.72 + Math.sin(t * 2) * 0.06;
        badge = '+2 斤？';
        pose = mix(pose, P({ hF: [16, -98], head: [10, -112] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        const spike = E.soft(seg(T, 0.2, 1.0));
        const drop = E.soft(seg(T, 2.0, 3.8));
        angle = lerp(0.05, 0.85 * spike - 0.8 * drop, fade);
        drainK = seg(T, 1.8, 4.0);
        sparkK = seg(T, 3.8, 4.4);
        if (T < 1.8) badge = '+2 斤！';
        else if (T < 3.7) badge = '排掉水分';
        else badge = '自然回落 ✓';

        const shocked = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.6, 2.0)));
        pose = mix(pose, P({ hF: [18, -112], hB: [-12, -108], head: [4, -116] }), shocked);
        const calm = E.soft(seg(T, 3.7, 4.2)) * (1 - E.soft(seg(T, 5.0, 5.4)));
        pose = mix(pose, P({ hF: [30, -82], hB: [-4, -56], head: [8, -114] }), calm);
      }

      drawDial(g, angle, badge);
      drawDrops(g, drainK);
      fig(g, pose, -78, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 78, -118, sparkK, 12, 5);
    },
  };
})();
