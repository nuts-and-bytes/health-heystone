// dilemma-postmeal-walk: 饭后温和慢走不会导致胃下垂，反而能压平餐后血糖峰值；真正该避开的是饭后立刻平躺防反酸。
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

  function drawPostMealBoard(g, walkK) {
    const x = 16, y = -126, w = 136;

    // Top row: avoid lying flat right after eating
    rr(g, x, y, w, 26, 8);
    inkFill(g, walkK > 0.35 ? '#FEF2F2' : C.paper, 1.3);
    text(g, '✕ 饭后立刻平躺：易胃酸反流', x + w / 2, y + 17, 8.4, walkK > 0.35 ? '#B91C1C' : C.muted);

    // Main curve card: blood glucose spike flattening with gentle walk
    rr(g, x, y + 32, w, 82, 9);
    inkFill(g, walkK > 0.45 ? C.butterSoft : C.paper, 1.5);
    text(g, walkK > 0.45 ? '✓ 歇会儿慢走 10–20 分钟' : '饭后散步会晃出胃下垂吗？', x + w / 2, y + 48, 8.8, walkK > 0.45 ? OR() : C.ink);

    // Baseline axis
    const gx1 = x + 14, gx2 = x + w - 14, gyBase = y + 90;
    ln(g, gx1, gyBase, gx2, gyBase, 1.1, C.line || '#d6d3d1');

    // Smooth curve transitioning from sharp glucose spike -> gentle wave
    const peakH = lerp(32, 13, walkK);
    g.save();
    g.beginPath();
    g.moveTo(gx1, gyBase - 3);
    g.bezierCurveTo(gx1 + 26, gyBase - 4, gx1 + 36, gyBase - peakH, gx1 + 54, gyBase - peakH);
    g.bezierCurveTo(gx1 + 72, gyBase - peakH, gx1 + 84, gyBase - 6, gx2, gyBase - 4);
    g.strokeStyle = walkK > 0.45 ? OR() : C.ink;
    g.lineWidth = 2.2;
    g.stroke();
    g.restore();

    text(g, walkK > 0.45 ? '餐后血糖更稳 · 不致胃下垂' : '久坐不动血糖冲高', x + w / 2, y + 106, 8.1, walkK > 0.45 ? C.ink : C.muted);
    text(g, '慢悠悠溜达即可 · 避开剧烈跑跳', x + w / 2, 14, 8.5, C.muted);
  }

  SC['dilemma-postmeal-walk'] = {
    dur: 5.2,
    width: 390,
    label: '小橙划掉饭后立刻平躺，迈开轻松慢走的步伐，右侧餐后血糖尖峰随之平滑落回舒适区。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let walkK = 0, sparkK = 0;
      let stepShift = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        walkK = E.soft(seg(T, 0.7, 2.2)) * fade;
        sparkK = seg(T, 2.3, 3.0);

        // gentle strolling leg & arm swing
        const strolling = E.soft(seg(T, 0.5, 1.1)) * (1 - E.soft(seg(T, 4.1, 4.7)));
        const cyc = Math.sin(T * 5.2);
        stepShift = strolling * cyc * 4;
        pose = mix(
          pose,
          P({
            hF: [10 + cyc * 14, -58],
            hB: [-6 - cyc * 14, -56],
            fF: [10 - cyc * 12, 0],
            fB: [-10 + cyc * 12, 0],
            head: [4, -116 + Math.abs(cyc) * 2],
          }),
          strolling
        );
      }

      drawPostMealBoard(g, walkK);
      fig(g, pose, -76 + stepShift, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 84, -76, sparkK, 12, 5);
    },
  };
})();
