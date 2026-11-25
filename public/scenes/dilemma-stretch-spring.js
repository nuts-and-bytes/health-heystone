// dilemma-stretch-spring: 不拉伸不会把肌肉练成死疙瘩，但练后温和静态拉伸能让紧绷肌群恢复弹性。
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

  function drawSpring(g, stretchK) {
    const x0 = 20, y = -68;
    const len = lerp(62, 118, stretchK);
    const coils = 6;
    g.beginPath();
    g.moveTo(x0, y);
    for (let i = 1; i <= coils; i++) {
      const px = x0 + (i - 0.5) * (len / coils);
      const py = y + (i % 2 === 0 ? -12 : 12);
      g.lineTo(px, py);
    }
    g.lineTo(x0 + len, y);
    g.strokeStyle = OR();
    g.lineWidth = 2.6;
    g.stroke();

    circle(g, x0, y, 4);
    circle(g, x0 + len, y, 4);
    inkFill(g, C.ink, 1);

    rr(g, 20, -120, 120, 26, 13);
    inkFill(g, stretchK > 0.5 ? C.butterSoft : C.paper, 1.4);
    text(g, stretchK > 0.5 ? '舒展柔韧 · 更轻松 ✓' : '练后微紧 ≠ 死疙瘩', 80, -103, 9.2, stretchK > 0.5 ? OR() : C.ink);
    text(g, '练后静态拉伸 15–30 秒', 80, 14, 9.5, C.muted);
  }

  SC['dilemma-stretch-spring'] = {
    dur: 5.0,
    width: 390,
    label: '小橙温和拉开紧绷的橙色肌肉弹簧，肌肉恢复柔韧弹性，打破“不拉伸变死疙瘩”焦虑。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let stretchK = 0.1, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [22, -78], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        stretchK = lerp(0.1, 1, E.soft(seg(T, 0.5, 2.2)) * fade);
        sparkK = seg(T, 2.3, 3.0);
        const reach = E.soft(seg(T, 0.4, 1.2)) * (1 - E.soft(seg(T, 3.8, 4.4)));
        pose = mix(pose, P({ hF: [26, -128], hB: [-10, -124], head: [2, -116] }), reach);
      }

      drawSpring(g, stretchK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 124, -68, sparkK, 12, 5);
    },
  };
})();
