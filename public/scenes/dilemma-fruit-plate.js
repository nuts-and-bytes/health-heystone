// dilemma-fruit-plate: 晚上只吃水果当晚饭缺蛋白易掉肌、过量果糖伤肝；把水果放回小碟餐间吃，晚饭吃均衡蛋白餐盘。
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

  function drawPlate(g, swapK) {
    const cx = 66, cy = -74, r = 38;

    // top banner
    rr(g, 16, -128, 134, 24, 12);
    inkFill(g, swapK > 0.45 ? C.butterSoft : '#FEF2F2', 1.4);
    text(g, swapK > 0.45 ? '✓ 均衡晚饭 + 水果放餐间' : '✕ 水果当晚饭：缺蛋白/过量果糖', 83, -112, 8.4, swapK > 0.45 ? OR() : '#B91C1C');

    // main dinner plate
    circle(g, cx, cy, r);
    inkFill(g, C.paper, 1.7);

    if (swapK < 0.45) {
      // overloaded fruit bowl/slices
      g.beginPath();
      g.arc(cx, cy + 4, 22, Math.PI, 0);
      g.closePath();
      g.fillStyle = '#FED7AA';
      g.fill();
      g.strokeStyle = C.ink;
      g.lineWidth = 1.5;
      g.stroke();
      text(g, '全果糖 · 0蛋白', cx, cy + 19, 8.2, '#B91C1C');
    } else {
      // balanced 3-section plate: veg (left half), protein (top-right), grain (bottom-right)
      ln(g, cx, cy - r + 3, cx, cy + r - 3, 1.3, C.ink);
      ln(g, cx, cy, cx + r - 3, cy, 1.3, C.ink);

      // orange highlight wedge for protein quarter
      g.beginPath();
      g.moveTo(cx, cy);
      g.arc(cx, cy, r - 3, -Math.PI * 0.5, 0);
      g.closePath();
      g.fillStyle = C.butterSoft;
      g.fill();

      text(g, '蔬菜', cx - 18, cy + 4, 9.2, C.ink);
      text(g, '蛋白', cx + 17, cy - 11, 9, OR());
      text(g, '杂粮', cx + 17, cy + 16, 8.8, C.ink);
    }

    // small side fruit saucer (appears when swapped)
    const sx = 132, sy = -58;
    circle(g, sx, sy, 18);
    inkFill(g, swapK > 0.45 ? C.butterSoft : C.paper, 1.4);
    text(g, '鲜果', sx, sy - 2, 8.5, swapK > 0.45 ? OR() : C.muted);
    text(g, '1–2拳', sx, sy + 10, 7.6, C.muted);

    text(g, '膳食指南：每日鲜果 200–350g，不代餐', 83, 14, 8.5, C.muted);
  }

  SC['dilemma-fruit-plate'] = {
    dur: 5.2,
    width: 390,
    label: '小橙把堆满果糖的代餐盘换成蔬菜、优质蛋白与杂粮均衡晚饭，把1到2拳鲜果放回旁边小碟。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let swapK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        swapK = E.soft(seg(T, 0.7, 1.6)) * fade;
        sparkK = seg(T, 1.8, 2.5);

        const swap = E.soft(seg(T, 0.4, 1.1)) * (1 - E.soft(seg(T, 2.0, 2.5)));
        pose = mix(pose, P({ hF: [42, -76], hB: [-4, -56], head: [8, -114] }), swap);

        const cheer = E.soft(seg(T, 2.4, 3.0)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [20, -126], hB: [-12, -120], head: [2, -116] }), cheer);
      }

      drawPlate(g, swapK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 84, -88, sparkK, 12, 5);
    },
  };
})();
