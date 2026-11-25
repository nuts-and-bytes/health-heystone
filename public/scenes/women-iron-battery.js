// women-iron-battery: 经常手脚冰凉、蹲起眼前发黑——先查血常规与铁蛋白，站起放慢别盲目乱补。
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

  function drawCheck(g, ironLevel) {
    const x = 22, y = -118, w = 118, h = 94;
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.5);
    text(g, '血常规 + 铁蛋白', x + w / 2, y + 18, 9.5, C.ink);

    // iron level bar
    rr(g, x + 16, y + 32, 86, 18, 5);
    inkFill(g, C.paper, 1.4);
    rr(g, x + 19, y + 35, Math.max(10, 80 * ironLevel), 12, 3);
    g.fillStyle = ironLevel < 0.35 ? '#E5484D' : OR();
    g.fill();

    text(g, ironLevel > 0.5 ? '查清再补更安心 ✓' : '蹲起发黑/手脚凉', x + w / 2, y + 72, 9, ironLevel > 0.5 ? OR() : C.muted);
  }

  SC['women-iron-battery'] = {
    dur: 5.2,
    width: 390,
    label: '小橙缓慢站起不再发黑，举起“血常规+铁蛋白”检查卡，提醒先查清再科学补铁。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const crouch = P({ hip: [0, -34], chest: [6, -62], head: [10, -88], hF: [16, -42], hB: [-8, -42] });
      const stand = P({ hF: [28, -86], hB: [-6, -56], head: [4, -116] });
      let rise = 1, iron = 0.22, sparkK = 0;

      if (T < 0) {
        rise = 0.75 + pulse(t, 5, 1.5, 1.5) * 0.25;
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        rise = lerp(0.1, 1, E.soft(seg(T, 0.3, 2.0)));
        iron = lerp(0.22, 0.82, E.soft(seg(T, 1.6, 3.2)) * fade);
        sparkK = seg(T, 3.0, 3.7);
      }

      drawCheck(g, iron);
      fig(g, breathe(mix(crouch, stand, rise), t), -74, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 81, -76, sparkK, 12, 5);
    },
  };
})();
