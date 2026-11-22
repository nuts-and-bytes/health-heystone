// sleep-bank: 工作日透支睡眠，周末补觉也补不满罐子。
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

  const DAYS = ['一', '二', '三', '四', '五', '周末'];

  function drawJar(g, level, leakK, dayLabel) {
    const x = 36, y = -126, w = 84, h = 114;
    // lid
    rr(g, x + 12, y - 10, w - 24, 12, 4);
    inkFill(g, C.paper, 1.5);
    // jar body
    rr(g, x, y, w, h, 14);
    inkFill(g, C.paper, 1.6);
    // orange sleep level
    const lh = Math.max(8, (h - 10) * level);
    rr(g, x + 5, y + h - 5 - lh, w - 10, lh, 10);
    g.fillStyle = OR();
    g.fill();
    // small crack on right side when refilling
    if (leakK > 0.05) {
      g.save();
      g.globalAlpha = leakK;
      ln(g, x + w - 2, y + 66, x + w + 10, y + 72, 1.5, C.ink);
      ln(g, x + w + 10, y + 72, x + w + 4, y + 80, 1.5, C.ink);
      circle(g, x + w + 10, y + 92 + (leakK * 14) % 12, 2.4);
      g.fillStyle = OR();
      g.fill();
      g.restore();
    }
    text(g, '睡眠储蓄', x + w / 2, 16, 10, C.muted);
    if (dayLabel) {
      rr(g, x + 18, y - 36, 48, 20, 6);
      inkFill(g, C.paper, 1.2);
      text(g, dayLabel, x + 42, y - 22, 10, C.ink);
    }
  }

  SC['sleep-bank'] = {
    dur: 6.4,
    width: 390,
    label: '周一到周五橙色睡眠罐子不断下降，周末补觉倒回一些但罐口有裂缝，始终补不满原位。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let level = 0.85, leakK = 0, dayLabel = '';

      if (T < 0) {
        pose = mix(pose, P({ hF: [10, -96], head: [6, -114], hB: [-4, -54] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const drain = E.soft(seg(T, 0.3, 3.0));
        const refill = E.soft(seg(T, 3.3, 4.9));
        const target = 0.85 - drain * 0.62 + refill * 0.28;
        level = lerp(0.85, target, fade);
        leakK = E.soft(seg(T, 3.5, 4.1)) * fade;
        if (T >= 0.3 && T < 3.0) {
          const idx = Math.min(4, Math.floor(seg(T, 0.3, 3.0) * 5));
          dayLabel = '周' + DAYS[idx];
        } else if (T >= 3.2 && T < 5.6) {
          dayLabel = '周末';
        }
        // tired slump during weekdays, then trying to pour on weekend
        const slump = E.soft(seg(T, 0.6, 1.1)) * (1 - E.soft(seg(T, 2.9, 3.3)));
        pose = mix(pose, P({ head: [10, -104], chest: [4, -84], hF: [10, -92], hB: [-6, -50] }), slump);
        const pour = E.soft(seg(T, 3.3, 3.7)) * (1 - E.soft(seg(T, 4.9, 5.3)));
        pose = mix(pose, P({ hF: [28, -94], hB: [10, -82], head: [8, -112] }), pour);
      }

      drawJar(g, level, leakK, dayLabel);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      if (T > 3.3 && T < 5.0) {
        text(g, 'Zzz', -50, -126, 10, C.muted);
      }
    },
  };
})();
