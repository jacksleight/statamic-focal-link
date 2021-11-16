/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var templatePattern = /\{\{\s*([a-z0-9]*)\s*\}\}/i;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [Fieldtype],
  data: function data() {
    return {
      spec: this.meta.spec,
      linkValue: this.meta.initialLink,
      queryValue: this.meta.initialQuery,
      fragmentValue: this.meta.initialFragment,
      queryTemplate: null,
      fragmentTemplate: null,
      loading: false
    };
  },
  computed: {
    returnValue: function returnValue() {
      if (!this.linkValue) {
        return null;
      }

      var value = new URL(this.linkValue);

      if (this.queryValue) {
        value.search = "?".concat(this.queryValue);
      } else {
        value.search = '';
      }

      if (this.fragmentValue) {
        value.hash = "#".concat(this.fragmentValue);
      } else {
        value.hash = '';
      }

      return value.toString();
    },
    queryOptions: function queryOptions() {
      var options = this.prepareOptions(this.spec.queries || {});

      if (this.loading) {
        options.push({
          value: '__loading__',
          label: null,
          title: null,
          template: true,
          loading: true
        });
      }

      return options;
    },
    fragmentOptions: function fragmentOptions() {
      var options = this.prepareOptions(this.spec.fragments || {});

      if (this.loading) {
        options.push({
          value: '__loading__',
          label: null,
          title: null,
          template: true,
          loading: true
        });
      }

      return options;
    },
    queryEnabled: function queryEnabled() {
      return this.spec && this.spec.queries;
    },
    fragmentEnabled: function fragmentEnabled() {
      return this.spec && (this.spec.fragments || this.spec.discovery);
    },
    bothEnabled: function bothEnabled() {
      return this.queryEnabled && this.fragmentEnabled;
    },
    eitherEnabled: function eitherEnabled() {
      return this.queryEnabled || this.fragmentEnabled;
    },
    discoveryPending: function discoveryPending() {
      return !this.spec || this.spec.discovery && !this.spec.discovered;
    },
    toggleVisible: function toggleVisible() {
      return false;
    },
    fieldsVisible: function fieldsVisible() {
      return this.linkValue;
    }
  },
  methods: {
    linkChanged: function linkChanged(link) {
      this.linkValue = link;
      this.queryValue = null;
      this.fragmentValue = null;
      this.queryTemplate = null;
      this.fragmentTemplate = null;
      this.spec = null;
      this.update(this.returnValue);
      this.linkChangedDebounced();
    },
    linkChangedDebounced: _.debounce(function () {
      var _this = this;

      if (this.linkValue) {
        var url = new URL(this.linkValue);

        if (url.search.length) {
          this.queryValue = url.search.substr(1);
        }

        if (url.hash.length) {
          this.fragmentValue = url.hash.substr(1);
        }
      }

      this.$nextTick(function () {
        return _this.fetchSpec();
      });
    }, 500),
    queryChanged: function queryChanged(query) {
      if (query === '__loading__') {
        return;
      }

      var prepared = this.prepareTemplate('query', query);

      if (prepared) {
        var _prepared = _slicedToArray(prepared, 2),
            preparedValue = _prepared[0],
            onNextTick = _prepared[1];

        this.queryTemplate = preparedValue;
        this.$nextTick(onNextTick);
      } else {
        this.queryValue = query;
        this.update(this.returnValue);
      }
    },
    fragmentChanged: function fragmentChanged(fragment) {
      if (fragment === '__loading__') {
        return;
      }

      var prepared = this.prepareTemplate('fragment', fragment);

      if (prepared) {
        var _prepared2 = _slicedToArray(prepared, 2),
            preparedValue = _prepared2[0],
            onNextTick = _prepared2[1];

        this.fragmentTemplate = preparedValue;
        this.$nextTick(onNextTick);
      } else {
        this.fragmentValue = fragment;
        this.update(this.returnValue);
      }
    },
    isTemplate: function isTemplate(value) {
      return templatePattern.exec(value) !== null;
    },
    prepareTemplate: function prepareTemplate(type, value) {
      var _this2 = this;

      var match = templatePattern.exec(value);

      if (match === null) {
        return;
      }

      var parsed = value.substr(0, match.index) + match[1] + value.substr(match.index + match[0].length);
      return [parsed, function () {
        var el = _this2.$refs["".concat(type, "_template")].$refs.input;

        el.focus();
        el.setSelectionRange(match.index, match.index + match[1].length);
      }];
    },
    queryTemplateCommit: function queryTemplateCommit() {
      if (!this.queryTemplate) {
        return;
      }

      this.queryValue = this.queryTemplate;
      this.queryTemplate = null;
      this.update(this.returnValue);
    },
    fragmentTemplateCommit: function fragmentTemplateCommit() {
      if (!this.fragmentTemplate) {
        return;
      }

      this.fragmentValue = this.fragmentTemplate;
      this.fragmentTemplate = null;
      this.update(this.returnValue);
    },
    selectOpen: function selectOpen() {
      if (this.discoveryPending) {
        this.fetchSpec(true);
      }
    },
    fetchSpec: function fetchSpec() {
      var _this3 = this;

      var discover = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _window$StatamicFocal = window.StatamicFocalLink,
          specCache = _window$StatamicFocal.specCache,
          discoverCache = _window$StatamicFocal.discoverCache;
      var cache = discover ? discoverCache : specCache;
      var value = this.linkValue;

      if (value === null) {
        return;
      }

      if (cache[value]) {
        this.spec = cache[value];
        return;
      }

      this.loading = true;
      this.$axios.get(cp_url('focal-link/spec'), {
        params: {
          value: value,
          discover: discover
        }
      }).then(function (response) {
        _this3.spec = response.data;
        cache[value] = _this3.spec;
      })["catch"](function (e) {})["finally"](function (e) {
        _this3.loading = false;
      });
    },
    prepareOptions: function prepareOptions(options) {
      var _this4 = this;

      return Object.entries(options).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            value = _ref2[0],
            label = _ref2[1];

        if (_this4.isTemplate(value)) {
          label = "".concat(label, "\u2026");
        }

        return {
          value: value,
          label: value,
          title: label,
          loading: false
        };
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.sfl-input {\n    position: relative;\n}\n.sfl-input .sfl-prefix {\n    position: absolute;\n    top: 0;\n    left: 0;\n    padding: 8px 0 8px 8px;\n    border: 1px solid transparent;\n}\n.sfl-input .vs__selected-options,\n.sfl-input .input-text {\n    padding-left: 20px !important;\n}\n.sfl-height {\n    height: 38px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css&");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue":
/*!*******************************************************************!*\
  !*** ./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FocalLinkFieldtype_vue_vue_type_template_id_b9ce8cec___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec& */ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec&");
/* harmony import */ var _FocalLinkFieldtype_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FocalLinkFieldtype.vue?vue&type=script&lang=js& */ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=script&lang=js&");
/* harmony import */ var _FocalLinkFieldtype_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css& */ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _FocalLinkFieldtype_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _FocalLinkFieldtype_vue_vue_type_template_id_b9ce8cec___WEBPACK_IMPORTED_MODULE_0__.render,
  _FocalLinkFieldtype_vue_vue_type_template_id_b9ce8cec___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/Fieldtypes/FocalLinkFieldtype.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=script&lang=js&":
/*!********************************************************************************************!*\
  !*** ./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocalLinkFieldtype.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5[0].rules[0].use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_0_rules_0_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css& ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_8_0_rules_0_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-8[0].rules[0].use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=style&index=0&lang=css&");


/***/ }),

/***/ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec&":
/*!**************************************************************************************************!*\
  !*** ./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec& ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_template_id_b9ce8cec___WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   "staticRenderFns": () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_template_id_b9ce8cec___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FocalLinkFieldtype_vue_vue_type_template_id_b9ce8cec___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue?vue&type=template&id=b9ce8cec& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "staticRenderFns": () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "flex flex-col" }, [
    _c(
      "div",
      { staticClass: "space-x-1 flex items-center" },
      [
        _c("link-fieldtype", {
          ref: "link",
          staticClass: "flex-1",
          attrs: {
            handle: "link",
            value: "linkValue",
            config: _vm.meta.link.config,
            meta: _vm.meta.link.meta,
          },
          on: {
            input: _vm.linkChanged,
            "meta-updated": function ($event) {
              _vm.meta.link.meta = $event
            },
          },
        }),
      ],
      1
    ),
    _vm._v(" "),
    _vm.fieldsVisible
      ? _c("div", { staticClass: "mt-1 space-x-1 flex items-center" }, [
          _c("div", { staticClass: "w-40 mr-1 flex-shrink-0 text-right" }),
          _vm._v(" "),
          _vm.queryEnabled
            ? _c(
                "div",
                { staticClass: "sfl-input flex-1 flex items-center" },
                [
                  _c("div", { staticClass: "sfl-prefix text-grey-60" }, [
                    _vm._v("?"),
                  ]),
                  _vm._v(" "),
                  !_vm.queryTemplate
                    ? _c("v-select", {
                        ref: "query",
                        staticClass: "flex-1",
                        attrs: {
                          placeholder: "query",
                          value: _vm.queryValue,
                          reduce: function (option) {
                            return option.value
                          },
                          "create-option": function (value) {
                            return { value: value, label: value, title: null }
                          },
                          clearable: true,
                          options: _vm.queryOptions,
                          searchable: true,
                          taggable: true,
                          "close-on-select": true,
                        },
                        on: { input: _vm.queryChanged, open: _vm.selectOpen },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "option",
                              fn: function (option) {
                                return [
                                  !option.loading
                                    ? _c(
                                        "div",
                                        {
                                          class: !_vm.bothEnabled
                                            ? "flex flex-wrap justify-between"
                                            : "flex flex-col",
                                        },
                                        [
                                          _c("span", [
                                            _vm._v(_vm._s(option.label)),
                                          ]),
                                          _vm._v(" "),
                                          _c("strong", [
                                            _vm._v(_vm._s(option.title)),
                                          ]),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  option.loading
                                    ? _c(
                                        "div",
                                        [
                                          _vm.loading
                                            ? _c("loading-graphic", {
                                                attrs: {
                                                  inline: true,
                                                  text: "Searching…",
                                                },
                                              })
                                            : _vm._e(),
                                        ],
                                        1
                                      )
                                    : _vm._e(),
                                ]
                              },
                            },
                            {
                              key: "no-options",
                              fn: function () {
                                return [
                                  _c("div", {
                                    staticClass:
                                      "text-sm text-grey-70 text-left py-1 px-2",
                                    domProps: {
                                      textContent: _vm._s(
                                        _vm.__("No options to choose from.")
                                      ),
                                    },
                                  }),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          false,
                          52952055
                        ),
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.queryTemplate
                    ? _c("text-input", {
                        ref: "query_template",
                        staticClass: "flex-1",
                        attrs: { append: "⏎" },
                        on: {
                          keydown: function ($event) {
                            if (
                              !$event.type.indexOf("key") &&
                              _vm._k(
                                $event.keyCode,
                                "enter",
                                13,
                                $event.key,
                                "Enter"
                              )
                            ) {
                              return null
                            }
                            return _vm.queryTemplateCommit.apply(
                              null,
                              arguments
                            )
                          },
                          blur: _vm.queryTemplateCommit,
                        },
                        model: {
                          value: _vm.queryTemplate,
                          callback: function ($$v) {
                            _vm.queryTemplate = $$v
                          },
                          expression: "queryTemplate",
                        },
                      })
                    : _vm._e(),
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.fragmentEnabled
            ? _c(
                "div",
                { staticClass: "sfl-input flex-1 flex items-center" },
                [
                  _c("div", { staticClass: "sfl-prefix text-grey-60" }, [
                    _vm._v("#"),
                  ]),
                  _vm._v(" "),
                  !_vm.fragmentTemplate
                    ? _c("v-select", {
                        ref: "fragment",
                        staticClass: "flex-1",
                        attrs: {
                          placeholder: "fragment",
                          value: _vm.fragmentValue,
                          reduce: function (option) {
                            return option.value
                          },
                          "create-option": function (value) {
                            return { value: value, label: value, title: null }
                          },
                          clearable: true,
                          options: _vm.fragmentOptions,
                          searchable: true,
                          taggable: true,
                          "close-on-select": true,
                        },
                        on: {
                          input: _vm.fragmentChanged,
                          open: _vm.selectOpen,
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "option",
                              fn: function (option) {
                                return [
                                  !option.loading
                                    ? _c(
                                        "div",
                                        {
                                          class: !_vm.bothEnabled
                                            ? "flex flex-wrap justify-between"
                                            : "flex flex-col",
                                        },
                                        [
                                          _c("span", [
                                            _vm._v(_vm._s(option.label)),
                                          ]),
                                          _vm._v(" "),
                                          _c("strong", [
                                            _vm._v(_vm._s(option.title)),
                                          ]),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  option.loading
                                    ? _c(
                                        "div",
                                        [
                                          _vm.loading
                                            ? _c("loading-graphic", {
                                                attrs: {
                                                  inline: true,
                                                  text: "Searching…",
                                                },
                                              })
                                            : _vm._e(),
                                        ],
                                        1
                                      )
                                    : _vm._e(),
                                ]
                              },
                            },
                            {
                              key: "no-options",
                              fn: function () {
                                return [
                                  _c("div", {
                                    staticClass:
                                      "text-sm text-grey-70 text-left py-1 px-2",
                                    domProps: {
                                      textContent: _vm._s(
                                        _vm.__("No options to choose from.")
                                      ),
                                    },
                                  }),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          false,
                          52952055
                        ),
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.fragmentTemplate
                    ? _c("text-input", {
                        ref: "fragment_template",
                        staticClass: "flex-1",
                        attrs: { append: "⏎" },
                        on: {
                          keydown: function ($event) {
                            if (
                              !$event.type.indexOf("key") &&
                              _vm._k(
                                $event.keyCode,
                                "enter",
                                13,
                                $event.key,
                                "Enter"
                              )
                            ) {
                              return null
                            }
                            return _vm.fragmentTemplateCommit.apply(
                              null,
                              arguments
                            )
                          },
                          blur: _vm.fragmentTemplateCommit,
                        },
                        model: {
                          value: _vm.fragmentTemplate,
                          callback: function ($$v) {
                            _vm.fragmentTemplate = $$v
                          },
                          expression: "fragmentTemplate",
                        },
                      })
                    : _vm._e(),
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          !_vm.eitherEnabled
            ? _c(
                "div",
                {
                  staticClass:
                    "flex-1 p-1 rounded border border-grey-40 bg-grey-10 flex justify-center items-center sfl-height",
                },
                [
                  !_vm.loading
                    ? _c("span", { staticClass: "text-sm text-grey" }, [
                        _vm._v("No additional options."),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.loading
                    ? _c("loading-graphic", {
                        attrs: { inline: true, text: "Loading…" },
                      })
                    : _vm._e(),
                ],
                1
              )
            : _vm._e(),
        ])
      : _vm._e(),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ normalizeComponent)
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./resources/js/addon.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Fieldtypes_FocalLinkFieldtype_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Fieldtypes/FocalLinkFieldtype.vue */ "./resources/js/components/Fieldtypes/FocalLinkFieldtype.vue");

window.StatamicFocalLink = {
  specCache: {},
  discoverCache: {}
};
Statamic.booting(function () {
  Statamic.$components.register('focal_link-fieldtype', _components_Fieldtypes_FocalLinkFieldtype_vue__WEBPACK_IMPORTED_MODULE_0__["default"]);
});
})();

/******/ })()
;