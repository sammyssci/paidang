/**
 * 圈子社区种子数据 — 模拟真实活跃羽球吧
 * 含 NPC 球友、35+ 帖子、120+ 评论、12 条可播放视频帖
 */
var COMMUNITY_SEED = {
  /* ========== NPC 球友（让圈子更真实） ========== */
  extraUsers: [
    { id: 'npc_001', username: 'linxiaoya', password: '', nickname: '林小雅', ballAge: 3, style: '网前型', rank: '业余中级', bio: '广州球友，周末固定打球', stats: { analysisCount: 5, postCount: 28, likeCount: 210, watchMinutes: 180 }, createdAt: '2024-08-01T00:00:00.000Z' },
    { id: 'npc_002', username: 'zhangwei_bd', password: '', nickname: '张伟_双打狂魔', ballAge: 8, style: '进攻型', rank: '业余高级', bio: '专攻双打，找固定搭档', stats: { analysisCount: 20, postCount: 56, likeCount: 890, watchMinutes: 520 }, createdAt: '2023-05-12T00:00:00.000Z' },
    { id: 'npc_003', username: 'chenmo', password: '', nickname: '沉默的杀球手', ballAge: 6, style: '进攻型', rank: '业余中级', bio: '后场杀球爱好者', stats: { analysisCount: 8, postCount: 19, likeCount: 345, watchMinutes: 240 }, createdAt: '2024-02-20T00:00:00.000Z' },
    { id: 'npc_004', username: 'xiaoyuanyuan', password: '', nickname: '小圆圆', ballAge: 2, style: '防守型', rank: '业余初级', bio: '入门学习中，请多指教', stats: { analysisCount: 2, postCount: 42, likeCount: 128, watchMinutes: 95 }, createdAt: '2025-03-15T00:00:00.000Z' },
    { id: 'npc_005', username: 'equipment_king', password: '', nickname: '装备党老王', ballAge: 10, style: '全能型', rank: '业余高级', bio: '球拍收藏50+，测评博主', stats: { analysisCount: 15, postCount: 88, likeCount: 1200, watchMinutes: 400 }, createdAt: '2022-11-08T00:00:00.000Z' },
    { id: 'npc_006', username: 'mixmaster', password: '', nickname: '混双小王子', ballAge: 4, style: '全能型', rank: '业余中级', bio: '混双专项，求女搭档', stats: { analysisCount: 11, postCount: 33, likeCount: 456, watchMinutes: 310 }, createdAt: '2024-04-22T00:00:00.000Z' },
    { id: 'npc_007', username: 'footwork_li', password: '', nickname: '步伐达人李', ballAge: 7, style: '防守型', rank: '业余高级', bio: '步法教练业余版', stats: { analysisCount: 25, postCount: 41, likeCount: 678, watchMinutes: 450 }, createdAt: '2023-09-01T00:00:00.000Z' },
    { id: 'npc_008', username: 'shenzhen_badminton', password: '', nickname: '深圳羽球社', ballAge: 5, style: '进攻型', rank: '业余中级', bio: '深圳本地约球群群主', stats: { analysisCount: 6, postCount: 67, likeCount: 534, watchMinutes: 280 }, createdAt: '2024-01-10T00:00:00.000Z' },
    { id: 'npc_009', username: 'coach_wang', password: '', nickname: '王教练', ballAge: 12, style: '全能型', rank: '专业级', bio: '青少年羽毛球教练', stats: { analysisCount: 120, postCount: 95, likeCount: 2100, watchMinutes: 890 }, createdAt: '2022-06-18T00:00:00.000Z' },
    { id: 'npc_010', username: 'night_owl', password: '', nickname: '夜猫子球友', ballAge: 3, style: '进攻型', rank: '业余初级', bio: '只有晚上有空打球', stats: { analysisCount: 4, postCount: 22, likeCount: 89, watchMinutes: 150 }, createdAt: '2025-01-05T00:00:00.000Z' },
    { id: 'npc_011', username: 'girl_doubles', password: '', nickname: '女双姐妹花', ballAge: 4, style: '网前型', rank: '业余中级', bio: '专注女双配合研究', stats: { analysisCount: 7, postCount: 38, likeCount: 412, watchMinutes: 220 }, createdAt: '2024-07-30T00:00:00.000Z' },
    { id: 'npc_012', username: 'budget_player', password: '', nickname: '穷鬼打球', ballAge: 2, style: '防守型', rank: '业余初级', bio: '预算有限，求性价比装备', stats: { analysisCount: 1, postCount: 31, likeCount: 256, watchMinutes: 60 }, createdAt: '2025-05-20T00:00:00.000Z' }
  ],

  /* ========== 吧务数据增强 ========== */
  forumBoost: {
    forum_1: { members: 28600, online: 512, todayPosts: 48 },
    forum_2: { members: 35200, online: 386, todayPosts: 35 },
    forum_3: { members: 19800, online: 278, todayPosts: 22 },
    forum_4: { members: 12400, online: 156, todayPosts: 18 },
    forum_5: { members: 42100, online: 890, todayPosts: 67 },
    forum_6: { members: 18900, online: 234, todayPosts: 41 },
    forum_7: { members: 31500, online: 445, todayPosts: 29 }
  },

  /* ========== 帖子（35条，覆盖全部7个吧） ========== */
  posts: [
    /* 新手吧 forum_1 */
    { id: 'post_001', forumId: 'forum_1', authorId: 'user_002', title: '刚学羽毛球，握拍对吗？求大神指点', type: 'text', content: '练了两个月，感觉高远球总是打不远，是不是握拍有问题？虎口对准拍柄侧面，但小拇指没有留空隙。', images: [], pinned: true, essence: true, likes: 145, dislikes: 3, views: 2890, favorites: 42, createdAt: '2026-01-08T10:00:00.000Z', poll: null, meetup: null },
    { id: 'post_009', forumId: 'forum_1', authorId: 'user_003', title: '新手必看的10个入门误区', type: 'text', content: '1.握拍太死 2.只用手臂发力 3.步伐不到位就击球 4.忽视热身 5.球拍磅数过高 6.穿跑鞋打球 7.不练高远球就学杀球 8.忽视反手 9.单打双打站位混淆 10.不拉伸就离场', images: [], pinned: false, essence: true, likes: 489, dislikes: 5, views: 15600, favorites: 312, createdAt: '2026-01-12T14:00:00.000Z', poll: null, meetup: null },
    { id: 'post_011', forumId: 'forum_1', authorId: 'npc_004', title: '第一次打羽毛球，手臂酸了三天正常吗？', type: 'text', content: '昨天打了两小时，今天手臂和肩膀都特别酸，是不是发力不对啊？', images: [], likes: 67, dislikes: 0, views: 1230, favorites: 8, createdAt: '2026-01-13T08:30:00.000Z', poll: null, meetup: null },
    { id: 'post_012', forumId: 'forum_1', authorId: 'npc_009', title: '【视频教学】新手握拍与发力入门', type: 'video', videoKey: 'xj_grip', content: '肖杰老师经典握拍教学，建议每个新手反复看三遍。', images: [], essence: true, likes: 312, dislikes: 1, views: 8900, favorites: 456, createdAt: '2026-01-13T11:00:00.000Z', poll: null, meetup: null },
    { id: 'post_013', forumId: 'forum_1', authorId: 'npc_010', title: '夜场打球需要注意什么？', type: 'text', content: '体育馆晚上灯光比较暗，有时候看不清球，大家有什么经验吗？', images: [], likes: 34, dislikes: 0, views: 560, favorites: 5, createdAt: '2026-01-14T20:00:00.000Z', poll: null, meetup: null },
    { id: 'post_014', forumId: 'forum_1', authorId: 'npc_012', title: '100块以内的球拍能买吗？', type: 'poll', content: '预算有限，以下哪款更适合新手？', images: [], likes: 89, dislikes: 2, views: 2340, favorites: 23, createdAt: '2026-01-15T09:00:00.000Z', poll: { options: [{ id: 'o1', text: '李宁入门款', votes: 45 }, { id: 'o2', text: 'Victor挑战者', votes: 38 }, { id: 'o3', text: '二手高端拍', votes: 52 }, { id: 'o4', text: '再攒攒钱', votes: 67 }], votedUsers: [] }, meetup: null },

    /* 装备吧 forum_2 */
    { id: 'post_002', forumId: 'forum_2', authorId: 'user_001', title: 'YONEX 100ZZ vs VICTOR 90K 怎么选？', type: 'text', content: '预算1500左右，进攻型打法，主要打双打后场。100ZZ中杆硬，90K速度快，纠结中。', images: [], essence: true, likes: 178, dislikes: 4, views: 4560, favorites: 89, createdAt: '2026-01-09T14:30:00.000Z', poll: null, meetup: null },
    { id: 'post_005', forumId: 'forum_2', authorId: 'user_002', title: '你最喜欢的羽毛球鞋是哪款？', type: 'poll', content: '来投票！选出你心中最佳羽毛球鞋。', images: [], likes: 134, dislikes: 0, views: 2780, favorites: 15, createdAt: '2026-01-11T08:00:00.000Z', poll: { options: [{ id: 'opt_1', text: 'YONEX 65Z3', votes: 128 }, { id: 'opt_2', text: 'VICTOR P9200', votes: 96 }, { id: 'opt_3', text: '李宁 鹘', votes: 72 }, { id: 'opt_4', text: '其他', votes: 34 }], votedUsers: [] }, meetup: null },
    { id: 'post_015', forumId: 'forum_2', authorId: 'npc_005', title: '【深度测评】100ZZ 三个月使用感受', type: 'video', videoKey: 'bi_clear_detail', content: '从控球、杀球、耐用性三个维度聊聊100ZZ，附高远球测试视频。', images: [], essence: true, likes: 267, dislikes: 8, views: 6780, favorites: 198, createdAt: '2026-01-12T16:00:00.000Z', poll: null, meetup: null },
    { id: 'post_016', forumId: 'forum_2', authorId: 'npc_005', title: '球线磅数对照表（建议收藏）', type: 'text', content: '新手：男单20-22磅 女单18-20磅\n进阶：男单24-26磅 女单22-24磅\n注意：气温高时适当降磅', images: [], pinned: true, likes: 523, dislikes: 2, views: 12300, favorites: 890, createdAt: '2026-01-10T10:00:00.000Z', poll: null, meetup: null },
    { id: 'post_017', forumId: 'forum_2', authorId: 'npc_012', title: '求推荐500以内入门球拍', type: 'text', content: '刚入门三个月，现在用的是借的拍子，想自己买一把。', images: [], likes: 45, dislikes: 0, views: 890, favorites: 12, createdAt: '2026-01-14T14:00:00.000Z', poll: null, meetup: null },

    /* 男单吧 forum_3 */
    { id: 'post_004', forumId: 'forum_3', authorId: 'user_003', title: '石宇奇杀球集锦+慢动作拆解', type: 'video', videoKey: 'bi_smash_detail', content: '整理了杀球教学视频，重点看击球点和手腕内旋，建议配合AI分析工具练习。', images: [], essence: true, likes: 356, dislikes: 2, views: 8900, favorites: 234, createdAt: '2026-01-10T16:00:00.000Z', poll: null, meetup: null },
    { id: 'post_018', forumId: 'forum_3', authorId: 'npc_003', title: '单打怎么打比自己快的人？', type: 'text', content: '每次遇到速度型选手就被压制，拉吊也不行，杀球又杀不死，求战术建议。', images: [], likes: 78, dislikes: 1, views: 1560, favorites: 34, createdAt: '2026-01-11T19:00:00.000Z', poll: null, meetup: null },
    { id: 'post_019', forumId: 'forum_3', authorId: 'npc_007', title: '【视频】米字步训练完整跟练', type: 'video', videoKey: 'xj_footwork', content: '肖杰老师步法练习，每天练15分钟，场上覆盖明显提升。', images: [], essence: true, likes: 445, dislikes: 0, views: 11200, favorites: 567, createdAt: '2026-01-12T08:00:00.000Z', poll: null, meetup: null },
    { id: 'post_020', forumId: 'forum_3', authorId: 'npc_003', title: '后场吊球总是下网怎么办？', type: 'text', content: '练习吊球十几次有七八次下网，是拍面太开了吗？', images: [], likes: 56, dislikes: 0, views: 780, favorites: 18, createdAt: '2026-01-13T15:30:00.000Z', poll: null, meetup: null },
    { id: 'post_021', forumId: 'forum_3', authorId: 'user_001', title: '【视频】正手高远球20分钟系统课', type: 'video', videoKey: 'xj_clear', content: '分享肖杰高远球完整教学，适合反复观看对照练习。', images: [], likes: 289, dislikes: 0, views: 7600, favorites: 345, createdAt: '2026-01-14T10:00:00.000Z', poll: null, meetup: null },

    /* 女双吧 forum_4 */
    { id: 'post_008', forumId: 'forum_4', authorId: 'user_002', title: '女双前场选手如何配合后场进攻？', type: 'text', content: '和搭档打女双，我负责前场但封网时机总不对，要么过早要么过晚。', images: [], likes: 96, dislikes: 1, views: 1920, favorites: 45, createdAt: '2026-01-12T09:30:00.000Z', poll: null, meetup: null },
    { id: 'post_022', forumId: 'forum_4', authorId: 'npc_011', title: '女双轮转跑位图解（建议收藏）', type: 'text', content: '进攻轮转：后场杀球后上前，搭档补位后场。防守轮转：平行站位，谁近谁接。附文字图解说明。', images: [], essence: true, likes: 234, dislikes: 0, views: 5600, favorites: 678, createdAt: '2026-01-11T14:00:00.000Z', poll: null, meetup: null },
    { id: 'post_023', forumId: 'forum_4', authorId: 'npc_011', title: '【视频】女双封网配合教学', type: 'video', videoKey: 'li_net_qa', content: '李老课堂双打封网典型问题解答，女双前场必看。', images: [], likes: 167, dislikes: 0, views: 4300, favorites: 234, createdAt: '2026-01-13T16:00:00.000Z', poll: null, meetup: null },
    { id: 'post_024', forumId: 'forum_4', authorId: 'npc_001', title: '找广州固定女双搭档', type: 'meetup', content: '本人业余中级，前场型，周末下午可打。', images: [], likes: 23, dislikes: 0, views: 456, favorites: 6, createdAt: '2026-01-14T11:00:00.000Z', poll: null, meetup: { time: '2026-01-18 14:00', location: '广州天河体育馆', spots: 2, filled: 1 } },

    /* 线下约球吧 forum_5 */
    { id: 'post_003', forumId: 'forum_5', authorId: 'user_001', title: '【约球】本周六下午北京朝阳体育馆', type: 'meetup', content: '约3-4人双打，业余中级，AA制。已有2人，还差2人。', images: [], pinned: true, likes: 45, dislikes: 0, views: 890, favorites: 12, createdAt: '2026-01-10T09:00:00.000Z', poll: null, meetup: { time: '2026-01-13 14:00', location: '北京朝阳体育馆', spots: 4, filled: 2 } },
    { id: 'post_010', forumId: 'forum_5', authorId: 'user_002', title: '【约球】上海浦东周末早上双打', type: 'meetup', content: '每周六早上8-10点，浦东源深体育馆，寻找固定搭档。', images: [], likes: 38, dislikes: 0, views: 560, favorites: 8, createdAt: '2026-01-12T16:00:00.000Z', poll: null, meetup: { time: '2026-01-14 08:00', location: '上海源深体育馆', spots: 3, filled: 1 } },
    { id: 'post_025', forumId: 'forum_5', authorId: 'npc_008', title: '【约球】深圳南山周三晚7-9点', type: 'meetup', content: '深圳羽球社固定活动，中高级局，欢迎加入微信群。', images: [], pinned: true, likes: 67, dislikes: 0, views: 1230, favorites: 23, createdAt: '2026-01-11T18:00:00.000Z', poll: null, meetup: { time: '2026-01-15 19:00', location: '深圳南山体育中心', spots: 6, filled: 4 } },
    { id: 'post_026', forumId: 'forum_5', authorId: 'npc_002', title: '【约球】成都周末混双缺1女', type: 'meetup', content: '水平业余中级以上，AA制，打完一起吃饭。', images: [], likes: 34, dislikes: 0, views: 670, favorites: 9, createdAt: '2026-01-13T20:00:00.000Z', poll: null, meetup: { time: '2026-01-17 15:00', location: '成都奥体中心', spots: 4, filled: 3 } },
    { id: 'post_027', forumId: 'forum_5', authorId: 'npc_008', title: '约球防鸽指南，建议置顶', type: 'text', content: '1.提前一天确认 2.留联系方式 3.首次约球选公共场所 4.迟到超过15分钟视为放弃 5.费用提前说清', images: [], essence: true, likes: 189, dislikes: 3, views: 4500, favorites: 234, createdAt: '2026-01-09T12:00:00.000Z', poll: null, meetup: null },

    /* 装备二手吧 forum_6 */
    { id: 'post_007', forumId: 'forum_6', authorId: 'user_001', title: '出95新 YONEX ARC11 3U 蓝色 900包邮', type: 'text', content: '打了3个月，无磕碰，原线原胶。因升级100ZZ出掉。', images: [], likes: 23, dislikes: 0, views: 890, favorites: 12, createdAt: '2026-01-11T15:00:00.000Z', poll: null, meetup: null },
    { id: 'post_028', forumId: 'forum_6', authorId: 'npc_005', title: '收一把4U 100ZZ 粉色或蓝色', type: 'text', content: '成色9成新以上，价格可谈，同城优先面交。', images: [], likes: 12, dislikes: 0, views: 340, favorites: 5, createdAt: '2026-01-12T11:00:00.000Z', poll: null, meetup: null },
    { id: 'post_029', forumId: 'forum_6', authorId: 'npc_012', title: '二手球拍交易防骗Tips', type: 'text', content: '1.走平台担保 2.要求实拍视频 3.警惕低价诱惑 4.面交验货 5.保留聊天记录', images: [], pinned: true, likes: 156, dislikes: 1, views: 3400, favorites: 189, createdAt: '2026-01-08T09:00:00.000Z', poll: null, meetup: null },

    /* 教学答疑吧 forum_7 */
    { id: 'post_006', forumId: 'forum_7', authorId: 'user_003', title: '【视频教学】反手高远球发力详解', type: 'video', videoKey: 'xj_backhand_clear', content: '反手高远球完整教学：侧身引拍、拇指顶宽面、手腕外旋、击球点。', images: [], pinned: true, essence: true, likes: 534, dislikes: 0, views: 15600, favorites: 890, createdAt: '2026-01-11T11:00:00.000Z', poll: null, meetup: null },
    { id: 'post_030', forumId: 'forum_7', authorId: 'npc_009', title: '【视频】杀球26分钟系统训练课', type: 'video', videoKey: 'sys_smash_long', content: '系统训练教程杀球专集，从准备到发力完整讲解。', images: [], essence: true, likes: 678, dislikes: 0, views: 18900, favorites: 1234, createdAt: '2026-01-10T08:00:00.000Z', poll: null, meetup: null },
    { id: 'post_031', forumId: 'forum_7', authorId: 'npc_006', title: '【视频】混双轮转配合教学', type: 'video', videoKey: 'mixed_rotate', content: '混双前后场转换时机与跑位，男女搭档必看。', images: [], likes: 345, dislikes: 0, views: 9800, favorites: 456, createdAt: '2026-01-12T13:00:00.000Z', poll: null, meetup: null },
    { id: 'post_032', forumId: 'forum_7', authorId: 'npc_002', title: '【视频】双打封网连贯套路', type: 'video', videoKey: 'dbl_net_combo', content: 'B站最全双打教学第三集，封网连贯套路详解。', images: [], likes: 423, dislikes: 1, views: 11200, favorites: 567, createdAt: '2026-01-13T09:00:00.000Z', poll: null, meetup: null },
    { id: 'post_033', forumId: 'forum_7', authorId: 'npc_007', title: '【视频】网前搓球基础课', type: 'video', videoKey: 'lh_net_spin', content: '刘辉教练网前展搓基础，搓球不稳定的朋友看这篇。', images: [], likes: 289, dislikes: 0, views: 7600, favorites: 389, createdAt: '2026-01-14T08:00:00.000Z', poll: null, meetup: null },
    { id: 'post_034', forumId: 'forum_7', authorId: 'user_002', title: '请教：杀球时肩膀疼是什么原因？', type: 'text', content: '打完球右肩前面特别疼，是不是发力方式有问题？需要热身吗？', images: [], likes: 78, dislikes: 0, views: 1890, favorites: 23, createdAt: '2026-01-14T16:00:00.000Z', poll: null, meetup: null },
    { id: 'post_035', forumId: 'forum_7', authorId: 'npc_009', title: '【视频】双打后场杀球步法', type: 'video', videoKey: 'li_rear_smash_step', content: '李老课堂：双打后场左右移动杀球步法，火力全覆盖。', images: [], likes: 198, dislikes: 0, views: 5400, favorites: 267, createdAt: '2026-01-15T10:00:00.000Z', poll: null, meetup: null }
  ]
};

