// dilemma-cold-plunge: 反复在力量训练后立即冰浴可能影响增肌，不示意具体等待时长或生理信号数值。
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

  function drawColdPlungeCard(g, shiftK, okK) {
    const x = 16, y = -126, w = 136, h = 114;

    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '增肌训练 · 练后怎么洗', x + w / 2, y + 17, 9, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // Switch from immediate ice immersion to a regular shower; not a timeline.
    const barX = x + 14, barY = y + 48, barW = w - 28;
    ln(g, barX, barY, barX + barW, barY, 2.2, C.line || '#d6d3d1');
    text(g, '立刻冰浴', barX + 10, barY - 10, 7.6, shiftK < 0.4 ? '#B91C1C' : C.muted);
    text(g, '普通淋浴', barX + barW - 26, barY - 10, 7.6, shiftK > 0.5 ? OR() : C.muted);

    // Sliding choice marker
    const tubX = lerp(barX + 12, barX + barW - 14, shiftK);
    rr(g, tubX - 11, barY - 7, 22, 14, 4);
    inkFill(g, shiftK > 0.5 ? C.butterSoft : '#EFF6FF', 1.4);
    text(g, shiftK > 0.5 ? '洗' : '冰', tubX, barY + 3, 8.2, shiftK > 0.5 ? OR() : '#1D4ED8');

    text(g, '研究关注的是重复冰浴', x + w / 2, y + 76, 8.2, C.ink);
    text(g, '没有确定的等待时长', x + w / 2, y + 88, 8, C.muted);

    text(g, okK > 0.3 ? '✓ 不必例行泡冰水' : '练后反复冰浴可能影响增肌', x + w / 2, y + 104, 8, okK > 0.3 ? OR() : '#B91C1C');
    text(g, '日常训练后照常洗澡即可', x + w / 2, 14, 8.1, C.muted);
  }

  SC['dilemma-cold-plunge'] = {
    dur: 5.2,
    width: 390,
    label: '小橙把练后选择从立即泡冰水切换为普通淋浴，不规定冰浴的等待时长。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let shiftK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        shiftK = E.soft(seg(T, 0.6, 1.8)) * fade;
        okK = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.3, 3.0);

        const push = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 2.0, 2.5)));
        pose = mix(pose, P({ hF: [lerp(28, 48, shiftK), -78], hB: [-6, -54], head: [8, -114] }), push);

        const cheer = E.soft(seg(T, 2.4, 3.0)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [22, -124], hB: [-12, -118], head: [2, -116] }), cheer);
      }

      drawColdPlungeCard(g, shiftK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -44, sparkK, 12, 5);
    },
  };
})();
