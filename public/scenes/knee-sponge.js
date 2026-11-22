// knee-sponge: 跑步伤膝盖？软骨像一块没有血管的海绵，一压一松，才把关节液吸进去。
// Load after stick.js and theme.js. Use as <stick-scene scene="knee-sponge" play="view"></stick-scene>.
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, arcPt, tick, lerp, L2, clamp } = R;
  const OR = () => window.ORANGE || '#F97316';
  // 小橙: the small orange dot on the figure's chest (drawn in the figure's local space, under the near arm).
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  const SP = { x: -38, w: 120 };
  const H_DRY = 22, H_FULL = 34;
  const BOWL = { x: 118, w: 58, h: 20 };
  const STEPS = 5, S0 = 0.75, SD = 0.66;
  const S_END = S0 + STEPS * SD;
  const PORES = [
    [0.12, 0.35], [0.27, 0.68], [0.4, 0.3], [0.55, 0.62], [0.7, 0.36], [0.86, 0.66], [0.2, 0.15], [0.62, 0.16], [0.93, 0.25], [0.05, 0.75], [0.47, 0.84], [0.78, 0.85],
  ];

  function sponge(g, h, w, plump) {
    const x0 = SP.x - w / 2;
    rr(g, x0, -h, w, h, 7);
    inkFill(g, OR(), 1.6, C.ink);
    for (let i = 0; i < PORES.length; i++) {
      const [u, v] = PORES[i];
      const r = lerp(1.5, 2.6, plump) * (0.8 + 0.4 * ((i * 7) % 3) / 2);
      circle(g, x0 + 6 + u * (w - 12), -h + 4 + v * (h - 8), r);
      g.fillStyle = C.paper;
      g.fill();
    }
  }

  function bowl(g, surf) {
    const { x, w, h } = BOWL;
    g.beginPath();
    g.moveTo(x - w / 2, -h);
    g.bezierCurveTo(x - w / 2, 2, x + w / 2, 2, x + w / 2, -h);
    g.closePath();
    inkFill(g, C.paper, 1.6);
    // liquid surface: a wavy ink line, plus one short ripple
    const y = -h + surf;
    const half = w / 2 - 2 - surf * 0.9;
    R.wline(g, [[x - half, y], [x + half, y]], 1.2, C.ink, 0.9, 3);
    ln(g, x - 8, y + 5, x + 4, y + 5, 1, C.soft);
  }

  function drop(g, p, r) {
    g.beginPath();
    g.moveTo(p[0], p[1] - r * 1.9);
    g.bezierCurveTo(p[0] + r * 0.9, p[1] - r * 0.6, p[0] + r, p[1] + r, p[0], p[1] + r);
    g.bezierCurveTo(p[0] - r, p[1] + r, p[0] - r * 0.9, p[1] - r * 0.6, p[0], p[1] - r * 1.9);
    g.closePath();
    inkFill(g, C.paper, 1.2);
  }

  SC['knee-sponge'] = {
    dur: 6.4,
    width: 380,
    label: '小人在一块像海绵的软骨上原地慢跑：每踩一下海绵被压扁，每抬一下它就从旁边的关节液碗里吸进一滴，几步之后海绵变得饱满。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let sq = 0, soak = 0, tickK = 0, s = 0;
      const look = P({ hF: [12, -60], hB: [-4, -52], head: [9, -113], chest: [2, -90] });
      if (T < 0) {
        pose = mix(pose, look, pulse(t, 6, 2.2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.6, this.dur);
        const jogW = E.soft(seg(T, 0.3, S0)) * (1 - E.soft(seg(T, S_END - 0.05, S_END + 0.35)));
        s = clamp((T - S0) / SD, 0, STEPS);
        const i = Math.min(STEPS - 1, Math.floor(s));
        const f = s >= STEPS ? 1 : s - Math.floor(s);
        const up = Math.sin(Math.PI * f);
        sq = jogW * (1 - up);
        const liftF = i % 2 === 0 ? up * 14 * jogW : 0;
        const liftB = i % 2 === 1 ? up * 14 * jogW : 0;
        const a = Math.sin(Math.PI * s) * jogW;
        const jog = P({
          head: [7, -114], chest: [3, -89], hip: [0, -58 + 3 * sq],
          fF: [6, -2.5 - liftF], fB: [-4, -2.5 - liftB], kF: [28, -34], kB: [18, -34],
          hF: [14 - 6 * a, -64 - 3 * Math.abs(a)], hB: [-4, -52], eb: 0.2, hang: 0,
        });
        pose = mix(pose, jog, E.soft(seg(T, 0.2, 0.6)) * (1 - E.soft(seg(T, S_END, S_END + 0.4))));
        const cheer = E.back(seg(T, S_END + 0.45, S_END + 0.85)) * (1 - E.soft(seg(T, S_END + 1.4, S_END + 1.8)));
        pose = mix(pose, P({ hF: [16, -128], hB: [-4, -54], head: [4, -117] }), cheer);
        soak = E.soft(seg(T, S0 + 0.6 * SD, S_END)) * fade;
        tickK = seg(T, S_END + 0.3, S_END + 0.7) * fade;
      }
      const hb = lerp(H_DRY, H_FULL, soak);
      const h = hb * (1 - 0.3 * sq);
      const w = SP.w + 10 * sq;

      bowl(g, 5 + 3 * soak);
      sponge(g, h, w, soak);
      text(g, '软骨', SP.x, 17, 10, C.muted);
      text(g, '关节液', BOWL.x, 17, 10, C.muted);
      fig(g, pose, SP.x - 6, -h, { wave: S.wave, wt: S.wt, held: chestDot, shadow: false });
      if (T >= 0) {
        for (let j = 0; j < STEPS; j++) {
          const dk = seg(T, S0 + (j + 0.12) * SD, S0 + (j + 0.82) * SD);
          if (dk <= 0 || dk >= 1) {
            continue;
          }
          const p = arcPt([BOWL.x - 10, -BOWL.h + 2], [SP.x + w / 2 - 8, -h * 0.55], 38, E.sm(dk));
          drop(g, p, 3.2 * (1 - 0.35 * seg(dk, 0.85, 1)));
        }
      }
      tick(g, SP.x + 40, -hb - 22, tickK, 1.5, C.ink);
    },
  };
})();