/**
 * 合并社区种子到 MOCK_DATA
 */
function mergeCommunitySeed(data) {
  if (!data || !COMMUNITY_SEED) return data;

  /* 合并 NPC 用户（不重复） */
  var existIds = {};
  (data.users || []).forEach(function (u) { existIds[u.id] = true; });
  COMMUNITY_SEED.extraUsers.forEach(function (u) {
    if (!existIds[u.id]) data.users.push(u);
  });

  /* 增强吧数据 */
  (data.forums || []).forEach(function (f) {
    var boost = COMMUNITY_SEED.forumBoost[f.id];
    if (boost) {
      f.members = boost.members;
      f.online = boost.online;
      f.todayPosts = boost.todayPosts;
    }
  });

  /* 替换为丰富帖子 */
  data.posts = COMMUNITY_SEED.posts.map(function (p) {
    return Object.assign({ images: [], videoUrl: '', pinned: false, essence: false, dislikes: 0, favorites: 0, poll: null, meetup: null }, p);
  });

  /* 丰富评论 */
  data.comments = COMMUNITY_SEED.buildComments();

  /* 模拟已有互动 */
  data.userLikes = COMMUNITY_SEED.seedLikes;
  data.notifications = COMMUNITY_SEED.seedNotifications;

  return data;
}

