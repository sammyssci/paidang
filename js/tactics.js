/**
 * 战术洞察库页面逻辑
 * 功能：分类筛选、热门推荐、战术详情、收藏、评论、跳转视频分析
 */
(function ($) {
  'use strict';

  const { Storage, Auth, Modal, Toast, Utils, Interaction } = window.BadmintonApp;

  let currentTacticId = null;
  let filters = { category: 'all', level: 'all', player: '', sort: 'likes' };

  const SIDEBAR_ITEMS = [
    { id: 'all', label: '全部战术', icon: '📖' },
    { id: 'single', label: '单打战术', icon: '🏸' },
    { id: 'double', label: '双打战术', icon: '👥' },
    { id: 'mixed', label: '混双战术', icon: '💑' },
    { id: 'front', label: '前场后场', icon: '↔️' },
    { id: 'defense', label: '防守反击', icon: '🛡️' },
    { id: 'net', label: '网前博弈', icon: '🕸️' }
  ];

  const SIDEBAR_CATEGORY_MAP = {
    all: 'all', single: '单打战术', double: '双打战术', mixed: '混双战术',
    front: '前场后场打法', defense: '防守反击', net: '网前博弈'
  };

  /* ========== 获取过滤后的战术列表 ========== */
  function getFilteredTactics() {
    let tactics = Storage.get('tactics') || [];
    if (filters.category !== 'all') {
      tactics = tactics.filter(function (t) { return t.category === filters.category; });
    }
    if (filters.level !== 'all') {
      tactics = tactics.filter(function (t) { return t.level === filters.level; });
    }
    if (filters.player) {
      tactics = tactics.filter(function (t) {
        return t.player.toLowerCase().indexOf(filters.player.toLowerCase()) > -1;
      });
    }
    if (filters.sort === 'likes') {
      tactics.sort(function (a, b) { return b.likes - a.likes; });
    } else {
      tactics.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }
    return tactics;
  }

  /* ========== 渲染战术卡片 ========== */
  function renderTacticCard(t) {
    const pinnedBadge = t.pinned ? '<span class="badge badge-hot">置顶</span>' : '';
    const thumbHtml = t.videoPoster
      ? '<img src="' + t.videoPoster + '" alt="' + t.title + '" class="tactic-card-video-thumb"' +
        (t.bvid ? ' data-bili-poster data-bili-bvid="' + t.bvid + '" data-bili-page="' + (t.page || 1) + '"' : '') +
        '><span class="tactic-play-badge">▶ 配套视频</span>'
      : '<span class="tactic-card-emoji">🏸</span>';
    return '<div class="tactic-card" data-id="' + t.id + '">' +
      '<div class="tactic-card-img tactic-card-media">' + thumbHtml + '</div>' +
      '<div class="tactic-card-body">' +
      '<div class="flex justify-between items-start">' +
      '<h3 class="font-semibold">' + t.title + '</h3>' + pinnedBadge + '</div>' +
      '<p class="text-sm text-gray-500 mt-1 line-clamp-2">' + t.summary + '</p>' +
      (t.videoTitle ? '<p class="text-xs text-mint-dark mt-1">📹 ' + t.videoTitle + (t.duration ? ' · ' + t.duration : '') + '</p>' : '') +
      '<div class="tactic-meta">' +
      '<span class="badge badge-mint">' + t.category + '</span>' +
      '<span class="badge badge-gray">' + t.level + '</span>' +
      '<span class="badge badge-gray">' + t.player + '</span></div>' +
      '<div class="flex justify-between text-sm text-gray-400 mt-2">' +
      '<span>👍 ' + t.likes + '</span><span>👁 ' + t.views + '</span></div></div></div>';
  }

  /* ========== 渲染列表 ========== */
  function renderTactics() {
    const all = getFilteredTactics();
    const pinned = all.filter(function (t) { return t.pinned; });
    const rest = all.filter(function (t) { return !t.pinned; });

    let pinnedHtml = '';
    pinned.forEach(function (t) { pinnedHtml += renderTacticCard(t); });
    $('#pinnedSection').toggle(pinned.length > 0);
    $('#pinnedTactics').html(pinnedHtml || '<p class="text-gray-400">暂无置顶</p>');

    let gridHtml = '';
    rest.forEach(function (t) { gridHtml += renderTacticCard(t); });
    $('#tacticGrid').html(gridHtml || '<div class="empty-state col-span-3"><div class="empty-state-icon">📖</div><p>暂无匹配战术</p></div>');
    $('#tacticCount').text('(' + all.length + ' 条)');
    if (window.VideoLib && window.VideoLib.refreshDomPosters) {
      window.VideoLib.refreshDomPosters($('#pinnedTactics, #tacticGrid'));
    }
  }

  /* ========== 战术详情 ========== */
  function showTacticDetail(id) {
    currentTacticId = id;
    const t = (Storage.get('tactics') || []).find(function (x) { return x.id === id; });
    if (!t) return;

    /* 增加浏览量 */
    t.views += 1;
    const tactics = Storage.get('tactics') || [];
    const idx = tactics.findIndex(function (x) { return x.id === id; });
    if (idx > -1) { tactics[idx] = t; Storage.set('tactics', tactics); }

    const comments = (Storage.get('tacticComments') || {})[id] || [];
    let commentsHtml = '';
    comments.forEach(function (c) {
      const author = Utils.getUserById(c.authorId);
      commentsHtml += '<div class="comment-item"><strong>' + author.nickname + '</strong> ' +
        '<span class="text-xs text-gray-400">' + Utils.formatDate(c.createdAt) + '</span>' +
        '<p class="mt-1">' + c.content + '</p></div>';
    });

    const videoHtml = t.videoUrl ?
      window.VideoLib.renderPlayerHtml(t, { height: 360 }) : '';

    $('#tacticDetailTitle').text(t.title);
    $('#tacticDetailBody').html(
      videoHtml +
      '<div class="flex gap-2 mb-4">' +
      '<span class="badge badge-mint">' + t.category + '</span>' +
      '<span class="badge badge-gray">' + t.level + '</span>' +
      '<span class="badge badge-gray">' + t.type + '</span>' +
      '<span class="badge badge-gray">参考: ' + t.player + '</span></div>' +
      '<p class="text-gray-700 leading-relaxed mb-4">' + t.content + '</p>' +
      '<div class="flex gap-4 text-sm text-gray-500 mb-4">👍 ' + t.likes + ' · 👁 ' + t.views + '</div>' +
      '<h4 class="font-semibold mb-2">💬 评论提问 (' + comments.length + ')</h4>' +
      '<div class="comment-list mb-4">' + (commentsHtml || '<p class="text-gray-400 text-sm">暂无评论</p>') + '</div>' +
      '<form id="tacticCommentForm">' +
      '<textarea class="form-textarea mb-2" id="tacticCommentInput" placeholder="提问或评论..." rows="2"></textarea>' +
      '<button type="submit" class="btn btn-sm btn-primary">发表评论</button></form>'
    );

    updateFavoriteBtn();
    Modal.open('tacticDetailModal');
  }

  function updateFavoriteBtn() {
    const user = Auth.getCurrentUser();
    if (!user || !currentTacticId) {
      $('#tacticFavoriteBtn').text('⭐ 收藏');
      return;
    }
    const isFav = Interaction.isFavorited(user.id, 'tactics', currentTacticId);
    $('#tacticFavoriteBtn').text(isFav ? '⭐ 已收藏' : '⭐ 收藏');
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    /* 分类/水平筛选 */
    $(document).on('click', '[data-filter]', function () {
      const filterType = $(this).data('filter');
      const value = $(this).data('value');
      $(this).siblings('[data-filter="' + filterType + '"]').removeClass('active');
      $(this).addClass('active');
      filters[filterType] = value;
      renderTactics();
    });

    /* 排序 */
    $(document).on('click', '[data-sort]', function () {
      $('[data-sort]').removeClass('active');
      $(this).addClass('active');
      filters.sort = $(this).data('sort');
      renderTactics();
    });

    /* 球员筛选 */
    $('#playerFilterBtn').on('click', function () {
      filters.player = $('#playerFilter').val().trim();
      renderTactics();
    });
    $('#playerFilter').on('keypress', function (e) {
      if (e.which === 13) { filters.player = $(this).val().trim(); renderTactics(); }
    });

    /* 卡片点击 */
    $(document).on('click', '.tactic-card', function () {
      showTacticDetail($(this).data('id'));
    });

    /* 收藏 */
    $('#tacticFavoriteBtn').on('click', function () {
      if (!Auth.requireLogin()) return;
      Interaction.toggleFavorite(Auth.getCurrentUser().id, 'tactics', currentTacticId);
      updateFavoriteBtn();
    });

    /* 跳转视频分析 */
    $('#tacticAnalyzeBtn').on('click', function () {
      const t = (Storage.get('tactics') || []).find(function (x) { return x.id === currentTacticId; });
      if (t && t.videoUrl) {
        sessionStorage.setItem('pendingVideoUrl', t.watchUrl || t.videoUrl);
        sessionStorage.setItem('pendingVideoTitle', t.title + ' - 对局拆解');
        sessionStorage.setItem('pendingVideoType', t.videoType || 'bilibili');
      }
      window.location.href = 'video-analysis.html';
    });

    /* 评论提交 */
    $(document).on('submit', '#tacticCommentForm', function (e) {
      e.preventDefault();
      if (!Auth.requireLogin()) return;
      const content = $('#tacticCommentInput').val().trim();
      if (!content) { Toast.show('请输入评论内容', 'error'); return; }

      const allComments = Storage.get('tacticComments') || {};
      if (!allComments[currentTacticId]) allComments[currentTacticId] = [];
      allComments[currentTacticId].push({
        id: Utils.generateId('tcmt'),
        authorId: Auth.getCurrentUser().id,
        content: content,
        createdAt: new Date().toISOString()
      });
      Storage.set('tacticComments', allComments);
      Toast.show('评论成功', 'success');
      showTacticDetail(currentTacticId);
    });

    /* 侧边栏 */
    $(document).on('click', '.sidebar-item', function () {
      const id = $(this).data('sidebar-id');
      $('.sidebar-item').removeClass('active');
      $(this).addClass('active');
      filters.category = SIDEBAR_CATEGORY_MAP[id] || 'all';
      $('[data-filter="category"]').removeClass('active');
      $('[data-filter="category"][data-value="' + filters.category + '"]').addClass('active');
      renderTactics();
    });
  }

  $(document).ready(function () {
    window.BadmintonApp.Navigation.renderSidebar(SIDEBAR_ITEMS, 'all');
    bindEvents();
    renderTactics();
  });

})(jQuery);
