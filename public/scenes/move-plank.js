// move-plank: 真正的地面平板支撑 / 鸟狗式核心稳定示范（水平趴撑在瑜伽垫上，交替伸手伸腿）
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawMat(g) {
    rr(g, -118, -7, 236, 8, 4);
    inkFill(g, C.paper, 1.5);
    text(g, '平板支撑 / 鸟狗式（保持躯干平直）', 0, 16, 10, C.muted);
  }

  SC['move-plank'] = {
    dur: 5.8,
    width: 340,
    label: '小人俯身撑在瑜伽垫上示范平板支撑与鸟狗式，躯干保持水平一条直线，交替平伸手臂与腿。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      // 水平四点支撑基准姿势（地面动作，与站立姿势完全区分）
      const plankBase = P({
        head: [48, -42],
        chest: [28, -36],
        hip: [-22, -34],
        kF: [-40, -14],
        kB: [-48, -14],
        fF: [-68, -4],
        fB: [-74, -4],
        hF: [36, -6],
        hB: [24, -6],
        hang: 0,
      });
      let pose = breathe(plankBase, t);
      let active = 0;

      if (T < 0) {
        pose = mix(pose, P({ ...plankBase, head: [50, -45] }), pulse(t, 5.2, 2, 2));
      } else {
        active = E.soft(seg(T, 0.3, 0.8)) * (1 - E.soft(seg(T, 4.9, 5.4)));
        const cyc = (Math.sin((T - 0.6) * 2.6 - Math.PI / 2) + 1) * 0.5;
        // 鸟狗式伸展：右手前伸 + 左腿后伸，躯干纹丝不动
        const birdDog = P({
          head: [50, -42],
          chest: [28, -36],
          hip: [-22, -34],
          kF: [-40, -14],
          kB: [-58, -32],
          fF: [-68, -4],
          fB: [-92, -30],
          hF: [66, -38],
          hB: [26, -6],
          hang: 0,
        });
        pose = mix(pose, birdDog, cyc * active);
      }

      drawMat(g);
      fig(g, pose, 6, -4, { wave: S.wave, wt: S.wt, held: chestDot, shadow: false });
      if (active > 0.2) {
        // 橙色水平核心稳定线
        ln(g, -28, -56, 36, -56, 2.4, OR());
        text(g, '核心收紧不塌腰', 4, -66, 10, OR());
      }
    },
  };
})();