/** 生成大量评论 */
COMMUNITY_SEED.buildComments = function () {
  var authors = ['user_001', 'user_002', 'user_003', 'npc_001', 'npc_002', 'npc_003', 'npc_004', 'npc_005', 'npc_006', 'npc_007', 'npc_008', 'npc_009', 'npc_011'];
  var templates = [
    '说得对，学到了！', '感谢分享，收藏了', '同款困扰， mark', '教练讲得清楚', '明天试试',
    '有没有更详细的？', '顶上去！', '实测有效', '请问楼主还在吗', '同感+1',
    '这个视频太有用了', '已转发给球友', '能出个慢动作吗', '建议置顶', '反对楼上，我觉得...'
  ];
  var comments = {};
  var cmtId = 1;
  var baseDate = new Date('2026-01-08');

  COMMUNITY_SEED.posts.forEach(function (post, pi) {
    var list = [];
    var count = 3 + (pi % 8);
    for (var i = 0; i < count; i++) {
      var d = new Date(baseDate.getTime() + (pi * 86400000) + (i * 3600000));
      list.push({
        id: 'cmt_' + (cmtId++),
        authorId: authors[(pi + i) % authors.length],
        content: templates[(pi + i) % templates.length] + (post.title.length > 10 ? ' — 关于「' + post.title.substring(0, 8) + '…」' : ''),
        createdAt: d.toISOString(),
        likes: Math.floor(Math.random() * 20) + 1,
        parentId: null
      });
    }
    /* 楼中楼 */
    if (list.length > 2) {
      list.push({
        id: 'cmt_' + (cmtId++),
        authorId: authors[(pi + 2) % authors.length],
        content: '回复楼上：同意，补充一点个人经验～',
        createdAt: new Date(d.getTime() + 1800000).toISOString(),
        likes: Math.floor(Math.random() * 8) + 1,
        parentId: list[0].id
      });
    }
    comments[post.id] = list;
  });

  /* 手工精评 */
  comments.post_001 = [
    { id: 'cmt_001', authorId: 'user_003', content: '握拍基本正确，建议虎口再放松一些，拍面稍微倾斜。', createdAt: '2026-01-08T11:00:00.000Z', likes: 45, parentId: null },
    { id: 'cmt_002', authorId: 'npc_009', content: '高远球打不远通常是发力问题，不是握拍。建议先看肖杰握拍+发力的视频。', createdAt: '2026-01-08T12:30:00.000Z', likes: 67, parentId: null },
    { id: 'cmt_003', authorId: 'user_002', content: '谢谢大神！我去看视频了', createdAt: '2026-01-08T13:00:00.000Z', likes: 12, parentId: 'cmt_001' },
    { id: 'cmt_004', authorId: 'npc_007', content: '补充：检查一下是不是握太死了，放松才能鞭打发力', createdAt: '2026-01-08T14:00:00.000Z', likes: 23, parentId: null }
  ];
  comments.post_004 = [
    { id: 'cmt_005', authorId: 'npc_003', content: '杀球角度太刁钻了，学习了', createdAt: '2026-01-10T17:00:00.000Z', likes: 34, parentId: null },
    { id: 'cmt_006', authorId: 'user_002', content: '已用AI分析工具练了，确实有进步', createdAt: '2026-01-10T18:00:00.000Z', likes: 28, parentId: null },
    { id: 'cmt_007', authorId: 'npc_002', content: '建议搭配步法一起看', createdAt: '2026-01-10T19:00:00.000Z', likes: 15, parentId: null }
  ];
  comments.post_030 = [
    { id: 'cmt_008', authorId: 'user_001', content: '26分钟干货，收藏！', createdAt: '2026-01-10T09:00:00.000Z', likes: 89, parentId: null },
    { id: 'cmt_009', authorId: 'npc_003', content: '杀球力量明显提升，练了一周', createdAt: '2026-01-10T10:30:00.000Z', likes: 56, parentId: null }
  ];

  return comments;
};

