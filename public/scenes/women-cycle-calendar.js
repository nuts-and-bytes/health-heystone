// women-cycle-calendar: 偶尔提前或推迟 7 天内常属正常波动，别自行乱买催经药；持续异常先测孕/挂妇科。
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

  function drawCalendar(g, showRange) {
    const x = 18, y = -124, w = 122, h = 104;
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    ln(g, x, y + 24, x + w, y + 24, 1.4, C.ink);
    text(g, '周期正常波动窗口', x + w / 2, y + 16, 9.5, C.ink);

    // 7-day range highlight
    rr(g, x + 14, y + 36, 94, 28, 8);
    inkFill(g, showRange > 0.3 ? C.butterSoft : C.paper, 1.4);
    text(g, '±7 天内 · 先观察', x + w / 2, y + 54, 10, showRange > 0.3 ? OR() : C.ink);

    text(g, '先排除早孕 · 勿乱吃催经药', x + w / 2, y + 84, 8.5, '#B91C1C');
  }

  SC['women-cycle-calendar'] = {
    dur: 5.0,
    width: 390,
    label: '小橙在日历上圈出±7天正常波动窗口，提醒先观察并排除早孕，不要自行乱吃催经药。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let showRange = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        showRange = E.soft(seg(T, 0.5, 1.4)) * fade;
        sparkK = seg(T, 1.5, 2.2);
        const point = E.soft(seg(T, 0.4, 0.9)) * (1 - E.soft(seg(T, 3.8, 4.3)));
        pose = mix(pose, P({ hF: [46, -82], hB: [-6, -54], head: [8, -114] }), point);
      }

      drawCalendar(g, showRange);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 79, -74, sparkK, 12, 5);
    },
  };
})();
