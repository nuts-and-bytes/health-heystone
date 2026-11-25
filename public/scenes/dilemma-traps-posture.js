// dilemma-traps-posture: 斜方肌显厚多半是耸肩圆肩紧张，把肩膀沉下去瞬间舒展。
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

  SC['dilemma-traps-posture'] = {
    dur: 5.2,
    width: 390,
    label: '小橙从低头耸肩的紧张姿势缓缓沉肩挺胸，肩颈紧绷线条散开，体态立刻舒展。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const tense = P({ head: [20, -100], chest: [10, -82], hF: [26, -72], hB: [6, -74] });
      const open = P({ head: [2, -118], chest: [0, -88], hF: [14, -56], hB: [-14, -56] });
      let k = 0, sparkK = 0;

      if (T < 0) {
        k = pulse(t, 5, 1.5, 1.5) * 0.25;
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        k = E.soft(seg(T, 0.8, 2.4)) * fade;
        sparkK = seg(T, 2.5, 3.2);
      }

      const pose = breathe(mix(tense, open, k), t);
      fig(g, pose, -46, 0, { wave: S.wave, wt: S.wt, held: chestDot });

      // posture status cue on right
      rr(g, 34, -108, 114, 72, 10);
      inkFill(g, k > 0.5 ? C.butterSoft : C.paper, 1.5);
      text(g, k > 0.5 ? '沉肩 · 脊柱拉直' : '低头耸肩代偿', 91, -82, 10.5, k > 0.5 ? OR() : C.ink);
      text(g, k > 0.5 ? '脖子瞬间显修长 ✓' : '上斜方肌长期紧绷', 91, -56, 9.5, C.muted);
      // down arrow cue
      if (k > 0.2) {
        ln(g, -46, -134, -46, -122, 2, OR());
        ln(g, -51, -127, -46, -122, 2, OR());
        ln(g, -41, -127, -46, -122, 2, OR());
      }
      sparks(g, -46, -120, sparkK, 12, 5);
    },
  };
})();
