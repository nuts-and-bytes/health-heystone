// women-uv-window: 阴天云层与普通玻璃仍会透过 UVA，户外(UVI≥3)与紧邻窗边需防晒；远离窗户的室内无需频繁补涂焦虑。
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

  function drawUvZones(g, scanK, calmK) {
    const x = 16, y = -126, w = 136, h = 114;

    // Outer frame split into Left (Cloud/Window UVA) and Right (Deep Indoor)
    rr(g, x, y, w, h, 10);
    inkFill(g, C.paper, 1.6);
    text(g, '防晒分场景 · 看 UVI 与窗边', x + w / 2, y + 17, 9, C.ink);
    ln(g, x + 10, y + 24, x + w - 10, y + 24, 1, C.line || '#e5e7eb');

    // Left column: Cloudy Outdoor / Window-side
    rr(g, x + 8, y + 30, 58, 76, 7);
    inkFill(g, scanK > 0.3 ? C.butterSoft : C.paper, 1.3);
    // cloud + UVA rays
    circle(g, x + 31, y + 44, 6);
    circle(g, x + 39, y + 43, 7);
    circle(g, x + 46, y + 45, 5);
    inkFill(g, C.paper, 1.1);
    if (scanK > 0.25) {
      ln(g, x + 30, y + 52, x + 26, y + 62, 1.4, OR());
      ln(g, x + 38, y + 52, x + 36, y + 62, 1.4, OR());
      ln(g, x + 46, y + 52, x + 44, y + 62, 1.4, OR());
    }
    text(g, '阴天 / 靠窗', x + 37, y + 76, 8.4, scanK > 0.3 ? OR() : C.ink);
    text(g, 'UVA 穿透', x + 37, y + 89, 7.6, C.muted);
    text(g, '✓ 需防晒', x + 37, y + 100, 8, scanK > 0.3 ? OR() : C.muted);

    // Right column: Deep Indoor away from window
    rr(g, x + 70, y + 30, 58, 76, 7);
    inkFill(g, calmK > 0.3 ? '#F5F5F4' : C.paper, 1.3);
    // little roof / indoor lamp icon
    ln(g, x + 86, y + 46, x + 99, y + 38, 1.4, C.ink);
    ln(g, x + 99, y + 38, x + 112, y + 46, 1.4, C.ink);
    rr(g, x + 90, y + 46, 18, 12, 2);
    inkFill(g, C.paper, 1.2);
    text(g, '远离窗室内', x + 99, y + 76, 8.4, C.ink);
    text(g, 'UVI 极低', x + 99, y + 89, 7.6, C.muted);
    text(g, '不必狂补涂', x + 99, y + 100, 7.8, calmK > 0.3 ? C.ink : C.muted);

    text(g, '户外 UVI ≥ 3：广谱 SPF 30+ 或硬防晒', x + w / 2, 14, 8.4, C.muted);
  }

  SC['women-uv-window'] = {
    dur: 5.2,
    width: 390,
    label: '小橙点亮左侧阴天与靠窗区域的UVA穿透提示需要防晒，同时安抚右侧远离窗户的室内工位不必频繁补涂。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [12, -62], hB: [-4, -54] }), t);
      let scanK = 0, calmK = 0, sparkK = 0;

      if (T < 0) {
        pose = mix(pose, P({ hF: [24, -84], head: [6, -114] }), pulse(t, 5, 1.5, 1.5));
      } else {
        const fade = 1 - seg(T, this.dur - 0.5, this.dur);
        scanK = E.soft(seg(T, 0.4, 1.2)) * fade;
        calmK = E.soft(seg(T, 1.7, 2.4)) * fade;
        sparkK = seg(T, 2.3, 3.0);

        const pLeft = E.soft(seg(T, 0.3, 0.9)) * (1 - E.soft(seg(T, 1.5, 1.9)));
        pose = mix(pose, P({ hF: [36, -80], hB: [-6, -54], head: [6, -114] }), pLeft);

        const pRight = E.soft(seg(T, 1.8, 2.4)) * (1 - E.soft(seg(T, 4.3, 4.7)));
        pose = mix(pose, P({ hF: [44, -66], hB: [-6, -54], head: [10, -112] }), pRight);
      }

      drawUvZones(g, scanK, calmK);
      fig(g, pose, -76, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, 52, -74, sparkK, 10, 5);
    },
  };
})();
