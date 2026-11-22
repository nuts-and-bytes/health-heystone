/* 本站的 stick-scene 主题：橙线风格（黑色细线 + 白纸 + 唯一橙色重点）。
 * 在 stick.js 之后、所有 scene 之前加载。 */
(function () {
  if (!window.STICK) return;
  window.STICK.theme({
    ink: '#1c1917',
    butter: '#fed7aa',
    butterHi: '#fb923c',
    butterSoft: '#ffedd5',
    umber: '#9a3412',
    amber: '#c2410c',
  });
  /* 场景里统一用这个橙色标重点，一个画面只用在一处 */
  window.ORANGE = '#F97316';
})();
