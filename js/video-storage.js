/**
 * 本地视频大文件存储（IndexedDB）
 * 突破 localStorage 体积限制，支持用户上传任意大小的羽毛球视频
 * 分析元数据仍存 localStorage，视频二进制存 IndexedDB
 */
(function (window) {
  'use strict';

  var DB_NAME = 'badminton_video_store';
  var DB_VERSION = 1;
  var STORE_NAME = 'videos';
  var dbPromise = null;

  /** 内存中 ObjectURL 缓存，避免重复创建 */
  var urlCache = {};

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error('浏览器不支持 IndexedDB'));
        return;
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = function (e) { resolve(e.target.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }

  /**
   * 保存视频文件（不限制大小）
   * @param {string} id 分析记录 ID
   * @param {File|Blob} file 视频文件
   * @param {function} onProgress 可选进度回调 0~100
   */
  function saveVideo(id, file, onProgress) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var record = {
          id: id,
          blob: file,
          fileName: file.name || 'video.mp4',
          fileSize: file.size,
          mimeType: file.type || 'video/mp4',
          createdAt: new Date().toISOString()
        };
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var store = tx.objectStore(STORE_NAME);
        var req = store.put(record);
        req.onsuccess = function () {
          if (onProgress) onProgress(100);
          resolve(record);
        };
        req.onerror = function () { reject(req.error); };
        if (onProgress) onProgress(50);
      });
    });
  }

  /** 读取视频记录 */
  function getVideo(id) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var req = tx.objectStore(STORE_NAME).get(id);
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  /** 获取可播放的 Object URL */
  function getPlayUrl(id) {
    if (urlCache[id]) return Promise.resolve(urlCache[id]);
    return getVideo(id).then(function (record) {
      if (!record || !record.blob) return null;
      var url = URL.createObjectURL(record.blob);
      urlCache[id] = url;
      return url;
    });
  }

  /** 删除视频 */
  function deleteVideo(id) {
    if (urlCache[id]) {
      URL.revokeObjectURL(urlCache[id]);
      delete urlCache[id];
    }
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var req = tx.objectStore(STORE_NAME).delete(id);
        req.onsuccess = function () { resolve(); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  /** 释放某个 ObjectURL */
  function revokePlayUrl(id) {
    if (urlCache[id]) {
      URL.revokeObjectURL(urlCache[id]);
      delete urlCache[id];
    }
  }

  /** 释放临时上传 URL（非 IndexedDB 键） */
  function revokeTempUrl(url) {
    if (url && url.indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(url); } catch (e) {}
    }
  }

  /** 格式化文件大小 */
  function formatSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }

  /** 校验是否为视频文件 */
  function isVideoFile(file) {
    if (!file) return false;
    if (file.type && file.type.indexOf('video/') === 0) return true;
    return /\.(mp4|webm|mov|avi|mkv|m4v|flv|wmv|mpeg|mpg|3gp)$/i.test(file.name || '');
  }

  /** 清空全部本地视频 */
  function clearAll() {
    Object.keys(urlCache).forEach(function (id) {
      URL.revokeObjectURL(urlCache[id]);
    });
    urlCache = {};
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        var req = tx.objectStore(STORE_NAME).clear();
        req.onsuccess = function () { resolve(); };
        req.onerror = function () { reject(req.error); };
      });
    });
  }

  window.VideoStorage = {
    saveVideo: saveVideo,
    getVideo: getVideo,
    getPlayUrl: getPlayUrl,
    deleteVideo: deleteVideo,
    revokePlayUrl: revokePlayUrl,
    revokeTempUrl: revokeTempUrl,
    formatSize: formatSize,
    isVideoFile: isVideoFile,
    clearAll: clearAll
  };

})(window);
