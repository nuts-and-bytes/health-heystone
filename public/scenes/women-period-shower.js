// women-period-shower: 经期可以照常洗头、淋浴或温水泡澡。
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

  function drawShowerCard(g, crossK, dryK) {
    const x = 16, y = -126, w = 136, h = 114;

    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '生理期洗护 · 破除旧谣言', x + w / 2, y + 17, 9, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // Top myth box crossed out
    rr(g, x + 10, y + 30, w - 20, 26, 6);
    inkFill(g, crossK > 0.3 ? '#F5F5F4' : '#FEF2F2', 1.2);
    text(g, '「经期洗头=宫寒落病根」', x + w / 2, y + 46, 8.2, crossK > 0.3 ? C.muted : '#B91C1C');
    if (crossK > 0.2) {
      ln(g, x + 18, y + 43, x + 18 + (w - 36) * crossK, y + 43, 1.8, OR());
    }

    // Bottom warm shower or bath comfort box
    rr(g, x + 10, y + 62, w - 20, 44, 7);
    inkFill(g, dryK > 0.3 ? C.butterSoft : C.paper, 1.5);

    // Simple hand-drawn shower head on left + warm drops/breeze
    ln(g, x + 22, y + 73, x + 36, y + 73, 1.6, C.ink);
    ln(g, x + 25, y + 77, x + 23, y + 85, 1.3, dryK > 0.3 ? OR() : C.muted);
    ln(g, x + 30, y + 77, x + 29, y + 86, 1.3, dryK > 0.3 ? OR() : C.muted);
    ln(g, x + 35, y + 77, x + 35, y + 85, 1.3, dryK > 0.3 ? OR() : C.muted);

    text(g, dryK > 0.3 ? '✓ 淋浴或温水泡澡' : '经期照常洗头洗澡', x + w / 2 + 12, y + 79, 8.5, dryK > 0.3 ? OR() : C.ink);
    text(g, '温水可缓解痛经', x + w / 2 + 12, y + 95, 7.6, dryK > 0.3 ? C.ink : C.muted);

    text(g, '洗后按自己觉得舒服的方式擦干', x + w / 2, 14, 8.4, C.muted);
  }

  SC['women-period-shower'] = {
    dur: 5.2,
    width: 390,
    label: '小橙划掉经期洗头落病根的旧谣言，点亮温水淋浴或泡澡的提示。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let crossK = 0, dryK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        crossK = E.soft(seg(T, 0.5, 1.4)) * fade;
        dryK = E.soft(seg(T, 1.6, 2.3)) * fade;
        sparkK = seg(T, 2.2, 2.9);

        const swipe = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 1.6, 2.0)));
        pose = mix(pose, P({ hF: [38, -84], hB: [-6, -54], head: [8, -114] }), swipe);

        const cheer = E.soft(seg(T, 2.3, 2.9)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [22, -124], hB: [-12, -118], head: [2, -116] }), cheer);
      }

      drawShowerCard(g, crossK, dryK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 134, -48, sparkK, 12, 5);
    },
  };
})();
