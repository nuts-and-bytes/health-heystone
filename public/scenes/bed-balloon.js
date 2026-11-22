// bed-balloon: 卧床静养的日子里，肌肉像漏气的气球变瘪；下床走动后才慢慢鼓回来。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, walkSeg, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawBed(g, dayStr) {
    const x = -132, y = -34, w = 104, h = 16;
    // headboard & legs
    ln(g, x + 4, y - 22, x + 4, 0, 2.2, C.ink);
    ln(g, x + w - 4, y - 6, x + w - 4, 0, 2.2, C.ink);
    rr(g, x, y, w, h, 5);
    inkFill(g, C.paper, 1.5);
    // pillow
    rr(g, x + 8, y - 10, 24, 10, 4);
    inkFill(g, C.paper, 1.2);
    if (dayStr) text(g, dayStr, x + w / 2, 16, 10, C.muted);
  }

  function drawBalloon(g, size) {
    const bx = 92, by = -112;
    const rx = lerp(12, 30, size);
    const ry = lerp(15, 36, size);
    // string tied to ground post
    ln(g, bx, by + ry, bx, 0, 1.3, C.ink);
    g.save();
    g.beginPath();
    g.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2);
    inkFill(g, OR(), 1.6, C.ink);
    g.restore();
    text(g, '肌肉', bx, by + 4, 10, C.paper);
  }

  SC['bed-balloon'] = {
    dur: 6.4,
    width: 390,
    label: '小人卧床十天，旁边的橙色肌肉气球一天天变瘪；下床活动走几步后，气球才慢慢鼓回一些。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let x = -2, gait = { ph: 0, amp: 0, stride: 22 };
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let balloon = 0.92;
      let dayStr = '病床';

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [8, -114] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const deflate = E.soft(seg(T, 0.4, 3.0));
        const recover = E.soft(seg(T, 3.6, 5.4));
        balloon = lerp(0.92, 0.92 - deflate * 0.72 + recover * 0.42, fade);
        if (T >= 0.4 && T < 3.1) {
          const day = Math.min(10, 1 + Math.floor(seg(T, 0.4, 3.0) * 10));
          dayStr = `卧床第${day}天`;
        } else if (T >= 3.3 && T < 5.6) {
          dayStr = '下床活动';
        }
        // sit/rest slumped near bed during bed rest, then walk forward & back
        const restW = E.soft(seg(T, 0.25, 0.65)) * (1 - E.soft(seg(T, 2.95, 3.35)));
        const sitPose = P({
          head: [-6, -92], chest: [-4, -72], hip: [-10, -44],
          kF: [14, -40], kB: [6, -40], fF: [16, -2], fB: [6, -2],
          hF: [8, -54], hB: [-8, -54],
        });
        pose = mix(pose, sitPose, restW);
        if (T >= 3.35 && T < 5.8) {
          const ws = T < 4.55 ? walkSeg(T, 3.35, 4.55, -2, 34) : walkSeg(T, 4.65, 5.75, 34, -2);
          x = ws.x;
          gait = ws.dir < 0 ? { ph: -ws.ph, amp: ws.amp, stride: ws.stride } : ws;
        }
      }

      pose = legs(pose, gait.ph, gait.amp, { arms: false, stride: gait.stride });
      drawBed(g, dayStr);
      drawBalloon(g, balloon);
      fig(g, pose, x, 0, { wave: S.wave, wt: S.wt, held: chestDot });
    },
  };
})();
