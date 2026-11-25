// women-checkup-report: 体检B超「少量盆腔积液/宫颈柱状上皮异位」多为正常生理现象，看清分级再决定复查。
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

  function drawReport(g, scanK, okK) {
    const x = 22, y = -126, w = 114, h = 112;
    rr(g, x, y, w, h, 8);
    inkFill(g, C.paper, 1.5);
    text(g, '体检 B 超单', x + w / 2, y + 18, 10, C.ink);
    ln(g, x + 12, y + 26, x + w - 12, y + 26, 1, C.line || '#e5e7eb');

    // row 1: 少量盆腔积液
    text(g, '少量积液', x + 38, y + 48, 9.5, C.ink);
    text(g, okK > 0.3 ? '多为生理 ✓' : '吓人词？', x + 86, y + 48, 8.5, okK > 0.3 ? OR() : C.muted);

    // row 2: 柱状上皮异位
    text(g, '柱状异位', x + 38, y + 72, 9.5, C.ink);
    text(g, okK > 0.5 ? '不是烂了 ✓' : '旧称糜烂', x + 86, y + 72, 8.5, okK > 0.5 ? OR() : C.muted);

    // row 3: 异常/高分级
    text(g, '高分级/痛', x + 38, y + 96, 9.5, '#B91C1C');
    text(g, '挂专科复查', x + 86, y + 96, 8.5, '#B91C1C');

    // magnifying glass scanning down
    if (scanK > 0.02 && scanK < 0.98) {
      const gy = y + 36 + scanK * 54;
      circle(g, x + 22, gy, 11);
      g.strokeStyle = OR();
      g.lineWidth = 2;
      g.stroke();
      ln(g, x + 14, gy + 8, x + 7, gy + 15, 2, C.ink);
    }
  }

  SC['women-checkup-report'] = {
    dur: 5.2,
    width: 390,
    label: '小橙拿放大镜逐行看清体检报告，把吓人的生理性术语标清，高分级或不适再挂专科复查。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let scanK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [8, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        scanK = E.soft(seg(T, 0.4, 2.4));
        okK = E.soft(seg(T, 1.2, 2.8)) * fade;
        sparkK = seg(T, 2.8, 3.5);

        const look = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 2.5, 3.0)));
        pose = mix(pose, P({ hF: [44, -92], hB: [-4, -56], head: [10, -112] }), look);
        const calm = E.soft(seg(T, 2.9, 3.4)) * (1 - E.soft(seg(T, 4.5, 4.9)));
        pose = mix(pose, P({ hF: [18, -124], hB: [-10, -118], head: [2, -116] }), calm);
      }

      drawReport(g, scanK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 80, -82, sparkK, 12, 5);
    },
  };
})();
