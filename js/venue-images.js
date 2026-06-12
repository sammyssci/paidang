/**
 * 羽毛球馆实景封面图
 * 均为室内羽毛球场地真实拍摄（Unsplash 授权可商用）
 */
var VENUE_IMAGES = {
  venue_1: {
    image: 'https://images.unsplash.com/photo-1780233689566-55045608bd17?w=800&h=480&fit=crop&q=85',
    imageAlt: '室内羽毛球馆多片场地实景'
  },
  venue_2: {
    image: 'https://images.unsplash.com/photo-1780233689509-fa976df10bbc?w=800&h=480&fit=crop&q=85',
    imageAlt: '室内羽毛球比赛场地实景'
  },
  venue_3: {
    image: 'https://images.unsplash.com/photo-1774652995555-59fa40d9306c?w=800&h=480&fit=crop&q=85',
    imageAlt: '室内羽毛球训练场地实景'
  },
  venue_4: {
    image: 'https://images.unsplash.com/photo-1599391398131-cd12dfc6c24e?w=800&h=480&fit=crop&q=85',
    imageAlt: '绿色地胶羽毛球场地实景'
  },
  venue_5: {
    image: 'https://images.unsplash.com/photo-1708312604109-16c0be9326cd?w=800&h=480&fit=crop&q=85',
    imageAlt: '羽毛球拍与球落在绿色场地实景'
  },
  venue_6: {
    image: 'https://images.unsplash.com/photo-1776999035766-9c2b5cddf613?w=800&h=480&fit=crop&q=85',
    imageAlt: '羽毛球落在绿色场地线内实景'
  },
  venue_7: {
    image: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?w=800&h=480&fit=crop&q=85',
    imageAlt: '室内羽毛球绿色地胶场地实景'
  },
  venue_8: {
    image: 'https://images.unsplash.com/photo-1547934045-2942d193cb49?w=800&h=480&fit=crop&q=85',
    imageAlt: '室内综合运动馆羽毛球场地实景'
  }
};

function mergeVenueImages(data) {
  if (!data || !data.venues) return;
  data.venues.forEach(function (v) {
    var info = VENUE_IMAGES[v.id];
    if (info) {
      v.image = info.image;
      v.imageAlt = info.imageAlt;
    }
  });
}

if (typeof window !== 'undefined') {
  window.VENUE_IMAGES = VENUE_IMAGES;
  window.mergeVenueImages = mergeVenueImages;
}
