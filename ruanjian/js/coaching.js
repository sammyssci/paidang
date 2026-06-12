/**
 * 教练指导页面逻辑
 * 功能：选择球馆、选择教练、预约线下课程、查看我的预约
 */
(function ($) {
  'use strict';

  const { Storage, Auth, Modal, Toast, Interaction, Navigation } = window.BadmintonApp;

  let cityFilter = 'all';
  let searchQuery = '';
  let specialtyFilter = 'all';
  let selectedVenueId = null;
  let selectedCoachId = null;
  let selectedDate = null;
  let selectedTimeSlot = null;

  const SIDEBAR_ITEMS = [
    { id: 'venues', label: '选择球馆', icon: '🏸' },
    { id: 'coaches', label: '选择教练', icon: '👨‍🏫' },
    { id: 'bookings', label: '我的预约', icon: '📋' }
  ];

  const COURSE_MULTIPLIER = {
    '私教1对1': { duration: 1, multiplier: 1 },
    '双人对练': { duration: 1.5, multiplier: 1.2 },
    '小班团课': { duration: 2, multiplier: 0.6 }
  };

  const STATUS_LABEL = {
    confirmed: { text: '已确认', cls: 'badge-mint' },
    pending: { text: '待确认', cls: 'badge-hot' },
    completed: { text: '已完成', cls: 'badge-gray' },
    cancelled: { text: '已取消', cls: 'badge-gray' }
  };

  function getVenues() {
    let venues = Storage.get('venues') || [];
    if (cityFilter !== 'all') {
      venues = venues.filter(function (v) { return v.city === cityFilter; });
    }
    if (searchQuery) {
      var q = searchQuery.toLowerCase();
      venues = venues.filter(function (v) {
        return v.name.toLowerCase().indexOf(q) > -1 ||
          v.district.toLowerCase().indexOf(q) > -1 ||
          v.address.toLowerCase().indexOf(q) > -1;
      });
    }
    return venues;
  }

  function getCoachesAtVenue(venueId) {
    return (Storage.get('coaches') || []).filter(function (c) {
      return c.venueIds.indexOf(venueId) > -1;
    });
  }

  function getFilteredCoaches() {
    let coaches = getCoachesAtVenue(selectedVenueId);
    if (specialtyFilter !== 'all') {
      coaches = coaches.filter(function (c) {
        return c.specialty.some(function (s) { return s.indexOf(specialtyFilter) > -1; }) ||
          c.targetLevel.some(function (l) { return l.indexOf(specialtyFilter) > -1; });
      });
    }
    return coaches.sort(function (a, b) { return b.rating - a.rating; });
  }

  function getVenueById(id) {
    return (Storage.get('venues') || []).find(function (v) { return v.id === id; });
  }

  function getCoachById(id) {
    return (Storage.get('coaches') || []).find(function (c) { return c.id === id; });
  }

  function setStep(step) {
    $('.booking-step').removeClass('active done');
    $('.booking-step').each(function () {
      var s = parseInt($(this).data('step'), 10);
      if (s < step) $(this).addClass('done');
      if (s === step) $(this).addClass('active');
    });
    $('#stepVenues').toggle(step === 1);
    $('#stepCoaches').toggle(step === 2);
  }

  function renderVenues() {
    var venues = getVenues();
    var html = '';
    venues.forEach(function (v) {
      html += '<div class="venue-card" data-id="' + v.id + '">';
      html += '<div class="venue-card-img"><img src="' + v.image + '" alt="' + (v.imageAlt || v.name) + '" loading="lazy">';
      html += '<span class="venue-rating">⭐ ' + v.rating + '</span></div>';
      html += '<div class="venue-card-body">';
      html += '<h3 class="font-semibold">' + v.name + '</h3>';
      html += '<p class="text-sm text-gray-500">📍 ' + v.city + ' · ' + v.district + '</p>';
      html += '<p class="text-xs text-gray-400 mt-1">' + v.address + '</p>';
      html += '<div class="venue-meta mt-2">';
      html += '<span class="badge badge-mint">' + v.courts + ' 片场地</span>';
      html += '<span class="badge badge-gray">' + v.priceRange + '</span></div>';
      html += '<div class="venue-tags mt-2">';
      v.tags.forEach(function (t) { html += '<span class="venue-tag">' + t + '</span>'; });
      html += '</div>';
      html += '<div class="venue-coach-count mt-2 text-sm text-mint-dark">';
      html += '👨‍🏫 ' + getCoachesAtVenue(v.id).length + ' 位驻场教练</div>';
      html += '<button class="btn btn-sm btn-primary w-full mt-3 venue-select-btn">选择此馆</button>';
      html += '</div></div>';
    });
    $('#venueGrid').html(html || '<div class="empty-state col-span-3"><div class="empty-state-icon">🏸</div><p>暂无匹配球馆</p></div>');
    $('#venueCount').text('(' + venues.length + ' 家)');
  }

  function renderSelectedVenueBar() {
    var v = getVenueById(selectedVenueId);
    if (!v) return;
    $('#selectedVenueBar').html(
      '<div class="selected-venue-info">' +
      '<img src="' + v.image + '" alt="' + (v.imageAlt || v.name) + '">' +
      '<div><strong>' + v.name + '</strong>' +
      '<p class="text-sm text-gray-500">' + v.address + ' · ' + v.hours + '</p>' +
      '<p class="text-sm text-gray-500">📞 ' + v.phone + '</p></div></div>'
    );
  }

  function renderCoaches() {
    var coaches = getFilteredCoaches();
    var html = '';
    coaches.forEach(function (c) {
      html += '<div class="coach-card" data-id="' + c.id + '">';
      html += '<div class="coach-avatar">' + (c.gender === '女' ? '👩‍🏫' : '👨‍🏫') + '</div>';
      html += '<div class="coach-card-body">';
      html += '<div class="flex justify-between items-start">';
      html += '<h3 class="font-semibold">' + c.name + '</h3>';
      html += '<span class="text-sm text-mint-dark font-semibold">¥' + c.pricePerHour + '/时</span></div>';
      html += '<p class="text-xs text-gray-500">' + c.level + ' · ' + c.experience + '年教龄</p>';
      html += '<div class="coach-specialty mt-2">';
      c.specialty.slice(0, 3).forEach(function (s) {
        html += '<span class="badge badge-mint">' + s + '</span>';
      });
      html += '</div>';
      html += '<p class="text-sm text-gray-500 mt-2 line-clamp-2">' + c.bio + '</p>';
      html += '<div class="flex justify-between text-sm text-gray-400 mt-2">';
      html += '<span>⭐ ' + c.rating + ' (' + c.reviewCount + ')</span>';
      html += '<span>👥 ' + c.students + ' 学员</span></div>';
      html += '<div class="flex gap-2 mt-3">';
      html += '<button class="btn btn-sm btn-secondary flex-1 coach-detail-btn">查看详情</button>';
      html += '<button class="btn btn-sm btn-primary flex-1 coach-book-btn">立即预约</button>';
      html += '</div></div></div>';
    });
    $('#coachGrid').html(html || '<div class="empty-state col-span-2"><div class="empty-state-icon">👨‍🏫</div><p>该球馆暂无匹配教练</p></div>');
    $('#coachCount').text('(' + coaches.length + ' 位)');
  }

  function showCoachDetail(coachId) {
    selectedCoachId = coachId;
    var c = getCoachById(coachId);
    var v = getVenueById(selectedVenueId);
    if (!c) return;

    var certHtml = c.certifications.map(function (x) {
      return '<span class="badge badge-gray">' + x + '</span>';
    }).join(' ');

    var levelHtml = c.targetLevel.map(function (x) {
      return '<span class="badge badge-mint">' + x + '</span>';
    }).join(' ');

    $('#coachDetailTitle').text(c.name + ' · ' + c.level);
    $('#coachDetailBody').html(
      '<div class="coach-detail-header">' +
      '<div class="coach-detail-avatar">' + (c.gender === '女' ? '👩‍🏫' : '👨‍🏫') + '</div>' +
      '<div><h4 class="text-xl font-bold">' + c.name + '</h4>' +
      '<p class="text-gray-500">' + c.level + ' · ' + c.experience + '年教龄 · ⭐ ' + c.rating + '</p>' +
      '<p class="text-mint-dark font-semibold mt-1">¥' + c.pricePerHour + ' / 小时</p>' +
      '<p class="text-sm text-gray-500 mt-1">📍 授课球馆：' + (v ? v.name : '') + '</p></div></div>' +
      '<div class="detail-section"><h4>个人简介</h4><p>' + c.bio + '</p></div>' +
      '<div class="detail-section"><h4>擅长方向</h4><div class="flex gap-2 flex-wrap">' +
      c.specialty.map(function (s) { return '<span class="badge badge-mint">' + s + '</span>'; }).join('') +
      '</div></div>' +
      '<div class="detail-section"><h4>适合学员</h4><div class="flex gap-2 flex-wrap">' + levelHtml + '</div></div>' +
      '<div class="detail-section"><h4>资质认证</h4><div class="flex gap-2 flex-wrap">' + certHtml + '</div></div>' +
      '<div class="detail-section"><h4>可约时段</h4><p class="text-sm text-gray-500">每日：' + c.weeklySlots.join('、') + '</p>' +
      (c.restDays && c.restDays.length ? '<p class="text-sm text-gray-400 mt-1">休息日：周' + c.restDays.map(function (d) {
        return ['日', '一', '二', '三', '四', '五', '六'][d];
      }).join('、') + '</p>' : '') + '</div>'
    );
    Modal.open('coachDetailModal');
  }

  function getAvailableDates(coach) {
    var dates = [];
    var today = new Date();
    for (var i = 1; i <= 14; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() + i);
      var dayOfWeek = d.getDay();
      if (coach.restDays && coach.restDays.indexOf(dayOfWeek) > -1) continue;
      dates.push({
        value: d.toISOString().split('T')[0],
        label: (d.getMonth() + 1) + '月' + d.getDate() + '日 周' + ['日', '一', '二', '三', '四', '五', '六'][dayOfWeek]
      });
    }
    return dates;
  }

  function renderTimeSlots() {
    var coach = getCoachById(selectedCoachId);
    if (!coach || !selectedDate) return;
    var html = '';
    coach.weeklySlots.forEach(function (slot) {
      var booked = Interaction.isSlotBooked(selectedCoachId, selectedVenueId, selectedDate, slot);
      var active = selectedTimeSlot === slot ? ' active' : '';
      var disabled = booked ? ' disabled' : '';
      html += '<button type="button" class="time-slot-btn' + active + disabled + '" data-slot="' + slot + '"' +
        (booked ? ' disabled' : '') + '>' + slot + (booked ? '<br><small>已满</small>' : '') + '</button>';
    });
    $('#timeSlotGrid').html(html);
  }

  function calcPrice(coach, courseType) {
    var cfg = COURSE_MULTIPLIER[courseType] || COURSE_MULTIPLIER['私教1对1'];
    return Math.round(coach.pricePerHour * cfg.multiplier * cfg.duration);
  }

  function updatePriceBox() {
    var coach = getCoachById(selectedCoachId);
    var courseType = $('#bookingCourseType').val();
    if (!coach) return;
    var cfg = COURSE_MULTIPLIER[courseType];
    var price = calcPrice(coach, courseType);
    $('#bookingPriceBox').html(
      '<div class="flex justify-between"><span>课程费用</span><strong class="text-mint-dark">¥' + price + '</strong></div>' +
      '<p class="text-xs text-gray-400 mt-1">含场地协调，到馆后向前台出示预约单即可</p>'
    );
  }

  function openBookingModal(coachId) {
    Auth.requireLogin();
    selectedCoachId = coachId;
    var coach = getCoachById(coachId);
    var venue = getVenueById(selectedVenueId);
    if (!coach || !venue) return;

    setStep(3);

    var dates = getAvailableDates(coach);
    selectedDate = dates.length ? dates[0].value : null;
    selectedTimeSlot = null;

    var dateHtml = '';
    dates.forEach(function (d) {
      dateHtml += '<option value="' + d.value + '">' + d.label + '</option>';
    });
    $('#bookingDate').html(dateHtml);
    if (selectedDate) $('#bookingDate').val(selectedDate);

    $('#bookingSummary').html(
      '<div class="booking-summary-row"><span>球馆</span><strong>' + venue.name + '</strong></div>' +
      '<div class="booking-summary-row"><span>教练</span><strong>' + coach.name + ' · ¥' + coach.pricePerHour + '/时</strong></div>' +
      '<div class="booking-summary-row"><span>地址</span><span class="text-sm">' + venue.address + '</span></div>'
    );

    renderTimeSlots();
    updatePriceBox();
    Modal.open('bookingModal');
  }

  function renderMyBookings() {
    Auth.requireLogin();
    var user = Auth.getCurrentUser();
    var bookings = Interaction.getCoachBookings(user.id);
    if (!bookings.length) {
      $('#myBookingsList').html('<div class="empty-state"><div class="empty-state-icon">📋</div><p>暂无预约记录</p>' +
        '<p class="text-sm text-gray-400 mt-2">选择球馆和教练即可预约线下课程</p></div>');
      return;
    }
    var html = '';
    bookings.forEach(function (b) {
      var venue = getVenueById(b.venueId);
      var coach = getCoachById(b.coachId);
      var st = STATUS_LABEL[b.status] || STATUS_LABEL.pending;
      html += '<div class="booking-record-card" data-id="' + b.id + '">';
      html += '<div class="flex justify-between items-start mb-2">';
      html += '<strong>' + (coach ? coach.name : '教练') + ' · ' + b.courseType + '</strong>';
      html += '<span class="badge ' + st.cls + '">' + st.text + '</span></div>';
      html += '<p class="text-sm text-gray-500">🏸 ' + (venue ? venue.name : '') + '</p>';
      html += '<p class="text-sm text-gray-500">📅 ' + b.date + ' ' + b.timeSlot + '</p>';
      html += '<p class="text-sm text-gray-500">📍 ' + (venue ? venue.address : '') + '</p>';
      if (b.note) html += '<p class="text-sm text-gray-400 mt-1">备注：' + b.note + '</p>';
      html += '<div class="flex justify-between items-center mt-3">';
      html += '<span class="text-mint-dark font-semibold">¥' + b.price + '</span>';
      if (b.status === 'confirmed') {
        html += '<button class="btn btn-sm btn-danger cancel-booking-btn" data-id="' + b.id + '">取消预约</button>';
      }
      html += '</div></div>';
    });
    $('#myBookingsList').html(html);
  }

  function selectVenue(venueId) {
    selectedVenueId = venueId;
    selectedCoachId = null;
    renderSelectedVenueBar();
    renderCoaches();
    setStep(2);
    $('html, body').animate({ scrollTop: $('#stepCoaches').offset().top - 80 }, 400);
  }

  function bindEvents() {
    $(document).on('click', '#cityFilter .filter-chip', function () {
      $('#cityFilter .filter-chip').removeClass('active');
      $(this).addClass('active');
      cityFilter = $(this).data('city');
      renderVenues();
    });

    $('#venueSearchBtn').on('click', function () {
      searchQuery = $('#venueSearch').val().trim();
      renderVenues();
    });
    $('#venueSearch').on('keydown', function (e) {
      if (e.key === 'Enter') { searchQuery = $(this).val().trim(); renderVenues(); }
    });

    $(document).on('click', '.venue-select-btn', function (e) {
      e.stopPropagation();
      selectVenue($(this).closest('.venue-card').data('id'));
    });

    $(document).on('click', '#coachFilter .filter-chip', function () {
      $('#coachFilter .filter-chip').removeClass('active');
      $(this).addClass('active');
      specialtyFilter = $(this).data('specialty');
      renderCoaches();
    });

    $('#backToVenuesBtn').on('click', function () {
      selectedVenueId = null;
      setStep(1);
    });

    $(document).on('click', '.coach-detail-btn', function (e) {
      e.stopPropagation();
      showCoachDetail($(this).closest('.coach-card').data('id'));
    });

    $(document).on('click', '.coach-book-btn', function (e) {
      e.stopPropagation();
      openBookingModal($(this).closest('.coach-card').data('id'));
    });

    $('#coachBookBtn').on('click', function () {
      Modal.close('coachDetailModal');
      openBookingModal(selectedCoachId);
    });

    $('#bookingDate').on('change', function () {
      selectedDate = $(this).val();
      selectedTimeSlot = null;
      renderTimeSlots();
    });

    $(document).on('click', '.time-slot-btn:not(.disabled)', function () {
      $('.time-slot-btn').removeClass('active');
      $(this).addClass('active');
      selectedTimeSlot = $(this).data('slot');
    });

    $('#bookingCourseType').on('change', updatePriceBox);

    $('#bookingForm').on('submit', function (e) {
      e.preventDefault();
      var user = Auth.getCurrentUser();
      var coach = getCoachById(selectedCoachId);
      if (!selectedTimeSlot) {
        Toast.show('请选择上课时间段', 'warning');
        return;
      }
      var courseType = $('#bookingCourseType').val();
      var cfg = COURSE_MULTIPLIER[courseType];
      var booking = Interaction.createCoachBooking({
        userId: user.id,
        venueId: selectedVenueId,
        coachId: selectedCoachId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        courseType: courseType,
        duration: cfg.duration,
        price: calcPrice(coach, courseType),
        note: $('#bookingNote').val().trim(),
        contactPhone: $('#bookingPhone').val().trim()
      });
      if (booking) {
        Modal.closeAll();
        $('#bookingForm')[0].reset();
        setStep(2);
        renderCoaches();
      }
    });

    $('#myBookingsBtn').on('click', function () {
      renderMyBookings();
      Modal.open('myBookingsModal');
    });

    $(document).on('click', '.cancel-booking-btn', function () {
      var id = $(this).data('id');
      if (!confirm('确定取消该预约吗？')) return;
      var user = Auth.getCurrentUser();
      if (Interaction.cancelCoachBooking(id, user.id)) {
        renderMyBookings();
        renderCoaches();
      }
    });

    $(document).on('click', '.sidebar-item', function () {
      var id = $(this).data('sidebar-id');
      if (id === 'venues') { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else if (id === 'coaches' && selectedVenueId) { setStep(2); }
      else if (id === 'bookings') { renderMyBookings(); Modal.open('myBookingsModal'); }
    });

    $(document).on('auth:login', function () { renderCoaches(); });
  }

  $(document).ready(function () {
    Navigation.renderSidebar(SIDEBAR_ITEMS, 'venues');
    bindEvents();
    renderVenues();
    setStep(1);

    var params = new URLSearchParams(window.location.search);
    var venueParam = params.get('venue');
    if (venueParam && getVenueById(venueParam)) {
      selectVenue(venueParam);
    }
  });

})(jQuery);
