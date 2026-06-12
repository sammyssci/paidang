/**
 * 首页专属逻辑
 * 功能：轮播图、快捷入口、赛事/球员/视频榜单、资讯筛选与详情
 */
(function ($) {
  'use strict';

  const { Storage, Carousel, Modal, Toast, Auth, Interaction } = window.BadmintonApp;

  let eventFilter = 'all';
  let playerFilter = 'all';
  let currentEventId = null;
  let currentPlayerId = null;
  let currentPlayerArticleId = null;

  const SCALE_MIN = 70;
  const SCALE_MAX = 150;
  const SCALE_STEP = 5;
  const VIEWPORT_HEIGHT_MIN = 280;
  const VIEWPORT_HEIGHT_MAX = 640;
  const VIEWPORT_HEIGHT_DEFAULT = 400;
  const SHARED_VIEWPORT_HEIGHT_KEY = 'home_data_viewport_height';

  const SCALABLE_CARD_CONFIG = {
    events: { label: '赛事列表', scaleKey: 'home_events_scale' },
    playerStats: { label: '球员排行', scaleKey: 'player_stats_scale' },
    hotVideos: { label: '热门视频', scaleKey: 'home_hot_videos_scale' }
  };

  const scalableCardState = {};
  let sharedViewportHeight = VIEWPORT_HEIGHT_DEFAULT;

  /* ========== 首页数据卡片缩放 ========== */
  function getScalableState(id) {
    if (!scalableCardState[id]) {
      scalableCardState[id] = { scale: 100 };
    }
    return scalableCardState[id];
  }

  function loadSharedViewportHeight() {
    var saved = parseInt(localStorage.getItem(SHARED_VIEWPORT_HEIGHT_KEY), 10);
    if (!isNaN(saved) && saved >= VIEWPORT_HEIGHT_MIN && saved <= VIEWPORT_HEIGHT_MAX) {
      sharedViewportHeight = saved;
      return;
    }
    /* 兼容旧版各自保存的高度，取最大值统一 */
    var legacyKeys = ['home_events_height', 'player_stats_height', 'home_hot_videos_height'];
    var legacyMax = 0;
    legacyKeys.forEach(function (key) {
      var h = parseInt(localStorage.getItem(key), 10);
      if (!isNaN(h) && h > legacyMax) legacyMax = h;
    });
    if (legacyMax >= VIEWPORT_HEIGHT_MIN && legacyMax <= VIEWPORT_HEIGHT_MAX) {
      sharedViewportHeight = legacyMax;
    }
  }

  function saveSharedViewportHeight() {
    localStorage.setItem(SHARED_VIEWPORT_HEIGHT_KEY, String(sharedViewportHeight));
  }

  function loadScalablePrefs(id) {
    var cfg = SCALABLE_CARD_CONFIG[id];
    var state = getScalableState(id);
    var savedScale = parseInt(localStorage.getItem(cfg.scaleKey), 10);
    if (!isNaN(savedScale) && savedScale >= SCALE_MIN && savedScale <= SCALE_MAX) {
      state.scale = savedScale;
    }
  }

  function saveScalableScale(id) {
    localStorage.setItem(SCALABLE_CARD_CONFIG[id].scaleKey, String(getScalableState(id).scale));
  }

  function applyScalableScale(id, scale) {
    var state = getScalableState(id);
    state.scale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, scale));
    var ratio = state.scale / 100;
    $('[data-scaler="' + id + '"]').css({
      transform: 'scale(' + ratio + ')',
      width: (100 / ratio) + '%'
    });
    $('[data-scale-slider="' + id + '"]').val(state.scale);
    saveScalableScale(id);
  }

  function applyUnifiedViewportHeight(height) {
    sharedViewportHeight = Math.max(VIEWPORT_HEIGHT_MIN, Math.min(VIEWPORT_HEIGHT_MAX, height));
    $('.scalable-viewport').css('height', sharedViewportHeight + 'px');
    saveSharedViewportHeight();
  }

  function resetScalableCard(id) {
    applyScalableScale(id, 100);
    applyUnifiedViewportHeight(VIEWPORT_HEIGHT_DEFAULT);
    Toast.show(SCALABLE_CARD_CONFIG[id].label + '已重置', 'info');
  }

  function initScalableCards() {
    loadSharedViewportHeight();
    Object.keys(SCALABLE_CARD_CONFIG).forEach(function (id) {
      loadScalablePrefs(id);
      applyScalableScale(id, getScalableState(id).scale);
    });
    applyUnifiedViewportHeight(sharedViewportHeight);

    $(document).on('click', '[data-scale-out]', function () {
      var id = $(this).data('scale-out');
      applyScalableScale(id, getScalableState(id).scale - SCALE_STEP);
    });
    $(document).on('click', '[data-scale-in]', function () {
      var id = $(this).data('scale-in');
      applyScalableScale(id, getScalableState(id).scale + SCALE_STEP);
    });
    $(document).on('click', '[data-scale-reset]', function () {
      resetScalableCard($(this).data('scale-reset'));
    });
    $(document).on('input', '[data-scale-slider]', function () {
      applyScalableScale($(this).data('scale-slider'), parseInt($(this).val(), 10));
    });

    $('.scalable-viewport').on('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      var id = $(this).data('viewport');
      var delta = e.originalEvent.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      applyScalableScale(id, getScalableState(id).scale + delta);
    });

    var resizingId = null;
    var startY = 0;
    var startHeight = 0;

    $(document).on('mousedown', '[data-resize]', function (e) {
      e.preventDefault();
      resizingId = $(this).data('resize');
      startY = e.clientY;
      startHeight = sharedViewportHeight;
      $('.scalable-viewport').addClass('is-resizing');
      $('[data-resize="' + resizingId + '"]').addClass('is-dragging');
    });

    $(document).on('mousemove.scalableCards', function (e) {
      if (!resizingId) return;
      applyUnifiedViewportHeight(startHeight + (e.clientY - startY));
    });

    $(document).on('mouseup.scalableCards', function () {
      if (!resizingId) return;
      $('.scalable-viewport').removeClass('is-resizing');
      $('[data-resize]').removeClass('is-dragging');
      resizingId = null;
    });
  }

  /* ========== 侧边栏配置 ========== */
  const SIDEBAR_ITEMS = [
    { id: 'overview', label: '首页概览', icon: '🏠' },
    { id: 'events', label: '赛事资讯', icon: '🏆' },
    { id: 'videos', label: '热门视频', icon: '🎬' },
    { id: 'news', label: '行业资讯', icon: '📰' }
  ];

  /* ========== 渲染轮播图（B站羽毛球长教学预览） ========== */
  function renderCarousel() {
    const banners = Storage.get('banners') || [];
    let html = '';
    banners.forEach(function (b) {
      html += '<div class="carousel-slide" data-link="' + b.link + '">';
      if (b.videoType === 'bilibili' && b.videoUrl) {
        html += '<iframe class="carousel-embed" src="' + b.videoUrl + '" allowfullscreen scrolling="no" frameborder="0"></iframe>';
      } else if (b.videoUrl) {
        html += '<video class="carousel-video" src="' + b.videoUrl + '" poster="' + (b.videoPoster || b.image) + '" muted loop playsinline autoplay></video>';
      } else {
        html += '<img src="' + b.image + '" alt="' + b.title + '">';
      }
      html += '<div class="carousel-caption">';
      html += '<span class="badge badge-mint mb-2">' + b.type + '</span>';
      if (b.duration) html += '<span class="badge badge-gray mb-2 ml-1">⏱ ' + b.duration + '</span>';
      html += '<h3>' + b.title + '</h3>';
      html += '<p>' + b.desc + '</p>';
      if (b.videoTitle) html += '<p class="text-sm opacity-80 mt-1">📺 ' + b.videoTitle + '</p></div></div>';
      else html += '</div></div>';
    });
    $('#carouselInner').html(html);
    Carousel.init('#mainCarousel');
  }

  /* ========== 渲染热门视频榜单（可点击播放） ========== */
  function renderHotVideos() {
    const videos = Storage.get('hotVideos') || [];
    let html = '';
    videos.forEach(function (v, i) {
      const rankClass = i < 3 ? ' top' + (i + 1) : '';
      html += '<div class="list-item hot-video-item cursor-pointer" data-id="' + v.id + '">';
      html += '<span class="list-rank' + rankClass + '">' + (i + 1) + '</span>';
      if (v.videoPoster) {
        html += '<div class="hot-video-thumb"><img src="' + v.videoPoster + '" alt=""';
        if (v.bvid) {
          html += ' data-bili-poster data-bili-bvid="' + v.bvid + '" data-bili-page="' + (v.page || 1) + '"';
        }
        html += '><span class="play-icon">▶</span></div>';
      }
      html += '<div class="flex-1"><div class="font-semibold">' + v.title + '</div>';
      html += '<div class="text-sm text-gray-500">' + v.author + ' · ' + (v.views / 1000).toFixed(1) + 'k 播放</div>';
      if (v.videoDesc) html += '<div class="text-xs text-mint-dark mt-1">' + v.videoDesc + '</div>';
      if (v.duration) html += '<div class="text-xs text-gray-400">⏱ 教学时长 ' + v.duration + '</div>';
      html += '</div>';
      html += '<button class="btn btn-sm btn-primary hot-video-analyze" data-id="' + v.id + '">AI分析</button></div>';
    });
    $('#hotVideosList').html(html);
  }

  /* ========== 热门视频播放弹窗 ========== */
  function showHotVideo(vid) {
    const v = (Storage.get('hotVideos') || []).find(function (x) { return x.id === vid; });
    if (!v || !v.videoUrl) return;
    $('#hotVideoTitle').text(v.title);
    $('#hotVideoDesc').text((v.videoDesc || v.videoTitle || '') + (v.coach ? ' · 讲师：' + v.coach : ''));
    window.VideoLib.mount($('#hotVideoPlayerWrap'), v, { height: 400 });
    Modal.open('hotVideoModal');
  }

  /* ========== 渲染快捷入口 ========== */
  function renderQuickEntries() {
    const entries = [
      { icon: '🎬', title: '视频AI分析', link: 'video-analysis.html' },
      { icon: '🎯', title: '教练指导', link: 'coaching.html' },
      { icon: '📖', title: '战术洞察库', link: 'tactics.html' },
      { icon: '💬', title: '羽毛球圈子', link: 'community.html' },
      { icon: '👤', title: '个人中心', link: 'profile.html' },
      { icon: '📺', title: '赛事直播预告', link: '#eventsList' }
    ];
    let html = '';
    entries.forEach(function (e) {
      html += '<a href="' + e.link + '" class="quick-entry">';
      html += '<div class="quick-entry-icon">' + e.icon + '</div>';
      html += '<div class="quick-entry-title">' + e.title + '</div></a>';
    });
    $('#quickEntries').html(html);
  }

  /** 赛事状态徽章样式 */
  function eventStatusBadge(status) {
    var cls = { '报名中': 'badge-mint', '即将开始': 'badge-hot', '筹备中': 'badge-gray', '进行中': 'badge-hot' };
    return '<span class="badge ' + (cls[status] || 'badge-gray') + '">' + status + '</span>';
  }

  /** 是否已订阅/报名 */
  function getEventUserState(eventId) {
    var user = Auth.getCurrentUser();
    if (!user) return { subscribed: false, registered: false };
    return {
      subscribed: Interaction.isEventSubscribed(user.id, eventId),
      registered: Interaction.isEventRegistered(user.id, eventId)
    };
  }

  /* ========== 渲染赛事列表 ========== */
  function renderEvents() {
    var events = Storage.get('events') || [];
    if (eventFilter !== 'all') {
      events = events.filter(function (e) { return e.status === eventFilter; });
    }
    if (!events.length) {
      $('#eventsList').html('<div class="empty-state py-6"><p class="text-gray-400 text-sm">暂无该分类赛事</p></div>');
      return;
    }
    var html = '';
    events.forEach(function (e) {
      var state = getEventUserState(e.id);
      html += '<div class="list-item event-item" data-id="' + e.id + '">';
      html += '<div class="flex-1 min-w-0">';
      html += '<div class="font-semibold flex items-center gap-2 flex-wrap">';
      html += '<span>' + e.name + '</span>';
      if (state.subscribed) html += '<span class="badge badge-mint text-xs">已订阅</span>';
      if (state.registered) html += '<span class="badge badge-hot text-xs">已报名</span>';
      html += '</div>';
      html += '<div class="text-sm text-gray-500">' + e.date + (e.endDate ? ' ~ ' + e.endDate : '') + ' · ' + e.location + '</div>';
      if (e.level) html += '<div class="text-xs text-mint-dark mt-1">' + e.level + (e.prize ? ' · 奖金 ' + e.prize : '') + '</div>';
      html += '</div>';
      html += eventStatusBadge(e.status);
      html += '</div>';
    });
    $('#eventsList').html(html);
  }

  /** 赛事详情弹窗 */
  function showEventDetail(eventId) {
    currentEventId = eventId;
    var evt = (Storage.get('events') || []).find(function (e) { return e.id === eventId; });
    if (!evt) return;
    var user = Auth.getCurrentUser();
    var state = getEventUserState(eventId);

    var scheduleHtml = '';
    if (evt.schedule && evt.schedule.length) {
      scheduleHtml = '<table class="detail-table"><thead><tr><th>阶段</th><th>日期</th><th>备注</th></tr></thead><tbody>';
      evt.schedule.forEach(function (s) {
        scheduleHtml += '<tr><td>' + s.round + '</td><td>' + s.date + '</td><td>' + (s.note || '-') + '</td></tr>';
      });
      scheduleHtml += '</tbody></table>';
    }

    var highlightsHtml = (evt.highlights || []).map(function (h) {
      return '<span class="badge badge-gray">' + h + '</span>';
    }).join(' ');

    var body = '<div class="detail-meta-row">' +
      eventStatusBadge(evt.status) +
      (evt.level ? '<span class="badge badge-mint">' + evt.level + '</span>' : '') +
      (evt.tags || []).map(function (t) { return '<span class="badge badge-gray">' + t + '</span>'; }).join('') +
      '</div>' +
      '<div class="detail-info-grid">' +
      '<div><span class="detail-label">📅 日期</span><p>' + evt.date + (evt.endDate ? ' ~ ' + evt.endDate : '') + '</p></div>' +
      '<div><span class="detail-label">📍 地点</span><p>' + evt.location + '</p></div>' +
      (evt.venue ? '<div><span class="detail-label">🏟 场馆</span><p>' + evt.venue + '</p></div>' : '') +
      (evt.prize ? '<div><span class="detail-label">💰 奖金</span><p>' + evt.prize + '</p></div>' : '') +
      '</div>' +
      '<p class="text-gray-700 leading-relaxed my-4">' + (evt.description || '') + '</p>' +
      (highlightsHtml ? '<div class="mb-4"><span class="detail-label">⭐ 焦点选手/队伍</span><div class="flex flex-wrap gap-2 mt-2">' + highlightsHtml + '</div></div>' : '') +
      (scheduleHtml ? '<h4 class="font-semibold mb-2">📋 赛程安排</h4>' + scheduleHtml : '') +
      '<div class="detail-actions mt-4">' +
      '<button class="btn btn-primary" id="eventSubscribeBtn">' + (state.subscribed ? '🔔 已订阅提醒' : '🔔 订阅开赛提醒') + '</button>' +
      (evt.registrationOpen
        ? '<button class="btn btn-secondary" id="eventRegisterBtn">' + (state.registered ? '✅ 已报名' : '📝 立即报名') + '</button>'
        : '<button class="btn btn-secondary" disabled title="暂未开放报名">报名未开放</button>') +
      '<button class="btn btn-secondary" id="eventNewsBtn">📰 相关资讯</button>' +
      '</div>';

    $('#eventDetailTitle').text(evt.name);
    $('#eventDetailBody').html(body);
    Modal.open('eventDetailModal');
  }

  /** 球员是否已关注 */
  function isPlayerFollowed(playerId) {
    var user = Auth.getCurrentUser();
    return user ? Interaction.isPlayerFollowed(user.id, playerId) : false;
  }

  /** 格式化退役/现役状态 */
  function formatPlayerCareerStatus(p) {
    if (p.status === 'retired' && p.retiredAt) {
      return { text: '已于 ' + p.retiredAt + ' 退役', cls: 'player-status-retired' };
    }
    if (p.plannedRetirement) {
      return { text: '现役 · 预计 ' + p.plannedRetirement + ' 退役', cls: 'player-status-active' };
    }
    return { text: '现役', cls: 'player-status-active' };
  }

  /** 列表用简短个人信息 */
  function formatPlayerProfileBrief(p) {
    var prof = p.profile || {};
    var parts = [];
    if (p.age) parts.push(p.age + '岁');
    if (prof.height) parts.push(prof.height);
    if (prof.handedness) parts.push(prof.handedness);
    if (prof.debutYear) parts.push(prof.debutYear + '年出道');
    return parts.join(' · ');
  }

  /** 渲染高光时刻 HTML */
  function renderHighlightsHtml(highlights) {
    if (!highlights || !highlights.length) return '';
    var html = '<div class="player-highlights">';
    highlights.forEach(function (h) {
      html += '<div class="player-highlight-item">';
      html += '<div class="player-highlight-date">' + h.date + '</div>';
      html += '<div class="player-highlight-dot"></div>';
      html += '<div class="player-highlight-content">';
      html += '<div class="font-semibold text-mint-dark">🏆 ' + h.title + '</div>';
      html += '<div class="text-xs text-gray-500 mt-0.5">' + h.event + '</div>';
      html += '<p class="text-sm text-gray-600 mt-1">' + h.desc + '</p>';
      html += '</div></div>';
    });
    html += '</div>';
    return html;
  }

  /** 渲染相关文章 HTML */
  function renderPlayerArticlesHtml(articles, playerId) {
    if (!articles || !articles.length) return '';
    var html = '<div class="player-articles">';
    articles.forEach(function (a) {
      html += '<div class="player-article-card cursor-pointer" data-player-id="' + playerId + '" data-article-id="' + a.id + '">';
      html += '<h5 class="font-semibold text-sm">' + a.title + '</h5>';
      html += '<p class="text-xs text-gray-500 mt-1 line-clamp-2">' + a.summary + '</p>';
      html += '<div class="text-xs text-gray-400 mt-2">' + a.source + ' · ' + a.date + '</div>';
      html += '<span class="text-xs text-mint-dark mt-1 inline-block">阅读全文 →</span>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /** 打开球员文章 */
  function showPlayerArticle(playerId, articleId) {
    var p = (Storage.get('playerStats') || []).find(function (x) { return x.id === playerId; });
    if (!p || !p.articles) return;
    var art = p.articles.find(function (a) { return a.id === articleId; });
    if (!art) return;
    currentPlayerArticleId = articleId;
    $('#playerArticleTitle').text(art.title);
    $('#playerArticleBody').html(
      '<div class="text-sm text-gray-500 mb-4">' + art.source + ' · ' + art.date + ' · 关于 ' + p.name + '</div>' +
      '<p class="text-gray-600 text-sm mb-4 p-3 bg-gray-50 rounded-lg">' + art.summary + '</p>' +
      '<div class="text-gray-700 leading-relaxed">' + art.content + '</div>' +
      '<button class="btn btn-sm btn-secondary mt-4" id="backToPlayerBtn">← 返回球员档案</button>'
    );
    Modal.open('playerArticleModal');
  }

  /* ========== 渲染球员战绩 ========== */
  function renderPlayerStats() {
    var stats = Storage.get('playerStats') || [];
    if (playerFilter !== 'all') {
      if (playerFilter === '双打') {
        stats = stats.filter(function (p) { return p.category === '男双' || p.category === '混双'; });
      } else {
        stats = stats.filter(function (p) { return p.category === playerFilter; });
      }
    }
    stats = stats.slice().sort(function (a, b) { return a.rank - b.rank; });
    if (!stats.length) {
      $('#playerStatsList').html('<div class="empty-state py-6"><p class="text-gray-400 text-sm">暂无该分类球员</p></div>');
      return;
    }
    var html = '';
    stats.forEach(function (p, i) {
      var rankClass = i < 3 ? ' top' + (i + 1) : '';
      var followed = isPlayerFollowed(p.id);
      var winRate = p.winRate || Math.round(p.wins / (p.wins + p.losses) * 100);
      var career = formatPlayerCareerStatus(p);
      var brief = formatPlayerProfileBrief(p);
      var itemCls = p.status === 'retired' ? ' player-item-retired' : '';
      html += '<div class="list-item player-item' + itemCls + '" data-id="' + p.id + '">';
      html += '<span class="list-rank' + rankClass + '">' + p.rank + '</span>';
      html += '<div class="flex-1 min-w-0">';
      html += '<div class="font-semibold flex items-center gap-2 flex-wrap">';
      html += '<span>' + p.name + '</span>';
      if (p.status === 'retired') html += '<span class="badge badge-gray text-xs">已退役</span>';
      if (followed) html += '<span class="text-xs text-mint-dark">★ 已关注</span>';
      html += '</div>';
      html += '<div class="text-sm text-gray-500">' + p.country + ' · ' + (p.category || '') + ' · 胜' + p.wins + ' 负' + p.losses + '</div>';
      if (brief) html += '<div class="text-xs text-gray-500 mt-0.5">' + brief + '</div>';
      html += '<div class="text-xs mt-1 ' + career.cls + '">' + career.text + '</div>';
      if (p.highlights && p.highlights.length) {
        html += '<div class="text-xs text-mint-dark mt-1 truncate">🏆 ' + p.highlights[0].title + ' · ' + p.highlights[0].event + '</div>';
      }
      if (p.articles && p.articles.length) {
        html += '<div class="text-xs text-gray-400 mt-0.5">📄 ' + p.articles.length + ' 篇相关文章</div>';
      }
      html += '<div class="win-rate-bar mt-1"><div class="win-rate-fill" style="width:' + winRate + '%"></div></div>';
      html += '<div class="text-xs text-gray-400 mt-1">胜率 ' + winRate + '%' + (p.points ? ' · 积分 ' + p.points.toLocaleString() : '') + '</div>';
      html += '</div>';
      html += '<button class="btn btn-sm btn-secondary player-follow-btn" data-id="' + p.id + '">' + (followed ? '已关注' : '+ 关注') + '</button>';
      html += '</div>';
    });
    $('#playerStatsList').html(html);
  }

  /** 球员详情弹窗 */
  function showPlayerDetail(playerId) {
    currentPlayerId = playerId;
    var p = (Storage.get('playerStats') || []).find(function (x) { return x.id === playerId; });
    if (!p) return;
    var followed = isPlayerFollowed(playerId);
    var winRate = p.winRate || Math.round(p.wins / (p.wins + p.losses) * 100);
    var prof = p.profile || {};
    var career = formatPlayerCareerStatus(p);

    var matchesHtml = '';
    if (p.recentMatches && p.recentMatches.length) {
      matchesHtml = '<table class="detail-table"><thead><tr><th>日期</th><th>赛事</th><th>对手</th><th>比分</th><th>结果</th></tr></thead><tbody>';
      p.recentMatches.forEach(function (m) {
        var resultCls = m.result === '胜' ? 'text-green-600' : 'text-red-500';
        matchesHtml += '<tr><td>' + m.date + '</td><td>' + m.event + '</td><td>' + m.opponent + '</td><td>' + m.score + '</td><td class="' + resultCls + ' font-semibold">' + m.result + '</td></tr>';
      });
      matchesHtml += '</tbody></table>';
    }

    var profileHtml = '<h4 class="font-semibold mb-2 mt-2">👤 个人信息</h4>' +
      '<div class="detail-info-grid player-profile-grid">' +
      (prof.birthDate ? '<div><span class="detail-label">🎂 出生日期</span><p>' + prof.birthDate + '</p></div>' : '') +
      (prof.birthplace ? '<div><span class="detail-label">📍 籍贯</span><p>' + prof.birthplace + '</p></div>' : '') +
      (p.age ? '<div><span class="detail-label">年龄</span><p>' + p.age + ' 岁</p></div>' : '') +
      (prof.height ? '<div><span class="detail-label">身高</span><p>' + prof.height + '</p></div>' : '') +
      (prof.weight ? '<div><span class="detail-label">体重</span><p>' + prof.weight + '</p></div>' : '') +
      (prof.handedness ? '<div><span class="detail-label">持拍</span><p>' + prof.handedness + '</p></div>' : '') +
      (prof.coach ? '<div><span class="detail-label">教练</span><p>' + prof.coach + '</p></div>' : '') +
      (prof.debutYear ? '<div><span class="detail-label">出道年份</span><p>' + prof.debutYear + ' 年</p></div>' : '') +
      '</div>';

    var careerHtml = '<h4 class="font-semibold mb-2 mt-4">📅 职业生涯</h4>' +
      '<div class="player-career-box ' + career.cls + '">' +
      '<p class="font-semibold">' + career.text + '</p>' +
      (p.status === 'retired' && p.retiredAt ? '<p class="text-sm mt-1 opacity-90">退役时间：' + p.retiredAt + '</p>' : '') +
      (p.status === 'active' && p.plannedRetirement ? '<p class="text-sm mt-1 opacity-90">预计退役：' + p.plannedRetirement + '</p>' : '') +
      (p.status === 'active' && !p.plannedRetirement ? '<p class="text-sm mt-1 opacity-90">暂无公开退役计划</p>' : '') +
      '</div>';

    var highlightsHtml = '';
    if (p.highlights && p.highlights.length) {
      highlightsHtml = '<h4 class="font-semibold mb-2 mt-4">✨ 高光时刻</h4>' + renderHighlightsHtml(p.highlights);
    }

    var articlesHtml = '';
    if (p.articles && p.articles.length) {
      articlesHtml = '<h4 class="font-semibold mb-2 mt-4">📄 相关文章</h4>' + renderPlayerArticlesHtml(p.articles, p.id);
    }

    var body = '<div class="detail-meta-row">' +
      '<span class="badge badge-hot">排名 #' + p.rank + '</span>' +
      (p.worldRank ? '<span class="badge badge-mint">世界排名 #' + p.worldRank + '</span>' : '') +
      (p.status === 'retired' ? '<span class="badge badge-gray">已退役</span>' : '<span class="badge badge-mint">现役</span>') +
      '<span class="badge badge-gray">' + p.category + '</span>' +
      '<span class="badge badge-gray">' + p.country + '</span>' +
      '</div>' +
      (prof.bio ? '<p class="text-gray-600 text-sm leading-relaxed my-3 p-3 bg-gray-50 rounded-lg">' + prof.bio + '</p>' : '') +
      profileHtml +
      careerHtml +
      '<h4 class="font-semibold mb-2 mt-4">📊 本赛季数据</h4>' +
      '<div class="detail-info-grid">' +
      '<div><span class="detail-label">战绩</span><p>胜 ' + p.wins + ' / 负 ' + p.losses + '</p></div>' +
      '<div><span class="detail-label">胜率</span><p>' + winRate + '%</p></div>' +
      (p.points ? '<div><span class="detail-label">积分</span><p>' + p.points.toLocaleString() + '</p></div>' : '') +
      (p.titles2025 !== undefined ? '<div><span class="detail-label">2025冠军</span><p>' + p.titles2025 + ' 个</p></div>' : '') +
      '</div>' +
      '<div class="win-rate-bar win-rate-bar-lg my-4"><div class="win-rate-fill" style="width:' + winRate + '%"></div></div>' +
      highlightsHtml +
      articlesHtml +
      (matchesHtml ? '<h4 class="font-semibold mb-2 mt-4">🎾 近期比赛</h4>' + matchesHtml : '') +
      '<div class="detail-actions mt-4">' +
      '<button class="btn btn-primary" id="playerFollowBtn">' + (followed ? '★ 已关注球员' : '+ 关注球员') + '</button>' +
      '<button class="btn btn-secondary" id="playerCompareBtn">📊 对比战绩</button>' +
      '</div>';

    $('#playerDetailTitle').text(p.name + ' · 球员档案');
    $('#playerDetailBody').html(body);
    Modal.open('playerDetailModal');
  }


  /* ========== 渲染资讯列表 ========== */
  function renderNews(category) {
    let news = Storage.get('news') || [];
    if (category && category !== 'all') {
      news = news.filter(function (n) { return n.category === category; });
    }
    let html = '';
    news.forEach(function (n) {
      var cover = n.videoPoster || n.image || '';
      var isVideo = n.type === 'video' || n.videoUrl;
      html += '<div class="card news-card cursor-pointer" data-id="' + n.id + '">';
      html += '<div class="news-card-cover relative">';
      html += '<img src="' + cover + '" alt="' + n.title + '" class="w-full h-40 object-cover"';
      if (n.bvid) {
        html += ' data-bili-poster data-bili-bvid="' + n.bvid + '" data-bili-page="' + (n.page || 1) + '"';
      }
      html += '>';
      if (isVideo) {
        html += '<span class="news-play-badge">▶ 视频</span>';
        if (n.duration) html += '<span class="news-duration-badge">' + n.duration + '</span>';
      } else if (n.type === 'article') {
        html += '<span class="news-article-badge">📄 已发布</span>';
      }
      html += '</div>';
      html += '<div class="card-body">';
      html += '<span class="badge badge-mint">' + n.category + '</span>';
      if (isVideo) html += ' <span class="badge badge-gray">视频资讯</span>';
      else if (n.type === 'article') html += ' <span class="badge badge-gray">图文</span>';
      html += '<h3 class="font-semibold mt-2 mb-1">' + n.title + '</h3>';
      html += '<p class="text-sm text-gray-500 line-clamp-2">' + n.summary + '</p>';
      html += '<div class="text-xs text-gray-400 mt-2">' + n.date;
      if (n.author) html += ' · ' + n.author;
      if (n.readMinutes) html += ' · 约' + n.readMinutes + '分钟';
      else if (n.coach) html += ' · ' + n.coach;
      html += '</div></div></div>';
    });
    $('#newsGrid').html(html);
    if (window.VideoLib && window.VideoLib.refreshDomPosters) {
      window.VideoLib.refreshDomPosters($('#newsGrid'));
    }
  }

  /* ========== 资讯详情 ========== */
  function showNewsDetail(newsId) {
    const news = (Storage.get('news') || []).find(function (n) { return n.id === newsId; });
    if (!news) return;
    var cover = news.videoPoster || news.image || '';
    var bodyHtml = '';
    if (news.type === 'video' && news.videoUrl && window.VideoLib) {
      bodyHtml += window.VideoLib.renderPlayerHtml(news, { height: 360 });
    } else if (cover) {
      bodyHtml += '<img src="' + cover + '" class="w-full h-48 object-cover rounded-lg mb-4" alt="' + news.title + '">';
    }
    bodyHtml += '<div class="flex gap-2 mb-4 flex-wrap items-center">';
    bodyHtml += '<span class="badge badge-mint">' + news.category + '</span>';
    if (news.type === 'video') bodyHtml += '<span class="badge badge-gray">视频资讯</span>';
    else if (news.type === 'article') bodyHtml += '<span class="badge badge-gray">已发布文章</span>';
    bodyHtml += '<span class="text-sm text-gray-500">' + news.date + '</span></div>';
    if (news.type === 'article') {
      bodyHtml += '<div class="news-article-meta text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">';
      if (news.author) bodyHtml += '<span class="mr-4">✍️ ' + news.author + '</span>';
      if (news.source) bodyHtml += '<span class="mr-4">📰 来源：' + news.source + '</span>';
      if (news.readMinutes) bodyHtml += '<span>⏱ 阅读约 ' + news.readMinutes + ' 分钟</span>';
      bodyHtml += '</div>';
      var paragraphs = (news.content || news.summary || '').split('\n\n');
      paragraphs.forEach(function (p) {
        if (p.trim()) bodyHtml += '<p class="text-gray-700 leading-relaxed mb-4">' + p.trim() + '</p>';
      });
    } else {
      bodyHtml += '<p class="text-gray-700 leading-relaxed">' + (news.content || news.summary) + '</p>';
    }
    if (news.watchUrl) {
      bodyHtml += '<a href="' + news.watchUrl + '" target="_blank" rel="noopener" class="btn btn-sm btn-secondary mt-4 inline-block">↗ 在 B 站打开</a>';
    }
    $('#newsDetailTitle').text(news.title);
    $('#newsDetailBody').html(bodyHtml);
    Modal.open('newsDetailModal');
  }

  /* ========== 侧边栏滚动定位 ========== */
  function bindSidebar() {
    window.BadmintonApp.Navigation.renderSidebar(SIDEBAR_ITEMS, 'overview');
    $(document).on('click', '.sidebar-item', function () {
      const id = $(this).data('sidebar-id');
      $('.sidebar-item').removeClass('active');
      $(this).addClass('active');
      const map = {
        overview: '#bannerSection',
        events: '#eventsList',
        videos: '#hotVideosList',
        news: '#newsGrid'
      };
      const target = map[id];
      if (target) {
        $('html, body').animate({ scrollTop: $(target).offset().top - 80 }, 400);
      }
    });
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    /* 资讯分类筛选 */
    $(document).on('click', '#newsFilter .filter-chip', function () {
      $('#newsFilter .filter-chip').removeClass('active');
      $(this).addClass('active');
      renderNews($(this).data('category'));
    });

    /* 资讯卡片点击 */
    $(document).on('click', '.news-card', function () {
      showNewsDetail($(this).data('id'));
    });

    /* 反馈按钮 */
    $('#feedbackBtn').on('click', function () {
      Modal.open('feedbackModal');
    });

    /* 热门视频播放 */
    $(document).on('click', '.hot-video-item', function (e) {
      if ($(e.target).closest('.hot-video-analyze').length) return;
      showHotVideo($(this).data('id'));
    });

    /* 跳转 AI 分析 */
    $(document).on('click', '.hot-video-analyze', function (e) {
      e.stopPropagation();
      const id = $(this).data('id');
      const v = (Storage.get('hotVideos') || []).find(function (x) { return x.id === id; });
      if (v && v.videoUrl) {
        sessionStorage.setItem('pendingVideoUrl', v.watchUrl || v.videoUrl);
        sessionStorage.setItem('pendingVideoTitle', v.title);
        sessionStorage.setItem('pendingVideoType', v.videoType || 'bilibili');
        window.location.href = 'video-analysis.html';
      }
    });

    /* 关闭视频弹窗 */
    $(document).on('click', '#hotVideoModal .modal-close', function () {
      $('#hotVideoPlayerWrap').empty();
    });

    /* 赛事筛选 */
    $(document).on('click', '#eventFilter .card-mini-tab', function () {
      $('#eventFilter .card-mini-tab').removeClass('active');
      $(this).addClass('active');
      eventFilter = $(this).data('filter');
      renderEvents();
    });

    /* 球员筛选 */
    $(document).on('click', '#playerFilter .card-mini-tab', function () {
      $('#playerFilter .card-mini-tab').removeClass('active');
      $(this).addClass('active');
      playerFilter = $(this).data('filter');
      renderPlayerStats();
    });

    /* 赛事点击 → 详情 */
    $(document).on('click', '.event-item', function () {
      showEventDetail($(this).data('id'));
    });

    /* 球员点击 → 详情（排除关注按钮） */
    $(document).on('click', '.player-item', function (e) {
      if ($(e.target).closest('.player-follow-btn').length) return;
      showPlayerDetail($(this).data('id'));
    });

    /* 列表内关注球员 */
    $(document).on('click', '.player-follow-btn', function (e) {
      e.stopPropagation();
      if (!Auth.requireLogin()) return;
      Interaction.togglePlayerFollow(Auth.getCurrentUser().id, $(this).data('id'));
      renderPlayerStats();
    });

    /* 赛事订阅 */
    $(document).on('click', '#eventSubscribeBtn', function () {
      if (!Auth.requireLogin()) return;
      Interaction.toggleEventSubscribe(Auth.getCurrentUser().id, currentEventId);
      showEventDetail(currentEventId);
      renderEvents();
    });

    /* 赛事报名 */
    $(document).on('click', '#eventRegisterBtn', function () {
      if (!Auth.requireLogin()) return;
      var evt = (Storage.get('events') || []).find(function (e) { return e.id === currentEventId; });
      if (!evt || !evt.registrationOpen) {
        Toast.show('该赛事暂未开放报名', 'warning');
        return;
      }
      if (Interaction.isEventRegistered(Auth.getCurrentUser().id, currentEventId)) {
        Toast.show('您已报名该赛事', 'info');
        return;
      }
      Interaction.registerEvent(Auth.getCurrentUser().id, currentEventId);
      showEventDetail(currentEventId);
      renderEvents();
    });

    /* 赛事相关资讯 */
    $(document).on('click', '#eventNewsBtn', function () {
      Modal.close('eventDetailModal');
      var keyword = ($('#eventDetailTitle').text() || '').replace('2026', '').substring(0, 4);
      renderNews('行业新闻');
      $('#newsFilter .filter-chip').removeClass('active');
      $('#newsFilter .filter-chip[data-category="行业新闻"]').addClass('active');
      Toast.show('已筛选相关赛事资讯', 'info');
      $('html, body').animate({ scrollTop: $('#newsGrid').offset().top - 80 }, 400);
    });

    /* 球员关注（详情页） */
    $(document).on('click', '#playerFollowBtn', function () {
      if (!Auth.requireLogin()) return;
      Interaction.togglePlayerFollow(Auth.getCurrentUser().id, currentPlayerId);
      showPlayerDetail(currentPlayerId);
      renderPlayerStats();
    });

    /* 球员文章阅读 */
    $(document).on('click', '.player-article-card', function (e) {
      e.stopPropagation();
      showPlayerArticle($(this).data('player-id'), $(this).data('article-id'));
    });

    $(document).on('click', '#backToPlayerBtn', function () {
      Modal.close('playerArticleModal');
      if (currentPlayerId) showPlayerDetail(currentPlayerId);
    });

    /* 球员战绩对比 */
    $(document).on('click', '#playerCompareBtn', function () {
      var all = Storage.get('playerStats') || [];
      var current = all.find(function (p) { return p.id === currentPlayerId; });
      if (!current) return;
      var sameCat = all.filter(function (p) {
        return p.id !== current.id && p.category === current.category;
      }).slice(0, 3);
      if (!sameCat.length) {
        Toast.show('暂无同项目球员可对比', 'info');
        return;
      }
      var msg = '【' + current.name + '】vs 同项目：\n';
      sameCat.forEach(function (p) {
        var wr = p.winRate || Math.round(p.wins / (p.wins + p.losses) * 100);
        msg += p.name + '：胜' + p.wins + '负' + p.losses + ' 胜率' + wr + '%\n';
      });
      Toast.show(msg.replace(/\n/g, ' | '), 'info');
    });
  }

  /* ========== 页面初始化 ========== */
  $(document).ready(function () {
    renderCarousel();
    renderQuickEntries();
    renderEvents();
    renderPlayerStats();
    renderHotVideos();
    renderNews('all');
    bindSidebar();
    bindEvents();
    initScalableCards();
    if (window.VideoLib && window.VideoLib.refreshDomPosters) {
      window.VideoLib.refreshDomPosters($('#hotVideosList'));
    }
  });

})(jQuery);
