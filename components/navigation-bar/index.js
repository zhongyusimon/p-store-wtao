module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var app = getApp();

var _wx$getSystemInfoSync = wx.getSystemInfoSync(),
    statusBarHeight = _wx$getSystemInfoSync.statusBarHeight,
    system = _wx$getSystemInfoSync.system,
    windowWidth = _wx$getSystemInfoSync.windowWidth;

var isIOS = /^ios/i.test(system);

/**
 * ???????????????????????????????????? (px)
 * @param {Number} windowWidth ????????????
 * @param {Boolean} isIOS ??????iOS
 */
function calcMaxWidth(windowWidth, isIOS) {
  var left = isIOS ? 7 : 10;
  var capsuleWidth = 43 * 2 + 1;
  var padding = isIOS ? 0 : 5;
  var total = (left + capsuleWidth + padding * 2) * 2;

  // `- 10` ?????????????????????????????????
  var maxWidth = windowWidth - total - 10;
  return maxWidth;
}

Component({
  options: {
    multipleSlots: true
  },
  properties: {
    /**
     * ????????????
     */
    title: {
      type: String,
      value: 'WeChat',
      observer: function observer(newTitle) {
        this.setData({
          title: newTitle
        });
      }
    },
    /**
     * ??????????????????
     */
    enable: {
      type: Boolean,
      value: true
    },
    /**
     * ???????????????
     */
    delta: {
      type: Number,
      value: 1
    },
    /**
     * ???????????? home ??????
     */
    showHome: {
      type: Boolean,
      value: true
    },
    /**
     * ????????????????????????
     */
    hideBack: {
      type: Boolean,
      value: false
    },
    /**
     * ???????????????
     */
    bgColor: {
      type: String,
      value: 'white'
    },
    /**
     * ?????????????????? light/dark
     */
    textStyle: {
      type: String,
      value: 'dark',
      observer: function observer(newStyle) {
        if (!this.properties.autoCapsule) return;
        if (newStyle === 'light') {
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000',
            animation: {}
          });
        } else {
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff',
            animation: {}
          });
        }
      }
    },
    /**
     * ???????????? textStyle ???????????????????????????????????????
     */
    autoCapsule: {
      type: Boolean,
      value: true
    },
    /**
     * ?????????????????????????????????
     * ??? `false` ??????????????? `height: 100%`????????????????????????????????????
     */
    autoHeight: {
      type: Boolean,
      value: true
    },
    /**
     * ????????????
     */
    hideNav: {
      type: Boolean,
      value: false
    },
    /**
     * ???????????????hideNav ??? true ?????????
     */
    autoStick: {
      type: Boolean,
      value: false
    },
    /**
     * ???????????????????????????
     * @version 0.0.10
     * @default 1
     */
    opacity: {
      type: Number,
      value: 1
    }
  },
  data: {
    isIOS: isIOS,
    iosNavHeight: 44,
    androidNavHeight: 48,
    justOnePage: true,
    barHeight: +statusBarHeight,
    refresh: true,
    /**
     * ???????????????????????????
     */
    maxWidth: calcMaxWidth(windowWidth, isIOS)
  },
  lifetimes: {
    attached: function attached() {
      this._init();
    }
  },
  attached: function attached() {
    this._init();
  },

  methods: {
    _init: function _init() {
      var _this = this;

      this.homePath = app.__APP_HOME_PATH__ || '/pages/home/home';
      var pages = getCurrentPages();
      this.setData({
        justOnePage: pages.length === 1
      });

      // ???????????????????????????
      // ?????????????????? cover-view ???????????????????????????????????????
      setTimeout(function () {
        _this.refreshNavigation();
      }, 100);
    },


    /**
     * ???????????????
     */
    disappearNavigation: function disappearNavigation() {
      this.setData({
        hideNav: true
      });
    },


    /**
     * ???????????????
     */
    displayNavigation: function displayNavigation() {
      this.setData({
        hideNav: false
      });
    },


    /**
     * ??????????????? (????????????????????????????????????????????????)
     *
     * ??????????????????????????????????????????????????????????????????
     *
     * ?????????
     * 1. cover-view ????????????????????????
     * 2. ????????????????????????????????????
     */
    refreshNavigation: function refreshNavigation() {
      var refresh = this.data.refresh;

      this.setData({
        refresh: !refresh
      });
    },

    /**
     * ??????????????????
     */
    _handleNavBack: function _handleNavBack() {
      var detail = {};
      this.triggerEvent('back', detail);
      var _properties = this.properties,
          enable = _properties.enable,
          delta = _properties.delta;

      if (enable) {
        wx.navigateBack({ delta: delta });
      }
    },


    /**
     * ??????????????????
     */
    _handleNavHome: function _handleNavHome() {
      var detail = {};
      this.triggerEvent('home', detail);
      var homePath = this.homePath;

      if (homePath) {
        wx.switchTab({
          url: homePath,
          fail: function fail() {
            wx.reLaunch({
              url: homePath
            });
          }
        });
      }
    }
  }
});

/***/ })
/******/ ]);