COMMUNITY_SEED.seedLikes = {
  user_001: ['post_004', 'post_019', 'post_030', 'post_032'],
  user_002: ['post_001', 'post_009', 'post_006'],
  user_003: ['post_015', 'post_021']
};

COMMUNITY_SEED.seedNotifications = [
  { id: 'notif_001', toUserId: 'user_002', fromUserId: 'user_003', type: 'comment', content: '评论了你的帖子《刚学羽毛球，握拍对吗？》', refId: 'post_001', read: false, createdAt: '2026-01-08T11:05:00.000Z' },
  { id: 'notif_002', toUserId: 'user_001', fromUserId: 'npc_003', type: 'like', content: '赞了你的帖子《石宇奇杀球集锦+慢动作拆解》', refId: 'post_004', read: false, createdAt: '2026-01-10T17:30:00.000Z' },
  { id: 'notif_003', toUserId: 'user_002', fromUserId: 'npc_009', type: 'comment', content: '评论了你的帖子《请教：杀球时肩膀疼是什么原因？》', refId: 'post_034', read: true, createdAt: '2026-01-14T17:00:00.000Z' }
];

if (typeof window !== 'undefined') {
  window.COMMUNITY_SEED = COMMUNITY_SEED;
  window.mergeCommunitySeed = mergeCommunitySeed;
}
