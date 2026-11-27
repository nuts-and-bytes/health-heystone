// dilemma-sauna-sweat: 暴汗服/狂出汗排掉的99%是水和盐，不等于燃脂或排毒，还易引发脱水与热射病；脂肪主要经呼吸 CO₂ 排出。
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

  function drawSweatBoard(g, coolK, breathK) {
    const x = 18, y = -126, w = 132;

    // Top warning card: Sauna suit / sweat myth
    rr(g, x, y, w, 50, 9);
    inkFill(g, coolK < 0.45 ? '#FEF2F2' : C.paper, 1.5);
    text(g, coolK > 0.45 ? '✕ 暴汗服锁热 · 谨防热射病' : '暴汗服狂流汗 = 狂燃脂？', x + w / 2, y + 18, 8.6, coolK > 0.45 ? '#B91C1C' : '#B91C1C');
    text(g, '汗液 99% 是水与电解质', x + w / 2, y + 36, 8.2, C.muted);

    // Mini thermometer on right edge of top card
    const thx = x + w - 13, thy = y + 38;
    ln(g, thx, y + 10, thx, thy, 3.2, '#E5E7EB');
    const levelY = lerp(y + 12, y + 28, coolK);
    ln(g, thx, levelY, thx, thy, 3.2, coolK > 0.45 ? OR() : '#B91C1C');
    circle(g, thx, thy + 2, 4.2);
    g.fillStyle = coolK > 0.45 ? OR() : '#B91C1C';
    g.fill();

    // Bottom truth card: Fat leaves via CO2 breath
    rr(g, x, y + 60, w, 54, 9);
    inkFill(g, breathK > 0.3 ? C.butterSoft : C.paper, 1.5);
    text(g, breathK > 0.3 ? '✓ 脂肪 84% 经呼吸 CO₂ 排出' : '脂肪到底怎么排出去？', x + w / 2, y + 79, 8.8, breathK > 0.3 ? OR() : C.ink);
    text(g, '穿透气运动服 · 小口补水散热', x + w / 2, y + 98, 8.1, C.muted);

    // Flowing breath/breeze waves when activated
    if (breathK > 0.2) {
      g.save();
      g.globalAlpha = breathK;
      g.strokeStyle = OR();
      g.lineWidth = 1.6;
      for (let i = 0; i < 2; i++) {
        const wy = y + 84 + i * 9;
        g.beginPath();
        g.moveTo(x - 8, wy);
        g.quadraticCurveTo(x - 2, wy - 4, x + 4, wy);
        g.stroke();
      }
      g.restore();
    }

    text(g, '出汗只负责散热 · 别捂汗硬扛', x + w / 2, 14, 8.6, C.muted);
  }

  SC['dilemma-sauna-sweat'] = {
    dur: 5.2,
    width: 390,
    label: '小橙划掉暴汗服燃脂误区让过热温度计降下来，并点亮脂肪主要经呼吸二氧化碳排出的科学真相。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let coolK = 0, breathK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [22, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        coolK = E.soft(seg(T, 0.5, 1.5)) * fade;
        breathK = E.soft(seg(T, 1.7, 2.5)) * fade;
        sparkK = seg(T, 2.4, 3.1);

        const dismiss = E.soft(seg(T, 0.2, 0.8)) * (1 - E.soft(seg(T, 1.5, 1.9)));
        pose = mix(pose, P({ hF: [42, -104], hB: [-6, -54], head: [6, -114] }), dismiss);

        const pointOk = E.soft(seg(T, 1.9, 2.5)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [42, -44], hB: [-6, -54], head: [8, -110] }), pointOk);
      }

      drawSweatBoard(g, coolK, breathK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -44, sparkK, 12, 5);
    },
  };
})();
