// step-stairs: 步数越多，每多走两千步换来的台阶越矮，收益曲线逐渐变平。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  // Diminishing-return staircase: heights 0 -> 34 -> 58 -> 72 -> 79 -> 82
  const STAIRS = [
    { x: -120, w: 46, h: 34, lb: '2千' },
    { x: -74, w: 46, h: 58, lb: '4千' },
    { x: -28, w: 46, h: 72, lb: '6千' },
    { x: 18, w: 46, h: 79, lb: '8千' },
    { x: 64, w: 54, h: 82, lb: '1万' },
  ];

  function drawStairs(g, curveK) {
    for (const s of STAIRS) {
      rr(g, s.x, -s.h, s.w, s.h, 3);
      inkFill(g, C.paper, 1.4);
      text(g, s.lb, s.x + s.w / 2, 16, 10, C.muted);
    }
    if (curveK > 0.01) {
      const pts = [
        [-146, -4],
        ...STAIRS.map((s) => [s.x + s.w * 0.5, -s.h - 10]),
      ];
      g.save();
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      const total = pts.length - 1;
      const prog = curveK * total;
      for (let i = 0; i < total; i++) {
        const k = Math.max(0, Math.min(1, prog - i));
        if (k <= 0) break;
        const p0 = pts[i], p1 = pts[i + 1];
        g.lineTo(lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k));
      }
      g.strokeStyle = OR();
      g.lineWidth = 2.6;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.stroke();
      g.restore();
    }
  }

  SC['step-stairs'] = {
    dur: 6.4,
    width: 390,
    label: '小人走上越来越矮的台阶：前几千步收益台阶很高，到六千至八千步之后越来越平，橙色曲线标出趋平的收益。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let x = -152, y = 0;
      let gait = { ph: 0, amp: 0, stride: 20 };
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let curveK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -113] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const ws = T < 4.5 ? R.walkSeg(T, 0.2, 3.5, -152, 91) : R.walkSeg(T, 5.1, 6.2, 91, -152);
        x = ws.x;
        const p = Math.max(0, Math.min(1, (x + 152) / (91 + 152)));
        // smooth curve elevation matching the stairs
        y = -82 * (1 - Math.pow(1 - p, 2.2));
        gait = ws.dir < 0 ? { ph: -ws.ph, amp: ws.amp * 0.6, stride: ws.stride } : { ph: ws.ph, amp: ws.amp * 0.6, stride: ws.stride };
        const shrug = E.soft(seg(T, 3.8, 4.15)) * (1 - E.soft(seg(T, 4.75, 5.05)));
        pose = mix(pose, P({ hF: [20, -78], hB: [-6, -64], head: [4, -114], chest: [0, -88] }), shrug);
        curveK = E.soft(seg(T, 0.4, 3.7)) * fade;
      }

      pose = legs(pose, gait.ph, gait.amp, { arms: false, stride: gait.stride });
      drawStairs(g, curveK);
      fig(g, pose, x, y, { wave: S.wave, wt: S.wt, held: chestDot, shadow: y === 0 });
      if (curveK > 0.7) {
        text(g, '收益变平', 84, -108, 10, OR());
      }
    },
  };
})();
