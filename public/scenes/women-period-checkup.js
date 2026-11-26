// women-period-checkup: 经期撞上体检不用整套作废，常规抽血/腹部B超当天可做，妇科TCT/尿检/CA125经净3-7天补检。
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

  function drawChecklist(g, step1, step2) {
    const x = 16, y = -126, w = 132, h = 114;
    // clipboard top clip
    rr(g, x + 44, y - 6, 44, 11, 4);
    inkFill(g, C.paper, 1.4);

    // board body
    rr(g, x, y, w, h, 9);
    inkFill(g, C.paper, 1.6);
    text(g, '经期体检分流清单', x + w / 2, y + 17, 9.5, C.ink);
    ln(g, x + 10, y + 25, x + w - 10, y + 25, 1, C.line || '#e5e7eb');

    // Box 1: can do today
    rr(g, x + 9, y + 32, w - 18, 34, 6);
    inkFill(g, step1 > 0.3 ? C.butterSoft : C.paper, 1.3);
    text(g, step1 > 0.3 ? '✓ 当天可查' : '① 常规抽血 / B超', x + w / 2, y + 46, 9, step1 > 0.3 ? OR() : C.ink);
    text(g, '肝肾甲功 · 心电图 · 腹部B超', x + w / 2, y + 60, 7.8, C.muted);

    // Box 2: defer 3-7 days
    rr(g, x + 9, y + 72, w - 18, 34, 6);
    inkFill(g, step2 > 0.3 ? '#FEF2F2' : C.paper, 1.3);
    text(g, step2 > 0.3 ? '↻ 经净 3–7 天再补' : '② 妇科 / 尿检 / CA125', x + w / 2, y + 86, 8.8, step2 > 0.3 ? '#B91C1C' : C.ink);
    text(g, '避免经血污染与假阳性', x + w / 2, y + 100, 7.8, C.muted);

    text(g, '提前告知前台 · 不用整套重约', x + w / 2, 14, 8.8, C.muted);
  }

  SC['women-period-checkup'] = {
    dur: 5.2,
    width: 390,
    label: '小橙在体检分流清单上勾出当天可做的常规抽血与B超，并将妇科、尿检与CA125标为经净后补查。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let step1 = 0, step2 = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        step1 = E.soft(seg(T, 0.4, 1.1)) * fade;
        step2 = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.5, 3.2);

        const p1 = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.5, 1.9)));
        pose = mix(pose, P({ hF: [42, -82], hB: [-6, -54], head: [8, -114] }), p1);

        const p2 = E.soft(seg(T, 1.8, 2.3)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [42, -44], hB: [-6, -54], head: [10, -112] }), p2);
      }

      drawChecklist(g, step1, step2);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 82, -78, sparkK, 12, 5);
    },
  };
})();
