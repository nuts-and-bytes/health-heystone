// adrenaline-alarm: 肾上腺就像身体里的紧急警报员：拉响警报帮你应对危险，但长期一直响会让人透支。
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

  function drawAlarm(g, ringing, beat) {
    const cx = 66, cy = -126;
    // post
    ln(g, cx, cy + 20, cx, 0, 2, C.ink);
    // bell dome (orange accent)
    const jiggle = ringing > 0.1 ? Math.sin(beat * 26) * 2.5 * ringing : 0;
    circle(g, cx + jiggle, cy, 20);
    inkFill(g, ringing > 0.1 ? OR() : C.paper, 1.6, C.ink);
    // ringing arcs
    if (ringing > 0.1) {
      g.save();
      g.strokeStyle = OR();
      g.lineWidth = 1.8;
      g.globalAlpha = ringing;
      for (const s of [-1, 1]) {
        g.beginPath();
        g.arc(cx + s * 24, cy, 8, s > 0 ? -0.7 : Math.PI - 0.7, s > 0 ? 0.7 : Math.PI + 0.7);
        g.stroke();
      }
      g.restore();
    }
    text(g, '肾上腺警报', cx, 16, 10, C.muted);
  }

  function drawMeter(g, level) {
    const x = 114, y = -128, w = 22, h = 92;
    rr(g, x, y, w, h, 6);
    inkFill(g, C.paper, 1.4);
    const lh = Math.max(8, (h - 6) * level);
    rr(g, x + 3, y + h - 3 - lh, w - 6, lh, 4);
    g.fillStyle = level > 0.65 ? OR() : C.ink;
    g.fill();
    text(g, '心跳', x + w / 2, y - 10, 10, C.muted);
  }

  SC['adrenaline-alarm'] = {
    dur: 6.2,
    width: 390,
    label: '小人拉响橙色肾上腺警报，心跳条立刻飙升帮你冲刺；警报关掉后，心跳才慢慢回落。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let ringing = 0, meter = 0.25, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 5.5, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const pull = E.soft(seg(T, 0.35, 0.85)) * (1 - E.soft(seg(T, 1.4, 1.85)));
        pose = mix(pose, P({ hF: [28, -110], hB: [-4, -54], head: [8, -115] }), pull);
        ringing = E.soft(seg(T, 0.9, 1.3)) * (1 - E.soft(seg(T, 3.8, 4.3))) * fade;
        const up = E.soft(seg(T, 1.0, 1.9));
        const down = E.soft(seg(T, 4.0, 5.4));
        meter = lerp(0.25, 0.25 + up * 0.68 - down * 0.55, fade);
        const alertPose = P({ hF: [18, -76], hB: [-8, -66], head: [6, -116], chest: [4, -90] });
        pose = mix(pose, alertPose, ringing);
        sparkK = seg(T, 1.1, 1.8);
      }

      drawAlarm(g, ringing, T > 0 ? T : 0);
      drawMeter(g, meter);
      fig(g, pose, -38, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 66, -152, sparkK, 14, 5);
    },
  };
})();
