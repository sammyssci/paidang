/**
 * 羽毛球专业教学视频库 v3
 * 全部为 B 站羽毛球长教学（10~45 分钟系统课），每条唯一、与内容精确匹配
 * 播放方式：Bilibili iframe 嵌入（需联网）
 */
(function (window) {
  'use strict';

  /**
   * 视频条目结构
   * type: 'bilibili'
   * bvid, page(分P), title, duration, coach, watchUrl
   */
  var CATALOG = {
    /* ===== 肖杰《学打羽毛球》经典45集 BV16t411D7ke ===== */
    xj_grip:           { type: 'bilibili', bvid: 'BV16t411D7ke', page: 3,  title: '肖杰：握拍方法完整教学', duration: '约12分钟', coach: '肖杰' },
    xj_serve_clear:    { type: 'bilibili', bvid: 'BV16t411D7ke', page: 4,  title: '肖杰：正手发后场高远球', duration: '约15分钟', coach: '肖杰' },
    xj_receive:        { type: 'bilibili', bvid: 'BV16t411D7ke', page: 8,  title: '肖杰：接发球技术详解', duration: '约14分钟', coach: '肖杰' },
    xj_footwork_kill:  { type: 'bilibili', bvid: 'BV16t411D7ke', page: 12, title: '肖杰：中场接杀球步法', duration: '约16分钟', coach: '肖杰' },
    xj_footwork:       { type: 'bilibili', bvid: 'BV16t411D7ke', page: 13, title: '肖杰：羽毛球步法系统练习', duration: '约18分钟', coach: '肖杰' },
    xj_clear:          { type: 'bilibili', bvid: 'BV16t411D7ke', page: 14, title: '肖杰：后场正手&头顶高远球', duration: '约20分钟', coach: '肖杰' },
    xj_drop:           { type: 'bilibili', bvid: 'BV16t411D7ke', page: 16, title: '肖杰：正手后场吊球技术', duration: '约17分钟', coach: '肖杰' },
    xj_smash:          { type: 'bilibili', bvid: 'BV16t411D7ke', page: 17, title: '肖杰：正手杀球技术精讲', duration: '约19分钟', coach: '肖杰' },
    xj_slice:          { type: 'bilibili', bvid: 'BV16t411D7ke', page: 18, title: '肖杰：劈球技术教学', duration: '约15分钟', coach: '肖杰' },
    xj_backhand_clear: { type: 'bilibili', bvid: 'BV16t411D7ke', page: 19, title: '肖杰：反手后场击吊高远球', duration: '约18分钟', coach: '肖杰' },
    xj_net_lift:       { type: 'bilibili', bvid: 'BV16t411D7ke', page: 25, title: '肖杰：前场挑球技术', duration: '约14分钟', coach: '肖杰' },
    xj_mid_kill:       { type: 'bilibili', bvid: 'BV16t411D7ke', page: 27, title: '肖杰：中场接杀球技术', duration: '约16分钟', coach: '肖杰' },
    xj_counter:          { type: 'bilibili', bvid: 'BV16t411D7ke', page: 28, title: '肖杰：接杀球反抽技术', duration: '约15分钟', coach: '肖杰' },
    xj_rear_drill:     { type: 'bilibili', bvid: 'BV16t411D7ke', page: 43, title: '肖杰：后场击球练习套路', duration: '约22分钟', coach: '肖杰' },
    xj_front_drill:    { type: 'bilibili', bvid: 'BV16t411D7ke', page: 44, title: '肖杰：前中场球练习套路', duration: '约20分钟', coach: '肖杰' },
    xj_full_court:     { type: 'bilibili', bvid: 'BV16t411D7ke', page: 45, title: '肖杰：全场综合练习', duration: '约25分钟', coach: '肖杰' },

    /* ===== 羽毛球系统训练教程 BV16M4y1v7jq（33集） ===== */
    sys_move:          { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 5,  title: '系统课：场上移动与步法', duration: '11分钟', coach: '系统训练' },
    sys_smash_long:    { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 13, title: '系统课：杀球完整教学', duration: '26分钟', coach: '系统训练' },
    sys_net_spin:      { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 15, title: '系统课：正手网前搓球', duration: '8分钟', coach: '系统训练' },
    sys_net_kill:      { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 17, title: '系统课：网前扑球技术', duration: '12分钟', coach: '系统训练' },
    sys_dbl_defense:   { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 19, title: '系统课：双打接杀防守', duration: '19分钟', coach: '系统训练' },
    sys_net_drop:      { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 20, title: '系统课：放网前球技术', duration: '14分钟', coach: '系统训练' },
    sys_flat_drive:    { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 21, title: '系统课：正手低手位平抽', duration: '11分钟', coach: '系统训练' },
    sys_hook:          { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 22, title: '系统课：网前勾对角假动作', duration: '10分钟', coach: '系统训练' },
    sys_dbl_receive:   { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 27, title: '系统课：双打接发网前小球', duration: '10分钟', coach: '系统训练' },
    sys_dbl_attack:    { type: 'bilibili', bvid: 'BV16M4y1v7jq', page: 30, title: '系统课：双打进攻站位', duration: '9分钟', coach: '系统训练' },

    /* ===== 专题长教学（独立BV） ===== */
    bi_clear_detail:   { type: 'bilibili', bvid: 'BV1rd4y1F7iE', page: 1, title: 'Badminton Insight：正手高远球详解', duration: '18分钟', coach: 'Greg & Jenny' },
    bi_smash_detail:   { type: 'bilibili', bvid: 'BV1pe4y1s7c6', page: 1, title: 'Badminton Insight：杀球力量与时机', duration: '11分钟', coach: 'Greg & Jenny' },
    dbl_grip:          { type: 'bilibili', bvid: 'BV1bt421H7q9', page: 1, title: '双打教学：握拍及抽挡发力', duration: '5分钟', coach: '闲散小北' },
    dbl_net_block:     { type: 'bilibili', bvid: 'BV1RH4y1a7iX', page: 1, title: '双打教学：前场封网技术', duration: '8分钟', coach: '闲散小北' },
    dbl_net_combo:     { type: 'bilibili', bvid: 'BV1hx4y1Z7q9', page: 1, title: '双打教学：封网连贯套路', duration: '7分钟', coach: '闲散小北' },
    dbl_qa:            { type: 'bilibili', bvid: 'BV1F4421w7z8', page: 1, title: '双打教学：前三期答疑合集', duration: '14分钟', coach: '闲散小北' },
    li_net_qa:         { type: 'bilibili', bvid: 'BV1ee4y1Y74w', page: 1, title: '李老课堂：双打封网典型问题', duration: '12分钟', coach: '李士伟' },
    li_defense_step:   { type: 'bilibili', bvid: 'BV17V4y1H7q7', page: 1, title: '李老课堂：双打接杀步伐调整', duration: '10分钟', coach: '李士伟' },
    li_rear_smash_step:{ type: 'bilibili', bvid: 'BV1ZB4y1B7Ch', page: 1, title: '李老课堂：双打后场杀球步法', duration: '11分钟', coach: '李士伟' },
    li_spin_type:      { type: 'bilibili', bvid: 'BV1gG4y167NZ', page: 1, title: '李老课堂：双打反拍搓球顺搓展搓', duration: '9分钟', coach: '李士伟' },
    lh_net_spin:       { type: 'bilibili', bvid: 'BV17uxLzXEqc', page: 1, title: '刘辉教练：网前展搓基础课', duration: '15分钟', coach: '刘辉' },
    mixed_double:      { type: 'bilibili', bvid: 'BV1J5411v7Dr', page: 1, title: '混双训练：女生后场与轮转', duration: '13分钟', coach: '混双专题' },
    pro_rally:         { type: 'bilibili', bvid: 'BV1pH4y1R7Rz', page: 1, title: '职业双打比赛精彩回合', duration: '10分钟', coach: '赛事集锦' }
  };

  /** B站原版封面（pic / first_frame，每条视频独立） */
  var XJ_SERIES_PIC = 'https://i2.hdslb.com/bfs/archive/8ead65b7a91315fd64ec3496d98832f902e0ea8b.jpg';

  var POSTER_BY_KEY = {
    /* 肖杰系列 — 官方合集封面（B站原片） */
    xj_grip: XJ_SERIES_PIC,
    xj_serve_clear: XJ_SERIES_PIC,
    xj_receive: XJ_SERIES_PIC,
    xj_footwork_kill: XJ_SERIES_PIC,
    xj_footwork: XJ_SERIES_PIC,
    xj_clear: XJ_SERIES_PIC,
    xj_drop: XJ_SERIES_PIC,
    xj_smash: XJ_SERIES_PIC,
    xj_slice: XJ_SERIES_PIC,
    xj_backhand_clear: XJ_SERIES_PIC,
    xj_net_lift: XJ_SERIES_PIC,
    xj_mid_kill: XJ_SERIES_PIC,
    xj_counter: XJ_SERIES_PIC,
    xj_rear_drill: XJ_SERIES_PIC,
    xj_front_drill: XJ_SERIES_PIC,
    xj_full_court: XJ_SERIES_PIC,
    /* 系统训练 — 各分P首帧（各不相同） */
    sys_move: 'https://i0.hdslb.com/bfs/storyff/n230525032ind1i0vrt5au3keu8dstf2_firsti.jpg',
    sys_smash_long: 'https://i0.hdslb.com/bfs/storyff/n230525022se0asyfbhi7ujyfqojek5u_firsti.jpg',
    sys_net_spin: 'https://i0.hdslb.com/bfs/storyff/n230525031f888uvj4nwqiicbrlw4wwu_firsti.jpg',
    sys_net_kill: 'https://i2.hdslb.com/bfs/storyff/n23052501iirpsmg4dg8x20cc19jf9xp_firsti.jpg',
    sys_dbl_defense: 'https://i1.hdslb.com/bfs/storyff/n230525063vwzgqxc81t6c25ma5vsoib_firsti.jpg',
    sys_net_drop: 'https://i2.hdslb.com/bfs/storyff/n23052503yq7g0611616d2vdvzhx23tl_firsti.jpg',
    sys_flat_drive: 'https://i1.hdslb.com/bfs/storyff/n23052502knt4x8f606l93olf7943h4t_firsti.jpg',
    sys_hook: 'https://i0.hdslb.com/bfs/storyff/n23052504q5dd8db6j1jwt70u7rwdow4_firsti.jpg',
    sys_dbl_receive: 'https://i0.hdslb.com/bfs/storyff/n2305250112ydor5l1z6m41qz6wqt6hz_firsti.jpg',
    sys_dbl_attack: 'https://i0.hdslb.com/bfs/storyff/n230525022k8dpzurrre382ux6sprzzk_firsti.jpg',
    /* 独立 BV — 各视频官方封面 */
    bi_clear_detail: 'https://i2.hdslb.com/bfs/archive/5c667d729f0e1cb943adae256884688f77f9f996.jpg',
    bi_smash_detail: 'https://i0.hdslb.com/bfs/archive/782acfdb2016de38c95b7c03bb5d42b51eb8943a.jpg',
    dbl_grip: 'https://i2.hdslb.com/bfs/archive/7e9b1be3663dfcef0b14b8e50957b6fde37348ce.jpg',
    dbl_net_block: 'https://i2.hdslb.com/bfs/archive/3501b00cf0e898433a7a41fbb03a1e87b2b95cb0.jpg',
    dbl_net_combo: 'https://i1.hdslb.com/bfs/archive/f1f4d5bae01a8d6936b4e1cd6f44f8fb70315040.jpg',
    dbl_qa: 'https://i0.hdslb.com/bfs/archive/ce641bea1a34d4cb7486179da14051f0cb1a5593.jpg',
    li_net_qa: 'https://i2.hdslb.com/bfs/archive/2cc61a4e5cbcaf6018946a1dd5cc8ed530b01873.jpg',
    li_defense_step: 'https://i2.hdslb.com/bfs/archive/1645edaaa9db8ac5e3d14a7e396025f1cccd63bb.jpg',
    li_rear_smash_step: 'https://i2.hdslb.com/bfs/archive/53afaa4957397f9fbdbcba13d86ce8e73e53f68d.jpg',
    li_spin_type: 'https://i0.hdslb.com/bfs/archive/b2f9532032bad0c4f9bf7d4a0fecbe89ad49f552.jpg',
    lh_net_spin: 'https://i1.hdslb.com/bfs/archive/793b41bdd38655159d64104b127967f7ef56e3f6.jpg',
    mixed_double: 'https://i2.hdslb.com/bfs/storyff/n240117a22qnmp9dnl9ns18ov8mfjgbg_firsti.jpg',
    mixed_rotate: 'https://i2.hdslb.com/bfs/archive/de46b29253641356e2997e0c21eec8596fad7cbc.jpg',
    pro_rally: 'https://i2.hdslb.com/bfs/archive/6a2742577a22ad006fe88284b7bdcdb76fb2a139.jpg'
  };

  var BVID_PIC = {
    BV16t411D7ke: XJ_SERIES_PIC,
    BV16M4y1v7jq: 'https://i1.hdslb.com/bfs/archive/4cb66de81858a5481d5cb3b803b51822798b934f.png',
    BV1rd4y1F7iE: 'https://i2.hdslb.com/bfs/archive/5c667d729f0e1cb943adae256884688f77f9f996.jpg',
    BV1pe4y1s7c6: 'https://i0.hdslb.com/bfs/archive/782acfdb2016de38c95b7c03bb5d42b51eb8943a.jpg'
  };

  var POSTER_CACHE_KEY = 'badminton_bili_posters';

  function normalizeHttps(url) {
    if (!url) return '';
    if (url.indexOf('//') === 0) return 'https:' + url;
    return url.replace(/^http:\/\//i, 'https://');
  }

  function getPosterCache() {
    try {
      return JSON.parse(localStorage.getItem(POSTER_CACHE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function setPosterCache(key, url) {
    var cache = getPosterCache();
    cache[key] = url;
    try {
      localStorage.setItem(POSTER_CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* ignore quota */ }
  }

  function posterCacheKey(bvid, page) {
    return bvid + '_p' + (page || 1);
  }

  function posterForEntry(entry) {
    if (!entry) return '';
    if (entry.pic) return normalizeHttps(entry.pic);
    var cache = getPosterCache();
    var ck = posterCacheKey(entry.bvid, entry.page);
    if (cache[ck]) return cache[ck];
    if (BVID_PIC[entry.bvid]) return BVID_PIC[entry.bvid];
    return '';
  }

  function poster(key) {
    if (POSTER_BY_KEY[key]) return POSTER_BY_KEY[key];
    return posterForEntry(CATALOG[key]);
  }

  /** 从 B 站 API 拉取原版封面（pic 或分P首帧）并缓存 */
  function fetchPoster(bvid, page, callback) {
    page = page || 1;
    var ck = posterCacheKey(bvid, page);
    var cache = getPosterCache();
    if (cache[ck]) {
      if (callback) callback(cache[ck]);
      return Promise.resolve(cache[ck]);
    }
    if (BVID_PIC[bvid] && page === 1) {
      setPosterCache(ck, BVID_PIC[bvid]);
      if (callback) callback(BVID_PIC[bvid]);
      return Promise.resolve(BVID_PIC[bvid]);
    }
    return fetch('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid)
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json || json.code !== 0 || !json.data) return '';
        var data = json.data;
        var url = normalizeHttps(data.pic);
        var pages = data.pages || [];
        var pg = pages[page - 1];
        if (pg && pg.first_frame) url = normalizeHttps(pg.first_frame);
        if (url) setPosterCache(ck, url);
        if (callback) callback(url);
        return url;
      })
      .catch(function () {
        if (callback) callback('');
        return '';
      });
  }

  /** 批量刷新页面上 video 封面 img */
  function refreshDomPosters($root) {
    var $scope = $root && $root.length ? $root : $(document);
    $scope.find('[data-bili-poster]').each(function () {
      var $el = $(this);
      var bvid = $el.data('bili-bvid');
      var page = $el.data('bili-page') || 1;
      if (!bvid) return;
      fetchPoster(bvid, page, function (url) {
        if (url) $el.attr('src', url);
      });
    });
  }

  function getEntry(key) {
    return CATALOG[key] || null;
  }

  /** 生成 B 站嵌入地址 */
  function embedUrl(entry) {
    if (!entry || entry.type !== 'bilibili') return '';
    return 'https://player.bilibili.com/player.html?bvid=' + entry.bvid +
      '&page=' + (entry.page || 1) +
      '&high_quality=1&danmaku=0&autoplay=0';
  }

  /** 生成 B 站观看页 */
  function watchUrl(entry) {
    if (!entry) return '';
    var base = 'https://www.bilibili.com/video/' + entry.bvid;
    if (entry.page && entry.page > 1) base += '?p=' + entry.page;
    return base;
  }

  /** 兼容旧字段：videoUrl 存 embed 地址 */
  function url(key) {
    return embedUrl(CATALOG[key]);
  }

  /** 渲染播放器 HTML（iframe 长教学） */
  function renderPlayerHtml(meta, opts) {
    opts = opts || {};
    var height = opts.height || 420;
    if (!meta) return '<p class="text-gray-400">暂无视频</p>';

    if (meta.videoType === 'bilibili' || meta.type === 'bilibili') {
      var src = meta.videoUrl || embedUrl(meta);
      var info = meta.videoTitle || meta.title || '';
      var dur = meta.duration ? '<span class="badge badge-mint ml-2">' + meta.duration + '</span>' : '';
      var coach = meta.coach ? '<span class="text-sm text-gray-500">教练：' + meta.coach + '</span>' : '';
      var link = meta.watchUrl || watchUrl(meta);
      return '<div class="video-embed-wrap">' +
        (info ? '<div class="mb-2 flex flex-wrap items-center gap-2"><strong>' + info + '</strong>' + dur + '</div>' : '') +
        (coach ? '<div class="mb-2">' + coach + '</div>' : '') +
        '<iframe class="video-embed-frame" src="' + src + '" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="height:' + height + 'px"></iframe>' +
        (link ? '<a href="' + link + '" target="_blank" rel="noopener" class="text-sm text-mint-dark mt-2 inline-block">↗ 在 B 站打开完整版</a>' : '') +
        '</div>';
    }

    /* 本地上传 mp4 */
    return '<video src="' + (meta.videoUrl || '') + '" poster="' + (meta.videoPoster || '') + '" controls playsinline class="w-full rounded-lg" style="max-height:' + height + 'px"></video>';
  }

  /** jQuery 挂载播放器 */
  function mount($container, meta, opts) {
    if (!$container || !$container.length) return;
    $container.html(renderPlayerHtml(meta, opts));
  }

  /** 从粘贴链接解析 B 站 */
  function parseBilibiliLink(text) {
    if (!text) return null;
    var m = text.match(/BV[\w]+/i);
    if (!m) return null;
    var pageM = text.match(/[?&]p=(\d+)/i);
    return {
      type: 'bilibili',
      videoType: 'bilibili',
      bvid: m[0],
      page: pageM ? parseInt(pageM[1], 10) : 1,
      title: 'B站羽毛球教学视频',
      videoUrl: embedUrl({ type: 'bilibili', bvid: m[0], page: pageM ? parseInt(pageM[1], 10) : 1 }),
      watchUrl: text.indexOf('http') === 0 ? text : 'https://www.bilibili.com/video/' + m[0],
      videoPoster: BVID_PIC[m[0]] || ''
    };
  }

  function enrichItem(item, key) {
    var e = CATALOG[key];
    if (!e) return;
    item.videoKey = key;
    item.videoType = 'bilibili';
    item.bvid = e.bvid;
    item.page = e.page;
    item.videoUrl = embedUrl(e);
    item.watchUrl = watchUrl(e);
    item.videoPoster = poster(key);
    item.image = item.videoPoster;
    item.videoTitle = e.title;
    item.duration = e.duration;
    item.coach = e.coach;
  }

  var TACTIC_VIDEOS = {
    tac_001: 'xj_rear_drill',
    tac_002: 'dbl_net_block',
    tac_003: 'mixed_double',
    tac_004: 'xj_smash',
    tac_005: 'xj_counter',
    tac_006: 'lh_net_spin',
    tac_007: 'sys_net_drop',
    tac_008: 'li_rear_smash_step',
    tac_009: 'sys_dbl_receive',
    tac_010: 'sys_flat_drive',
    tac_011: 'xj_net_lift',
    tac_012: 'sys_net_kill',
    tac_013: 'xj_full_court',
    tac_014: 'sys_dbl_defense',
    tac_015: 'mixed_double',
    tac_016: 'xj_drop',
    tac_017: 'xj_mid_kill',
    tac_018: 'sys_hook',
    tac_019: 'sys_move',
    tac_020: 'dbl_net_combo'
  };

  /* tac_015 与 tac_003 同 BV 不同 page */
  CATALOG.mixed_rotate = { type: 'bilibili', bvid: 'BV1J5411v7Dr', page: 2, title: '混双训练：前后场轮转配合', duration: '14分钟', coach: '混双专题' };
  TACTIC_VIDEOS.tac_015 = 'mixed_rotate';

  var HOT_VIDEOS = {
    hv_1: 'bi_clear_detail',
    hv_2: 'lh_net_spin',
    hv_3: 'dbl_net_combo',
    hv_4: 'sys_smash_long',
    hv_5: 'xj_footwork'
  };

  var POST_VIDEOS = {
    post_004: 'bi_smash_detail',
    post_006: 'xj_backhand_clear'
  };

  var ANALYSIS_VIDEOS = { va_001: 'bi_clear_detail' };

  var BANNER_VIDEOS = {
    banner_1: 'xj_full_court',
    banner_2: 'sys_smash_long',
    banner_3: 'dbl_qa'
  };

  var NEWS_COVERS = {
    news_1: 'pro_rally',
    news_2: 'bi_smash_detail',
    news_3: 'xj_grip',
    news_4: 'bi_clear_detail',
    news_5: 'sys_dbl_attack',
    news_6: 'sys_move',
    news_7: 'bi_smash_detail',
    news_8: 'xj_full_court',
    news_9: 'li_rear_smash_step',
    news_10: 'mixed_double'
  };

  /** 资讯条目注入封面；仅 video 类型附加播放器字段 */
  function enrichNewsItem(item, key) {
    if (!item || !key) return;
    var cover = poster(key);
    item.coverKey = key;
    item.image = cover;
    item.videoPoster = cover;
    if (item.type === 'video') {
      item.videoKey = key;
      enrichItem(item, key);
    }
  }

  function applyToMockData(data) {
    if (!data) return data;
    (data.tactics || []).forEach(function (t) { enrichItem(t, TACTIC_VIDEOS[t.id]); });
    (data.hotVideos || []).forEach(function (v) {
      enrichItem(v, HOT_VIDEOS[v.id]);
      v.videoDesc = v.videoTitle + ' · ' + (v.duration || '');
    });
    (data.posts || []).forEach(function (p) {
      var key = p.videoKey || (p.type === 'video' ? POST_VIDEOS[p.id] : null);
      if (key) {
        enrichItem(p, key);
        p.type = 'video';
      }
    });
    (data.videoAnalyses || []).forEach(function (a) {
      enrichItem(a, ANALYSIS_VIDEOS[a.id]);
      a.videoType = 'bilibili';
    });
    (data.banners || []).forEach(function (b) { enrichItem(b, BANNER_VIDEOS[b.id]); });
    (data.news || []).forEach(function (n) {
      enrichNewsItem(n, n.coverKey || n.videoKey || NEWS_COVERS[n.id]);
    });
    return data;
  }

  function migrateVideos(db) {
    var fresh = JSON.parse(JSON.stringify(window.MOCK_DATA));
    applyToMockData(fresh);
    ['tactics', 'hotVideos', 'posts', 'videoAnalyses', 'banners', 'news'].forEach(function (listKey) {
      if (listKey === 'posts') {
        db.posts = fresh.posts;
        return;
      }
      if (listKey === 'news') {
        db.news = fresh.news;
        return;
      }
      var map = {};
      (fresh[listKey] || []).forEach(function (x) { map[x.id] = x; });
      (db[listKey] || []).forEach(function (x) {
        if (!map[x.id]) return;
        ['videoUrl', 'videoPoster', 'videoKey', 'videoTitle', 'videoDesc', 'videoType', 'bvid', 'page', 'watchUrl', 'duration', 'coach'].forEach(function (f) {
          if (map[x.id][f] !== undefined) x[f] = map[x.id][f];
        });
        if (map[x.id].type === 'video') x.type = 'video';
      });
    });
    return db;
  }

  /** 迁移圈子社区数据 */
  function migrateCommunity(db) {
    var fresh = JSON.parse(JSON.stringify(window.MOCK_DATA));
    db.posts = fresh.posts;
    db.comments = fresh.comments;
    db.forums = fresh.forums;
    db.notifications = (fresh.notifications || []).concat((db.notifications || []).filter(function (n) {
      return !(fresh.notifications || []).some(function (fn) { return fn.id === n.id; });
    }));
    var existIds = {};
    (db.users || []).forEach(function (u) { existIds[u.id] = true; });
    (fresh.users || []).forEach(function (u) {
      if (!existIds[u.id]) db.users.push(u);
    });
    db.userLikes = Object.assign({}, fresh.userLikes, db.userLikes || {});
    return db;
  }

  window.VideoLib = {
    CATALOG: CATALOG,
    getEntry: getEntry,
    embedUrl: embedUrl,
    watchUrl: watchUrl,
    url: url,
    poster: poster,
    posterForEntry: posterForEntry,
    fetchPoster: fetchPoster,
    refreshDomPosters: refreshDomPosters,
    normalizeHttps: normalizeHttps,
    renderPlayerHtml: renderPlayerHtml,
    mount: mount,
    parseBilibiliLink: parseBilibiliLink,
    applyToMockData: applyToMockData,
    migrateVideos: migrateVideos,
    migrateCommunity: migrateCommunity,
    enrichItem: enrichItem,
    defaultDemoUrl: 'https://www.bilibili.com/video/BV16t411D7ke?p=14',
    defaultEmbedUrl: embedUrl(CATALOG.xj_clear)
  };

})(window);
