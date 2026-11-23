// move-calf: 台阶边缘提踵示范（脚掌踩在台阶边，脚跟大幅上下升降，明显区分站立动作）
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawStep(g) {
    rr(g, -26, -22, 86, 22, 4);
    inkFill(g, C.paper, 1.6);
    text(g, '台阶 / 书本', 17, 16, 10, C.muted);
    // 扶手柱
    ln(g, 52, -130, 52, -22, 2.2, C.ink);
  }

  SC['move-calf'] = {
    dur: 5.4,
    width: 340,
    label: '小人前脚掌踩在台阶边缘，脚跟大幅度抬高停顿两秒再缓慢下沉，示范台阶提踵。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const baseHold = P({
        head: [4, -112],
        chest: [2, -88],
        hip: [0, -56],
        hF: [42, -84],
        hB: [-4, -52],
        hang: 0,
      });
      let pose = breathe(baseHold, t);
      let lift = 0;
      let yOff = -22;

      if (T < 0) {
        pose = mix(pose, P({ ...baseHold, head: [7, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const w = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 4.7, 5.2)));
        const cyc = (Math.sin((T - 0.5) * 3.4 - Math.PI / 2) + 1) * 0.5;
        lift = cyc * w;
        yOff = lerp(-22, -40, lift);
      }

      drawStep(g);
      fig(g, pose, 6, yOff, { wave: S.wave, wt: S.wt, held: chestDot, shadow: false });
      if (lift > 0.25) {
        ln(g, -42, -20, -42, -56, 2.4, OR());
        ln(g, -47, -48, -42, -56, 2.2, OR());
        ln(g, -37, -48, -42, -56, 2.2, OR());
        text(g, '踮高停2秒', -66, -64, 10, OR());
      }
    },
  };
})();
