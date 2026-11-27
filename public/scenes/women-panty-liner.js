// women-panty-liner: 非经期不建议天天垫护垫，塑料底膜闷热潮湿易打破微生态；穿纯棉透气内裤、单独洗净晒干并定期更换即可。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, text, seg, breathe, pulse, circle, sparks, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawBreathableCard(g, peelK, freshK) {
    const x = 18, y = -126, w = 132;

    // Top status pill
    rr(g, x, y, w, 24, 12);
    inkFill(g, freshK > 0.3 ? C.butterSoft : '#FEF2F2', 1.4);
    text(g, freshK > 0.3 ? '✓ 纯棉透气 · 干爽护微生态' : '✕ 天天垫护垫：闷热潮湿', x + w / 2, y + 16, 8.5, freshK > 0.3 ? OR() : '#B91C1C');

    // Center airflow box
    rr(g, x + 6, y + 32, w - 12, 52, 9);
    inkFill(g, C.paper, 1.5);

    if (peelK < 0.5) {
      // trapped moisture layer + humid droplets
      rr(g, x + 16, y + 42, w - 32, 16, 8);
      inkFill(g, '#FEE2E2', 1.2);
      text(g, '不透气塑料底膜', x + w / 2, y + 53, 8, '#B91C1C');
      text(g, '湿热积聚 · 易诱发不适', x + w / 2, y + 74, 8, C.muted);
    } else {
      // clean breeze arrows flowing through cotton weave
      g.save();
      g.strokeStyle = OR();
      g.lineWidth = 1.6;
      for (let i = 0; i < 3; i++) {
        const bx = x + 36 + i * 28;
        const shift = (1 - freshK) * 6;
        g.beginPath();
        g.moveTo(bx, y + 64 + shift);
        g.quadraticCurveTo(bx + 5, y + 54 + shift, bx, y + 44 + shift);
        g.stroke();
      }
      g.restore();
      text(g, '纯棉透气 · 自然分泌物很正常', x + w / 2, y + 75, 8.2, C.ink);
    }

    // Bottom laundry care badge
    rr(g, x, y + 90, w, 26, 8);
    inkFill(g, freshK > 0.3 ? C.butterSoft : C.paper, 1.3);
    text(g, '单独洗净晒干/烘干 · 3–6月换', x + w / 2, y + 107, 8.2, freshK > 0.3 ? OR() : C.muted);

    text(g, '护垫仅留经期尾声或出行应急', x + w / 2, 14, 8.5, C.muted);
  }

  SC['women-panty-liner'] = {
    dur: 5.2,
    width: 390,
    label: '小橙撤掉闷热的日常护垫层，让清爽气流穿过纯棉内裤，并点亮单独洗净晒干与定期更换提示。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let peelK = 0, freshK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        peelK = E.soft(seg(T, 0.6, 1.5)) * fade;
        freshK = E.soft(seg(T, 1.5, 2.3)) * fade;
        sparkK = seg(T, 2.2, 2.9);

        const peel = E.soft(seg(T, 0.3, 1.0)) * (1 - E.soft(seg(T, 1.8, 2.2)));
        pose = mix(pose, P({ hF: [42, -78], hB: [-6, -54], head: [8, -114] }), peel);

        const relax = E.soft(seg(T, 2.2, 2.8)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [20, -124], hB: [-12, -118], head: [2, -116] }), relax);
      }

      drawBreathableCard(g, peelK, freshK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 84, -72, sparkK, 12, 5);
    },
  };
})();
