// about-desk-stone: About 页面专属互动——手绘橙线小橙坐在石头书桌前，点击画布/按钮滚来小橘子，小橙开心接住！
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

  function drawDesk(g, orangeX, orangeY, showReply) {
    // desk surface
    ln(g, -20, -42, 130, -42, 2, C.ink);
    ln(g, 110, -42, 110, 0, 1.8, C.ink);
    // laptop
    ln(g, 48, -42, 76, -42, 2.2, C.ink);
    ln(g, 76, -42, 88, -68, 2.2, C.ink);
    circle(g, 82, -55, 2.2);
    g.fillStyle = OR();
    g.fill();
    // small book stack
    rr(g, 92, -52, 28, 10, 2);
    inkFill(g, C.paper, 1.3);
    // rolling orange treat
    circle(g, orangeX, orangeY, 8);
    g.fillStyle = OR();
    g.fill();
    g.strokeStyle = C.ink;
    g.lineWidth = 1.6;
    g.stroke();
    ln(g, orangeX, orangeY - 8, orangeX + 4, orangeY - 12, 1.6, C.ink);

    if (showReply > 0.05) {
      g.save();
      g.globalAlpha = showReply;
      rr(g, -110, -148, 112, 24, 12);
      inkFill(g, C.paper, 1.4);
      text(g, '收到投喂，继续干活！', -54, -132, 9.5, OR());
      g.restore();
    }
  }

  SC['about-desk-stone'] = {
    dur: 4.4,
    width: 360,
    label: '手绘橙线小橙在书桌前整理健康证据，点击画面滚来一颗小橘子，小橙开心地举起来接住。',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let pose = breathe(P({ hF: [36, -54], hB: [18, -54], head: [6, -110] }), t);
      let ox = 22, oy = -50, replyK = 0, sparkK = 0;

      if (T < 0) {
        const typeWave = Math.sin(t * 7) * 3;
        pose = P({ hF: [42, -54 + typeWave], hB: [24, -54 - typeWave], head: [8, -110] });
        ox = 20;
        oy = -50;
      } else {
        const fade = 1 - seg(T, this.dur - 0.45, this.dur);
        const roll = E.soft(seg(T, 0.1, 1.0));
        const lift = E.soft(seg(T, 1.1, 1.7)) * (1 - E.soft(seg(T, 3.2, 3.8)));
        ox = lerp(124, -22, roll);
        oy = -50 - lift * 62;
        replyK = E.soft(seg(T, 1.4, 1.9)) * fade;
        sparkK = seg(T, 1.5, 2.2);

        pose = mix(
          pose,
          P({ hF: [28, -114], hB: [-14, -110], head: [4, -116] }),
          lift
        );
      }

      drawDesk(g, ox, oy, replyK);
      fig(g, pose, -44, 0, { wave: S.wave, wt: S.wt, held: chestDot });
      sparks(g, -22, -114, sparkK, 12, 5);
    },
  };
})();
