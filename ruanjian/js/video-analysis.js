/**
 * 视频AI分析页面逻辑
 * 功能：视频上传/链接导入、模拟AI分析、可视化结果、保存/分享/收藏
 */
(function ($) {
  'use strict';

  const { Storage, Auth, Modal, Toast, Utils, Interaction } = window.BadmintonApp;

  /* 当前分析数据 */
  let currentAnalysis = null;
  let currentVideoUrl = '';
  let currentTempBlobUrl = ''; /* 本次上传的临时 blob URL */

  /** 序列化分析记录（不含 File/Blob/大 base64） */
  function serializeAnalysis(a) {
    var copy = JSON.parse(JSON.stringify(a));
    delete copy.localFile;
    delete copy.videoData;
    /* blob URL 刷新后失效，本地视频只存 IndexedDB 键 */
    if (copy.videoType === 'local' && copy.videoStorageKey) {
      delete copy.videoUrl;
    }
    return copy;
  }

  /** 挂载本地/在线视频播放器 */
  function mountLocalOrOnlinePlayer(data) {
    var html = window.VideoLib.renderPlayerHtml({
      videoType: data.videoType === 'local' ? 'mp4' : data.videoType,
      videoUrl: data.videoUrl,
      videoPoster: data.videoPoster,
      title: data.title,
      videoTitle: data.title
    }, { height: 420 });
    if (data.videoType === 'local' && (data.fileName || data.fileSize)) {
      html = '<div class="mb-2 flex gap-2 flex-wrap">' +
        '<span class="badge badge-mint">📁 我的视频</span>' +
        (data.fileName ? '<span class="badge badge-gray">' + data.fileName + '</span>' : '') +
        (data.fileSize ? '<span class="badge badge-gray">' + VideoStorage.formatSize(data.fileSize) + '</span>' : '') +
        '</div>' + html;
    }
    $('#analysisVideoWrap').html(html);
    currentVideoUrl = data.videoUrl;
    var isLocal = data.videoType === 'local';
    var isBili = data.videoType === 'bilibili';
    $('#clipBtn, #pauseBtn').toggle(isLocal);
    if (isLocal) {
      Toast.show('已加载你的本地视频，可使用暂停/裁剪/分帧跳转', 'success');
    } else if (isBili) {
      Toast.show('已加载 B 站教学视频，请观看后保存 AI 分析报告', 'info');
    }
  }

  /* AI动作类型库 */
  const ACTION_TYPES = ['高远球', '吊球', '杀球', '搓球', '扑球', '步伐'];
  const ACTION_COMMENTS = {
    '高远球': ['击球点偏后', '手腕内旋充分', '随挥完整', '侧身不够'],
    '吊球': ['拍面控制良好', '落点精准', '假动作不足', '速度偏慢'],
    '杀球': ['起跳高度足够', '落点刁钻', '发力不完整', '准备时间过长'],
    '搓球': ['旋转控制良好', '过网高度合适', '手法单一', '稳定性不足'],
    '扑球': ['反应速度快', '出手果断', '时机偏早', '角度选择不当'],
    '步伐': ['回中速度快', '启动及时', '交叉步不到位', '重心偏高']
  };

  const SIDEBAR_ITEMS = [
    { id: 'import', label: '导入视频', icon: '📤' },
    { id: 'result', label: '分析结果', icon: '📊' },
    { id: 'history', label: '历史记录', icon: '📋' }
  ];

  /* ========== 模拟AI分析 ========== */
  function simulateAIAnalysis(title, videoUrl, videoType, videoData) {
    $('#analysisProgress').show();
    $('#analysisResult').hide();
    let progress = 0;
    const steps = videoType === 'local'
      ? ['读取本地视频...', '动作识别中...', '轨迹分析中...', '保存视频并生成报告...']
      : ['解析教学视频...', '动作识别中...', '轨迹分析中...', '生成报告中...'];
    let stepIdx = 0;

    const timer = setInterval(function () {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      $('#progressFill').css('width', progress + '%');
      $('#progressText').text(steps[Math.min(stepIdx, steps.length - 1)]);
      if (progress > 25 * (stepIdx + 1)) stepIdx++;

      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(function () {
          $('#analysisProgress').hide();
          const analysis = generateAnalysisResult();
          var meta = videoData && typeof videoData === 'object' ? videoData : {};
          var analysisId = Utils.generateId('va');

          function finishAnalysis(extra) {
            currentAnalysis = Object.assign({
              id: analysisId,
              userId: Auth.getCurrentUser() ? Auth.getCurrentUser().id : 'guest',
              title: title,
              videoUrl: videoUrl,
              videoType: videoType,
              watchUrl: meta.watchUrl || '',
              bvid: meta.bvid || '',
              page: meta.page || 1,
              duration: meta.duration || '',
              coach: meta.coach || '',
              createdAt: new Date().toISOString(),
              analysis: analysis
            }, extra || {});
            currentVideoUrl = currentAnalysis.watchUrl || currentAnalysis.videoUrl;
            displayAnalysisResult(currentAnalysis);
            Toast.show('AI 分析完成！', 'success');
          }

          /* 本地视频：立即写入 IndexedDB，不限制文件大小 */
          if (videoType === 'local' && meta.file) {
            $('#progressText').text('正在保存视频到本地库（大文件可能需要片刻）...');
            VideoStorage.saveVideo(analysisId, meta.file, function (pct) {
              $('#progressFill').css('width', Math.min(95, pct) + '%');
            }).then(function () {
              finishAnalysis({
                videoStorageKey: analysisId,
                fileName: meta.file.name,
                fileSize: meta.file.size,
                mimeType: meta.file.type
              });
            }).catch(function (err) {
              console.error(err);
              Toast.show('视频保存失败，但仍可本次会话内播放分析', 'warning');
              finishAnalysis({
                fileName: meta.file.name,
                fileSize: meta.file.size
              });
            });
          } else {
            finishAnalysis();
          }
        }, 500);
      }
    }, 300);
  }

  /** 生成模拟分析结果 */
  function generateAnalysisResult() {
    const numActions = 2 + Math.floor(Math.random() * 3);
    const actions = [];
    const usedActions = [];
    for (let i = 0; i < numActions; i++) {
      let action = ACTION_TYPES[Math.floor(Math.random() * ACTION_TYPES.length)];
      while (usedActions.indexOf(action) > -1 && usedActions.length < ACTION_TYPES.length) {
        action = ACTION_TYPES[Math.floor(Math.random() * ACTION_TYPES.length)];
      }
      usedActions.push(action);
      actions.push(action);
    }

    const frames = [];
    actions.forEach(function (action, i) {
      const comments = ACTION_COMMENTS[action];
      frames.push({
        time: (i + 1) * 0.8 + Math.random() * 0.5,
        action: action,
        label: comments[Math.floor(Math.random() * comments.length)]
      });
    });

    const mistakes = [];
    actions.forEach(function (action) {
      const comments = ACTION_COMMENTS[action];
      if (Math.random() > 0.5) {
        mistakes.push(comments[Math.floor(Math.random() * 2)]);
      }
    });

    const pros = ['侧身充分', '步伐到位', '随挥完整', '击球点准确', '重心稳定'];
    const cons = ['手腕内旋不足', '回中速度慢', '发力不连贯', '准备动作过大'];
    const suggestions = [
      '多练定点高远球找击球点',
      '加强核心力量与下肢训练',
      '注意手腕内旋发力技巧',
      '练习米字步提升场上覆盖',
      '观看职业选手慢动作对比学习'
    ];

    const heatmap = [];
    for (let r = 0; r < 5; r++) {
      const row = [];
      for (let c = 0; c < 5; c++) {
        row.push(Math.random());
      }
      heatmap.push(row);
    }

    return {
      actions: actions,
      frames: frames,
      speed: Math.floor(180 + Math.random() * 120),
      landing: ['底线内5cm', '底线内10cm', '中场偏后', '边线附近'][Math.floor(Math.random() * 4)],
      mistakes: mistakes.length ? mistakes : ['暂无明显失误'],
      pros: pros.slice(0, 2 + Math.floor(Math.random() * 2)),
      cons: cons.slice(0, 1 + Math.floor(Math.random() * 2)),
      suggestions: suggestions.slice(0, 2 + Math.floor(Math.random() * 2)),
      heatmap: heatmap
    };
  }

  /* ========== 挂载视频播放器 ========== */
  function mountVideoPlayer(data) {
    if (data.videoType === 'bilibili') {
      window.VideoLib.mount($('#analysisVideoWrap'), {
        videoType: 'bilibili',
        videoUrl: data.videoUrl,
        videoPoster: data.videoPoster,
        title: data.title,
        videoTitle: data.title,
        duration: data.duration,
        coach: data.coach,
        watchUrl: data.watchUrl,
        bvid: data.bvid,
        page: data.page,
        type: 'bilibili'
      }, { height: 420 });
      currentVideoUrl = data.watchUrl || data.videoUrl;
      $('#clipBtn, #pauseBtn').hide();
      Toast.show('已加载 B 站羽毛球教学，请观看后保存 AI 分析报告', 'info');
      return;
    }

    mountLocalOrOnlinePlayer(data);
  }

  /* ========== 展示分析结果 ========== */
  function displayAnalysisResult(data) {
    $('#analysisResult').show();
    $('#resultTitle').text(data.title);

    function render() {
      mountVideoPlayer(data);
      renderAnalysisPanels(data.analysis);
    }

    /* 本地视频：从 IndexedDB 加载（支持大文件、刷新后仍可播放） */
    if (data.videoType === 'local' && data.videoStorageKey) {
      VideoStorage.getPlayUrl(data.videoStorageKey).then(function (url) {
        if (url) {
          data.videoUrl = url;
          render();
        } else if (data.videoUrl) {
          render();
        } else {
          Toast.show('本地视频文件未找到，可能已被清除', 'error');
        }
      });
      return;
    }

    render();
  }

  function renderAnalysisPanels(a) {

    /* 动作标签 */
    let tagsHtml = '';
    a.actions.forEach(function (act) {
      tagsHtml += '<span class="action-tag">' + act + '</span>';
    });
    $('#actionTags').html(tagsHtml);

    $('#speedValue').text(a.speed);
    $('#landingValue').text(a.landing);

    /* 分帧预览 */
    let framesHtml = '';
    a.frames.forEach(function (f, i) {
      framesHtml += '<div class="frame-thumb' + (i === 0 ? ' active' : '') + '" data-time="' + f.time + '">';
      framesHtml += '<div class="text-center"><div class="font-semibold">' + f.action + '</div>';
      framesHtml += '<div class="text-xs">' + f.time.toFixed(1) + 's</div></div></div>';
    });
    $('#framePreview').html(framesHtml);

    /* 失误点 */
    let mistakesHtml = '<ul class="list-disc pl-5">';
    a.mistakes.forEach(function (m) { mistakesHtml += '<li class="text-red-500">' + m + '</li>'; });
    mistakesHtml += '</ul>';
    $('#mistakesList').html(mistakesHtml);

    /* 优缺点 */
    let prosHtml = '', consHtml = '';
    a.pros.forEach(function (p) { prosHtml += '<li class="text-green-600">' + p + '</li>'; });
    a.cons.forEach(function (c) { consHtml += '<li class="text-red-500">' + c + '</li>'; });
    $('#prosList').html(prosHtml);
    $('#consList').html(consHtml);

    /* 建议 */
    let sugHtml = '<ol class="list-decimal pl-5 space-y-2">';
    a.suggestions.forEach(function (s) { sugHtml += '<li>' + s + '</li>'; });
    sugHtml += '</ol>';
    $('#suggestionsList').html(sugHtml);

    drawHeatmap(a.heatmap);
    drawTrajectory(a.frames);
    updateFavoriteBtn();
  }

  /* ========== 绘制热力图 ========== */
  function drawHeatmap(data) {
    const canvas = document.getElementById('heatmapCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const cellW = w / data[0].length;
    const cellH = h / data.length;

    ctx.clearRect(0, 0, w, h);
    data.forEach(function (row, r) {
      row.forEach(function (val, c) {
        const intensity = Math.floor(val * 255);
        ctx.fillStyle = 'rgba(78, 205, 196, ' + val + ')';
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
        if (val > 0.7) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px sans-serif';
          ctx.fillText('●', c * cellW + cellW / 2 - 3, r * cellH + cellH / 2 + 3);
        }
      });
    });

    /* 球场线条 */
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }

  /* ========== 绘制步伐轨迹 ========== */
  function drawTrajectory(frames) {
    const canvas = document.getElementById('trajectoryCanvas');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    /* 球场背景 */
    ctx.fillStyle = '#1a472a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.strokeRect(10, 10, w - 20, h - 20);

    /* 模拟轨迹点 */
    const points = [];
    for (let i = 0; i <= frames.length; i++) {
      points.push({
        x: 50 + Math.random() * (w - 100),
        y: 30 + Math.random() * (h - 60)
      });
    }

    ctx.beginPath();
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    points.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    points.forEach(function (p, i) {
      ctx.beginPath();
      ctx.fillStyle = i === 0 ? '#FFD700' : (i === points.length - 1 ? '#FF6B6B' : '#4ECDC4');
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ========== 保存分析报告 ========== */
  function saveReport() {
    if (!currentAnalysis) { Toast.show('暂无分析结果', 'error'); return; }
    const analyses = Storage.get('videoAnalyses') || [];
    const toSave = serializeAnalysis(currentAnalysis);
    const existIdx = analyses.findIndex(function (a) { return a.id === toSave.id; });
    if (existIdx > -1) {
      analyses[existIdx] = toSave;
    } else {
      analyses.unshift(toSave);
    }
    Storage.set('videoAnalyses', analyses);

    /* 更新用户统计 */
    const user = Auth.getCurrentUser();
    if (user) {
      const users = Storage.get('users') || [];
      const u = users.find(function (x) { return x.id === user.id; });
      if (u) {
        u.stats.analysisCount = (u.stats.analysisCount || 0) + 1;
        Storage.set('users', users);
      }
    }

    Toast.show('分析报告已保存', 'success');
    renderHistory();
  }

  /* ========== 渲染历史记录 ========== */
  function renderHistory() {
    const analyses = Storage.get('videoAnalyses') || [];
    $('#historyCount').text(analyses.length + ' 条');
    if (!analyses.length) {
      $('#historyList').html('<div class="empty-state"><div class="empty-state-icon">📋</div><p>暂无分析记录</p></div>');
      return;
    }
    let html = '';
    analyses.forEach(function (a) {
      var typeLabel = a.videoType === 'local' ? '📁 我的视频' : (a.videoType === 'bilibili' ? 'B站' : '链接');
      var sizeLabel = a.fileSize ? ' · ' + VideoStorage.formatSize(a.fileSize) : '';
      html += '<div class="list-item history-item" data-id="' + a.id + '">';
      html += '<div class="flex-1"><div class="font-semibold">' + a.title + '</div>';
      html += '<div class="text-sm text-gray-500">' + Utils.formatDate(a.createdAt) + ' · ' + typeLabel + sizeLabel + '</div>';
      html += '<div class="text-xs text-gray-400">动作: ' + a.analysis.actions.join(', ') + '</div></div>';
      html += '<button class="btn btn-sm btn-secondary view-history-btn" data-id="' + a.id + '">查看</button>';
      html += '<button class="btn btn-sm btn-danger delete-history-btn ml-2" data-id="' + a.id + '">删除</button></div>';
    });
    $('#historyList').html(html);
  }

  /* ========== 收藏按钮状态 ========== */
  function updateFavoriteBtn() {
    const user = Auth.getCurrentUser();
    if (!user || !currentAnalysis) {
      $('#favoriteVideoBtn').text('⭐ 收藏视频');
      return;
    }
    const isFav = Interaction.isFavorited(user.id, 'videos', currentAnalysis.id);
    $('#favoriteVideoBtn').text(isFav ? '⭐ 已收藏' : '⭐ 收藏视频');
  }

  /* ========== 事件绑定 ========== */
  function bindEvents() {
    /* 导入方式切换 */
    $(document).on('click', '[data-import]', function () {
      $('[data-import]').removeClass('active');
      $(this).addClass('active');
      const type = $(this).data('import');
      $('#uploadPanel').toggle(type === 'upload');
      $('#urlPanel').toggle(type === 'url');
    });

    /* 选择文件时显示信息（不限制大小） */
    $('#videoFile').on('change', function () {
      var file = this.files[0];
      if (!file) {
        $('#videoFileInfo').addClass('hidden').text('');
        return;
      }
      if (!VideoStorage.isVideoFile(file)) {
        Toast.show('请选择视频文件', 'warning');
        this.value = '';
        return;
      }
      $('#videoFileInfo').removeClass('hidden').html(
        '已选择：<strong>' + file.name + '</strong>（' + VideoStorage.formatSize(file.size) + '）— 大小不限，可直接分析'
      );
    });

    /* 本地上传分析 — 不限制大小，Blob URL 即时播放 + IndexedDB 持久化 */
    $('#uploadAnalyzeBtn').on('click', function () {
      const file = $('#videoFile')[0].files[0];
      const title = $('#videoTitle').val().trim();
      if (!file) { Toast.show('请选择视频文件', 'error'); return; }
      if (!title) { Toast.show('请输入分析标题', 'error'); return; }
      if (!VideoStorage.isVideoFile(file)) { Toast.show('文件格式不支持，请选择视频', 'error'); return; }

      if (currentTempBlobUrl) VideoStorage.revokeTempUrl(currentTempBlobUrl);
      const objectUrl = URL.createObjectURL(file);
      currentTempBlobUrl = objectUrl;

      Toast.show('正在分析「' + file.name + '」（' + VideoStorage.formatSize(file.size) + '）', 'info');
      simulateAIAnalysis(title, objectUrl, 'local', { file: file, objectUrl: objectUrl });
    });

    /* 在线链接分析（支持 B 站羽毛球教学链接） */
    $('#urlAnalyzeBtn').on('click', function () {
      const url = $('#videoUrl').val().trim();
      const title = $('#videoUrlTitle').val().trim();
      if (!url) { Toast.show('请输入视频链接', 'error'); return; }
      if (!title) { Toast.show('请输入分析标题', 'error'); return; }

      var bili = window.VideoLib.parseBilibiliLink(url);
      if (bili) {
        bili.title = title;
        bili.videoTitle = title;
        simulateAIAnalysis(title, bili.videoUrl, 'bilibili', bili);
        currentAnalysis = null;
        return;
      }

      if (!/^https?:\/\/.+/i.test(url)) { Toast.show('请输入有效的 URL 或 B 站链接', 'error'); return; }
      simulateAIAnalysis(title, url, 'online', '');
    });

    /* 暂停/播放（仅本地 mp4） */
    $('#pauseBtn').on('click', function () {
      const video = $('#analysisVideoWrap video')[0];
      if (!video) { Toast.show('B站教学请直接在播放器内控制播放', 'info'); return; }
      if (video.paused) { video.play(); $(this).text('⏸ 暂停'); }
      else { video.pause(); $(this).text('▶ 播放'); }
    });

    /* 裁剪（仅本地 mp4） */
    $('#clipBtn').on('click', function () {
      if (!$('#analysisVideoWrap video').length) {
        Toast.show('B站长教学不支持裁剪，请观看完整课程', 'info');
        return;
      }
      $('#clipControls').toggle();
    });
    $('#applyClipBtn').on('click', function () {
      const video = $('#analysisVideoWrap video')[0];
      if (!video) return;
      const start = parseFloat($('#clipStart').val());
      const end = parseFloat($('#clipEnd').val());
      if (start >= end) { Toast.show('裁剪区间无效', 'error'); return; }
      video.currentTime = start;
      video.play();
      Toast.show('已跳转到裁剪起点 ' + start + 's', 'success');
      const checkEnd = setInterval(function () {
        if (video.currentTime >= end) {
          video.pause();
          clearInterval(checkEnd);
          Toast.show('裁剪片段播放完毕', 'info');
        }
      }, 100);
    });

    /* 分帧点击跳转 */
    $(document).on('click', '.frame-thumb', function () {
      $('.frame-thumb').removeClass('active');
      $(this).addClass('active');
      const video = $('#analysisVideoWrap video')[0];
      if (!video) {
        Toast.show('分帧标记已选中：' + $(this).find('.font-semibold').text(), 'info');
        return;
      }
      const time = parseFloat($(this).data('time'));
      video.currentTime = time;
    });

    /* 保存报告 */
    $('#saveReportBtn').on('click', saveReport);

    /* 收藏 */
    $('#favoriteVideoBtn').on('click', function () {
      if (!Auth.requireLogin()) return;
      if (!currentAnalysis) { Toast.show('请先完成分析', 'error'); return; }
      saveReport();
      Interaction.toggleFavorite(Auth.getCurrentUser().id, 'videos', currentAnalysis.id);
      updateFavoriteBtn();
    });

    /* 分享到圈子 */
    $('#shareCircleBtn').on('click', function () {
      if (!Auth.requireLogin()) return;
      if (!currentAnalysis) { Toast.show('请先完成分析', 'error'); return; }
      saveReport();
      const forums = Storage.get('forums') || [];
      let optHtml = '';
      forums.forEach(function (f) { optHtml += '<option value="' + f.id + '">' + f.name + '</option>'; });
      $('#shareForum').html(optHtml);
      $('#shareTitle').val('[AI分析] ' + currentAnalysis.title);
      $('#shareContent').val('动作识别: ' + currentAnalysis.analysis.actions.join('、') + '\n速度: ' + currentAnalysis.analysis.speed + ' km/h\n' + currentAnalysis.analysis.suggestions.join('\n'));
      Modal.open('shareModal');
    });

    $('#shareForm').on('submit', function (e) {
      e.preventDefault();
      if (currentAnalysis && currentAnalysis.videoType === 'local') {
        Toast.show('本地视频无法直接分享文件，已分享分析报告文字内容', 'info');
      }
      const posts = Storage.get('posts') || [];
      const user = Auth.getCurrentUser();
      posts.unshift({
        id: Utils.generateId('post'),
        forumId: $('#shareForum').val(),
        authorId: user.id,
        title: $('#shareTitle').val().trim(),
        type: 'text',
        content: $('#shareContent').val().trim() + (currentAnalysis && currentAnalysis.videoType === 'local' ? '\n\n（分析基于本人上传视频：' + (currentAnalysis.fileName || '本地文件') + '）' : ''),
        images: [],
        videoUrl: currentAnalysis && currentAnalysis.videoType !== 'local' ? currentVideoUrl : '',
        pinned: false, essence: false,
        likes: 0, dislikes: 0, views: 0, favorites: 0,
        createdAt: new Date().toISOString(),
        poll: null, meetup: null
      });
      Storage.set('posts', posts);
      Modal.closeAll();
      Toast.show('已分享到圈子！', 'success');
    });

    /* 历史记录查看/删除 */
    $(document).on('click', '.view-history-btn', function (e) {
      e.stopPropagation();
      const id = $(this).data('id');
      const item = (Storage.get('videoAnalyses') || []).find(function (a) { return a.id === id; });
      if (item) {
        currentAnalysis = item;
        displayAnalysisResult(item);
        $('html, body').animate({ scrollTop: $('#analysisResult').offset().top - 80 }, 400);
      }
    });
    $(document).on('click', '.delete-history-btn', function (e) {
      e.stopPropagation();
      const id = $(this).data('id');
      let analyses = Storage.get('videoAnalyses') || [];
      analyses = analyses.filter(function (a) { return a.id !== id; });
      Storage.set('videoAnalyses', analyses);
      VideoStorage.deleteVideo(id);
      Toast.show('已删除分析记录及本地视频', 'info');
      renderHistory();
    });
  }

  /* ========== 初始化 ========== */
  $(document).ready(function () {
    window.BadmintonApp.Navigation.renderSidebar(SIDEBAR_ITEMS, 'import');
    $(document).on('click', '.sidebar-item', function () {
      const id = $(this).data('sidebar-id');
      $('.sidebar-item').removeClass('active');
      $(this).addClass('active');
      const map = { import: 0, result: '#analysisResult', history: '#historyList' };
      if (id === 'import') window.scrollTo({ top: 0, behavior: 'smooth' });
      else if (map[id]) $('html, body').animate({ scrollTop: $(map[id]).offset().top - 80 }, 400);
    });
    bindEvents();
    renderHistory();

    /* 从战术库跳转时自动填充视频链接 */
    const pendingUrl = sessionStorage.getItem('pendingVideoUrl');
    const pendingTitle = sessionStorage.getItem('pendingVideoTitle');
    const pendingType = sessionStorage.getItem('pendingVideoType');
    if (pendingUrl) {
      $('[data-import="url"]').click();
      $('#videoUrl').val(pendingUrl);
      if (pendingTitle) $('#videoUrlTitle').val(pendingTitle);
      sessionStorage.removeItem('pendingVideoUrl');
      sessionStorage.removeItem('pendingVideoTitle');
      sessionStorage.removeItem('pendingVideoType');
      Toast.show('已自动填充羽毛球教学链接，点击开始 AI 分析', 'info');
    } else if (window.VideoLib) {
      $('#videoUrl').val(window.VideoLib.defaultDemoUrl);
      $('#videoUrlTitle').val('肖杰：后场高远球教学分析');
    }
  });

})(jQuery);
