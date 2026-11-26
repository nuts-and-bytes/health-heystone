// dilemma-watch-calories: 运动手表估算卡路里误差常达 27%–30%+，减脂期别按表上数字 100% 吃回来，看 2–4 周真实趋势。
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

  function drawWatch(g, trimK, okK) {
    // watch straps & body on the right
    const wx = 26, wy = -124, ww = 114, wh = 62;
    rr(g, wx + 36, wy - 8, 42, 10, 3);
    inkFill(g, C.paper, 1.3);
    rr(g, wx + 36, wy + wh - 2, 42, 10, 3);
    inkFill(g, C.paper, 1.3);

    // watch face
    rr(g, wx, wy, ww, wh, 12);
    inkFill(g, C.paper, 1.7);
    // side crown button
    rr(g, wx + ww - 1, wy + 20, 6, 16, 2);
    inkFill(g, C.ink, 1);

    text(g, trimK > 0.45 ? '手表估测 ±30% 误差' : '手表显示 +520 kcal?', wx + ww / 2, wy + 18, 8.8, trimK > 0.45 ? C.muted : C.ink);

    // calorie bar shrinking from inflated to conservative
    const barX = wx + 12, barY = wy + 30, barMax = ww - 24;
    rr(g, barX, barY, barMax, 14, 7);
    inkFill(g, C.paper, 1.2);
    const fillW = lerp(barMax - 4, barMax * 0.56, trimK);
    rr(g, barX + 2, barY + 2, fillW, 10, 5);
    g.fillStyle = trimK > 0.45 ? C.butterSoft : '#FED7AA';
    g.fill();
    if (trimK > 0.35) {
      // dashed inflated tail
      ln(g, barX + 2 + fillW + 4, barY + 7, barX + barMax - 5, barY + 7, 1.4, '#B91C1C');
    }
    text(g, trimK > 0.45 ? '别按 100% 吃回来' : '心率准 · 大卡常高估', wx + ww / 2, wy + 55, 8.2, trimK > 0.45 ? OR() : C.muted);

    // bottom real-trend card
    rr(g, 20, -44, 126, 36, 9);
    inkFill(g, okK > 0.3 ? C.butterSoft : C.paper, 1.5);
    text(g, okK > 0.3 ? '✓ 看 2–4 周真实体重腰围' : '真实趋势更靠谱', 83, -22, 9.2, okK > 0.3 ? OR() : C.ink);
    text(g, '手表消耗仅作活动参考', 83, 14, 9, C.muted);
  }

  SC['dilemma-watch-calories'] = {
    dur: 5.2,
    width: 390,
    label: '小橙轻点运动手表，把虚高的消耗条缩回合理区间，并点亮下方2到4周真实体重腰围趋势卡。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let trimK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        trimK = E.soft(seg(T, 0.5, 1.6)) * fade;
        okK = E.soft(seg(T, 1.8, 2.5)) * fade;
        sparkK = seg(T, 2.5, 3.2);

        const tapWatch = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 1.6, 2.0)));
        pose = mix(pose, P({ hF: [42, -96], hB: [-6, -54], head: [8, -114] }), tapWatch);

        const pointTrend = E.soft(seg(T, 2.0, 2.5)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [40, -34], hB: [-6, -54], head: [10, -110] }), pointTrend);
      }

      drawWatch(g, trimK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -28, sparkK, 12, 5);
    },
  };
})();
