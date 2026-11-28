// dilemma-meal-order: 菜→肉→饭进食顺序可显著压平餐后血糖峰值，胃弱者选温热熟菜、总热量仍是根本。
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

  function drawMealCurve(g, smoothK, okK) {
    const x = 16, y = -126, w = 136, h = 114;

    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '进食顺序 · 餐后血糖曲线', x + w / 2, y + 17, 9, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // Three sequence pills: 1 熟菜 -> 2 蛋白 -> 3 主食
    const pills = ['① 熟蔬菜', '② 肉蛋豆', '③ 主食'];
    for (let i = 0; i < 3; i++) {
      const px = x + 10 + i * 40;
      rr(g, px, y + 30, 36, 20, 5);
      inkFill(g, smoothK > i * 0.28 + 0.15 ? C.butterSoft : C.paper, 1.2);
      text(g, pills[i], px + 18, y + 43, 7.6, smoothK > i * 0.28 + 0.15 ? OR() : C.ink);
    }

    // Glucose curve box
    const gx = x + 14, gy = y + 92, gw = w - 28;
    ln(g, gx, gy, gx + gw, gy, 1.2, C.line || '#d6d3d1');

    // Morph sharp red spike into smooth orange hill
    const peakY = lerp(y + 56, y + 76, smoothK);
    const col = smoothK > 0.5 ? OR() : '#B91C1C';
    g.beginPath();
    g.moveTo(gx, gy - 3);
    g.quadraticCurveTo(gx + gw * 0.36, peakY, gx + gw * 0.62, lerp(y + 84, y + 80, smoothK));
    g.quadraticCurveTo(gx + gw * 0.82, gy - 4, gx + gw, gy - 4);
    g.strokeStyle = col;
    g.lineWidth = 2.2;
    g.stroke();

    text(g, okK > 0.3 ? '✓ 峰值变平 · 少犯困更稳' : '先吃主食血糖冲峰陡峭', x + w / 2, y + 105, 8, okK > 0.3 ? OR() : '#B91C1C');
    text(g, '胃弱别空腹啃生冷沙拉，总热量仍是根本', x + w / 2, 14, 8, C.muted);
  }

  SC['dilemma-meal-order'] = {
    dur: 5.2,
    width: 390,
    label: '小橙依次点亮熟蔬菜、肉蛋豆和主食顺序，陡峭的餐后血糖尖峰平滑回落为温和曲线。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let smoothK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        smoothK = E.soft(seg(T, 0.5, 1.8)) * fade;
        okK = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.2, 2.9);

        const guide = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 2.0, 2.5)));
        pose = mix(pose, P({ hF: [36, lerp(-86, -66, smoothK)], hB: [-6, -54], head: [8, -114] }), guide);

        const cheer = E.soft(seg(T, 2.4, 3.0)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [22, -124], hB: [-12, -118], head: [2, -116] }), cheer);
      }

      drawMealCurve(g, smoothK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -56, sparkK, 12, 5);
    },
  };
})();
