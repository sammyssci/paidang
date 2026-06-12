/**
 * 羽毛球综合服务网站 - 公共 JavaScript
 * 功能：localStorage 模拟数据库、用户认证、弹窗组件、Toast 提示、导航渲染
 */

(function ($) {
  'use strict';

  /* ========== 常量配置 ========== */
  const STORAGE_KEY = 'badminton_site_db';
  const SESSION_KEY = 'badminton_current_user';
  const DATA_VERSION_KEY = 'badminton_data_version';
  const CURRENT_DATA_VERSION = '4.9'; /* v4.9: 球馆实景封面图 */

  const NAV_ITEMS = [
    { id: 'home', label: '首页', href: 'index.html', icon: '🏠' },
    { id: 'video', label: '视频AI分析', href: 'video-analysis.html', icon: '🎬' },
    { id: 'coaching', label: '教练指导', href: 'coaching.html', icon: '🎯' },
    { id: 'tactics', label: '战术洞察库', href: 'tactics.html', icon: '📖' },
    { id: 'community', label: '羽毛球圈子', href: 'community.html', icon: '💬' },
    { id: 'profile', label: '个人中心', href: 'profile.html', icon: '👤' }
  ];

  /* ========== 工具函数 ========== */
  const Utils = {
    /** 生成唯一ID */
    generateId: function (prefix) {
      return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    },

    /** 格式化日期 */
    formatDate: function (dateStr) {
      const d = new Date(dateStr);
      const now = new Date();
      const diff = now - d;
      if (diff < 60000) return '刚刚';
      if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
      if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
      if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
      return d.toLocaleDateString('zh-CN');
    },

    /** 获取当前页面标识 */
    getCurrentPage: function () {
      const path = window.location.pathname;
      const file = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
      const map = {
        'index.html': 'home',
        'video-analysis.html': 'video',
        'coaching.html': 'coaching',
        'tactics.html': 'tactics',
        'community.html': 'community',
        'profile.html': 'profile'
      };
      return map[file] || 'home';
    },

    /** 根据用户ID获取用户信息 */
    getUserById: function (userId) {
      const users = Storage.get('users') || [];
      return users.find(function (u) { return u.id === userId; }) || { nickname: '匿名用户', id: userId };
    },

    /** 表单简单校验 */
    validate: function (rules) {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const val = rule.el.val ? rule.el.val().trim() : rule.el;
        if (rule.required && !val) {
          Toast.show(rule.message || '请填写必填项', 'error');
          return false;
        }
        if (rule.minLength && val.length < rule.minLength) {
          Toast.show(rule.message || '长度不足', 'error');
          return false;
        }
        if (rule.pattern && !rule.pattern.test(val)) {
          Toast.show(rule.message || '格式不正确', 'error');
          return false;
        }
        if (rule.custom && !rule.custom(val)) {
          return false;
        }
      }
      return true;
    },

    /** 读取文件为 Base64（用于图片/小视频上传） */
    readFileAsDataURL: function (file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) { resolve(e.target.result); };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  };

  /* ========== localStorage 数据库模拟 ========== */
  const Storage = {
    /** 获取完整数据库 */
    getDB: function () {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error('数据解析失败，重新初始化');
        }
      }
      return null;
    },

    /** 初始化数据库（首次访问 / 视频库版本升级） */
    init: function () {
      const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
      const db = this.getDB();

      if (!db) {
        const initialData = JSON.parse(JSON.stringify(window.MOCK_DATA));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
        console.log('[Storage] 数据库已初始化，写入模拟数据');
        return;
      }

      /* 视频库升级：刷新所有内置视频链接为专业 CDN 资源 */
      if (storedVersion !== CURRENT_DATA_VERSION) {
        if (window.VideoLib) {
          window.VideoLib.migrateVideos(db);
          if (window.VideoLib.migrateCommunity) {
            window.VideoLib.migrateCommunity(db);
          }
        }
        var fresh = JSON.parse(JSON.stringify(window.MOCK_DATA));
        db.events = fresh.events;
        db.playerStats = fresh.playerStats;
        db.news = fresh.news;
        db.venues = fresh.venues;
        db.coaches = fresh.coaches;
        db.banners = fresh.banners;
        if (!db.coachBookings) {
          db.coachBookings = fresh.coachBookings;
        }
        if (!db.homeInteractions) {
          db.homeInteractions = fresh.homeInteractions;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
        console.log('[Storage] 已升级至 v' + CURRENT_DATA_VERSION + '：数据已更新');
      }
    },

    /** 获取某个字段 */
    get: function (key) {
      const db = this.getDB();
      return db ? db[key] : null;
    },

    /** 设置某个字段并保存 */
    set: function (key, value) {
      const db = this.getDB() || {};
      db[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    },

    /** 更新整个数据库 */
    saveDB: function (db) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    },

    /** 清除所有本地数据 */
    clearAll: function () {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(DATA_VERSION_KEY);
      if (window.VideoStorage) {
        window.VideoStorage.clearAll().finally(function () {
          Storage.init();
        });
      } else {
        this.init();
      }
    }
  };

  /* ========== Toast 提示组件 ========== */
  const Toast = {
    show: function (message, type) {
      type = type || 'info';
      let container = $('.toast-container');
      if (!container.length) {
        container = $('<div class="toast-container"></div>').appendTo('body');
      }
      const toast = $('<div class="toast ' + type + '">' + message + '</div>');
      container.append(toast);
      setTimeout(function () {
        toast.fadeOut(300, function () { $(this).remove(); });
      }, 3000);
    }
  };

  /* ========== 弹窗组件 ========== */
  const Modal = {
    /** 打开弹窗 */
    open: function (modalId) {
      $('#' + modalId).addClass('show');
      $('body').css('overflow', 'hidden');
    },

    /** 关闭弹窗 */
    close: function (modalId) {
      $('#' + modalId).removeClass('show');
      $('body').css('overflow', '');
    },

    /** 关闭所有弹窗 */
    closeAll: function () {
      $('.modal-overlay').removeClass('show');
      $('body').css('overflow', '');
    },

    /** 初始化弹窗事件（关闭按钮、遮罩点击） */
    init: function () {
      $(document).on('click', '.modal-close, [data-modal-close]', function () {
        Modal.closeAll();
      });
      $(document).on('click', '.modal-overlay', function (e) {
        if ($(e.target).hasClass('modal-overlay')) {
          Modal.closeAll();
        }
      });
    }
  };

  /* ========== 用户认证模块 ========== */
  const Auth = {
    /** 获取当前登录用户 */
    getCurrentUser: function () {
      const userId = localStorage.getItem(SESSION_KEY);
      if (!userId) return null;
      const users = Storage.get('users') || [];
      return users.find(function (u) { return u.id === userId; }) || null;
    },

    /** 是否为游客账号 */
    isGuest: function (user) {
      user = user || this.getCurrentUser();
      return !!(user && user.isGuest);
    },

    /** 游客一键登录（无需注册） */
    guestLogin: function (silent) {
      const suffix = Math.random().toString(36).substr(2, 6);
      const newUser = {
        id: Utils.generateId('guest'),
        username: 'guest_' + suffix,
        password: '',
        nickname: '游客' + suffix,
        isGuest: true,
        avatar: '',
        ballAge: 0,
        style: '全能型',
        rank: '业余初级',
        bio: '临时游客身份，注册账号后可永久保存收藏与记录',
        stats: { analysisCount: 0, postCount: 0, likeCount: 0, watchMinutes: 0 },
        createdAt: new Date().toISOString()
      };
      const users = Storage.get('users') || [];
      users.push(newUser);
      Storage.set('users', users);
      localStorage.setItem(SESSION_KEY, newUser.id);
      if (!silent) {
        Toast.show('已以游客身份进入，欢迎 ' + newUser.nickname + '！', 'success');
      }
      return newUser;
    },

    /** 确保有登录会话（无会话时自动游客登录） */
    ensureSession: function () {
      if (!this.getCurrentUser()) {
        return this.guestLogin(true);
      }
      return this.getCurrentUser();
    },

    /** 登录 */
    login: function (username, password) {
      const users = Storage.get('users') || [];
      const user = users.find(function (u) {
        return u.username === username && u.password === password;
      });
      if (user) {
        localStorage.setItem(SESSION_KEY, user.id);
        Toast.show('登录成功，欢迎 ' + user.nickname + '！', 'success');
        return user;
      }
      Toast.show('用户名或密码错误', 'error');
      return null;
    },

    /** 注册 */
    register: function (data) {
      const users = Storage.get('users') || [];
      if (users.find(function (u) { return u.username === data.username; })) {
        Toast.show('用户名已存在', 'error');
        return null;
      }
      const newUser = {
        id: Utils.generateId('user'),
        username: data.username,
        password: data.password,
        nickname: data.nickname || data.username,
        avatar: '',
        ballAge: 0,
        style: '全能型',
        rank: '业余初级',
        bio: '',
        stats: { analysisCount: 0, postCount: 0, likeCount: 0, watchMinutes: 0 },
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      Storage.set('users', users);
      localStorage.setItem(SESSION_KEY, newUser.id);
      Toast.show('注册成功！', 'success');
      return newUser;
    },

    /** 退出登录 */
    logout: function () {
      localStorage.removeItem(SESSION_KEY);
      Toast.show('已退出登录', 'success');
    },

    /** 更新用户信息 */
    updateProfile: function (userId, updates) {
      const users = Storage.get('users') || [];
      const idx = users.findIndex(function (u) { return u.id === userId; });
      if (idx === -1) return null;
      Object.assign(users[idx], updates);
      Storage.set('users', users);
      return users[idx];
    },

    /** 修改密码 */
    changePassword: function (userId, oldPwd, newPwd) {
      const users = Storage.get('users') || [];
      const user = users.find(function (u) { return u.id === userId; });
      if (user && user.isGuest) {
        Toast.show('游客账号请注册后再修改密码', 'warning');
        return false;
      }
      if (!user || user.password !== oldPwd) {
        Toast.show('原密码错误', 'error');
        return false;
      }
      user.password = newPwd;
      Storage.set('users', users);
      Toast.show('密码修改成功', 'success');
      return true;
    },

    /** 检查是否登录，未登录则自动游客登录 */
    requireLogin: function () {
      if (!this.getCurrentUser()) {
        this.guestLogin(true);
      }
      return true;
    }
  };

  /* ========== 收藏/点赞模块 ========== */
  const Interaction = {
    /** 获取用户收藏键名 */
    _favKey: function (userId) {
      return 'fav_' + userId;
    },

    /** 获取收藏列表 */
    getFavorites: function (userId, type) {
      const all = Storage.get('userFavorites') || {};
      const userFav = all[userId] || { videos: [], tactics: [], posts: [] };
      return type ? (userFav[type] || []) : userFav;
    },

    /** 切换收藏 */
    toggleFavorite: function (userId, type, itemId) {
      const all = Storage.get('userFavorites') || {};
      if (!all[userId]) all[userId] = { videos: [], tactics: [], posts: [] };
      const list = all[userId][type] || [];
      const idx = list.indexOf(itemId);
      if (idx > -1) {
        list.splice(idx, 1);
        Toast.show('已取消收藏', 'info');
      } else {
        list.push(itemId);
        Toast.show('收藏成功', 'success');
      }
      all[userId][type] = list;
      Storage.set('userFavorites', all);
      return list.indexOf(itemId) > -1;
    },

    /** 是否已收藏 */
    isFavorited: function (userId, type, itemId) {
      const fav = this.getFavorites(userId, type);
      return fav.indexOf(itemId) > -1;
    },

    /** 首页交互数据 */
    _home: function () {
      return Storage.get('homeInteractions') || { eventSubscriptions: {}, eventRegistrations: {}, playerFollows: {} };
    },

    _saveHome: function (data) {
      Storage.set('homeInteractions', data);
    },

    /** 赛事订阅提醒 */
    toggleEventSubscribe: function (userId, eventId) {
      var home = this._home();
      if (!home.eventSubscriptions[userId]) home.eventSubscriptions[userId] = [];
      var list = home.eventSubscriptions[userId];
      var idx = list.indexOf(eventId);
      if (idx > -1) {
        list.splice(idx, 1);
        Toast.show('已取消赛事提醒', 'info');
      } else {
        list.push(eventId);
        Toast.show('已订阅赛事提醒，开赛前将通知您', 'success');
      }
      this._saveHome(home);
      return list.indexOf(eventId) > -1;
    },

    isEventSubscribed: function (userId, eventId) {
      var home = this._home();
      return (home.eventSubscriptions[userId] || []).indexOf(eventId) > -1;
    },

    /** 赛事报名 */
    registerEvent: function (userId, eventId) {
      var home = this._home();
      if (!home.eventRegistrations[userId]) home.eventRegistrations[userId] = [];
      if (home.eventRegistrations[userId].indexOf(eventId) > -1) {
        Toast.show('您已报名该赛事', 'warning');
        return false;
      }
      home.eventRegistrations[userId].push(eventId);
      this._saveHome(home);
      Toast.show('报名成功！请留意赛程通知', 'success');
      return true;
    },

    isEventRegistered: function (userId, eventId) {
      var home = this._home();
      return (home.eventRegistrations[userId] || []).indexOf(eventId) > -1;
    },

    /** 关注球员 */
    togglePlayerFollow: function (userId, playerId) {
      var home = this._home();
      if (!home.playerFollows[userId]) home.playerFollows[userId] = [];
      var list = home.playerFollows[userId];
      var idx = list.indexOf(playerId);
      if (idx > -1) {
        list.splice(idx, 1);
        Toast.show('已取消关注', 'info');
      } else {
        list.push(playerId);
        Toast.show('已关注球员，战绩更新时将提醒', 'success');
      }
      this._saveHome(home);
      return list.indexOf(playerId) > -1;
    },

    isPlayerFollowed: function (userId, playerId) {
      var home = this._home();
      return (home.playerFollows[userId] || []).indexOf(playerId) > -1;
    },

    /** 教练线下预约 */
    getCoachBookings: function (userId) {
      return (Storage.get('coachBookings') || []).filter(function (b) {
        return b.userId === userId;
      }).sort(function (a, b) {
        return new Date(b.date + 'T' + b.timeSlot.split('-')[0]) - new Date(a.date + 'T' + a.timeSlot.split('-')[0]);
      });
    },

    isSlotBooked: function (coachId, venueId, date, timeSlot) {
      return (Storage.get('coachBookings') || []).some(function (b) {
        return b.coachId === coachId && b.venueId === venueId && b.date === date &&
          b.timeSlot === timeSlot && b.status !== 'cancelled';
      });
    },

    createCoachBooking: function (data) {
      if (this.isSlotBooked(data.coachId, data.venueId, data.date, data.timeSlot)) {
        Toast.show('该时段已被预约，请选择其他时间', 'warning');
        return null;
      }
      var booking = {
        id: Utils.generateId('cb'),
        userId: data.userId,
        venueId: data.venueId,
        coachId: data.coachId,
        date: data.date,
        timeSlot: data.timeSlot,
        courseType: data.courseType,
        duration: data.duration || 1,
        price: data.price,
        status: 'confirmed',
        note: data.note || '',
        contactPhone: data.contactPhone || '',
        createdAt: new Date().toISOString()
      };
      var list = Storage.get('coachBookings') || [];
      list.push(booking);
      Storage.set('coachBookings', list);
      Toast.show('预约成功！请按时到馆上课', 'success');
      return booking;
    },

    cancelCoachBooking: function (bookingId, userId) {
      var list = Storage.get('coachBookings') || [];
      var booking = list.find(function (b) { return b.id === bookingId && b.userId === userId; });
      if (!booking) {
        Toast.show('预约不存在', 'error');
        return false;
      }
      if (booking.status === 'cancelled') {
        Toast.show('该预约已取消', 'warning');
        return false;
      }
      if (booking.status === 'completed') {
        Toast.show('已完成的课程无法取消', 'warning');
        return false;
      }
      booking.status = 'cancelled';
      Storage.set('coachBookings', list);
      Toast.show('预约已取消', 'info');
      return true;
    },

    /** 帖子点赞 */
    togglePostLike: function (userId, postId) {
      const all = Storage.get('userLikes') || {};
      if (!all[userId]) all[userId] = [];
      const posts = Storage.get('posts') || [];
      const post = posts.find(function (p) { return p.id === postId; });
      if (!post) return;

      const idx = all[userId].indexOf(postId);
      if (idx > -1) {
        all[userId].splice(idx, 1);
        post.likes = Math.max(0, post.likes - 1);
      } else {
        all[userId].push(postId);
        post.likes += 1;
        this._addNotification(post.authorId, userId, 'like', '赞了你的帖子《' + post.title + '》', postId);
      }
      Storage.set('userLikes', all);
      Storage.set('posts', posts);
      return all[userId].indexOf(postId) > -1;
    },

    /** 帖子踩 */
    togglePostDislike: function (userId, postId) {
      const all = Storage.get('userDislikes') || {};
      if (!all[userId]) all[userId] = [];
      const posts = Storage.get('posts') || [];
      const post = posts.find(function (p) { return p.id === postId; });
      if (!post) return;

      const idx = all[userId].indexOf(postId);
      if (idx > -1) {
        all[userId].splice(idx, 1);
        post.dislikes = Math.max(0, post.dislikes - 1);
      } else {
        all[userId].push(postId);
        post.dislikes += 1;
      }
      Storage.set('userDislikes', all);
      Storage.set('posts', posts);
      return all[userId].indexOf(postId) > -1;
    },

    /** 是否已点赞帖子 */
    isPostLiked: function (userId, postId) {
      const all = Storage.get('userLikes') || {};
      return (all[userId] || []).indexOf(postId) > -1;
    },

    /** 添加通知 */
    _addNotification: function (toUserId, fromUserId, type, content, refId) {
      if (toUserId === fromUserId) return;
      const notifications = Storage.get('notifications') || [];
      notifications.unshift({
        id: Utils.generateId('notif'),
        toUserId: toUserId,
        fromUserId: fromUserId,
        type: type,
        content: content,
        refId: refId,
        read: false,
        createdAt: new Date().toISOString()
      });
      Storage.set('notifications', notifications);
    },

    /** 添加评论通知 */
    addCommentNotification: function (toUserId, fromUserId, content, refId) {
      this._addNotification(toUserId, fromUserId, 'comment', content, refId);
    }
  };

  /* ========== 导航栏渲染 ========== */
  const Navigation = {
    /** 渲染顶部导航 */
    renderNav: function () {
      const currentPage = Utils.getCurrentPage();
      const user = Auth.getCurrentUser();

      let navHtml = '<nav class="top-nav">';
      navHtml += '<button type="button" class="nav-toggle" id="navToggle" aria-label="打开菜单">☰</button>';
      navHtml += '<a href="index.html" class="nav-logo">';
      navHtml += '<span class="nav-logo-icon">🏸</span>';
      navHtml += '<span class="nav-logo-text">羽球综合服务平台</span></a>';

      navHtml += '<div class="nav-panel" id="navPanel">';
      navHtml += '<div class="nav-links">';
      NAV_ITEMS.forEach(function (item) {
        const active = item.id === currentPage ? ' active' : '';
        navHtml += '<a href="' + item.href + '" class="nav-link' + active + '">' + item.label + '</a>';
      });
      navHtml += '</div>';

      navHtml += '<div class="nav-actions">';
      if (user) {
        if (Auth.isGuest(user)) {
          navHtml += '<span class="badge badge-gray text-xs mr-1">游客</span>';
        }
        navHtml += '<span class="text-sm text-gray-600 mr-2">👋 ' + user.nickname + '</span>';
        if (Auth.isGuest(user)) {
          navHtml += '<button class="btn btn-sm btn-primary mr-1" id="navRegisterBtn">注册账号</button>';
        }
        navHtml += '<button class="btn btn-sm btn-secondary" id="navLogoutBtn">退出</button>';
      } else {
        navHtml += '<button class="btn btn-sm btn-secondary mr-1" id="navGuestBtn">游客登录</button>';
        navHtml += '<button class="btn btn-sm btn-primary" id="navLoginBtn">登录 / 注册</button>';
      }
      navHtml += '</div></div></nav>';

      $('#topNav').html('<div class="mobile-overlay" id="mobileNavOverlay"></div>' + navHtml);

      $('#navLoginBtn').on('click', function () { Modal.open('loginModal'); });
      $('#navGuestBtn').on('click', function () {
        const user = Auth.guestLogin(false);
        Navigation.renderNav();
        $(document).trigger('auth:login', [user]);
      });
      $('#navRegisterBtn').on('click', function () {
        Modal.open('loginModal');
        $('.form-tab[data-tab="register"]').click();
      });
      $('#navLogoutBtn').on('click', function () {
        Auth.logout();
        Navigation.renderNav();
        $(document).trigger('auth:logout');
      });
    },

    /** 渲染侧边栏 */
    renderSidebar: function (items, activeId) {
      let html = '';
      items.forEach(function (item) {
        const active = item.id === activeId ? ' active' : '';
        html += '<div class="sidebar-item' + active + '" data-sidebar-id="' + item.id + '">';
        html += '<span>' + (item.icon || '') + '</span>';
        html += '<span>' + item.label + '</span></div>';
      });
      $('#sidebar').html(html);
    }
  };

  /* ========== 公共弹窗 HTML 注入 ========== */
  const ModalsHTML = {
    /** 登录/注册弹窗 */
    loginModal: function () {
      return `
      <div class="modal-overlay" id="loginModal">
        <div class="modal">
          <div class="modal-header">
            <h3>登录 / 注册</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-tabs">
              <div class="form-tab active" data-tab="login">登录</div>
              <div class="form-tab" data-tab="register">注册</div>
            </div>
            <!-- 登录表单 -->
            <form id="loginForm">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <input type="text" class="form-input" id="loginUsername" placeholder="测试账号: demo / test">
              </div>
              <div class="form-group">
                <label class="form-label">密码</label>
                <input type="password" class="form-input" id="loginPassword" placeholder="密码: 123456">
              </div>
              <button type="submit" class="btn btn-primary w-full">登录</button>
            </form>
            <div class="auth-divider"><span>或</span></div>
            <button type="button" class="btn btn-secondary w-full" id="modalGuestLoginBtn">🎫 游客一键登录（无需注册）</button>
            <p class="text-xs text-gray-400 text-center mt-3">游客可浏览、收藏、发帖；注册后数据永久保存</p>
            <!-- 注册表单 -->
            <form id="registerForm" style="display:none;">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <input type="text" class="form-input" id="regUsername" placeholder="4-16位字母数字">
              </div>
              <div class="form-group">
                <label class="form-label">昵称</label>
                <input type="text" class="form-input" id="regNickname" placeholder="显示名称">
              </div>
              <div class="form-group">
                <label class="form-label">密码</label>
                <input type="password" class="form-input" id="regPassword" placeholder="至少6位">
              </div>
              <div class="form-group">
                <label class="form-label">确认密码</label>
                <input type="password" class="form-input" id="regPassword2" placeholder="再次输入密码">
              </div>
              <button type="submit" class="btn btn-primary w-full">注册</button>
            </form>
          </div>
        </div>
      </div>`;
    },

    /** 反馈弹窗 */
    feedbackModal: function () {
      return `
      <div class="modal-overlay" id="feedbackModal">
        <div class="modal">
          <div class="modal-header">
            <h3>意见反馈</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="feedbackForm">
              <div class="form-group">
                <label class="form-label">反馈类型</label>
                <select class="form-select" id="feedbackType">
                  <option value="bug">问题反馈</option>
                  <option value="feature">功能建议</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">反馈内容</label>
                <textarea class="form-textarea" id="feedbackContent" placeholder="请详细描述您的反馈..."></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">联系方式（选填）</label>
                <input type="text" class="form-input" id="feedbackContact" placeholder="邮箱或手机号">
              </div>
              <button type="submit" class="btn btn-primary w-full">提交反馈</button>
            </form>
          </div>
        </div>
      </div>`;
    },

    /** 修改资料弹窗 */
    profileEditModal: function () {
      return `
      <div class="modal-overlay" id="profileEditModal">
        <div class="modal">
          <div class="modal-header">
            <h3>修改个人资料</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="profileEditForm">
              <div class="form-group">
                <label class="form-label">昵称</label>
                <input type="text" class="form-input" id="editNickname">
              </div>
              <div class="form-group">
                <label class="form-label">球龄（年）</label>
                <input type="number" class="form-input" id="editBallAge" min="0" max="50">
              </div>
              <div class="form-group">
                <label class="form-label">擅长打法</label>
                <select class="form-select" id="editStyle">
                  <option value="进攻型">进攻型</option>
                  <option value="防守型">防守型</option>
                  <option value="全能型">全能型</option>
                  <option value="网前型">网前型</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">段位</label>
                <select class="form-select" id="editRank">
                  <option value="业余初级">业余初级</option>
                  <option value="业余中级">业余中级</option>
                  <option value="业余高级">业余高级</option>
                  <option value="专业级">专业级</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">个人简介</label>
                <textarea class="form-textarea" id="editBio" rows="3"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">头像（上传图片）</label>
                <input type="file" class="form-input" id="editAvatar" accept="image/*">
              </div>
              <button type="submit" class="btn btn-primary w-full">保存修改</button>
            </form>
          </div>
        </div>
      </div>`;
    },

    /** 发帖弹窗 */
    postModal: function () {
      return `
      <div class="modal-overlay" id="postModal">
        <div class="modal modal-lg">
          <div class="modal-header">
            <h3>发布帖子</h3>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            <form id="postForm">
              <div class="form-group">
                <label class="form-label">帖子类型</label>
                <select class="form-select" id="postType">
                  <option value="text">文字帖</option>
                  <option value="video">视频帖</option>
                  <option value="poll">投票帖</option>
                  <option value="meetup">约球招募帖</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">标题</label>
                <input type="text" class="form-input" id="postTitle" placeholder="请输入帖子标题">
              </div>
              <div class="form-group">
                <label class="form-label">内容</label>
                <textarea class="form-textarea" id="postContent" rows="4" placeholder="请输入帖子内容"></textarea>
              </div>
              <div class="form-group" id="postImageGroup">
                <label class="form-label">上传配图（选填）</label>
                <input type="file" class="form-input" id="postImages" accept="image/*" multiple>
              </div>
              <div class="form-group" id="postVideoGroup" style="display:none;">
                <label class="form-label">视频链接</label>
                <input type="text" class="form-input" id="postVideoUrl" placeholder="粘贴视频URL">
              </div>
              <div id="postPollGroup" style="display:none;">
                <div class="form-group">
                  <label class="form-label">投票选项（每行一个）</label>
                  <textarea class="form-textarea" id="postPollOptions" rows="3" placeholder="选项1&#10;选项2&#10;选项3"></textarea>
                </div>
              </div>
              <div id="postMeetupGroup" style="display:none;">
                <div class="form-group">
                  <label class="form-label">约球时间</label>
                  <input type="datetime-local" class="form-input" id="postMeetupTime">
                </div>
                <div class="form-group">
                  <label class="form-label">地点</label>
                  <input type="text" class="form-input" id="postMeetupLocation" placeholder="体育馆名称">
                </div>
                <div class="form-group">
                  <label class="form-label">招募人数</label>
                  <input type="number" class="form-input" id="postMeetupSpots" min="1" max="20" value="4">
                </div>
              </div>
              <button type="submit" class="btn btn-primary w-full">发布</button>
            </form>
          </div>
        </div>
      </div>`;
    }
  };

  /* ========== 公共弹窗事件绑定 ========== */
  function bindModalEvents() {
    /* 登录/注册 Tab 切换 */
    $(document).on('click', '.form-tab', function () {
      const tab = $(this).data('tab');
      $('.form-tab').removeClass('active');
      $(this).addClass('active');
      if (tab === 'login') {
        $('#loginForm').show();
        $('#registerForm').hide();
      } else {
        $('#loginForm').hide();
        $('#registerForm').show();
      }
    });

    /* 游客登录 */
    $(document).on('click', '#modalGuestLoginBtn', function () {
      const user = Auth.guestLogin(false);
      Modal.closeAll();
      Navigation.renderNav();
      $(document).trigger('auth:login', [user]);
    });

    /* 登录提交 */
    $(document).on('submit', '#loginForm', function (e) {
      e.preventDefault();
      const username = $('#loginUsername').val().trim();
      const password = $('#loginPassword').val().trim();
      if (!Utils.validate([
        { el: { val: function () { return username; } }, required: true, message: '请输入用户名' },
        { el: { val: function () { return password; } }, required: true, message: '请输入密码' }
      ])) return;

      const user = Auth.login(username, password);
      if (user) {
        Modal.closeAll();
        Navigation.renderNav();
        $(document).trigger('auth:login', [user]);
      }
    });

    /* 注册提交 */
    $(document).on('submit', '#registerForm', function (e) {
      e.preventDefault();
      const username = $('#regUsername').val().trim();
      const nickname = $('#regNickname').val().trim();
      const password = $('#regPassword').val().trim();
      const password2 = $('#regPassword2').val().trim();

      if (!Utils.validate([
        { el: { val: function () { return username; } }, required: true, minLength: 4, message: '用户名至少4位' },
        { el: { val: function () { return password; } }, required: true, minLength: 6, message: '密码至少6位' },
        { el: { val: function () { return password; } }, custom: function () {
          if (password !== password2) { Toast.show('两次密码不一致', 'error'); return false; }
          return true;
        }}
      ])) return;

      const user = Auth.register({ username: username, nickname: nickname, password: password });
      if (user) {
        Modal.closeAll();
        Navigation.renderNav();
        $(document).trigger('auth:login', [user]);
      }
    });

    /* 反馈提交 */
    $(document).on('submit', '#feedbackForm', function (e) {
      e.preventDefault();
      const content = $('#feedbackContent').val().trim();
      if (!content) { Toast.show('请填写反馈内容', 'error'); return; }
      const feedbacks = Storage.get('feedbacks') || [];
      feedbacks.push({
        id: Utils.generateId('fb'),
        type: $('#feedbackType').val(),
        content: content,
        contact: $('#feedbackContact').val().trim(),
        createdAt: new Date().toISOString()
      });
      Storage.set('feedbacks', feedbacks);
      Modal.closeAll();
      Toast.show('感谢您的反馈！', 'success');
      $('#feedbackForm')[0].reset();
    });

    /* 发帖类型切换 */
    $(document).on('change', '#postType', function () {
      const type = $(this).val();
      $('#postVideoGroup').toggle(type === 'video');
      $('#postPollGroup').toggle(type === 'poll');
      $('#postMeetupGroup').toggle(type === 'meetup');
      $('#postImageGroup').toggle(type === 'text');
    });
  }

  /* ========== 轮播图组件 ========== */
  const Carousel = {
    init: function (selector) {
      const $carousel = $(selector);
      if (!$carousel.length) return;

      const $inner = $carousel.find('.carousel-inner');
      const $slides = $inner.find('.carousel-slide');
      const slideCount = $slides.length;
      let current = 0;
      let timer = null;

      function goTo(index) {
        current = (index + slideCount) % slideCount;
        $inner.css('transform', 'translateX(-' + (current * 100) + '%)');
        $carousel.find('.carousel-dot').removeClass('active').eq(current).addClass('active');
      }

      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }

      function startAuto() {
        timer = setInterval(next, 4000);
      }
      function stopAuto() {
        clearInterval(timer);
      }

      /* 创建指示点 */
      let dotsHtml = '<div class="carousel-dots">';
      for (let i = 0; i < slideCount; i++) {
        dotsHtml += '<span class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></span>';
      }
      dotsHtml += '</div>';
      $carousel.append(dotsHtml);

      $carousel.append('<button class="carousel-btn prev">&#8249;</button>');
      $carousel.append('<button class="carousel-btn next">&#8250;</button>');

      $carousel.find('.carousel-btn.prev').on('click', function () { stopAuto(); prev(); startAuto(); });
      $carousel.find('.carousel-btn.next').on('click', function () { stopAuto(); next(); startAuto(); });
      $carousel.find('.carousel-dot').on('click', function () {
        stopAuto();
        goTo(parseInt($(this).data('index')));
        startAuto();
      });

      $carousel.find('.carousel-slide').on('click', function () {
        const link = $(this).data('link');
        if (link) window.location.href = link;
      });

      startAuto();
    }
  };

  /* ========== 移动端布局 ========== */
  function initResponsiveLayout() {
    if ($('#sidebar').length && !$('#sidebarToggle').length) {
      $('body').append('<button type="button" class="sidebar-toggle" id="sidebarToggle" aria-label="打开分类">📋</button>');
    }
    if (!$('#mobileSidebarOverlay').length) {
      $('body').append('<div class="mobile-overlay" id="mobileSidebarOverlay"></div>');
    }
  }

  function bindResponsiveEvents() {
    $(document).on('click', '#navToggle', function () {
      $('body').toggleClass('nav-open').removeClass('sidebar-open');
    });
    $(document).on('click', '#mobileNavOverlay', function () {
      $('body').removeClass('nav-open');
    });
    $(document).on('click', '#navPanel .nav-link', function () {
      $('body').removeClass('nav-open');
    });
    $(document).on('click', '#sidebarToggle', function () {
      $('body').toggleClass('sidebar-open').removeClass('nav-open');
    });
    $(document).on('click', '#mobileSidebarOverlay', function () {
      $('body').removeClass('sidebar-open');
    });
    $(document).on('click', '.sidebar-item', function () {
      if (window.innerWidth <= 768) {
        $('body').removeClass('sidebar-open');
      }
    });
    $(window).on('resize.responsive', function () {
      if (window.innerWidth > 768) {
        $('body').removeClass('nav-open sidebar-open');
      }
    });
  }

  /* ========== 全局初始化 ========== */
  function initCommon() {
    Storage.init();
    Auth.ensureSession();
    Modal.init();
    bindModalEvents();
    bindResponsiveEvents();

    /* 注入公共弹窗 */
    if (!$('#loginModal').length) {
      $('body').append(ModalsHTML.loginModal());
      $('body').append(ModalsHTML.feedbackModal());
      $('body').append(ModalsHTML.profileEditModal());
    }

    Navigation.renderNav();
    initResponsiveLayout();
  }

  /* ========== 暴露全局 API ========== */
  window.BadmintonApp = {
    Storage: Storage,
    Auth: Auth,
    Modal: Modal,
    Toast: Toast,
    Utils: Utils,
    Interaction: Interaction,
    Navigation: Navigation,
    Carousel: Carousel,
    ModalsHTML: ModalsHTML,
    NAV_ITEMS: NAV_ITEMS
  };

  /* DOM Ready 时初始化 */
  $(document).ready(initCommon);

})(jQuery);
