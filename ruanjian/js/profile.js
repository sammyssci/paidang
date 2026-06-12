/**
 * 个人中心页面逻辑
 * 功能：登录/资料修改、资产展示、数据统计、通知、设置
 */
(function ($) {
  'use strict';

  const { Storage, Auth, Modal, Toast, Utils, Interaction, Navigation } = window.BadmintonApp;

  let currentAssetTab = 'videos';

  const SIDEBAR_ITEMS = [
    { id: 'profile', label: '个人信息', icon: '👤' },
    { id: 'assets', label: '我的资产', icon: '💼' },
    { id: 'stats', label: '数据统计', icon: '📊' },
    { id: 'notifications', label: '我的动态', icon: '🔔' },
    { id: 'settings', label: '设置', icon: '⚙️' }
  ];

  /* ========== 渲染页面 ========== */
  function renderPage() {
    const user = Auth.getCurrentUser();
    if (!user) {
      $('#guestView').show();
      $('#userView').hide();
      return;
    }
    $('#guestView').hide();
    $('#userView').show();
    renderProfileHeader(user);
    renderStats(user);
    renderAssets(user);
    renderNotifications(user);
    $('#changePwdBtn').toggle(!Auth.isGuest(user));
  }

  function renderProfileHeader(user) {
    const avatarContent = user.avatar ?
      '<img src="' + user.avatar + '" alt="avatar">' : '👤';
    let guestBanner = '';
    if (Auth.isGuest(user)) {
      guestBanner = '<div class="guest-tip-banner mt-3">' +
        '🎫 当前为游客身份，收藏与发帖仅保存在本机。' +
        '<button type="button" class="btn btn-sm btn-primary ml-2" id="guestUpgradeBtn">注册账号</button>' +
        '</div>';
    }
    $('#profileHeader').html(
      '<div class="profile-avatar">' + avatarContent + '</div>' +
      '<div class="flex-1">' +
      (Auth.isGuest(user) ? '<span class="badge badge-gray mb-1">游客</span> ' : '') +
      '<h2 class="text-2xl font-bold">' + user.nickname + '</h2>' +
      '<p class="opacity-80">@' + user.username + ' · 球龄 ' + user.ballAge + ' 年 · ' + user.rank + '</p>' +
      '<p class="mt-2 opacity-90">' + (user.bio || '暂无简介') + '</p>' +
      '<div class="flex gap-2 mt-2">' +
      '<span class="badge badge-mint">' + user.style + '</span></div>' +
      guestBanner +
      '</div>' +
      '<button class="btn btn-secondary" id="headerEditBtn">编辑资料</button>'
    );
  }

  function renderStats(user) {
    const s = user.stats || {};
    $('#statsGrid').html(
      '<div class="stat-card"><div class="stat-value">' + (s.analysisCount || 0) + '</div><div class="stat-label">AI分析次数</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (s.postCount || 0) + '</div><div class="stat-label">发帖数量</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (s.likeCount || 0) + '</div><div class="stat-label">获赞总数</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (s.watchMinutes || 0) + '</div><div class="stat-label">观看时长(分)</div></div>'
    );
  }

  /* ========== 渲染资产 ========== */
  function renderAssets(user) {
    let html = '';
    const fav = Interaction.getFavorites(user.id);

    if (currentAssetTab === 'videos') {
      const analyses = Storage.get('videoAnalyses') || [];
      const videoIds = fav.videos || [];
      if (!videoIds.length) {
        html = '<div class="empty-state col-span-3"><div class="empty-state-icon">🎬</div><p>暂无收藏视频</p></div>';
      } else {
        videoIds.forEach(function (vid) {
          const item = analyses.find(function (a) { return a.id === vid; });
          if (item) {
            html += '<div class="card"><div class="card-body">' +
              '<h3 class="font-semibold">' + item.title + '</h3>' +
              '<p class="text-sm text-gray-500 mt-1">动作: ' + item.analysis.actions.join(', ') + '</p>' +
              '<a href="video-analysis.html" class="btn btn-sm btn-primary mt-2">查看</a></div></div>';
          }
        });
      }
    } else if (currentAssetTab === 'tactics') {
      const tactics = Storage.get('tactics') || [];
      const tacticIds = fav.tactics || [];
      if (!tacticIds.length) {
        html = '<div class="empty-state col-span-3"><div class="empty-state-icon">📖</div><p>暂无收藏战术</p></div>';
      } else {
        tacticIds.forEach(function (tid) {
          const t = tactics.find(function (x) { return x.id === tid; });
          if (t) {
            html += '<div class="card"><div class="card-body">' +
              '<h3 class="font-semibold">' + t.title + '</h3>' +
              '<p class="text-sm text-gray-500">' + t.category + ' · ' + t.level + '</p>' +
              '<a href="tactics.html" class="btn btn-sm btn-primary mt-2">查看</a></div></div>';
          }
        });
      }
    } else if (currentAssetTab === 'posts') {
      const posts = (Storage.get('posts') || []).filter(function (p) { return p.authorId === user.id; });
      if (!posts.length) {
        html = '<div class="empty-state col-span-3"><div class="empty-state-icon">💬</div><p>暂无发布的帖子</p></div>';
      } else {
        posts.forEach(function (p) {
          html += '<div class="card"><div class="card-body">' +
            '<h3 class="font-semibold">' + p.title + '</h3>' +
            '<p class="text-sm text-gray-500">👍 ' + p.likes + ' · ' + Utils.formatDate(p.createdAt) + '</p>' +
            '<a href="community.html" class="btn btn-sm btn-primary mt-2">查看</a></div></div>';
        });
      }
    } else if (currentAssetTab === 'analyses') {
      const analyses = (Storage.get('videoAnalyses') || []).filter(function (a) { return a.userId === user.id; });
      if (!analyses.length) {
        html = '<div class="empty-state col-span-3"><div class="empty-state-icon">🎬</div><p>暂无上传的分析视频</p></div>';
      } else {
        analyses.forEach(function (a) {
          html += '<div class="card"><div class="card-body">' +
            '<h3 class="font-semibold">' + a.title + '</h3>' +
            '<p class="text-sm text-gray-500">' + Utils.formatDate(a.createdAt) + '</p>' +
            '<a href="video-analysis.html" class="btn btn-sm btn-primary mt-2">查看</a></div></div>';
        });
      }
    } else if (currentAssetTab === 'history') {
      const analyses = (Storage.get('videoAnalyses') || []).filter(function (a) { return a.userId === user.id; });
      if (!analyses.length) {
        html = '<div class="empty-state col-span-3"><div class="empty-state-icon">📋</div><p>暂无分析记录</p></div>';
      } else {
        analyses.forEach(function (a) {
          html += '<div class="card"><div class="card-body">' +
            '<h3 class="font-semibold">' + a.title + '</h3>' +
            '<p class="text-sm text-gray-500">速度 ' + a.analysis.speed + ' km/h · ' + a.analysis.actions.join(', ') + '</p>' +
            '<p class="text-xs text-gray-400">' + Utils.formatDate(a.createdAt) + '</p></div></div>';
        });
      }
    } else if (currentAssetTab === 'coachings') {
      const bookings = Interaction.getCoachBookings(user.id);
      if (!bookings.length) {
        html = '<div class="empty-state col-span-3"><div class="empty-state-icon">🎯</div><p>暂无教练预约</p>' +
          '<a href="coaching.html" class="btn btn-primary mt-4">去预约</a></div>';
      } else {
        const venues = Storage.get('venues') || [];
        const coaches = Storage.get('coaches') || [];
        const statusMap = { confirmed: '已确认', pending: '待确认', completed: '已完成', cancelled: '已取消' };
        bookings.forEach(function (b) {
          const venue = venues.find(function (v) { return v.id === b.venueId; });
          const coach = coaches.find(function (c) { return c.id === b.coachId; });
          html += '<div class="card booking-record-card"><div class="card-body">' +
            '<div class="flex justify-between items-start">' +
            '<h3 class="font-semibold">' + (coach ? coach.name : '教练') + ' · ' + b.courseType + '</h3>' +
            '<span class="badge badge-mint">' + (statusMap[b.status] || b.status) + '</span></div>' +
            '<p class="text-sm text-gray-500 mt-1">🏸 ' + (venue ? venue.name : '') + '</p>' +
            '<p class="text-sm text-gray-500">📅 ' + b.date + ' ' + b.timeSlot + '</p>' +
            '<p class="text-sm text-mint-dark mt-2">¥' + b.price + '</p>' +
            '<a href="coaching.html" class="btn btn-sm btn-secondary mt-2">查看详情</a></div></div>';
        });
      }
    }
    $('#assetGrid').html(html);
  }

  /* ========== 渲染通知 ========== */
  function renderNotifications(user) {
    const all = Storage.get('notifications') || [];
    const mine = all.filter(function (n) { return n.toUserId === user.id; });
    if (!mine.length) {
      $('#notificationsList').html('<div class="empty-state"><div class="empty-state-icon">🔔</div><p>暂无消息</p></div>');
      return;
    }
    let html = '';
    mine.forEach(function (n) {
      const from = Utils.getUserById(n.fromUserId);
      const unread = n.read ? '' : ' unread';
      html += '<div class="notification-item' + unread + '" data-id="' + n.id + '">' +
        '<div class="text-2xl">' + (n.type === 'like' ? '👍' : n.type === 'comment' ? '💬' : '📢') + '</div>' +
        '<div><strong>' + from.nickname + '</strong> ' + n.content +
        '<div class="text-xs text-gray-400">' + Utils.formatDate(n.createdAt) + '</div></div></div>';
    });
    $('#notificationsList').html(html);

    /* 标记已读 */
    mine.forEach(function (n) { n.read = true; });
    Storage.set('notifications', all);
  }

  /* ========== 打开编辑资料弹窗并填充 ========== */
  function openEditProfile() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    $('#editNickname').val(user.nickname);
    $('#editBallAge').val(user.ballAge);
    $('#editStyle').val(user.style);
    $('#editRank').val(user.rank);
    $('#editBio').val(user.bio);
    Modal.open('profileEditModal');
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    $('#guestLoginBtn').on('click', function () { Modal.open('loginModal'); });
    $('#guestEnterBtn').on('click', function () {
      const user = Auth.guestLogin(false);
      renderPage();
      Navigation.renderNav();
      $(document).trigger('auth:login', [user]);
    });
    $(document).on('click', '#guestUpgradeBtn', function () {
      Modal.open('loginModal');
      $('.form-tab[data-tab="register"]').click();
    });

    $(document).on('click', '#headerEditBtn, #editProfileBtn', openEditProfile);

    /* 资料修改提交 */
    $(document).on('submit', '#profileEditForm', function (e) {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      if (!user) return;
      const updates = {
        nickname: $('#editNickname').val().trim(),
        ballAge: parseInt($('#editBallAge').val()) || 0,
        style: $('#editStyle').val(),
        rank: $('#editRank').val(),
        bio: $('#editBio').val().trim()
      };
      if (!updates.nickname) { Toast.show('昵称不能为空', 'error'); return; }

      const avatarFile = $('#editAvatar')[0].files[0];
      if (avatarFile) {
        Utils.readFileAsDataURL(avatarFile).then(function (dataUrl) {
          updates.avatar = dataUrl;
          Auth.updateProfile(user.id, updates);
          Modal.closeAll();
          Toast.show('资料已更新', 'success');
          renderPage();
          Navigation.renderNav();
        });
      } else {
        Auth.updateProfile(user.id, updates);
        Modal.closeAll();
        Toast.show('资料已更新', 'success');
        renderPage();
        Navigation.renderNav();
      }
    });

    /* Tab 切换 */
    $(document).on('click', '.profile-tab', function () {
      $('.profile-tab').removeClass('active');
      $(this).addClass('active');
      const tab = $(this).data('tab');
      $('#tabAssets, #tabNotifications, #tabSettings').hide();
      if (tab === 'assets') $('#tabAssets').show();
      else if (tab === 'notifications') { $('#tabNotifications').show(); renderNotifications(Auth.getCurrentUser()); }
      else if (tab === 'settings') $('#tabSettings').show();
    });

    /* 资产子Tab */
    $(document).on('click', '[data-asset]', function () {
      $('[data-asset]').removeClass('active');
      $(this).addClass('active');
      currentAssetTab = $(this).data('asset');
      renderAssets(Auth.getCurrentUser());
    });

    /* 修改密码 */
    $('#changePwdBtn').on('click', function () { Modal.open('changePwdModal'); });
    $('#changePwdForm').on('submit', function (e) {
      e.preventDefault();
      const user = Auth.getCurrentUser();
      const oldPwd = $('#oldPassword').val();
      const newPwd = $('#newPassword').val();
      const newPwd2 = $('#newPassword2').val();
      if (!oldPwd || !newPwd) { Toast.show('请填写完整', 'error'); return; }
      if (newPwd.length < 6) { Toast.show('新密码至少6位', 'error'); return; }
      if (newPwd !== newPwd2) { Toast.show('两次密码不一致', 'error'); return; }
      if (Auth.changePassword(user.id, oldPwd, newPwd)) {
        Modal.closeAll();
        $('#changePwdForm')[0].reset();
      }
    });

    /* 清除缓存 */
    $('#clearCacheBtn').on('click', function () {
      if (confirm('确定清除所有本地数据吗？此操作不可恢复！')) {
        Storage.clearAll();
        Auth.logout();
        Toast.show('缓存已清除，数据已重置', 'success');
        renderPage();
        Navigation.renderNav();
      }
    });

    /* 退出登录 */
    $('#logoutBtn').on('click', function () {
      Auth.logout();
      renderPage();
      Navigation.renderNav();
    });

    /* 侧边栏 */
    $(document).on('click', '.sidebar-item', function () {
      const id = $(this).data('sidebar-id');
      $('.sidebar-item').removeClass('active');
      $(this).addClass('active');
      if (id === 'profile') window.scrollTo({ top: 0, behavior: 'smooth' });
      else if (id === 'assets') { $('.profile-tab[data-tab="assets"]').click(); }
      else if (id === 'stats') { $('html, body').animate({ scrollTop: $('#statsGrid').offset().top - 80 }, 400); }
      else if (id === 'notifications') { $('.profile-tab[data-tab="notifications"]').click(); }
      else if (id === 'settings') { $('.profile-tab[data-tab="settings"]').click(); }
    });

    $(document).on('auth:login', function () { renderPage(); });
    $(document).on('auth:logout', function () { renderPage(); });
  }

  $(document).ready(function () {
    Navigation.renderSidebar(SIDEBAR_ITEMS, 'profile');
    bindEvents();
    renderPage();
  });

})(jQuery);
