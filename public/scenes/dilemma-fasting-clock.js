// dilemma-fasting-clock: 16+8 轻断食与常规控卡等热量下减脂无显著差异，别长期跳早餐硬饿伤胆囊。
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

  function drawClock(g, shiftK, okK) {
    const cx = 82, cy = -82, r = 38;
    // outer 24h dial
    circle(g, cx, cy, r);
    inkFill(g, C.paper, 1.6);

    // 8h eating arc rotates earlier (from 12:00-20:00 -> 08:00-18:00)
    const startAng = lerp(-Math.PI * 0.1, -Math.PI * 0.55, shiftK);
    const spanAng = lerp(Math.PI * 0.66, Math.PI * 0.84, shiftK);
    g.beginPath();
    g.moveTo(cx, cy);
    g.arc(cx, cy, r - 4, startAng, startAng + spanAng);
    g.closePath();
    g.fillStyle = okK > 0.3 ? C.butterSoft : '#FED7AA';
    g.fill();

    // arc highlight rim
    g.beginPath();
    g.arc(cx, cy, r - 4, startAng, startAng + spanAng);
    g.strokeStyle = OR();
    g.lineWidth = 2.6;
    g.stroke();

    // center dot & clock ticks
    circle(g, cx, cy, 3);
    g.fillStyle = C.ink;
    g.fill();
    ln(g, cx, cy - r + 2, cx, cy - r + 7, 1.3, C.ink);
    ln(g, cx + r - 2, cy, cx + r - 7, cy, 1.3, C.ink);
    ln(g, cx, cy + r - 2, cx, cy + r - 7, 1.3, C.ink);
    ln(g, cx - r + 2, cy, cx - r + 7, cy, 1.3, C.ink);

    text(g, shiftK > 0.45 ? '白天规律进食' : '16h 饿到跳早饭?', cx, cy - r - 9, 9, shiftK > 0.45 ? OR() : C.muted);

    // bottom takeaway pill
    rr(g, 16, -32, 132, 30, 9);
    inkFill(g, okK > 0.3 ? C.butterSoft : C.paper, 1.5);
    text(g, okK > 0.3 ? '✓ 总热量相同 · 规律护胆囊' : 'NEJM：等热量瘦得一样', 82, -13, 8.8, okK > 0.3 ? OR() : C.ink);
    text(g, '胆结石/低血糖人群勿盲目断食', 82, 14, 8.5, '#B91C1C');
  }

  SC['dilemma-fasting-clock'] = {
    dur: 5.2,
    width: 390,
    label: '小橙把24小时进食钟盘从跳过早餐拨回白天规律窗口，提示等热量减脂效果一致且更护胆囊。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let shiftK = 0, okK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        shiftK = E.soft(seg(T, 0.5, 1.8)) * fade;
        okK = E.soft(seg(T, 1.9, 2.5)) * fade;
        sparkK = seg(T, 2.5, 3.2);

        const turnDial = E.soft(seg(T, 0.4, 1.1)) * (1 - E.soft(seg(T, 2.0, 2.5)));
        pose = mix(pose, P({ hF: [42, -92], hB: [-4, -56], head: [8, -114] }), turnDial);

        const calm = E.soft(seg(T, 2.6, 3.2)) * (1 - E.soft(seg(T, 4.4, 4.8)));
        pose = mix(pose, P({ hF: [22, -124], hB: [-10, -118], head: [4, -116] }), calm);
      }

      drawClock(g, shiftK, okK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 82, -120, sparkK, 12, 5);
    },
  };
})();
