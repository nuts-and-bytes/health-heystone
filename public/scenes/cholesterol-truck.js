// cholesterol-truck: 胆固醇像修路建材：肝脏自己造了大部分，LDL 负责送货，HDL 负责把多余的拉回去。
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, fig, inkFill, rr, ln, text, seg, breathe, pulse, circle, lerp, L2 } = R;
  const OR = () => window.ORANGE || '#F97316';
  const chestDot = (g, J) => {
    const p = L2(J.chest, J.hip, 0.3);
    circle(g, p[0], p[1], 3.4);
    g.fillStyle = OR();
    g.fill();
  };

  function drawRoad(g) {
    ln(g, -40, -24, 168, -24, 1.4, C.soft);
    ln(g, -40, -68, 168, -68, 1.4, C.soft);
    text(g, '血管公路', 64, 16, 10, C.muted);
  }

  function drawLiver(g) {
    rr(g, -42, -138, 66, 54, 10);
    inkFill(g, C.paper, 1.5);
    text(g, '肝脏工厂', -9, -114, 10, C.ink);
    text(g, '自产约7成', -9, -98, 9, C.muted);
  }

  function drawTruck(g, x, y, label, orange) {
    rr(g, x, y, 48, 22, 5);
    inkFill(g, orange ? OR() : C.paper, 1.5, C.ink);
    circle(g, x + 11, y + 23, 4);
    inkFill(g, C.paper, 1.4);
    circle(g, x + 37, y + 23, 4);
    inkFill(g, C.paper, 1.4);
    text(g, label, x + 24, y + 14, 9, orange ? C.paper : C.ink);
  }

  SC['cholesterol-truck'] = {
    dur: 6.2,
    width: 390,
    label: '肝脏工厂产出大部分胆固醇，橙色 HDL 回收车沿着血管把多余的胆固醇拉回肝脏，维持道路通畅。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let ldlX = -20, hdlX = 112;

      if (T < 0) {
        pose = mix(pose, P({ hF: [12, -60], hB: [-4, -52], head: [9, -114] }), pulse(t, 6, 2, 2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.55, this.dur);
        const out = E.soft(seg(T, 0.3, 2.7)) * fade;
        const back = E.soft(seg(T, 2.5, 5.2)) * fade;
        ldlX = lerp(-20, 108, out);
        hdlX = lerp(112, -14, back);
        const point = E.soft(seg(T, 0.5, 1.0)) * (1 - E.soft(seg(T, 4.6, 5.1)));
        pose = mix(pose, P({ hF: [26, -84], hB: [-4, -54], head: [8, -114] }), point);
      }

      drawRoad(g);
      drawLiver(g);
      drawTruck(g, ldlX, -62, 'LDL送', false);
      drawTruck(g, hdlX, -32, 'HDL收', true);
      fig(g, pose, -108, 0, { wave: S.wave, wt: S.wt, held: chestDot });
    },
  };
})();
