// dilemma-melatonin-clock: 褪黑素是生物钟校时信号，不是万能安眠药；慢性失眠一线首选规律光照与 CBT-I。
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

  function drawSleepClock(g, tuneK, sunK) {
    const x = 16, y = -126, w = 136, h = 114;

    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '褪黑素 · 生物钟校时器', x + w / 2, y + 17, 9, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // Left: circadian clock face
    const cx = x + 36, cy = y + 54, cr = 17;
    circle(g, cx, cy, cr);
    inkFill(g, tuneK > 0.3 ? C.butterSoft : C.paper, 1.4);
    // clock hands rotating gently
    const ang = -Math.PI / 2 + tuneK * 1.4;
    ln(g, cx, cy, cx + Math.cos(ang) * 10, cy + Math.sin(ang) * 10, 1.6, OR());
    ln(g, cx, cy, cx + 6, cy - 3, 1.4, C.ink);
    text(g, '倒时差校时', cx, y + 82, 7.6, tuneK > 0.3 ? OR() : C.muted);

    // Right: CBT-I + Morning Light card
    rr(g, x + 64, y + 32, 62, 56, 7);
    inkFill(g, sunK > 0.3 ? C.butterSoft : C.paper, 1.4);
    // little morning sun
    circle(g, x + 95, y + 48, 6);
    inkFill(g, sunK > 0.3 ? OR() : C.paper, 1.2);
    text(g, '慢性失眠首选', x + 95, y + 66, 7.8, C.ink);
    text(g, '固定作息+CBT-I', x + 95, y + 79, 7.6, sunK > 0.3 ? OR() : C.muted);

    text(g, sunK > 0.3 ? '✓ 晨光+固定起床，不盲目加量' : '不是万能安眠药，勿自行加量', x + w / 2, y + 102, 7.9, sunK > 0.3 ? OR() : C.muted);
    text(g, '每周失眠≥3次超3月请挂睡眠医学科', x + w / 2, 14, 8.2, C.muted);
  }

  SC['dilemma-melatonin-clock'] = {
    dur: 5.2,
    width: 390,
    label: '小橙拨正左侧生物钟表盘说明褪黑素仅用于校时，并点亮右侧晨光与CBT-I慢性失眠首选方案。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let tuneK = 0, sunK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        tuneK = E.soft(seg(T, 0.4, 1.3)) * fade;
        sunK = E.soft(seg(T, 1.6, 2.3)) * fade;
        sparkK = seg(T, 2.2, 2.9);

        const pClock = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 1.5, 1.9)));
        pose = mix(pose, P({ hF: [36, -78], hB: [-6, -54], head: [6, -114] }), pClock);

        const pSun = E.soft(seg(T, 1.8, 2.4)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [24, -120], hB: [-10, -114], head: [4, -116] }), pSun);
      }

      drawSleepClock(g, tuneK, sunK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 112, -78, sparkK, 11, 5);
    },
  };
})();
