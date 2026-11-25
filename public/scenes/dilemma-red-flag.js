// dilemma-red-flag: 掉发闭经/发烧/练腿头晕等高危红线——拉下暂停闸，先歇息或及时就医。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, text, seg, breathe, pulse, circle, sparks, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawGauge(g, energy, pausedK) {
    const x = 22, y = -114, w = 118, h = 84;
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.5);
    text(g, '身体能量警报', x + w / 2, y + 18, 10, C.ink);

    // battery bar
    rr(g, x + 16, y + 32, 86, 18, 5);
    inkFill(g, C.paper, 1.4);
    const fillW = Math.max(8, 80 * energy);
    rr(g, x + 19, y + 35, fillW, 12, 3);
    g.fillStyle = energy < 0.3 ? '#E5484D' : OR();
    g.fill();

    text(
      g,
      pausedK > 0.5 ? '已停练 · 先恢复/就医 ✓' : '能量见红 · 别硬扛！',
      x + w / 2,
      y + 70,
      9.5,
      pausedK > 0.5 ? OR() : '#B91C1C'
    );
  }

  SC['dilemma-red-flag'] = {
    dur: 5.4,
    width: 390,
    label: '身体能量条见红报警，小橙果断拉下暂停键停练恢复，能量条随之回升。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let energy = 0.16, pausedK = 0, sparkK = 0;

      if (T < 0) {
        energy = 0.14 + Math.abs(Math.sin(t * 2.5)) * 0.08;
        pose = mix(pose, P({ hF: [24, -92], head: [10, -110] }), pulse(t, 4.5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        pausedK = E.soft(seg(T, 0.9, 1.6)) * fade;
        energy = lerp(0.16, 0.78, E.soft(seg(T, 1.7, 3.6)) * fade);
        sparkK = seg(T, 3.2, 3.9);

        const pullStop = E.soft(seg(T, 0.5, 1.1)) * (1 - E.soft(seg(T, 1.8, 2.3)));
        pose = mix(pose, P({ hF: [46, -84], hB: [-6, -54], head: [8, -112] }), pullStop);
        const rest = E.soft(seg(T, 2.4, 3.0)) * (1 - E.soft(seg(T, 4.6, 5.0)));
        pose = mix(pose, P({ hF: [14, -124], hB: [-10, -120], head: [2, -116] }), rest);
      }

      drawGauge(g, energy, pausedK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 81, -72, sparkK, 12, 5);
    },
  };
})();
