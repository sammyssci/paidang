/**
 * 羽毛球圈子（贴吧）页面逻辑
 * 功能：分区切换、发帖、点赞踩、评论、收藏、搜索、排序筛选
 */
(function ($) {
  'use strict';

  const { Storage, Auth, Modal, Toast, Utils, Interaction, ModalsHTML } = window.BadmintonApp;

  let currentForumId = 'forum_1';
  let currentSort = 'hot';
  let searchQuery = '';
  let searchType = 'posts';
  let currentPostId = null;

  /** 确保视频帖已注入可播放地址 */
  function ensurePostVideo(post) {
    if (!post || !window.VideoLib) return post;
    if (post.videoUrl) return post;
    if (post.videoKey) {
      window.VideoLib.enrichItem(post, post.videoKey);
      post.type = 'video';
    }
    return post;
  }

  /** 评论数 */
  function getCommentCount(postId) {
    return ((Storage.get('comments') || {})[postId] || []).length;
  }

  /** 最后回复信息 */
  function getLastReply(postId) {
    var list = (Storage.get('comments') || {})[postId] || [];
    if (!list.length) return null;
    var latest = list.slice().sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })[0];
    var author = Utils.getUserById(latest.authorId);
    return { author: author.nickname, time: latest.createdAt };
  }

  /** 全站统计 */
  function getCommunityStats() {
    var posts = Storage.get('posts') || [];
    var forums = Storage.get('forums') || [];
    var totalComments = 0;
    var allComments = Storage.get('comments') || {};
    Object.keys(allComments).forEach(function (k) { totalComments += allComments[k].length; });
    return {
      totalPosts: posts.length,
      totalComments: totalComments,
      totalOnline: forums.reduce(function (s, f) { return s + (f.online || 0); }, 0),
      videoPosts: posts.filter(function (p) { return p.type === 'video' || p.videoUrl; }).length
    };
  }

  /* ========== 渲染侧边栏（分区贴吧） ========== */
  function renderForumSidebar() {
    const forums = Storage.get('forums') || [];
    let html = '<div class="sidebar-title">羽球吧分区</div>';
    forums.forEach(function (f) {
      const active = f.id === currentForumId ? ' active' : '';
      const todayBadge = f.todayPosts ? '<span class="sidebar-badge">' + f.todayPosts + '</span>' : '';
      html += '<div class="sidebar-item' + active + '" data-forum-id="' + f.id + '">';
      html += '<span>' + f.icon + '</span><span class="flex-1">' + f.name + '</span>' + todayBadge + '</div>';
    });
    $('#sidebar').html(html);
  }

  /* ========== 渲染吧头 ========== */
  function renderForumHeader() {
    const forums = Storage.get('forums') || [];
    const forum = forums.find(function (f) { return f.id === currentForumId; });
    if (!forum) return;
    $('#forumName').text(forum.icon + ' ' + forum.name);
    $('#forumDesc').text(forum.desc);
    $('#forumMembers').text('成员: ' + forum.members.toLocaleString());
    $('#forumOnline').text('在线: ' + forum.online);
    $('#forumTodayPosts').text('今日发帖: ' + (forum.todayPosts || 0));
    if (forum.notice) {
      $('#forumNotice').show();
      $('#forumNoticeText').text(forum.notice);
    } else {
      $('#forumNotice').hide();
    }
  }

  /* ========== 渲染在线球友 ========== */
  function renderOnlineUsers() {
    const users = Storage.get('users') || [];
    const npcFirst = users.filter(function (u) { return u.id.indexOf('npc_') === 0; });
    const others = users.filter(function (u) { return u.id.indexOf('npc_') !== 0; });
    const pool = npcFirst.concat(others);
    const shuffled = pool.slice().sort(function () { return Math.random() - 0.5; });
    const online = shuffled.slice(0, Math.min(14, pool.length));
    let html = '';
    online.forEach(function (u) {
      const tag = u.rank ? '<span class="text-xs opacity-70"> · ' + u.rank + '</span>' : '';
      html += '<span class="badge badge-mint cursor-pointer online-user" data-user-id="' + u.id + '" title="' + (u.bio || '') + '">' +
        '👤 ' + u.nickname + tag + '</span>';
    });
    $('#onlineUsers').html(html);
  }

  /** 社区动态条：热帖 + 全站数据 */
  function renderActivityBar() {
    var stats = getCommunityStats();
    var posts = (Storage.get('posts') || []).slice().sort(function (a, b) { return b.likes - a.likes; }).slice(0, 5);
    var hotHtml = posts.map(function (p) {
      return '<a href="#" class="activity-hot-item" data-post-id="' + p.id + '">' + p.title + '</a>';
    }).join('<span class="activity-divider">|</span>');

    var html = '<div class="activity-stats">' +
      '<span>📊 全站 <strong>' + stats.totalPosts + '</strong> 帖</span>' +
      '<span>💬 <strong>' + stats.totalComments + '</strong> 评论</span>' +
      '<span>🎬 <strong>' + stats.videoPosts + '</strong> 视频</span>' +
      '<span>🟢 <strong>' + stats.totalOnline + '</strong> 在线</span>' +
      '</div>' +
      '<div class="activity-hot"><span class="activity-label">🔥 热帖</span>' + hotHtml + '</div>';
    $('#activityBar').html(html);
  }

  /* ========== 获取过滤后的帖子 ========== */
  function getFilteredPosts() {
    let posts = Storage.get('posts') || [];
    posts = posts.filter(function (p) { return p.forumId === currentForumId; });

    /* 搜索 */
    if (searchQuery) {
      if (searchType === 'posts') {
        posts = posts.filter(function (p) {
          return p.title.indexOf(searchQuery) > -1 || p.content.indexOf(searchQuery) > -1;
        });
      } else if (searchType === 'users') {
        posts = posts.filter(function (p) {
          const author = Utils.getUserById(p.authorId);
          return author.nickname.indexOf(searchQuery) > -1 || author.username.indexOf(searchQuery) > -1;
        });
      } else {
        posts = posts.filter(function (p) {
          return p.title.indexOf(searchQuery) > -1 || p.content.indexOf(searchQuery) > -1;
        });
      }
    }

    /* 只看楼主：仅显示当前登录用户发布的帖子 */
    if (currentSort === 'author') {
      const user = Auth.getCurrentUser();
      if (user) {
        posts = posts.filter(function (p) { return p.authorId === user.id; });
      } else {
        posts = [];
      }
    }

    /* 排序（精华筛选在前，避免被排序覆盖） */
    if (currentSort === 'essence') {
      posts = posts.filter(function (p) { return p.essence || p.pinned; });
      posts.sort(function (a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.likes - a.likes; });
    } else if (currentSort === 'hot') {
      posts.sort(function (a, b) { return b.likes - a.likes; });
    } else if (currentSort === 'newest') {
      posts.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }
    /* author 排序已在上方处理，保持发布时间倒序 */
    if (currentSort === 'author') {
      posts.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    }

    return posts;
  }

  /* ========== 渲染帖子列表 ========== */
  function renderPosts() {
    const posts = getFilteredPosts();
    const user = Auth.getCurrentUser();

    if (!posts.length) {
      $('#postsList').html('<div class="empty-state"><div class="empty-state-icon">💬</div><p>暂无帖子，快来发布第一条吧！</p></div>');
      return;
    }

    let html = '';
    posts.forEach(function (p) {
      ensurePostVideo(p);
      const author = Utils.getUserById(p.authorId);
      const isLiked = user ? Interaction.isPostLiked(user.id, p.id) : false;
      const isFav = user ? Interaction.isFavorited(user.id, 'posts', p.id) : false;
      const pinnedClass = p.pinned ? ' pinned' : '';
      const typeBadge = { text: '文字', video: '视频', poll: '投票', meetup: '约球' }[p.type] || '文字';
      const cmtCount = getCommentCount(p.id);
      const lastReply = getLastReply(p.id);

      html += '<div class="post-item' + pinnedClass + '" data-post-id="' + p.id + '">';
      if (p.pinned) html += '<span class="badge badge-hot mb-2">置顶</span> ';
      if (p.essence) html += '<span class="badge badge-mint mb-2">精华</span> ';
      html += '<span class="badge badge-gray mb-2">' + typeBadge + '</span>';
      if (p.type === 'video' && p.duration) {
        html += ' <span class="badge badge-gray mb-2">⏱ ' + p.duration + '</span>';
      }
      html += '<h3 class="font-semibold text-lg mt-1 cursor-pointer post-title-link" data-id="' + p.id + '">' + p.title + '</h3>';
      html += '<div class="post-meta">';
      html += '<span>👤 ' + author.nickname + '</span>';
      html += '<span>' + Utils.formatDate(p.createdAt) + '</span>';
      html += '<span>👁 ' + p.views + '</span>';
      html += '<span>💬 ' + cmtCount + '</span>';
      if (lastReply) {
        html += '<span class="text-mint-dark">↩ ' + lastReply.author + ' ' + Utils.formatDate(lastReply.time) + '</span>';
      }
      html += '</div>';
      html += '<p class="text-gray-600 line-clamp-2">' + p.content.substring(0, 120) + '</p>';

      /* 约球信息 */
      if (p.type === 'meetup' && p.meetup) {
        html += '<div class="mt-2 p-2 bg-mint-light/30 rounded text-sm">📍 ' + p.meetup.location +
          ' · 🕐 ' + p.meetup.time + ' · 招募 ' + p.meetup.filled + '/' + p.meetup.spots + ' 人</div>';
      }

      /* 视频帖列表预览缩略图 */
      if (p.type === 'video' || p.videoUrl) {
        var poster = p.videoPoster || '';
        html += '<div class="mt-2 relative rounded-lg overflow-hidden h-36 video-thumb-preview cursor-pointer post-title-link" data-id="' + p.id + '">';
        html += '<img src="' + poster + '" class="w-full h-full object-cover" alt="视频封面"';
        if (p.bvid) {
          html += ' data-bili-poster data-bili-bvid="' + p.bvid + '" data-bili-page="' + (p.page || 1) + '"';
        }
        html += '>';
        html += '<span class="video-play-overlay">▶ 点击播放</span>';
        if (p.duration) html += '<span class="video-duration-badge">' + p.duration + '</span>';
        if (p.coach) html += '<span class="video-coach-badge">' + p.coach + '</span>';
        html += '</div>';
      }

      /* 投票预览 */
      if (p.type === 'poll' && p.poll) {
        html += '<div class="mt-2 text-sm text-gray-500">📊 投票中 · ' + p.poll.options.length + ' 个选项</div>';
      }

      html += '<div class="post-actions">';
      html += '<button class="post-action-btn like-btn' + (isLiked ? ' active' : '') + '" data-id="' + p.id + '">👍 ' + p.likes + '</button>';
      html += '<button class="post-action-btn dislike-btn" data-id="' + p.id + '">👎 ' + p.dislikes + '</button>';
      html += '<button class="post-action-btn comment-btn" data-id="' + p.id + '">💬 ' + cmtCount + '</button>';
      html += '<button class="post-action-btn fav-btn' + (isFav ? ' active' : '') + '" data-id="' + p.id + '">' + (isFav ? '⭐ 已收藏' : '☆ 收藏') + '</button>';
      html += '<button class="post-action-btn share-btn" data-id="' + p.id + '">🔗 分享</button>';
      html += '<button class="post-action-btn report-btn" data-id="' + p.id + '">🚩 举报</button>';
      html += '</div></div>';
    });
    $('#postsList').html(html);
    if (window.VideoLib && window.VideoLib.refreshDomPosters) {
      window.VideoLib.refreshDomPosters($('#postsList'));
    }
  }

  /* ========== 帖子详情 ========== */
  function showPostDetail(postId) {
    currentPostId = postId;
    const posts = Storage.get('posts') || [];
    const post = posts.find(function (p) { return p.id === postId; });
    if (!post) return;
    ensurePostVideo(post);

    post.views += 1;
    Storage.set('posts', posts);

    const author = Utils.getUserById(post.authorId);
    const user = Auth.getCurrentUser();
    const comments = (Storage.get('comments') || {})[postId] || [];

    let bodyHtml = '<div class="post-meta mb-4"><span>👤 ' + author.nickname + '</span><span>' +
      Utils.formatDate(post.createdAt) + '</span></div>';
    bodyHtml += '<p class="text-gray-700 leading-relaxed mb-4">' + post.content.replace(/\n/g, '<br>') + '</p>';

    /* 视频 */
    if (post.type === 'video' || post.videoUrl || post.videoKey) {
      bodyHtml += '<div id="postVideoPlayer">' + window.VideoLib.renderPlayerHtml(post, { height: 400 }) + '</div>';
    }

    /* 配图 */
    if (post.images && post.images.length) {
      post.images.forEach(function (img) {
        bodyHtml += '<img src="' + img + '" class="rounded-lg mb-2 max-h-64">';
      });
    }

    /* 投票 */
    if (post.type === 'poll' && post.poll) {
      bodyHtml += '<div class="border rounded-lg p-4 mb-4" id="pollArea">';
      post.poll.options.forEach(function (opt) {
        const total = post.poll.options.reduce(function (s, o) { return s + o.votes; }, 0);
        const pct = total ? Math.round(opt.votes / total * 100) : 0;
        const voted = user && post.poll.votedUsers.indexOf(user.id) > -1;
        bodyHtml += '<div class="mb-2">';
        if (!voted && user) {
          bodyHtml += '<button class="btn btn-sm btn-secondary w-full text-left poll-vote-btn" data-opt="' + opt.id + '">' +
            opt.text + ' (' + opt.votes + '票)</button>';
        } else {
          bodyHtml += '<div class="text-sm mb-1">' + opt.text + ' - ' + pct + '%</div>';
          bodyHtml += '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
        }
        bodyHtml += '</div>';
      });
      bodyHtml += '</div>';
    }

    /* 约球 */
    if (post.type === 'meetup' && post.meetup) {
      bodyHtml += '<div class="p-4 bg-mint-light/30 rounded-lg mb-4">' +
        '<p>📍 地点: ' + post.meetup.location + '</p>' +
        '<p>🕐 时间: ' + post.meetup.time + '</p>' +
        '<p>👥 招募: ' + post.meetup.filled + '/' + post.meetup.spots + ' 人</p>' +
        (user ? '<button class="btn btn-sm btn-primary mt-2" id="joinMeetupBtn">报名参加</button>' : '') +
        '</div>';
    }

    /* 评论列表 */
    bodyHtml += '<h4 class="font-semibold mb-3">💬 评论 (' + comments.length + ')</h4>';
    bodyHtml += renderComments(comments, 0);

    /* 发表评论 */
    bodyHtml += '<form id="commentForm" class="mt-4">' +
      '<textarea class="form-textarea mb-2" id="commentInput" placeholder="写下你的评论..." rows="2"></textarea>' +
      '<button type="submit" class="btn btn-sm btn-primary">发表评论</button></form>';

    $('#postDetailTitle').text(post.title);
    $('#postDetailBody').html(bodyHtml);
    Modal.open('postDetailModal');
  }

  /** 渲染评论（支持楼中楼） */
  function renderComments(comments, level) {
    const topLevel = comments.filter(function (c) { return !c.parentId; });
    let html = '<div class="comment-list">';
    topLevel.forEach(function (c) {
      html += renderSingleComment(c, comments, level);
    });
    html += '</div>';
    return html;
  }

  function renderSingleComment(c, allComments, level) {
    const author = Utils.getUserById(c.authorId);
    let html = '<div class="comment-item" data-comment-id="' + c.id + '">';
    html += '<strong>' + author.nickname + '</strong> ';
    html += '<span class="text-xs text-gray-400">' + Utils.formatDate(c.createdAt) + '</span>';
    html += '<p class="mt-1">' + c.content + '</p>';
    html += '<button class="text-xs text-mint-dark reply-btn" data-id="' + c.id + '">回复</button>';

    /* 子回复 */
    const replies = allComments.filter(function (r) { return r.parentId === c.id; });
    if (replies.length) {
      html += '<div class="comment-replies">';
      replies.forEach(function (r) {
        html += renderSingleComment(r, allComments, level + 1);
      });
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  /* ========== 发布帖子 ========== */
  function publishPost(formData) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const posts = Storage.get('posts') || [];
    const newPost = {
      id: Utils.generateId('post'),
      forumId: currentForumId,
      authorId: user.id,
      title: formData.title,
      type: formData.type,
      content: formData.content,
      images: formData.images || [],
      videoUrl: formData.videoUrl || '',
      pinned: false,
      essence: false,
      likes: 0,
      dislikes: 0,
      views: 0,
      favorites: 0,
      createdAt: new Date().toISOString(),
      poll: null,
      meetup: null
    };

    if (formData.type === 'poll') {
      const opts = formData.pollOptions.split('\n').filter(function (o) { return o.trim(); });
      if (opts.length < 2) { Toast.show('投票至少需要2个选项', 'error'); return; }
      newPost.poll = {
        options: opts.map(function (text, i) {
          return { id: 'opt_' + i, text: text.trim(), votes: 0 };
        }),
        votedUsers: []
      };
    }

    if (formData.type === 'meetup') {
      if (!formData.meetupTime || !formData.meetupLocation) {
        Toast.show('请填写约球时间和地点', 'error');
        return;
      }
      newPost.meetup = {
        time: formData.meetupTime,
        location: formData.meetupLocation,
        spots: formData.meetupSpots || 4,
        filled: 1
      };
    }

    if (formData.type === 'video' && formData.videoUrl && window.VideoLib) {
      var parsed = window.VideoLib.parseBilibiliLink(formData.videoUrl);
      if (parsed) {
        Object.assign(newPost, parsed);
        if (!newPost.videoPoster && parsed.bvid) {
          window.VideoLib.fetchPoster(parsed.bvid, parsed.page, function (url) {
            if (url) newPost.videoPoster = url;
          });
        }
      } else {
        newPost.videoUrl = formData.videoUrl;
      }
      newPost.type = 'video';
    }

    posts.unshift(newPost);
    Storage.set('posts', posts);

    /* 更新用户发帖数 */
    const users = Storage.get('users') || [];
    const u = users.find(function (x) { return x.id === user.id; });
    if (u) {
      u.stats.postCount = (u.stats.postCount || 0) + 1;
      Storage.set('users', users);
    }

    Modal.closeAll();
    Toast.show('发布成功！', 'success');
    renderPosts();
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    /* 切换分区 */
    $(document).on('click', '[data-forum-id]', function () {
      currentForumId = $(this).data('forum-id');
      searchQuery = '';
      $('#searchInput').val('');
      renderForumSidebar();
      renderForumHeader();
      renderActivityBar();
      renderPosts();
    });

    /* 热帖快捷打开 */
    $(document).on('click', '.activity-hot-item', function (e) {
      e.preventDefault();
      var postId = $(this).data('post-id');
      var post = (Storage.get('posts') || []).find(function (p) { return p.id === postId; });
      if (post) {
        currentForumId = post.forumId;
        renderForumSidebar();
        renderForumHeader();
        renderPosts();
      }
      showPostDetail(postId);
    });

    /* 排序 */
    $(document).on('click', '[data-sort]', function () {
      $('[data-sort]').removeClass('active');
      $(this).addClass('active');
      currentSort = $(this).data('sort');
      renderPosts();
    });

    /* 搜索 */
    $('#searchBtn').on('click', function () {
      searchQuery = $('#searchInput').val().trim();
      searchType = $('#searchType').val();
      renderPosts();
      if (searchQuery) Toast.show('搜索: ' + searchQuery, 'info');
    });
    $('#searchInput').on('keypress', function (e) {
      if (e.which === 13) $('#searchBtn').click();
    });

    /* 悬浮发帖 */
    $('#fabPostBtn').on('click', function () {
      if (!Auth.requireLogin()) return;
      if (!$('#postModal').length) {
        $('body').append(ModalsHTML.postModal());
      }
      Modal.open('postModal');
    });

    /* 发帖提交 */
    $(document).on('submit', '#postForm', function (e) {
      e.preventDefault();
      const title = $('#postTitle').val().trim();
      const content = $('#postContent').val().trim();
      const type = $('#postType').val();

      if (!title) { Toast.show('请输入标题', 'error'); return; }
      if (!content && type === 'text') { Toast.show('请输入内容', 'error'); return; }
      if (type === 'video' && !$('#postVideoUrl').val().trim()) {
        Toast.show('请输入视频链接', 'error');
        return;
      }

      const formData = {
        title: title,
        content: content,
        type: type,
        videoUrl: $('#postVideoUrl').val().trim(),
        pollOptions: $('#postPollOptions').val(),
        meetupTime: $('#postMeetupTime').val(),
        meetupLocation: $('#postMeetupLocation').val().trim(),
        meetupSpots: parseInt($('#postMeetupSpots').val()) || 4,
        images: []
      };

      /* 处理配图上传 */
      const imageFiles = $('#postImages')[0].files;
      if (imageFiles && imageFiles.length) {
        const promises = [];
        for (let i = 0; i < imageFiles.length; i++) {
          promises.push(Utils.readFileAsDataURL(imageFiles[i]));
        }
        Promise.all(promises).then(function (images) {
          formData.images = images;
          publishPost(formData);
        });
      } else {
        publishPost(formData);
      }
    });

    /* 帖子标题点击 */
    $(document).on('click', '.post-title-link', function (e) {
      e.stopPropagation();
      showPostDetail($(this).data('id'));
    });

    /* 点赞 */
    $(document).on('click', '.like-btn', function (e) {
      e.stopPropagation();
      if (!Auth.requireLogin()) return;
      const postId = $(this).data('id');
      Interaction.togglePostLike(Auth.getCurrentUser().id, postId);
      renderPosts();
    });

    /* 踩 */
    $(document).on('click', '.dislike-btn', function (e) {
      e.stopPropagation();
      if (!Auth.requireLogin()) return;
      Interaction.togglePostDislike(Auth.getCurrentUser().id, $(this).data('id'));
      renderPosts();
    });

    /* 评论按钮 */
    $(document).on('click', '.comment-btn', function (e) {
      e.stopPropagation();
      showPostDetail($(this).data('id'));
    });

    /* 收藏 */
    $(document).on('click', '.fav-btn', function (e) {
      e.stopPropagation();
      if (!Auth.requireLogin()) return;
      Interaction.toggleFavorite(Auth.getCurrentUser().id, 'posts', $(this).data('id'));
      renderPosts();
    });

    /* 分享 */
    $(document).on('click', '.share-btn', function (e) {
      e.stopPropagation();
      const postId = $(this).data('id');
      const url = window.location.href.split('?')[0] + '?post=' + postId;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          Toast.show('链接已复制到剪贴板', 'success');
        });
      } else {
        Toast.show('分享链接: ' + url, 'info');
      }
    });

    /* 举报 */
    $(document).on('click', '.report-btn', function (e) {
      e.stopPropagation();
      Toast.show('举报已提交，我们会尽快处理', 'success');
    });

    /* 评论提交 */
    $(document).on('submit', '#commentForm', function (e) {
      e.preventDefault();
      if (!Auth.requireLogin()) return;
      const content = $('#commentInput').val().trim();
      if (!content) { Toast.show('请输入评论', 'error'); return; }

      const allComments = Storage.get('comments') || {};
      if (!allComments[currentPostId]) allComments[currentPostId] = [];
      const parentId = $('#commentForm').data('reply-to') || null;
      allComments[currentPostId].push({
        id: Utils.generateId('cmt'),
        authorId: Auth.getCurrentUser().id,
        content: content,
        createdAt: new Date().toISOString(),
        likes: 0,
        parentId: parentId
      });
      Storage.set('comments', allComments);

      /* 通知楼主 */
      const post = (Storage.get('posts') || []).find(function (p) { return p.id === currentPostId; });
      if (post) {
        Interaction.addCommentNotification(
          post.authorId,
          Auth.getCurrentUser().id,
          '评论了你的帖子《' + post.title + '》',
          currentPostId
        );
      }

      Toast.show('评论成功', 'success');
      showPostDetail(currentPostId);
    });

    /* 回复评论 */
    let replyToId = null;
    $(document).on('click', '.reply-btn', function () {
      replyToId = $(this).data('id');
      $('#commentForm').data('reply-to', replyToId);
      const author = Utils.getUserById(
        ((Storage.get('comments') || {})[currentPostId] || []).find(function (c) { return c.id === replyToId; }).authorId
      );
      $('#commentInput').attr('placeholder', '回复 @' + author.nickname + '...').focus();
    });

    /* 投票 */
    $(document).on('click', '.poll-vote-btn', function () {
      if (!Auth.requireLogin()) return;
      const optId = $(this).data('opt');
      const posts = Storage.get('posts') || [];
      const post = posts.find(function (p) { return p.id === currentPostId; });
      if (!post || !post.poll) return;
      if (post.poll.votedUsers.indexOf(Auth.getCurrentUser().id) > -1) {
        Toast.show('你已经投过票了', 'warning');
        return;
      }
      const opt = post.poll.options.find(function (o) { return o.id === optId; });
      if (opt) {
        opt.votes += 1;
        post.poll.votedUsers.push(Auth.getCurrentUser().id);
        Storage.set('posts', posts);
        Toast.show('投票成功', 'success');
        showPostDetail(currentPostId);
      }
    });

    /* 约球报名 */
    $(document).on('click', '#joinMeetupBtn', function () {
      if (!Auth.requireLogin()) return;
      const posts = Storage.get('posts') || [];
      const post = posts.find(function (p) { return p.id === currentPostId; });
      if (post && post.meetup) {
        if (post.meetup.filled >= post.meetup.spots) {
          Toast.show('名额已满', 'warning');
          return;
        }
        post.meetup.filled += 1;
        Storage.set('posts', posts);
        Toast.show('报名成功！', 'success');
        showPostDetail(currentPostId);
      }
    });

    /* 在线用户点击 */
    $(document).on('click', '.online-user', function () {
      searchQuery = Utils.getUserById($(this).data('user-id')).nickname;
      searchType = 'users';
      $('#searchInput').val(searchQuery);
      $('#searchType').val('users');
      renderPosts();
    });

    /* URL 参数打开帖子 */
    const urlParams = new URLSearchParams(window.location.search);
    const postParam = urlParams.get('post');
    if (postParam) {
      setTimeout(function () { showPostDetail(postParam); }, 500);
    }
  }

  /* ========== 初始化 ========== */
  $(document).ready(function () {
    if (!$('#postModal').length) {
      $('body').append(ModalsHTML.postModal());
    }
    renderForumSidebar();
    renderForumHeader();
    renderActivityBar();
    renderOnlineUsers();
    renderPosts();
    bindEvents();
  });

})(jQuery);
