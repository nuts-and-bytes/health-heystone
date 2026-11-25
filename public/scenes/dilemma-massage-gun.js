// dilemma-massage-gun: 筋膜枪严禁打颈部与骨突，只在大块肌肉（臀腿背）表面轻柔滑动。
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

  function drawZones(g, safeK) {
    // top red禁区
    rr(g, 18, -124, 122, 42, 8);
    inkFill(g, '#FEF2F2', 1.5);
    text(g, '✕ 禁区：颈部 / 脊椎 / 关节骨突', 79, -99, 8.8, '#B91C1C');

    // bottom safe zone
    rr(g, 18, -68, 122, 48, 8);
    inkFill(g, safeK > 0.4 ? C.butterSoft : C.paper, 1.6);
    text(g, '✓ 安全区：大腿 / 臀部大肌群', 79, -46, 9, safeK > 0.4 ? OR() : C.ink);
    text(g, '顺肌纤维缓慢移动 ≤2分钟', 79, -29, 8.5, C.muted);
  }

  SC['dilemma-massage-gun'] = {
    dur: 5.0,
    width: 390,
    label: '小橙明确划开颈部与骨突禁区，把筋膜枪稳稳落在大腿臀部大肌群安全区放松。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let safeK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -76], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        safeK = E.soft(seg(T, 1.2, 2.0)) * fade;
        sparkK = seg(T, 2.1, 2.8);
        const stopTop = E.soft(seg(T, 0.2, 0.7)) * (1 - E.soft(seg(T, 1.2, 1.6)));
        pose = mix(pose, P({ hF: [42, -104], hB: [-4, -54], head: [8, -114] }), stopTop);
        const pointSafe = E.soft(seg(T, 1.6, 2.2)) * (1 - E.soft(seg(T, 4.2, 4.6)));
        pose = mix(pose, P({ hF: [44, -46], hB: [-6, -54], head: [10, -112] }), pointSafe);
      }

      drawZones(g, safeK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 79, -44, sparkK, 12, 5);
    },
  };
})();
