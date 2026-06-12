/**
 * 羽毛球综合服务网站 - 模拟初始数据
 * 首次打开网站时写入 localStorage，刷新不丢失
 */

const MOCK_DATA = {
  /* ========== 测试用户账号 ========== */
  users: [
    {
      id: 'user_001',
      username: 'demo',
      password: '123456',
      nickname: '羽球达人',
      avatar: '',
      ballAge: 5,
      style: '进攻型',
      rank: '业余中级',
      bio: '热爱羽毛球，擅长后场杀球，欢迎交流切磋！',
      stats: {
        analysisCount: 12,
        postCount: 8,
        likeCount: 156,
        watchMinutes: 320
      },
      createdAt: '2024-01-15T08:00:00.000Z'
    },
    {
      id: 'user_002',
      username: 'test',
      password: '123456',
      nickname: '新手小白',
      avatar: '',
      ballAge: 1,
      style: '防守型',
      rank: '业余初级',
      bio: '刚入门羽毛球，正在学习基础步伐。',
      stats: {
        analysisCount: 3,
        postCount: 15,
        likeCount: 42,
        watchMinutes: 85
      },
      createdAt: '2024-06-01T10:00:00.000Z'
    },
    {
      id: 'user_003',
      username: 'pro_player',
      password: '123456',
      nickname: '专业教练李',
      avatar: '',
      ballAge: 15,
      style: '全能型',
      rank: '专业级',
      bio: '国家二级运动员，专注羽毛球教学与战术分析。',
      stats: {
        analysisCount: 89,
        postCount: 45,
        likeCount: 892,
        watchMinutes: 1560
      },
      createdAt: '2023-03-20T14:00:00.000Z'
    }
  ],

  /* ========== 轮播图数据 ========== */
  banners: [
    {
      id: 'banner_1',
      title: '2026全英羽毛球公开赛',
      desc: '世界羽联超级1000赛事，3月18日伯明翰开战',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4e4?w=1200&h=400&fit=crop',
      link: 'tactics.html',
      type: '赛事'
    },
    {
      id: 'banner_2',
      title: '后场高远球精讲课程',
      desc: '国家队教练亲授，从握拍到发力完整教学',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=400&fit=crop',
      link: 'video-analysis.html',
      type: '教学'
    },
    {
      id: 'banner_3',
      title: '春季业余联赛报名中',
      desc: '单打/双打/混双组别，奖金池50000元',
      image: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=1200&h=400&fit=crop',
      link: 'community.html',
      type: '活动'
    },
    {
      id: 'banner_4',
      title: '认证教练 · 线下一对一指导',
      desc: '覆盖北京/上海/广州/深圳/成都/郑州，选择球馆预约专业教练',
      image: 'https://images.unsplash.com/photo-1780233689566-55045608bd17?w=1200&h=400&fit=crop&q=85',
      link: 'coaching.html',
      type: '教练'
    }
  ],

  /* ========== 热门赛事 ========== */
  events: [
    {
      id: 'evt_1',
      name: '2026全英羽毛球公开赛',
      date: '2026-03-18',
      endDate: '2026-03-23',
      location: '英国伯明翰',
      venue: 'Utilita Arena Birmingham',
      status: '即将开始',
      level: '超级1000',
      prize: '£950,000',
      description: '全英公开赛是世界羽联超级1000级别赛事，与世锦赛、奥运会并称羽坛三大赛。2026年赛事将于伯明翰举行，各国顶尖选手将争夺全英冠军头衔。',
      schedule: [
        { round: '资格赛', date: '2026-03-17', note: '上午场' },
        { round: '小组赛/首轮', date: '2026-03-18', note: '09:00 起' },
        { round: '1/4决赛', date: '2026-03-21', note: '18:00 起' },
        { round: '半决赛', date: '2026-03-22', note: '14:00 起' },
        { round: '决赛', date: '2026-03-23', note: '15:00 男单/女单' }
      ],
      highlights: ['石宇奇', '安赛龙', '陈雨菲', '戴资颖'],
      registrationOpen: false,
      tags: ['超级1000', '单打', '双打']
    },
    {
      id: 'evt_2',
      name: '2026亚洲羽毛球锦标赛',
      date: '2026-04-25',
      endDate: '2026-04-30',
      location: '中国宁波',
      venue: '宁波奥体中心',
      status: '报名中',
      level: '洲际锦标赛',
      prize: '¥500,000',
      description: '亚洲羽毛球锦标赛是亚洲最高级别的单项锦标赛，汇聚亚洲各国顶尖选手。2026年在中国宁波举办，中国队主场作战。',
      schedule: [
        { round: '报名截止', date: '2026-04-10', note: '23:59' },
        { round: '小组赛', date: '2026-04-25', note: '09:00 起' },
        { round: '淘汰赛', date: '2026-04-27', note: '全天' },
        { round: '决赛', date: '2026-04-30', note: '19:00' }
      ],
      highlights: ['石宇奇', '李诗沣', '陈雨菲', '何冰娇'],
      registrationOpen: true,
      tags: ['洲际赛', '单打', '双打']
    },
    {
      id: 'evt_3',
      name: '2026汤尤杯',
      date: '2026-05-10',
      endDate: '2026-05-18',
      location: '印度新德里',
      venue: 'K.D. Jadhav Indoor Hall',
      status: '筹备中',
      level: '团体世锦赛',
      prize: '团体荣誉',
      description: '汤姆斯杯（男子团体）与尤伯杯（女子团体）是羽毛球界最高团体荣誉。2026年印度新德里承办，各国国家队展开团体对决。',
      schedule: [
        { round: '小组赛', date: '2026-05-10', note: '汤尤杯同步' },
        { round: '1/4决赛', date: '2026-05-14', note: '团体赛' },
        { round: '半决赛', date: '2026-05-16', note: '团体赛' },
        { round: '决赛', date: '2026-05-18', note: '汤杯+尤杯' }
      ],
      highlights: ['中国队', '印尼队', '韩国队', '日本队'],
      registrationOpen: false,
      tags: ['团体赛', '国家队']
    },
    {
      id: 'evt_4',
      name: '2026世界羽毛球锦标赛',
      date: '2026-08-15',
      endDate: '2026-08-23',
      location: '日本东京',
      venue: '东京体育馆',
      status: '筹备中',
      level: '世锦赛',
      prize: '世界冠军',
      description: '世界羽毛球锦标赛是除奥运会外最高级别的单项赛事，每届产生新的世界冠军。2026年于东京举行。',
      schedule: [
        { round: '资格赛', date: '2026-08-14', note: '资格赛' },
        { round: '正赛首轮', date: '2026-08-15', note: '五个单项' },
        { round: '1/4决赛', date: '2026-08-20', note: '全天' },
        { round: '决赛', date: '2026-08-23', note: '五个单项决赛' }
      ],
      highlights: ['石宇奇', '安赛龙', '陈雨菲', '山口茜'],
      registrationOpen: false,
      tags: ['世锦赛', '单打', '双打']
    },
    {
      id: 'evt_5',
      name: '2026中国羽毛球公开赛',
      date: '2026-09-20',
      endDate: '2026-09-25',
      location: '中国常州',
      venue: '常州奥体中心',
      status: '报名中',
      level: '超级1000',
      prize: '¥1,200,000',
      description: '中国公开赛是世界羽联超级1000赛事，在国内拥有极高关注度。业余爱好者可关注同期业余组报名。',
      schedule: [
        { round: '业余组报名', date: '2026-08-01', note: '已开放' },
        { round: '职业组首轮', date: '2026-09-20', note: '09:00 起' },
        { round: '半决赛', date: '2026-09-24', note: '18:00 起' },
        { round: '决赛', date: '2026-09-25', note: '14:00 起' }
      ],
      highlights: ['石宇奇', '李诗沣', '郑思维/黄雅琼'],
      registrationOpen: true,
      tags: ['超级1000', '业余组开放']
    }
  ],

  /* ========== 球员战绩 ========== */
  playerStats: [
    {
      id: 'ps_1', name: '石宇奇', rank: 1, worldRank: 1, category: '男单',
      wins: 45, losses: 8, country: '中国', points: 104350, winRate: 84.9,
      titles2025: 4, age: 28, status: 'active', retiredAt: null, plannedRetirement: '2028-12',
      profile: {
        birthDate: '1996-02-28', birthplace: '江苏南京', height: '183cm', weight: '75kg',
        handedness: '右手', grip: '正手', coach: '孙俊', debutYear: 2014,
        bio: '东京奥运会男单亚军，2024年巴黎奥运会男单季军。以拉吊结合突击的打法著称，后场进攻威胁大。'
      },
      recentMatches: [
        { opponent: '安赛龙', result: '胜', score: '21-18 21-15', event: '马来西亚公开赛', date: '2026-01-12' },
        { opponent: '李诗沣', result: '胜', score: '21-16 21-19', event: '马来西亚公开赛', date: '2026-01-11' },
        { opponent: '昆拉武特', result: '胜', score: '21-14 18-21 21-17', event: '印度公开赛', date: '2026-01-05' }
      ]
    },
    {
      id: 'ps_2', name: '安赛龙', rank: 2, worldRank: 2, category: '男单',
      wins: 42, losses: 10, country: '丹麦', points: 98720, winRate: 80.8,
      titles2025: 3, age: 31, status: 'active', retiredAt: null, plannedRetirement: '2027-08',
      profile: {
        birthDate: '1994-01-04', birthplace: '丹麦欧登塞', height: '194cm', weight: '80kg',
        handedness: '右手', grip: '正手', coach: '肯尼斯·乔纳森', debutYear: 2010,
        bio: '东京奥运会男单冠军，两届世锦赛冠军。身高优势突出，后场杀球与防守覆盖能力顶尖。'
      },
      recentMatches: [
        { opponent: '石宇奇', result: '负', score: '18-21 15-21', event: '马来西亚公开赛', date: '2026-01-12' },
        { opponent: '安东森', result: '胜', score: '21-12 21-18', event: '马来西亚公开赛', date: '2026-01-10' },
        { opponent: '李梓嘉', result: '胜', score: '21-17 21-14', event: '印度公开赛', date: '2026-01-04' }
      ]
    },
    {
      id: 'ps_3', name: '陈雨菲', rank: 3, worldRank: 3, category: '女单',
      wins: 40, losses: 12, country: '中国', points: 95680, winRate: 76.9,
      titles2025: 3, age: 27, status: 'active', retiredAt: null, plannedRetirement: '2029-06',
      profile: {
        birthDate: '1998-03-01', birthplace: '浙江杭州', height: '171cm', weight: '60kg',
        handedness: '右手', grip: '正手', coach: '罗毅刚', debutYear: 2015,
        bio: '东京奥运会女单冠军，尤伯杯主力成员。打法稳健全面，防守反击能力出色，心理稳定性强。'
      },
      recentMatches: [
        { opponent: '戴资颖', result: '胜', score: '21-19 21-17', event: '马来西亚公开赛', date: '2026-01-12' },
        { opponent: '何冰娇', result: '胜', score: '21-15 21-18', event: '马来西亚公开赛', date: '2026-01-11' },
        { opponent: '山口茜', result: '负', score: '19-21 21-18 18-21', event: '印度公开赛', date: '2026-01-06' }
      ]
    },
    {
      id: 'ps_4', name: '戴资颖', rank: 4, worldRank: 4, category: '女单',
      wins: 38, losses: 14, country: '中国台北', points: 92100, winRate: 73.1,
      titles2025: 2, age: 30, status: 'retired', retiredAt: '2024-08-13', plannedRetirement: null,
      profile: {
        birthDate: '1994-06-20', birthplace: '台湾高雄', height: '163cm', weight: '58kg',
        handedness: '右手', grip: '正手', coach: '廖国栋', debutYear: 2009,
        bio: '曾长期占据女单世界第一，世锦赛亚军。以假动作多变、网前细腻著称。2024年8月宣布退出国际赛场。'
      },
      recentMatches: [
        { opponent: '陈雨菲', result: '负', score: '19-21 17-21', event: '马来西亚公开赛', date: '2026-01-12' },
        { opponent: '安洗莹', result: '胜', score: '21-16 21-19', event: '印度公开赛', date: '2026-01-07' },
        { opponent: '马林', result: '胜', score: '21-12 21-15', event: '印度公开赛', date: '2026-01-05' }
      ]
    },
    {
      id: 'ps_5', name: '李诗沣', rank: 5, worldRank: 5, category: '男单',
      wins: 36, losses: 15, country: '中国', points: 88900, winRate: 70.6,
      titles2025: 2, age: 25, status: 'active', retiredAt: null, plannedRetirement: '2030-03',
      profile: {
        birthDate: '2000-01-02', birthplace: '江西南昌', height: '178cm', weight: '70kg',
        handedness: '右手', grip: '正手', coach: '陈金', debutYear: 2018,
        bio: '亚运会男单冠军，国羽新生代领军人物。进攻速度快，后场杀球连贯性好，具备较强多拍相持能力。'
      },
      recentMatches: [
        { opponent: '石宇奇', result: '负', score: '16-21 19-21', event: '马来西亚公开赛', date: '2026-01-11' },
        { opponent: '奈良冈功大', result: '胜', score: '21-18 21-16', event: '印度公开赛', date: '2026-01-06' },
        { opponent: '骆建佑', result: '胜', score: '21-14 21-17', event: '印度公开赛', date: '2026-01-04' }
      ]
    },
    {
      id: 'ps_6', name: '郑思维/黄雅琼', rank: 6, worldRank: 1, category: '混双',
      wins: 52, losses: 6, country: '中国', points: 112400, winRate: 89.7,
      titles2025: 6, age: 28, status: 'active', retiredAt: null, plannedRetirement: '2027-12',
      profile: {
        birthDate: '1997-02-28 / 1994-02-05', birthplace: '浙江杭州 / 浙江杭州',
        height: '185cm / 167cm', weight: '78kg / 55kg',
        handedness: '均为右手', grip: '正手', coach: '杨明', debutYear: 2017,
        bio: '奥运会、世锦赛、苏迪曼杯混双冠军组合。郑思维前场封网快，黄雅琼后场过渡稳定，配合默契度极高。'
      },
      recentMatches: [
        { opponent: '渡边/东野', result: '胜', score: '21-17 21-14', event: '马来西亚公开赛', date: '2026-01-12' },
        { opponent: '冯/黄', result: '胜', score: '21-19 21-16', event: '马来西亚公开赛', date: '2026-01-10' },
        { opponent: '徐/蔡', result: '胜', score: '21-15 21-18', event: '印度公开赛', date: '2026-01-05' }
      ]
    },
    {
      id: 'ps_7', name: '梁伟铿/王昶', rank: 7, worldRank: 2, category: '男双',
      wins: 48, losses: 9, country: '中国', points: 105200, winRate: 84.2,
      titles2025: 5, age: 26, status: 'active', retiredAt: null, plannedRetirement: '2029-08',
      profile: {
        birthDate: '2000-11-05 / 1999-01-07', birthplace: '广东广州 / 浙江宁波',
        height: '178cm / 180cm', weight: '72kg / 74kg',
        handedness: '均为右手', grip: '正手', coach: '陈其美', debutYear: 2019,
        bio: '世锦赛男双冠军，进攻型双打组合。梁伟铿后场杀球力量足，王昶中前场连贯封网速度快。'
      },
      recentMatches: [
        { opponent: '姜/徐', result: '胜', score: '21-18 21-16', event: '马来西亚公开赛', date: '2026-01-12' },
        { opponent: '阿山/塞蒂亚万', result: '胜', score: '21-15 21-19', event: '印度公开赛', date: '2026-01-07' },
        { opponent: '兰基雷迪/谢提', result: '负', score: '19-21 21-18 17-21', event: '印度公开赛', date: '2026-01-05' }
      ]
    },
    {
      id: 'ps_8', name: '安洗莹', rank: 8, worldRank: 6, category: '女单',
      wins: 35, losses: 11, country: '韩国', points: 87600, winRate: 76.1,
      titles2025: 3, age: 23, status: 'active', retiredAt: null, plannedRetirement: '2031-06',
      profile: {
        birthDate: '2002-02-17', birthplace: '韩国光州', height: '169cm', weight: '58kg',
        handedness: '右手', grip: '正手', coach: '成池汉', debutYear: 2017,
        bio: '巴黎奥运会女单冠军，韩羽女单领军人物。移动能力出色，多拍相持与变速突击结合紧密。'
      },
      recentMatches: [
        { opponent: '戴资颖', result: '负', score: '16-21 19-21', event: '印度公开赛', date: '2026-01-07' },
        { opponent: '马林', result: '胜', score: '21-14 21-16', event: '印度公开赛', date: '2026-01-06' },
        { opponent: '何冰娇', result: '胜', score: '21-18 19-21 21-15', event: '马来西亚公开赛', date: '2026-01-10' }
      ]
    },
    {
      id: 'ps_9', name: '谌龙', rank: 9, worldRank: null, category: '男单',
      wins: 312, losses: 89, country: '中国', points: 0, winRate: 77.8,
      titles2025: 0, age: 36, status: 'retired', retiredAt: '2023-05-13', plannedRetirement: null,
      profile: {
        birthDate: '1989-01-18', birthplace: '湖北荆州', height: '178cm', weight: '72kg',
        handedness: '右手', grip: '正手', coach: '李永波（退役前）', debutYear: 2006,
        bio: '里约奥运会男单冠军，伦敦奥运会男单亚军，两届世锦赛冠军。以防守反击和拉吊控制见长，2023年5月正式退役。'
      },
      recentMatches: []
    }
  ],

  /* ========== 首页交互记录（赛事订阅/球员关注/报名） ========== */
  homeInteractions: {
    eventSubscriptions: {},
    eventRegistrations: {},
    playerFollows: {}
  },

  /* ========== 热门教学视频榜单 ========== */
  hotVideos: [
    { id: 'hv_1', title: '正手高远球发力技巧', views: 125000, author: '专业教练李', link: 'video-analysis.html' },
    { id: 'hv_2', title: '网前搓球慢动作拆解', views: 98000, author: '羽球达人', link: 'video-analysis.html' },
    { id: 'hv_3', title: '双打轮转配合训练', views: 87000, author: '专业教练李', link: 'video-analysis.html' },
    { id: 'hv_4', title: '杀球点位的选择', views: 76000, author: '羽球达人', link: 'video-analysis.html' },
    { id: 'hv_5', title: '步伐训练：米字步', views: 65000, author: '新手小白', link: 'video-analysis.html' }
  ],

  /* ========== 资讯文章 ========== */
  news: [
    {
      id: 'news_1',
      title: '世界羽联正式发布2026赛季赛历，31站赛事贯穿全年',
      category: '行业新闻',
      type: 'article',
      coverKey: 'pro_rally',
      author: '李晓明',
      source: '世界羽联（BWF）',
      summary: '2026赛季共安排31站世界巡回赛，含4站超级1000、6站超级750；全英赛3月打响，中国公开赛9月落户常州。',
      content: '2026年1月8日，世界羽联（BWF）在吉隆坡总部正式公布了2026赛季世界巡回赛完整赛历。新赛季共设有31站赛事，级别覆盖超级1000、750、500、300及100，为巴黎奥运周期后的首个完整赛季划定了清晰路线图。\n\n超级1000级别赛事共4站：马来西亚公开赛（1月13—18日）、全英公开赛（3月18—23日）、印尼公开赛（6月10—15日）以及中国公开赛（9月16—21日，举办地常州）。超级750级别包括印度公开赛、新加坡公开赛、日本公开赛、丹麦公开赛等6站。\n\n中国羽毛球队方面，教练组已根据赛历制定上半年训练计划。全英公开赛被队内定为重点备战目标之一，单打组将提前赴英国适应场地。世界羽联同时宣布，2026年起部分超级500赛事将试行新的视频回放挑战规则，决赛局每边可挑战两次。\n\n对于业余爱好者而言，2026赛季意味着更多顶级赛事可通过直播观看。中国公开赛继续保留业余组组别，报名通道预计于2026年7月开放。羽球爱好者可关注世界羽联官网及"羽球综合服务平台"首页赛事模块，获取最新签表与直播信息。',
      date: '2026-01-10',
      readMinutes: 4,
      published: true,
      image: ''
    },
    {
      id: 'news_2',
      title: 'YONEX ARC11 PRO 深度测评',
      category: '装备测评',
      type: 'video',
      videoKey: 'bi_smash_detail',
      summary: '新一代弓11 Pro在控球性和杀球威力上均有提升，附杀球发力教学参考。',
      content: '作为YONEX经典弓系列的最新力作，ARC11 PRO在拍框稳定性与杀球传导上做了升级。结合 Badminton Insight 杀球力量与时机教学，从发力原理理解如何发挥进攻型球拍优势。',
      date: '2026-01-08',
      image: ''
    },
    {
      id: 'news_3',
      title: '新手入门：握拍方式完全指南',
      category: '新手入门',
      type: 'video',
      videoKey: 'xj_grip',
      summary: '正确的握拍是打好羽毛球的第一步，肖杰老师经典握拍教学完整版。',
      content: '握拍方式直接影响击球质量和手感。正手握拍与反手握拍各有要点：虎口对准拍柄侧面、手指留隙、握拍放松。建议配合肖杰《学打羽毛球》握拍篇反复练习。',
      date: '2026-01-05',
      image: ''
    },
    {
      id: 'news_4',
      title: 'VICTOR 神速90K 二代测评',
      category: '装备测评',
      type: 'video',
      videoKey: 'bi_clear_detail',
      summary: '神速系列最新款速度型球拍测评，附高远球发力详解。',
      content: 'VICTOR神速90K二代延续了系列的速度基因，适合快速进攻型打法。理解正手高远球发力原理，有助于发挥速度型球拍在中后场压制上的优势。',
      date: '2026-01-03',
      image: ''
    },
    {
      id: 'news_5',
      title: '国羽海南冬训收官：双打组重点演练进攻轮转',
      category: '行业新闻',
      type: 'article',
      coverKey: 'sys_dbl_attack',
      author: '王晨',
      source: '新华社',
      summary: '中国国家羽毛球队在海南陵水完成2025—2026赛季冬训，双打组围绕进攻站位与前后场轮转进行了为期三周的专项强化。',
      content: '2025年12月26日，中国国家羽毛球队在海南陵水训练基地结束了为期六周的冬训。本次冬训是2026赛季开赛前最后一次系统合练，混双、男双、女双三个组均完成了进攻站位与轮转配合的专项演练。\n\n据教练组介绍，冬训期间双打组每日上午进行多球对抗，下午安排录像复盘。混双组重点解决了女生后场过渡与男生上网衔接的时序问题；男双组则针对接发后第三拍连贯压制进行了战术细化。总教练张军在接受采访时表示："冬训目标不是练出新花样，而是把基本功和配合默契再夯实一层。"\n\n单打方面，石宇奇、陈雨菲等主力队员保持了每天两练的节奏，重点强化多拍相持中的变速能力。年轻队员李诗沣、韩悦等也随队完成全程训练，教练组对他们的进步给予肯定。\n\n国羽将于2026年1月中旬出征马来西亚公开赛，开启新赛季征程。届时男双组合梁伟铿/王昶、混双郑思维/黄雅琼将悉数出战。',
      date: '2025-12-28',
      readMinutes: 3,
      published: true,
      image: ''
    },
    {
      id: 'news_6',
      title: '如何选择适合自己的羽毛球鞋',
      category: '新手入门',
      type: 'video',
      videoKey: 'sys_move',
      summary: '从步法与移动基础入手，理解选鞋与场上移动的关系。',
      content: '一双合适的羽毛球鞋能有效防止运动损伤。选鞋需结合场地类型、脚型与打法风格。打好步法与移动基础，才能更好发挥球鞋的防滑与缓震性能。本期附系统训练教程移动篇。',
      date: '2025-12-25',
      image: ''
    },
    {
      id: 'news_7',
      title: '石宇奇时隔一年重返男单世界第一',
      category: '行业新闻',
      type: 'article',
      coverKey: 'bi_smash_detail',
      author: '体育周报',
      source: 'BWF世界排名',
      summary: '凭借2025中国羽毛球大师赛冠军及马来西亚公开赛四强积分，石宇奇以104350分重返男单榜首。',
      content: '2025年12月20日，世界羽联更新最新一期世界排名。中国选手石宇奇凭借在中国羽毛球大师赛（超级750）夺冠以及后续赛事的稳定发挥，以104350分超越丹麦选手安赛龙，时隔一年重返男单世界第一。\n\n这是石宇奇职业生涯第三次登顶男单榜首。2025年下半年，他在常州大师赛决赛中以21—18、21—16击败印尼选手金廷，夺冠后排名积分大幅攀升。安赛龙因肩伤缺席部分赛事，以98720分位列第二；中国台北选手周天成排名第三。\n\n石宇奇在赛后采访中表示："排名是结果，不是目标。2026年最重要的还是全英和世锦赛。"中国羽协同日发文祝贺，并确认其已入选马来西亚公开赛参赛名单。\n\n国羽男单整体表现稳健：李诗沣排名第五，翁泓阳进入前二十。教练组认为，男单集团优势为2026赛季苏迪曼杯和汤尤杯提供了信心保障。',
      date: '2025-12-20',
      readMinutes: 3,
      published: true,
      image: ''
    },
    {
      id: 'news_8',
      title: '2025中国羽毛球大师赛圆满落幕，国羽斩获三金两银',
      category: '行业新闻',
      type: 'article',
      coverKey: 'xj_full_court',
      author: '常州日报',
      source: '中国羽毛球协会',
      summary: '超级750级别赛事在常州奥体中心收官，石宇奇、陈雨菲分获单打冠军，混双郑思维/黄雅琼成功卫冕。',
      content: '2025年11月30日，2025中国羽毛球大师赛在江苏常州奥体中心体育馆落下帷幕。作为超级750级别赛事，本届大师赛吸引了来自28个国家和地区的400余名选手参赛，国羽最终收获三金两银。\n\n男单决赛，石宇奇以21—18、21—16战胜金廷，继2018年后再次在主场观众面前捧起冠军奖杯。女单方面，陈雨菲在决赛中击败日本选手山口茜，实现本赛季第三冠。混双卫冕冠军郑思维/黄雅琼直落两局击败韩国组合，展现稳定统治力。\n\n男双决赛，梁伟铿/王昶与队友刘雨辰/欧烜屹会师，最终前者组合夺冠；女双陈清晨/贾一凡获得银牌。赛事期间，常州当地共接待球迷超8万人次，带动周边餐饮住宿消费显著增长。\n\n中国羽毛球协会秘书长表示，大师赛的成功举办进一步推动了羽毛球运动在长三角地区的普及。2026年中国公开赛将继续在常州举行，业余组报名预计于明年夏季开放。',
      date: '2025-12-01',
      readMinutes: 4,
      published: true,
      image: ''
    },
    {
      id: 'news_9',
      title: '世界羽联公布2026积分规则微调方案，奥运周期选手受益',
      category: '行业新闻',
      type: 'article',
      coverKey: 'li_rear_smash_step',
      author: '国际羽联观察',
      source: 'BWF官方公告',
      summary: '新规则将于2026年3月1日生效，超级1000冠军积分维持12000分，低级别赛事积分系数小幅上调。',
      content: '2025年12月15日，世界羽联发布《2026赛季积分排名系统调整说明》，新方案将于2026年3月1日起正式生效。此次调整是巴黎奥运会后首次系统性修订，旨在平衡各级别赛事积分权重。\n\n主要变化包括：超级1000冠军积分维持12000分不变；超级500冠军积分由9200分上调至9600分；超级300冠军积分由7000分上调至7400分。此外，同一周内连续参加两站赛事的选手，第二站积分将按90%系数计算，以减轻密集赛程带来的积分"稀释"效应。\n\n规则修订还涉及伤病保护条款：因医疗原因退赛且提供BWF认可证明的选手，可在14天内申请保护排名，保护期最长12周。这一条款受到多位顶尖选手欢迎，安赛龙团队在社交媒体表示"合理的规则有助于运动员职业生涯规划"。\n\n中国羽协已组织教练组学习新规则，并将在队内战术会上向队员详细解读。业余赛事方面，2026年中国羽毛球协会业余联赛将继续沿用现有积分体系，不受BWF职业规则影响。',
      date: '2025-12-15',
      readMinutes: 5,
      published: true,
      image: ''
    },
    {
      id: 'news_10',
      title: '2026苏迪曼杯落户厦门，3月19日揭幕',
      category: '行业新闻',
      type: 'article',
      coverKey: 'mixed_double',
      author: '厦门晚报',
      source: '中国羽毛球协会',
      summary: '第19届苏迪曼杯世界羽毛球混合团体锦标赛将于2026年3月19日至28日在厦门凤凰体育馆举行，中国队力争卫冕。',
      content: '2025年12月10日，中国羽毛球协会与世界羽联联合宣布：第19届苏迪曼杯世界羽毛球混合团体锦标赛将于2026年3月19日至28日在福建厦门凤凰体育馆举行。这是厦门继2019年后第二次承办苏迪曼杯。\n\n苏迪曼杯为混合团体赛，每场比赛由男单、女单、男双、女双、混双五场单项组成。中国队是该项赛事历史上最成功的队伍，曾13次夺冠。2025年苏州苏迪曼杯，中国队在决赛中3—1击败韩国队成功卫冕。\n\n厦门组委会介绍，赛事门票将于2026年1月下旬通过官方渠道开售，预计开放8个比赛日场次。场馆周边已规划球迷互动区与羽毛球体验区，赛事期间将举办业余双打挑战赛等配套活动。\n\n国羽混双组郑思维/黄雅琼、冯彦哲/黄东萍，以及男单石宇奇、女单陈雨菲均已确认进入备战名单。教练组表示，苏迪曼杯是2026上半年最重要的团体赛事，冬训成果将在该项赛事中接受检验。',
      date: '2025-12-10',
      readMinutes: 4,
      published: true,
      image: ''
    }
  ],

  /* ========== 战术洞察库（30+条） ========== */
  tactics: [
    {
      id: 'tac_001', title: '单打拉吊突击战术', category: '单打战术', level: '进阶',
      player: '石宇奇', type: '进攻', likes: 328, views: 5600, pinned: true,
      summary: '通过后场高远球和吊球调动对手，寻找杀球机会。',
      content: '拉吊突击是单打中最经典的战术体系。核心思路：1. 后场高远球压制对手底线；2. 突然吊球打空档；3. 对手回球质量下降时果断杀球得分。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2025-12-01T08:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_002', title: '双打前场封网战术', category: '双打战术', level: '专业',
      player: '郑思维', type: '网前', likes: 456, views: 8900, pinned: true,
      summary: '前场选手的封网时机与手法，配合后场进攻形成压制。',
      content: '双打前场封网的关键在于预判和反应速度。封网时机：对手回球偏高时立即上前；手法：搓球、扑球、推球交替使用。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2025-12-05T10:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_003', title: '混双男前女后站位', category: '混双战术', level: '新手',
      player: '郑思维/黄雅琼', type: '站位', likes: 289, views: 7200, pinned: false,
      summary: '混双经典站位模式，男选手前场封网，女选手后场进攻。',
      content: '混双男前女后是最常见的站位方式。男选手负责网前控制和封网，女选手在后场负责进攻和防守转换。',
      videoUrl: '', createdAt: '2025-12-08T14:00:00.000Z', authorId: 'user_001'
    },
    {
      id: 'tac_004', title: '后场杀球落点选择', category: '前场后场打法', level: '进阶',
      player: '林丹', type: '杀球', likes: 512, views: 12000, pinned: true,
      summary: '杀球不是越重越好，落点选择才是得分关键。',
      content: '后场杀球的落点选择：1. 直线杀向边线；2. 斜线杀向空档；3. 追身杀球打乱节奏；4. 结合吊球形成变化。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2025-12-10T09:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_005', title: '防守反击：挡网转攻', category: '防守反击', level: '进阶',
      player: '桃田贤斗', type: '防守', likes: 367, views: 6800, pinned: false,
      summary: '被动防守中通过挡网创造反击机会的经典套路。',
      content: '防守反击的核心是"以守为攻"。当处于被动时，利用挡网将球放到网前，迫使对手上网，然后快速反击。',
      videoUrl: '', createdAt: '2025-12-12T11:00:00.000Z', authorId: 'user_001'
    },
    {
      id: 'tac_006', title: '网前搓球博弈技巧', category: '网前博弈', level: '专业',
      player: '戴资颖', type: '搓球', likes: 423, views: 9500, pinned: false,
      summary: '网前搓球的旋转控制与假动作运用。',
      content: '网前搓球博弈是高水平比赛的焦点。关键技巧：1. 正手搓球带旋转；2. 反手搓球快速过网；3. 假搓真推迷惑对手。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2025-12-15T16:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_007', title: '单打控网战术', category: '单打战术', level: '新手',
      player: '陈雨菲', type: '网前', likes: 198, views: 4200, pinned: false,
      summary: '通过网前小球控制节奏，消耗对手体力。',
      content: '控网战术适合体力占优时使用。频繁使用放网、搓球迫使对手上网，消耗其体力后再发起进攻。',
      videoUrl: '', createdAt: '2025-12-18T08:00:00.000Z', authorId: 'user_002'
    },
    {
      id: 'tac_008', title: '双打后场进攻体系', category: '双打战术', level: '进阶',
      player: '李俊慧/刘雨辰', type: '进攻', likes: 345, views: 7800, pinned: false,
      summary: '双打后场选手的进攻选择与配合跑位。',
      content: '双打后场进攻需要与搭档密切配合。进攻选择：杀球、吊球、平抽；跑位：进攻后上前，搭档补位后场。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2025-12-20T10:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_009', title: '混双发接发战术', category: '混双战术', level: '进阶',
      player: '王懿律/黄东萍', type: '发接发', likes: 276, views: 6100, pinned: false,
      summary: '混双发接发阶段的前三板战术设计。',
      content: '混双发接发决定了回合的主动权。发球：偷后场与发前网交替；接发：扑球、推球、挑球的选择。',
      videoUrl: '', createdAt: '2025-12-22T13:00:00.000Z', authorId: 'user_001'
    },
    {
      id: 'tac_010', title: '前场推球快速过网', category: '前场后场打法', level: '新手',
      player: '安赛龙', type: '推球', likes: 167, views: 3800, pinned: false,
      summary: '前场推球的速度与角度控制要领。',
      content: '推球是前场最常用的进攻手段。推直线打空档，推斜线调动对手，推球过网速度要快。',
      videoUrl: '', createdAt: '2025-12-25T09:00:00.000Z', authorId: 'user_002'
    },
    {
      id: 'tac_011', title: '被动防守：挑球过渡', category: '防守反击', level: '新手',
      player: '陈雨菲', type: '防守', likes: 145, views: 3200, pinned: false,
      summary: '被动情况下如何通过挑球回到相持阶段。',
      content: '被动防守时，挑高远球是最安全的选择。挑球要点：弧度要高，落点要到底线，给自己回位时间。',
      videoUrl: '', createdAt: '2025-12-28T11:00:00.000Z', authorId: 'user_002'
    },
    {
      id: 'tac_012', title: '网前扑球时机把握', category: '网前博弈', level: '进阶',
      player: '黄雅琼', type: '扑球', likes: 312, views: 7100, pinned: false,
      summary: '判断对手回球高度，选择最佳扑球时机。',
      content: '扑球是网前最直接的得分手段。时机：对手回球过网高度超过网口10cm时；手法：快速下压，直奔对手空档。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2026-01-02T08:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_013', title: '单打变速战术', category: '单打战术', level: '专业',
      player: '安赛龙', type: '节奏', likes: 389, views: 8200, pinned: false,
      summary: '通过节奏变化打乱对手击球习惯。',
      content: '变速战术的核心是"快-慢-快"的节奏切换。突然加速杀球后，下一拍放网减速；慢节奏拉吊后突然提速突击。',
      videoUrl: '', createdAt: '2026-01-04T10:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_014', title: '双打平行站位防守', category: '双打战术', level: '新手',
      player: '阿山/塞蒂亚万', type: '防守', likes: 234, views: 5500, pinned: false,
      summary: '双打防守阶段的平行站位与分工。',
      content: '平行站位是双打防守的标准站位。左右分工：各守半边场地；前后层次：一人稍前一人稍后，形成立体防守。',
      videoUrl: '', createdAt: '2026-01-06T14:00:00.000Z', authorId: 'user_001'
    },
    {
      id: 'tac_015', title: '混双女前男后转换', category: '混双战术', level: '专业',
      player: '渡边勇太/东野有纱', type: '轮转', likes: 298, views: 6400, pinned: false,
      summary: '混双中前后场角色转换的时机与跑位。',
      content: '混双轮转是高级战术。转换时机：后场进攻被防回时，前场选手后退；跑位路线：交叉换位，避免碰撞。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2026-01-08T09:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_016', title: '后场吊球假动作', category: '前场后场打法', level: '进阶',
      player: '石宇奇', type: '吊球', likes: 356, views: 7600, pinned: false,
      summary: '后场吊球与杀球的假动作一致性训练。',
      content: '吊球假动作的关键是挥拍动作与杀球一致。在最高点击球前瞬间改变拍面，使吊球具有欺骗性。',
      videoUrl: '', createdAt: '2026-01-09T11:00:00.000Z', authorId: 'user_001'
    },
    {
      id: 'tac_017', title: '接杀球分球反击', category: '防守反击', level: '专业',
      player: '桃田贤斗', type: '接杀', likes: 445, views: 9800, pinned: false,
      summary: '接杀球后的分球线路选择与反击时机。',
      content: '接杀球分球是防守反击的精髓。分球线路：挡网前、挑后场、抽平球；选择原则：避开杀球者，打向空档。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2026-01-10T08:00:00.000Z', authorId: 'user_003'
    },
    {
      id: 'tac_018', title: '网前勾对角技巧', category: '网前博弈', level: '进阶',
      player: '戴资颖', type: '勾球', likes: 267, views: 5900, pinned: false,
      summary: '网前勾对角球的出手时机与拍面控制。',
      content: '勾对角是网前的变化球。出手时机：对手向直线移动时；拍面控制：手腕快速翻转，球过网后向对角飞去。',
      videoUrl: '', createdAt: '2026-01-11T10:00:00.000Z', authorId: 'user_001'
    },
    {
      id: 'tac_019', title: '单打体能分配策略', category: '单打战术', level: '进阶',
      player: '谌龙', type: '体能', likes: 189, views: 4100, pinned: false,
      summary: '长局比赛中如何合理分配体能。',
      content: '单打体能分配策略：开局试探不宜过猛；中局加速扩大优势；末局根据比分调整节奏。',
      videoUrl: '', createdAt: '2026-01-11T14:00:00.000Z', authorId: 'user_002'
    },
    {
      id: 'tac_020', title: '双打中局轮转', category: '双打战术', level: '专业',
      player: '姜敏京/金元昊', type: '轮转', likes: 378, views: 8500, pinned: false,
      summary: '双打中局阶段的进攻轮转与补位。',
      content: '中局轮转是双打得分的关键。进攻者杀球后上前；搭档补位后场；形成连续进攻压制。',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      createdAt: '2026-01-12T09:00:00.000Z', authorId: 'user_003'
    }
  ],

  /* ========== 圈子分区（贴吧） ========== */
  forums: [
    { id: 'forum_1', name: '新手吧', icon: '🌱', desc: '羽毛球新手交流，提问入门问题', members: 12580, online: 326, notice: '欢迎新手提问，禁止广告！' },
    { id: 'forum_2', name: '装备吧', icon: '🏸', desc: '球拍球鞋测评与推荐', members: 8920, online: 218, notice: '测评请客观真实，禁止虚假推荐。' },
    { id: 'forum_3', name: '男单吧', icon: '💪', desc: '男子单打技术讨论', members: 6540, online: 156, notice: '专注男单技术，欢迎分享训练心得。' },
    { id: 'forum_4', name: '女双吧', icon: '👭', desc: '女子双打配合与战术', members: 4320, online: 98, notice: '女双配合技巧交流专区。' },
    { id: 'forum_5', name: '线下约球吧', icon: '📍', desc: '同城约球、组队打球', members: 9870, online: 412, notice: '约球请注意安全，诚信约球。' },
    { id: 'forum_6', name: '装备二手吧', icon: '♻️', desc: '二手球拍球鞋交易', members: 5670, online: 145, notice: '交易请走正规渠道，谨防诈骗。' },
    { id: 'forum_7', name: '教学答疑吧', icon: '📚', desc: '技术问题解答与教学分享', members: 7890, online: 267, notice: '提问请附视频或详细描述。' }
  ],

  /* ========== 圈子帖子 ========== */
  posts: [
    {
      id: 'post_001', forumId: 'forum_1', authorId: 'user_002',
      title: '刚学羽毛球，握拍对吗？求大神指点', type: 'text',
      content: '练了两个月，感觉高远球总是打不远，是不是握拍有问题？附一张握拍照片描述：虎口对准拍柄侧面。',
      images: [], videoUrl: '', pinned: true, essence: true,
      likes: 45, dislikes: 2, views: 890, favorites: 12,
      createdAt: '2026-01-08T10:00:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_002', forumId: 'forum_2', authorId: 'user_001',
      title: 'YONEX 100ZZ vs VICTOR 90K 怎么选？', type: 'text',
      content: '预算1500左右，进攻型打法，主要打双打后场。两款球拍纠结中，有用过的球友给点建议吗？',
      images: [], videoUrl: '', pinned: false, essence: true,
      likes: 78, dislikes: 3, views: 1560, favorites: 34,
      createdAt: '2026-01-09T14:30:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_003', forumId: 'forum_5', authorId: 'user_001',
      title: '【约球】本周六下午北京朝阳体育馆', type: 'meetup',
      content: '约3-4人双打，水平业余中级，AA制场地费。有意向的楼下回复留联系方式。',
      images: [], videoUrl: '', pinned: true, essence: false,
      likes: 23, dislikes: 0, views: 456, favorites: 8,
      createdAt: '2026-01-10T09:00:00.000Z',
      poll: null,
      meetup: { time: '2026-01-13 14:00', location: '北京朝阳体育馆', spots: 4, filled: 2 }
    },
    {
      id: 'post_004', forumId: 'forum_3', authorId: 'user_003',
      title: '石宇奇全英赛精彩杀球集锦', type: 'video',
      content: '整理了石宇奇在全英赛中的几个经典杀球，落点变化太精彩了！',
      images: [], videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', pinned: false, essence: true,
      likes: 156, dislikes: 1, views: 3200, favorites: 89,
      createdAt: '2026-01-10T16:00:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_005', forumId: 'forum_2', authorId: 'user_002',
      title: '你最喜欢的羽毛球鞋是哪款？', type: 'poll',
      content: '来投票吧！选出你心中最佳羽毛球鞋。',
      images: [], videoUrl: '', pinned: false, essence: false,
      likes: 34, dislikes: 0, views: 780, favorites: 5,
      createdAt: '2026-01-11T08:00:00.000Z',
      poll: {
        options: [
          { id: 'opt_1', text: 'YONEX 65Z3', votes: 28 },
          { id: 'opt_2', text: 'VICTOR P9200', votes: 22 },
          { id: 'opt_3', text: '李宁 鹘', votes: 15 },
          { id: 'opt_4', text: '其他', votes: 8 }
        ],
        votedUsers: []
      },
      meetup: null
    },
    {
      id: 'post_006', forumId: 'forum_7', authorId: 'user_003',
      title: '【教学】反手高远球发力详解', type: 'text',
      content: '反手高远球是很多人的弱项。要点：1. 侧身引拍；2. 拇指顶住拍柄宽面；3. 手腕外旋发力；4. 击球点在身体前方。',
      images: [], videoUrl: '', pinned: true, essence: true,
      likes: 234, dislikes: 0, views: 4500, favorites: 167,
      createdAt: '2026-01-11T11:00:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_007', forumId: 'forum_6', authorId: 'user_001',
      title: '出95新 YONEX ARC11 3U 蓝色', type: 'text',
      content: '打了3个月，无磕碰，原线原胶。因升级100ZZ出掉，900包邮。',
      images: [], videoUrl: '', pinned: false, essence: false,
      likes: 12, dislikes: 0, views: 340, favorites: 6,
      createdAt: '2026-01-11T15:00:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_008', forumId: 'forum_4', authorId: 'user_002',
      title: '女双前场选手如何配合后场进攻？', type: 'text',
      content: '和搭档打女双，我负责前场但总感觉封网时机不对，要么过早要么过晚。有经验的姐妹分享下经验吧。',
      images: [], videoUrl: '', pinned: false, essence: false,
      likes: 56, dislikes: 1, views: 920, favorites: 23,
      createdAt: '2026-01-12T09:30:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_009', forumId: 'forum_1', authorId: 'user_003',
      title: '新手必看的10个入门误区', type: 'text',
      content: '1. 握拍太死；2. 只用手臂发力；3. 步伐不到位就击球；4. 忽视热身；5. 球拍磅数过高...',
      images: [], videoUrl: '', pinned: false, essence: true,
      likes: 189, dislikes: 2, views: 5600, favorites: 145,
      createdAt: '2026-01-12T14:00:00.000Z',
      poll: null, meetup: null
    },
    {
      id: 'post_010', forumId: 'forum_5', authorId: 'user_002',
      title: '【约球】上海浦东周末早上双打', type: 'meetup',
      content: '每周六早上8-10点，浦东源深体育馆，寻找固定搭档。',
      images: [], videoUrl: '', pinned: false, essence: false,
      likes: 18, dislikes: 0, views: 280, favorites: 4,
      createdAt: '2026-01-12T16:00:00.000Z',
      poll: null,
      meetup: { time: '2026-01-14 08:00', location: '上海源深体育馆', spots: 3, filled: 1 }
    }
  ],

  /* ========== 帖子评论 ========== */
  comments: {
    post_001: [
      { id: 'cmt_001', authorId: 'user_003', content: '握拍基本正确，建议虎口再放松一些，拍面稍微倾斜。', createdAt: '2026-01-08T11:00:00.000Z', likes: 12, parentId: null },
      { id: 'cmt_002', authorId: 'user_001', content: '高远球打不远可能是发力方式问题，试试侧身引拍。', createdAt: '2026-01-08T12:30:00.000Z', likes: 8, parentId: null },
      { id: 'cmt_003', authorId: 'user_002', content: '谢谢大神指点！我试试侧身引拍。', createdAt: '2026-01-08T13:00:00.000Z', likes: 3, parentId: 'cmt_001' }
    ],
    post_002: [
      { id: 'cmt_004', authorId: 'user_003', content: '100ZZ中杆更硬，90K速度更快。双打后场推荐100ZZ。', createdAt: '2026-01-09T15:00:00.000Z', likes: 15, parentId: null }
    ],
    post_004: [
      { id: 'cmt_005', authorId: 'user_001', content: '石宇奇的杀球角度太刁钻了！', createdAt: '2026-01-10T17:00:00.000Z', likes: 6, parentId: null },
      { id: 'cmt_006', authorId: 'user_002', content: '能出个慢动作分析吗？', createdAt: '2026-01-10T18:00:00.000Z', likes: 4, parentId: null }
    ],
    post_006: [
      { id: 'cmt_007', authorId: 'user_002', content: '收藏了！反手一直是我的弱项。', createdAt: '2026-01-11T12:00:00.000Z', likes: 9, parentId: null }
    ]
  },

  /* ========== 战术评论 ========== */
  tacticComments: {
    tac_001: [
      { id: 'tcmt_001', authorId: 'user_002', content: '拉吊突击练了半年，确实有效果！', createdAt: '2025-12-02T10:00:00.000Z' },
      { id: 'tcmt_002', authorId: 'user_001', content: '请问拉吊过程中如何保持耐心？', createdAt: '2025-12-03T14:00:00.000Z' }
    ],
    tac_002: [
      { id: 'tcmt_003', authorId: 'user_001', content: '封网时机讲得很清楚，实战试试。', createdAt: '2025-12-06T09:00:00.000Z' }
    ]
  },

  /* ========== 视频分析记录（示例） ========== */
  videoAnalyses: [
    {
      id: 'va_001', userId: 'user_001', title: '正手高远球练习',
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', videoType: 'online',
      createdAt: '2026-01-05T10:00:00.000Z',
      analysis: {
        actions: ['高远球', '步伐'],
        frames: [
          { time: 0.5, action: '引拍', label: '侧身引拍到位' },
          { time: 1.2, action: '高远球', label: '击球点偏后' },
          { time: 2.0, action: '步伐', label: '回中速度良好' }
        ],
        speed: 280, landing: '底线内10cm', mistakes: ['击球点偏后', '手腕未充分内旋'],
        pros: ['侧身充分', '步伐到位', '随挥完整'],
        cons: ['击球点偏后', '发力不够连贯'],
        suggestions: ['多练定点高远球找击球点', '加强核心力量训练', '注意手腕内旋发力'],
        heatmap: [[0.2,0.3,0.8],[0.5,0.6,0.9],[0.3,0.4,0.7],[0.7,0.2,0.5],[0.4,0.8,0.6]]
      }
    }
  ],

  /* ========== 用户收藏与互动记录 ========== */
  userFavorites: {},
  userLikes: {},
  userDislikes: {},
  userPostVotes: {},
  notifications: [],

  /* ========== 反馈记录 ========== */
  feedbacks: [],

  /* ========== 羽毛球馆 ========== */
  venues: [
    {
      id: 'venue_1',
      name: '羽动天地羽毛球馆',
      city: '北京',
      district: '朝阳区',
      address: '望京街10号华彩商业中心B2',
      phone: '010-88886666',
      hours: '08:00 - 22:00',
      courts: 12,
      priceRange: '80-120元/小时',
      facilities: ['淋浴', '免费停车', '装备租赁', '休息区'],
      rating: 4.8,
      reviewCount: 326,
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4e4?w=600&h=360&fit=crop',
      tags: ['地铁直达', '专业地胶']
    },
    {
      id: 'venue_2',
      name: '冠军羽毛球俱乐部',
      city: '北京',
      district: '海淀区',
      address: '中关村大街28号',
      phone: '010-66668888',
      hours: '09:00 - 21:30',
      courts: 8,
      priceRange: '100-150元/小时',
      facilities: ['淋浴', '私教区', 'VIP包厢', '咖啡吧'],
      rating: 4.9,
      reviewCount: 512,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=360&fit=crop',
      tags: ['国家队训练基地合作', '空调恒温']
    },
    {
      id: 'venue_3',
      name: '沪上羽球中心',
      city: '上海',
      district: '浦东新区',
      address: '世纪大道1000号3F',
      phone: '021-55556666',
      hours: '07:30 - 23:00',
      courts: 16,
      priceRange: '90-130元/小时',
      facilities: ['淋浴', '储物柜', '装备店', '免费WiFi'],
      rating: 4.7,
      reviewCount: 428,
      image: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=600&h=360&fit=crop',
      tags: ['陆家嘴商圈', '赛事承办']
    },
    {
      id: 'venue_4',
      name: '羊城飞鸟羽毛球馆',
      city: '广州',
      district: '天河区',
      address: '体育西路188号',
      phone: '020-33334444',
      hours: '08:00 - 22:00',
      courts: 10,
      priceRange: '70-110元/小时',
      facilities: ['淋浴', '停车场', '饮料售卖', '穿线服务'],
      rating: 4.6,
      reviewCount: 289,
      image: 'https://images.unsplash.com/photo-1622163642999-9584a24d9c8d?w=600&h=360&fit=crop',
      tags: ['业余联赛主场', '新手友好']
    },
    {
      id: 'venue_5',
      name: '鹏城羽球训练基地',
      city: '深圳',
      district: '南山区',
      address: '科技园南路66号',
      phone: '0755-88889999',
      hours: '08:00 - 22:30',
      courts: 14,
      priceRange: '85-125元/小时',
      facilities: ['淋浴', '免费停车', '青少年培训区', '视频回放室'],
      rating: 4.8,
      reviewCount: 367,
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=360&fit=crop',
      tags: ['AI辅助训练', '青少年特色']
    },
    {
      id: 'venue_6',
      name: '蓉城羽动馆',
      city: '成都',
      district: '武侯区',
      address: '人民南路四段8号',
      phone: '028-77778888',
      hours: '09:00 - 21:00',
      courts: 9,
      priceRange: '60-100元/小时',
      facilities: ['淋浴', '茶歇区', '装备租赁'],
      rating: 4.5,
      reviewCount: 198,
      image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=360&fit=crop',
      tags: ['性价比高', '社区球友多']
    },
    {
      id: 'venue_7',
      name: '中原羽球运动中心',
      city: '郑州',
      district: '金水区',
      address: '花园路136号正弘城体育层',
      phone: '0371-66668888',
      hours: '08:00 - 22:00',
      courts: 11,
      priceRange: '65-95元/小时',
      facilities: ['淋浴', '免费停车', '装备租赁', '穿线服务', '休息区'],
      rating: 4.7,
      reviewCount: 412,
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4e4?w=600&h=360&fit=crop',
      tags: ['地铁2号线', '业余联赛承办', '中央空调']
    },
    {
      id: 'venue_8',
      name: '商都飞羽羽毛球馆',
      city: '郑州',
      district: '郑东新区',
      address: '商务内环路20号绿地中心B座4F',
      phone: '0371-88887777',
      hours: '09:00 - 21:30',
      courts: 8,
      priceRange: '70-100元/小时',
      facilities: ['淋浴', '储物柜', '私教区', '视频回放室', '饮料售卖'],
      rating: 4.8,
      reviewCount: 278,
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=360&fit=crop',
      tags: ['CBD核心', '青少年培训', '专业地胶']
    }
  ],

  /* ========== 教练 ========== */
  coaches: [
    {
      id: 'coach_1',
      name: '李明',
      venueIds: ['venue_1', 'venue_2'],
      gender: '男',
      level: '国家二级运动员',
      specialty: ['单打', '后场技术', '杀球'],
      targetLevel: ['进阶', '业余高级'],
      pricePerHour: 200,
      rating: 4.9,
      reviewCount: 128,
      students: 86,
      experience: 8,
      bio: '前省队队员，擅长后场进攻体系搭建，帮助学员提升杀球质量与连贯性。教学风格严谨细致，注重动作规范与实战结合。',
      certifications: ['国家二级运动员', 'C级教练证', '运动损伤防护'],
      weeklySlots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '19:00-20:00', '20:00-21:00'],
      restDays: [0]
    },
    {
      id: 'coach_2',
      name: '王芳',
      venueIds: ['venue_1'],
      gender: '女',
      level: '省级退役运动员',
      specialty: ['女单', '网前技术', '搓勾推'],
      targetLevel: ['新手', '进阶'],
      pricePerHour: 180,
      rating: 4.8,
      reviewCount: 96,
      students: 72,
      experience: 6,
      bio: '网前手感细腻，专精搓球、勾对角与推球技术。对女学员和青少年耐心友好，从零基础到业余中级系统带教。',
      certifications: ['省级退役运动员', 'D级教练证'],
      weeklySlots: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '16:00-17:00', '19:00-20:00'],
      restDays: [1]
    },
    {
      id: 'coach_3',
      name: '张强',
      venueIds: ['venue_2'],
      gender: '男',
      level: '国家一级运动员',
      specialty: ['双打', '混双', '轮转配合'],
      targetLevel: ['进阶', '业余高级', '专业'],
      pricePerHour: 220,
      rating: 4.9,
      reviewCount: 156,
      students: 94,
      experience: 10,
      bio: '全国混双业余联赛冠军，精通双打站位、轮转与发接发战术。可带搭档一对二或单独强化个人双打意识。',
      certifications: ['国家一级运动员', 'B级教练证'],
      weeklySlots: ['09:00-10:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '20:00-21:00'],
      restDays: [0, 6]
    },
    {
      id: 'coach_4',
      name: '陈浩',
      venueIds: ['venue_3'],
      gender: '男',
      level: '前国家队梯队',
      specialty: ['全能', '战术分析', '体能'],
      targetLevel: ['业余高级', '专业'],
      pricePerHour: 280,
      rating: 5.0,
      reviewCount: 89,
      students: 45,
      experience: 12,
      bio: '曾入选国家青年队，退役后专注成人精英培训。结合视频回放与战术拆解，帮助学员建立完整比赛思维。',
      certifications: ['前国家队梯队', 'A级教练证', '体能训练师'],
      weeklySlots: ['10:00-11:00', '14:00-15:00', '15:00-16:00', '19:00-20:00', '20:00-21:00'],
      restDays: [2]
    },
    {
      id: 'coach_5',
      name: '刘洋',
      venueIds: ['venue_3'],
      gender: '男',
      level: '资深业余教练',
      specialty: ['新手入门', '握拍发力', '基础步伐'],
      targetLevel: ['新手'],
      pricePerHour: 150,
      rating: 4.7,
      reviewCount: 203,
      students: 156,
      experience: 5,
      bio: '入门教学经验丰富，擅长让零基础学员快速建立正确握拍与高远球发力感觉。课堂氛围轻松，适合成人新手。',
      certifications: ['D级教练证', '急救员证'],
      weeklySlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '19:00-20:00', '20:00-21:00'],
      restDays: [0]
    },
    {
      id: 'coach_6',
      name: '赵慧',
      venueIds: ['venue_4'],
      gender: '女',
      level: '体育学院硕士',
      specialty: ['步法', '体能', '拉吊突击'],
      targetLevel: ['新手', '进阶'],
      pricePerHour: 190,
      rating: 4.8,
      reviewCount: 74,
      students: 58,
      experience: 7,
      bio: '运动人体科学硕士，从生物力学角度纠正动作。步法与体能结合训练，帮助学员提升场上覆盖与多拍对抗能力。',
      certifications: ['体育学院硕士', 'C级教练证', '运动康复基础'],
      weeklySlots: ['09:00-10:00', '15:00-16:00', '16:00-17:00', '19:00-20:00'],
      restDays: [6]
    },
    {
      id: 'coach_7',
      name: '孙杰',
      venueIds: ['venue_4', 'venue_5'],
      gender: '男',
      level: '国家二级运动员',
      specialty: ['进攻', '杀球', '突击'],
      targetLevel: ['进阶', '业余高级'],
      pricePerHour: 230,
      rating: 4.9,
      reviewCount: 112,
      students: 67,
      experience: 9,
      bio: '进攻型打法代表，杀球时速训练与突击时机选择是强项。适合有一定基础、希望提升终结能力的学员。',
      certifications: ['国家二级运动员', 'C级教练证'],
      weeklySlots: ['10:00-11:00', '14:00-15:00', '16:00-17:00', '20:00-21:00'],
      restDays: [1]
    },
    {
      id: 'coach_8',
      name: '周婷',
      venueIds: ['venue_5'],
      gender: '女',
      level: '省级双打冠军',
      specialty: ['女双', '混双', '封网'],
      targetLevel: ['进阶', '业余高级'],
      pricePerHour: 200,
      rating: 4.8,
      reviewCount: 88,
      students: 53,
      experience: 7,
      bio: '广东省业余女双冠军，封网意识与中场连贯是教学重点。混双女前角色专项训练，帮助女学员提升网前统治力。',
      certifications: ['省级双打冠军', 'C级教练证'],
      weeklySlots: ['09:00-10:00', '11:00-12:00', '14:00-15:00', '19:00-20:00', '20:00-21:00'],
      restDays: [0]
    },
    {
      id: 'coach_9',
      name: '吴磊',
      venueIds: ['venue_5', 'venue_6'],
      gender: '男',
      level: '青少年培训专家',
      specialty: ['青少年', '基础技术', '兴趣培养'],
      targetLevel: ['新手', '青少年'],
      pricePerHour: 160,
      rating: 4.7,
      reviewCount: 145,
      students: 120,
      experience: 6,
      bio: '专注6-16岁青少年羽毛球启蒙与进阶，课程游戏化设计，注重运动习惯与团队协作培养。家长好评率极高。',
      certifications: ['青少年教练证', 'D级教练证', '儿童心理基础'],
      weeklySlots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'],
      restDays: [2, 3]
    },
    {
      id: 'coach_10',
      name: '李教练',
      venueIds: ['venue_2'],
      gender: '男',
      level: '国家二级运动员',
      specialty: ['战术分析', '单打', '视频复盘'],
      targetLevel: ['进阶', '业余高级', '专业'],
      pricePerHour: 280,
      rating: 4.9,
      reviewCount: 167,
      students: 78,
      experience: 15,
      bio: '国家二级运动员，平台认证专业教练。结合 AI 视频分析与线下实操，提供「诊断+训练+复盘」完整教学闭环。',
      certifications: ['国家二级运动员', 'B级教练证', 'AI分析认证教练'],
      weeklySlots: ['10:00-11:00', '14:00-15:00', '15:00-16:00', '19:00-20:00'],
      restDays: [0, 6]
    },
    {
      id: 'coach_11',
      name: '马超',
      venueIds: ['venue_7'],
      gender: '男',
      level: '河南省队退役',
      specialty: ['单打', '后场技术', '拉吊突击'],
      targetLevel: ['进阶', '业余高级'],
      pricePerHour: 190,
      rating: 4.8,
      reviewCount: 134,
      students: 92,
      experience: 9,
      bio: '河南省羽毛球队退役队员，长期执教郑州业余精英学员。擅长构建拉吊结合突击的单打体系，对河南本地业余联赛备赛经验丰富。',
      certifications: ['河南省队退役', 'C级教练证', '运动损伤防护'],
      weeklySlots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '16:00-17:00', '19:00-20:00', '20:00-21:00'],
      restDays: [1]
    },
    {
      id: 'coach_12',
      name: '林静',
      venueIds: ['venue_7', 'venue_8'],
      gender: '女',
      level: '国家二级运动员',
      specialty: ['女双', '混双', '网前技术', '发接发'],
      targetLevel: ['新手', '进阶', '业余高级'],
      pricePerHour: 170,
      rating: 4.9,
      reviewCount: 118,
      students: 81,
      experience: 7,
      bio: '国家二级运动员，郑州本土成长教练。混双女前角色与发接发抢攻是强项，适合想提升双打配合与网前手感的学员，女学员口碑尤佳。',
      certifications: ['国家二级运动员', 'C级教练证'],
      weeklySlots: ['10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '19:00-20:00'],
      restDays: [0]
    },
    {
      id: 'coach_13',
      name: '魏建国',
      venueIds: ['venue_8'],
      gender: '男',
      level: '资深青少年教练',
      specialty: ['新手入门', '青少年', '基础步伐', '握拍发力'],
      targetLevel: ['新手', '青少年'],
      pricePerHour: 140,
      rating: 4.7,
      reviewCount: 186,
      students: 143,
      experience: 8,
      bio: '在郑东新区从事青少年与成人启蒙教学八年，课程节奏清晰、反馈及时。擅长让零基础学员在十节课内建立稳定高远球与基础步法框架。',
      certifications: ['D级教练证', '青少年教练证', '急救员证'],
      weeklySlots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '19:00-20:00'],
      restDays: [2, 6]
    }
  ],

  /* ========== 教练线下预约记录 ========== */
  coachBookings: [
    {
      id: 'cb_001',
      userId: 'user_001',
      venueId: 'venue_2',
      coachId: 'coach_10',
      date: '2026-06-14',
      timeSlot: '14:00-15:00',
      courseType: '私教1对1',
      duration: 1,
      price: 280,
      status: 'confirmed',
      note: '重点纠正高远球击球点',
      contactPhone: '138****5678',
      createdAt: '2026-06-10T10:00:00.000Z'
    }
  ]
};

/* 合并球员高光与文章 */
if (typeof window !== 'undefined' && typeof mergePlayerExtra === 'function') {
  mergePlayerExtra(MOCK_DATA);
}

/* 合并球馆实景封面 */
if (typeof window !== 'undefined' && typeof mergeVenueImages === 'function') {
  mergeVenueImages(MOCK_DATA);
}

/* 合并活跃圈子种子数据 */
if (typeof window !== 'undefined' && typeof mergeCommunitySeed === 'function') {
  mergeCommunitySeed(MOCK_DATA);
}

/* 注入专业视频 URL（每条唯一、可播放、与内容语义匹配） */
if (typeof window !== 'undefined' && window.VideoLib) {
  VideoLib.applyToMockData(MOCK_DATA);
}

/* 导出供 common.js 使用 */
if (typeof window !== 'undefined') {
  window.MOCK_DATA = MOCK_DATA;
}
