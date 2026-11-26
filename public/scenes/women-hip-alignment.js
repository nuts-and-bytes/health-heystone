// women-hip-alignment: 假胯宽的骨头按不小，绑腿带无效；练强臀中肌、改掉股骨内旋与跷二郎腿能改善视觉线条。
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

  function drawHipDiagram(g, alignK) {
    const cx = 82, pelY = -84;

    // top crossed-out myth badge
    rr(g, 20, -126, 124, 24, 12);
    inkFill(g, alignK > 0.4 ? '#FEF2F2' : C.paper, 1.3);
    text(g, alignK > 0.4 ? '✕ 绑腿带/徒手缩骨按不小骨头' : '绑带能把骨头按进去？', cx, -110, 8.4, alignK > 0.4 ? '#B91C1C' : C.muted);

    // pelvis arc
    rr(g, cx - 28, pelY - 10, 56, 20, 10);
    inkFill(g, alignK > 0.5 ? C.butterSoft : C.paper, 1.6);

    // greater trochanter bumps & femur lines rotating from inward collapse -> neutral alignment
    const bulgeOut = lerp(12, 3, alignK);
    const kneeIn = lerp(14, 2, alignK);

    // left & right gluteus medius highlight arcs when activated
    if (alignK > 0.25) {
      g.save();
      g.globalAlpha = alignK;
      g.strokeStyle = OR();
      g.lineWidth = 2.6;
      g.beginPath();
      g.arc(cx - 28, pelY + 4, 10, Math.PI * 0.65, Math.PI * 1.35);
      g.stroke();
      g.beginPath();
      g.arc(cx + 28, pelY + 4, 10, -Math.PI * 0.35, Math.PI * 0.35);
      g.stroke();
      g.restore();
    }

    // femur segments (hip -> trochanter -> knee)
    ln(g, cx - 22, pelY + 8, cx - 22 - bulgeOut, pelY + 22, 2.2, C.ink);
    ln(g, cx - 22 - bulgeOut, pelY + 22, cx - 18 + kneeIn, pelY + 54, 2.2, C.ink);

    ln(g, cx + 22, pelY + 8, cx + 22 + bulgeOut, pelY + 22, 2.2, C.ink);
    ln(g, cx + 22 + bulgeOut, pelY + 22, cx + 18 - kneeIn, pelY + 54, 2.2, C.ink);

    // knee joints
    circle(g, cx - 18 + kneeIn, pelY + 54, 3.2);
    inkFill(g, alignK > 0.5 ? OR() : C.paper, 1.3);
    circle(g, cx + 18 - kneeIn, pelY + 54, 3.2);
    inkFill(g, alignK > 0.5 ? OR() : C.paper, 1.3);

    // bottom status label
    rr(g, 18, -22, 128, 24, 8);
    inkFill(g, alignK > 0.5 ? C.butterSoft : C.paper, 1.4);
    text(g, alignK > 0.5 ? '✓ 激活臀中肌 · 力线回正' : '久坐股骨内旋 · 外侧显凸', cx, -6, 8.8, alignK > 0.5 ? OR() : C.ink);
    text(g, '蚌式开合 + 少跷二郎腿', cx, 15, 8.6, C.muted);
  }

  SC['women-hip-alignment'] = {
    dur: 5.2,
    width: 390,
    label: '小橙划掉绑腿带缩骨误区，演示激活臀中肌让内旋的股骨力线回正、视觉线条更顺。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let alignK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [22, -78], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        alignK = E.soft(seg(T, 0.7, 2.2)) * fade;
        sparkK = seg(T, 2.3, 3.0);

        const dismiss = E.soft(seg(T, 0.2, 0.7)) * (1 - E.soft(seg(T, 1.2, 1.6)));
        pose = mix(pose, P({ hF: [40, -108], hB: [-6, -54], head: [6, -114] }), dismiss);

        const activate = E.soft(seg(T, 1.6, 2.3)) * (1 - E.soft(seg(T, 4.2, 4.6)));
        pose = mix(pose, P({ hF: [26, -72], hB: [-12, -72], head: [4, -116] }), activate);
      }

      drawHipDiagram(g, alignK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 82, -78, sparkK, 12, 5);
    },
  };
})();
