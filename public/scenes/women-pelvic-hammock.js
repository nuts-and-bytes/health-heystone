// women-pelvic-hammock: 跑步跳绳漏尿多与盆底肌弹性有关，科学凯格尔呼吸训练可明显改善。
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

  function drawHammock(g, liftK) {
    const x1 = 22, x2 = 142, y = -68;
    // two pelvic anchors
    circle(g, x1, y, 4.5);
    circle(g, x2, y, 4.5);
    inkFill(g, C.ink, 1);

    // pelvic floor hammock curve tightening up
    const sag = lerp(34, 10, liftK);
    g.beginPath();
    g.moveTo(x1, y);
    g.quadraticCurveTo((x1 + x2) / 2, y + sag, x2, y);
    g.strokeStyle = OR();
    g.lineWidth = 3.2;
    g.stroke();

    // gentle pressure ball supported nicely
    circle(g, (x1 + x2) / 2, y + sag * 0.5 - 12, 9);
    inkFill(g, C.paper, 1.6);

    text(g, liftK > 0.5 ? '盆底肌吊床稳稳托住 ✓' : '松弛易在跑跳时漏尿', (x1 + x2) / 2, -104, 9.5, liftK > 0.5 ? OR() : C.muted);
    text(g, '盆底肌弹性示意', (x1 + x2) / 2, 14, 9.5, C.muted);
  }

  SC['women-pelvic-hammock'] = {
    dur: 5.2,
    width: 390,
    label: '小橙配合呼吸练习收紧底部橙色盆底肌吊床，吊床弹性恢复、稳稳托住压力。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let liftK = 0.1, sparkK = 0;

      if (T < 0) {
        liftK = 0.1 + Math.sin(t * 2) * 0.08;
        pose = mix(pose, P({ hF: [20, -76], head: [4, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        liftK = lerp(0.1, 0.95, E.soft(seg(T, 0.6, 2.4)) * fade);
        sparkK = seg(T, 2.4, 3.1);
        const breath = E.soft(seg(T, 0.5, 1.5)) * (1 - E.soft(seg(T, 3.8, 4.4)));
        pose = mix(pose, P({ hF: [18, -94], hB: [-8, -94], head: [2, -116] }), breath);
      }

      drawHammock(g, liftK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 82, -74, sparkK, 12, 5);
    },
  };
})();
