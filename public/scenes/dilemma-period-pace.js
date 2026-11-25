// dilemma-period-pace: 经期健身按当天体感调旋钮，中低强度或散步反而有助舒缓。
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

  function drawDialControl(g, knobPos, waveAmp) {
    // intensity slider board
    const x = 16, y = -114, w = 128, h = 92;
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.5);
    text(g, '按当天体感调强度', x + w / 2, y + 18, 10, C.ink);

    // track
    const ty = y + 42;
    ln(g, x + 18, ty, x + w - 18, ty, 2.4, C.line || '#d6d3d1');
    const kx = lerp(x + w - 22, x + 46, knobPos);
    ln(g, x + 18, ty, kx, ty, 2.8, OR());
    circle(g, kx, ty, 6);
    inkFill(g, C.paper, 1.8);
    text(g, '轻柔', x + 22, ty + 16, 8.5, C.muted);
    text(g, '中等', x + w / 2, ty + 16, 8.5, OR());
    text(g, '极限', x + w - 22, ty + 16, 8.5, C.muted);

    // comfort wave becoming smooth
    g.beginPath();
    for (let i = 0; i <= 24; i++) {
      const px = x + 16 + (i / 24) * (w - 32);
      const py = y + 76 + Math.sin(i * 0.9) * waveAmp;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.strokeStyle = OR();
    g.lineWidth = 1.8;
    g.stroke();
  }

  SC['dilemma-period-pace'] = {
    dur: 5.4,
    width: 390,
    label: '小橙把训练强度滑块从极限轻调到舒适档，原本剧烈波动的体感曲线瞬间变得平缓舒展。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let knob = 0, amp = 7, sparkK = 0;

      if (T < 0) {
        amp = 6 + Math.sin(t * 3) * 1.5;
        pose = mix(pose, P({ hF: [24, -78], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        knob = E.soft(seg(T, 0.7, 2.2)) * fade;
        amp = lerp(7.5, 1.2, knob);
        sparkK = seg(T, 2.4, 3.1);

        const reach = E.soft(seg(T, 0.5, 1.1)) * (1 - E.soft(seg(T, 2.2, 2.7)));
        pose = mix(pose, P({ hF: [52, -74], hB: [-6, -54], head: [10, -112] }), reach);
        const relax = E.soft(seg(T, 2.7, 3.2)) * (1 - E.soft(seg(T, 4.5, 5.0)));
        pose = mix(pose, P({ hF: [18, -124], hB: [-10, -118], head: [2, -116] }), relax);
      }

      drawDialControl(g, knob, amp);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 80, -38, sparkK, 12, 5);
    },
  };
})();
