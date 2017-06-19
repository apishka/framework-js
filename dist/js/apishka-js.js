/*!
	Autosize 3.0.21
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports', 'module'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.autosize = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : (function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			'delete': function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	})();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function (name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = ta.clientWidth;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			var originalHeight = ta.style.height;
			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = 'auto';

			var endHeight = ta.scrollHeight + heightOffset;

			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				ta.style.height = originalHeight;
				return;
			}

			ta.style.height = endHeight + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);

			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

			// The actual height not matching the style height (set via the resize method) indicates that
			// the max-height has been exceeded, in which case the overflow should be allowed.
			if (actualHeight !== styleHeight) {
				if (computed.overflowY === 'hidden') {
					changeOverflow('scroll');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = (function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map['delete'](ta);
		}).bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function (el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function (el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	module.exports = autosize;
});;// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function () {
	"use strict";

	var doT = {
		name: "doT",
		version: "1.1.1",
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	"it",
			strip:		true,
			append:		true,
			selfcontained: false,
			doNotSkipEncoded: false
		},
		template: undefined, //fn, compile template
		compile:  undefined, //fn, for express
		log: true
	}, _globals;

	doT.encodeHTMLSource = function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	};

	_globals = (function(){ return this || (0,eval)("this"); }());

	/* istanbul ignore else */
	if (typeof module !== "undefined" && module.exports) {
		module.exports = doT;
	} else if (typeof define === "function" && define.amd) {
		define(function(){return doT;});
	} else {
		_globals.doT = doT;
	}

	var startend = {
		append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
		split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === "string") ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf("def.") === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ":") {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
				} else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return "";
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, "_");
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
			.replace(/'|\\/g, "\\$&")
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
			//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode) {
			if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
			str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
				+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
				+ str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			/* istanbul ignore else */
			if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());
;/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));
;/**
 * jQuery serializeObject
 * @copyright 2014, macek <paulmacek@gmail.com>
 * @link https://github.com/macek/jquery-serialize-object
 * @license BSD
 * @version 2.5.0
 */
(function(root, factory) {

  // AMD
  if (typeof define === "function" && define.amd) {
    define(["exports", "jquery"], function(exports, $) {
      return factory(exports, $);
    });
  }

  // CommonJS
  else if (typeof exports !== "undefined") {
    var $ = require("jquery");
    factory(exports, $);
  }

  // Browser
  else {
    factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(exports, $) {

  var patterns = {
    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    key:      /[a-z0-9_]+|(?=\[\])/gi,
    push:     /^$/,
    fixed:    /^\d+$/,
    named:    /^[a-z0-9_]+$/i
  };

  function FormSerializer(helper, $form) {

    // private variables
    var data     = {},
        pushes   = {};

    // private API
    function build(base, key, value) {
      base[key] = value;
      return base;
    }

    function makeObject(root, value) {

      var keys = root.match(patterns.key), k;

      // nest, nest, ..., nest
      while ((k = keys.pop()) !== undefined) {
        // foo[]
        if (patterns.push.test(k)) {
          var idx = incrementPush(root.replace(/\[\]$/, ''));
          value = build([], idx, value);
        }

        // foo[n]
        else if (patterns.fixed.test(k)) {
          value = build([], k, value);
        }

        // foo; foo[bar]
        else if (patterns.named.test(k)) {
          value = build({}, k, value);
        }
      }

      return value;
    }

    function incrementPush(key) {
      if (pushes[key] === undefined) {
        pushes[key] = 0;
      }
      return pushes[key]++;
    }

    function encode(pair) {
      switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
        case "checkbox":
          return pair.value === "on" ? true : pair.value;
        default:
          return pair.value;
      }
    }

    function addPair(pair) {
      if (!patterns.validate.test(pair.name)) return this;
      var obj = makeObject(pair.name, encode(pair));
      data = helper.extend(true, data, obj);
      return this;
    }

    function addPairs(pairs) {
      if (!helper.isArray(pairs)) {
        throw new Error("formSerializer.addPairs expects an Array");
      }
      for (var i=0, len=pairs.length; i<len; i++) {
        this.addPair(pairs[i]);
      }
      return this;
    }

    function serialize() {
      return data;
    }

    function serializeJSON() {
      return JSON.stringify(serialize());
    }

    // public API
    this.addPair = addPair;
    this.addPairs = addPairs;
    this.serialize = serialize;
    this.serializeJSON = serializeJSON;
  }

  FormSerializer.patterns = patterns;

  FormSerializer.serializeObject = function serializeObject() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serialize();
  };

  FormSerializer.serializeJSON = function serializeJSON() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serializeJSON();
  };

  if (typeof $.fn !== "undefined") {
    $.fn.serializeObject = FormSerializer.serializeObject;
    $.fn.serializeJSON   = FormSerializer.serializeJSON;
  }

  exports.FormSerializer = FormSerializer;

  return FormSerializer;
}));
;// Generated by CoffeeScript 1.6.2
/**
@license Sticky-kit v1.1.3 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/


(function() {
  var $, win;

  $ = this.jQuery || window.jQuery;

  win = $(window);

  $.fn.stick_in_parent = function(opts) {
    var doc, elm, enable_bottoming, inner_scrolling, manual_spacer, offset_top, outer_width, parent_selector, recalc_every, sticky_class, _fn, _i, _len;

    if (opts == null) {
      opts = {};
    }
    sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
    if (offset_top == null) {
      offset_top = 0;
    }
    if (parent_selector == null) {
      parent_selector = void 0;
    }
    if (inner_scrolling == null) {
      inner_scrolling = true;
    }
    if (sticky_class == null) {
      sticky_class = "is_stuck";
    }
    doc = $(document);
    if (enable_bottoming == null) {
      enable_bottoming = true;
    }
    outer_width = function(el) {
      var computed, w, _el;

      if (window.getComputedStyle) {
        _el = el[0];
        computed = window.getComputedStyle(el[0]);
        w = parseFloat(computed.getPropertyValue("width")) + parseFloat(computed.getPropertyValue("margin-left")) + parseFloat(computed.getPropertyValue("margin-right"));
        if (computed.getPropertyValue("box-sizing") !== "border-box") {
          w += parseFloat(computed.getPropertyValue("border-left-width")) + parseFloat(computed.getPropertyValue("border-right-width")) + parseFloat(computed.getPropertyValue("padding-left")) + parseFloat(computed.getPropertyValue("padding-right"));
        }
        return w;
      } else {
        return el.outerWidth(true);
      }
    };
    _fn = function(elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
      var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;

      if (elm.data("sticky_kit")) {
        return;
      }
      elm.data("sticky_kit", true);
      last_scroll_height = doc.height();
      parent = elm.parent();
      if (parent_selector != null) {
        parent = parent.closest(parent_selector);
      }
      if (!parent.length) {
        throw "failed to find stick parent";
      }
      fixed = false;
      bottomed = false;
      spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
      if (spacer) {
        spacer.css('position', elm.css('position'));
      }
      recalc = function() {
        var border_top, padding_top, restore;

        if (detached) {
          return;
        }
        last_scroll_height = doc.height();
        border_top = parseInt(parent.css("border-top-width"), 10);
        padding_top = parseInt(parent.css("padding-top"), 10);
        padding_bottom = parseInt(parent.css("padding-bottom"), 10);
        parent_top = parent.offset().top + border_top + padding_top;
        parent_height = parent.height();
        if (fixed) {
          fixed = false;
          bottomed = false;
          if (manual_spacer == null) {
            elm.insertAfter(spacer);
            spacer.detach();
          }
          elm.css({
            position: "",
            top: "",
            width: "",
            bottom: ""
          }).removeClass(sticky_class);
          restore = true;
        }
        top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
        height = elm.outerHeight(true);
        el_float = elm.css("float");
        if (spacer) {
          spacer.css({
            width: outer_width(elm),
            height: height,
            display: elm.css("display"),
            "vertical-align": elm.css("vertical-align"),
            "float": el_float
          });
        }
        if (restore) {
          return tick();
        }
      };
      recalc();
      if (height === parent_height) {
        return;
      }
      last_pos = void 0;
      offset = offset_top;
      recalc_counter = recalc_every;
      tick = function() {
        var css, delta, recalced, scroll, will_bottom, win_height;

        if (detached) {
          return;
        }
        recalced = false;
        if (recalc_counter != null) {
          recalc_counter -= 1;
          if (recalc_counter <= 0) {
            recalc_counter = recalc_every;
            recalc();
            recalced = true;
          }
        }
        if (!recalced && doc.height() !== last_scroll_height) {
          recalc();
          recalced = true;
        }
        scroll = win.scrollTop();
        if (last_pos != null) {
          delta = scroll - last_pos;
        }
        last_pos = scroll;
        if (fixed) {
          if (enable_bottoming) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
            if (bottomed && !will_bottom) {
              bottomed = false;
              elm.css({
                position: "fixed",
                bottom: "",
                top: offset
              }).trigger("sticky_kit:unbottom");
            }
          }
          if (scroll < top) {
            fixed = false;
            offset = offset_top;
            if (manual_spacer == null) {
              if (el_float === "left" || el_float === "right") {
                elm.insertAfter(spacer);
              }
              spacer.detach();
            }
            css = {
              position: "",
              width: "",
              top: ""
            };
            elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
          }
          if (inner_scrolling) {
            win_height = win.height();
            if (height + offset_top > win_height) {
              if (!bottomed) {
                offset -= delta;
                offset = Math.max(win_height - height, offset);
                offset = Math.min(offset_top, offset);
                if (fixed) {
                  elm.css({
                    top: offset + "px"
                  });
                }
              }
            }
          }
        } else {
          if (scroll > top) {
            fixed = true;
            css = {
              position: "fixed",
              top: offset
            };
            css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
            elm.css(css).addClass(sticky_class);
            if (manual_spacer == null) {
              elm.after(spacer);
              if (el_float === "left" || el_float === "right") {
                spacer.append(elm);
              }
            }
            elm.trigger("sticky_kit:stick");
          }
        }
        if (fixed && enable_bottoming) {
          if (will_bottom == null) {
            will_bottom = scroll + height + offset > parent_height + parent_top;
          }
          if (!bottomed && will_bottom) {
            bottomed = true;
            if (parent.css("position") === "static") {
              parent.css({
                position: "relative"
              });
            }
            return elm.css({
              position: "absolute",
              bottom: padding_bottom,
              top: "auto"
            }).trigger("sticky_kit:bottom");
          }
        }
      };
      recalc_and_tick = function() {
        recalc();
        return tick();
      };
      detach = function() {
        detached = true;
        win.off("touchmove", tick);
        win.off("scroll", tick);
        win.off("resize", recalc_and_tick);
        $(document.body).off("sticky_kit:recalc", recalc_and_tick);
        elm.off("sticky_kit:detach", detach);
        elm.removeData("sticky_kit");
        elm.css({
          position: "",
          bottom: "",
          top: "",
          width: ""
        });
        parent.position("position", "");
        if (fixed) {
          if (manual_spacer == null) {
            if (el_float === "left" || el_float === "right") {
              elm.insertAfter(spacer);
            }
            spacer.remove();
          }
          return elm.removeClass(sticky_class);
        }
      };
      win.on("touchmove", tick);
      win.on("scroll", tick);
      win.on("resize", recalc_and_tick);
      $(document.body).on("sticky_kit:recalc", recalc_and_tick);
      elm.on("sticky_kit:detach", detach);
      return setTimeout(tick, 0);
    };
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      elm = this[_i];
      _fn($(elm));
    }
    return this;
  };

}).call(this);
;/*jslint browser: true*/
/*jslint jquery: true*/

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * https://github.com/tzuryby/jquery.hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function(jQuery) {

  jQuery.hotkeys = {
    version: "0.8",

    specialKeys: {
      8: "backspace",
      9: "tab",
      10: "return",
      13: "return",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "insert",
      46: "del",
      59: ";",
      61: "=",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "numlock",
      145: "scroll",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    },

    shiftNums: {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      ";": ": ",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
      "\\": "|"
    },

    // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
    textAcceptingInputTypes: [
      "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
      "datetime-local", "search", "color", "tel"],

    // default input types not to bind to unless bound directly
    textInputTypes: /textarea|input|select/i,

    options: {
      filterInputAcceptingElements: true,
      filterTextInputs: true,
      filterContentEditable: true
    }
  };

  function keyHandler(handleObj) {
    if (typeof handleObj.data === "string") {
      handleObj.data = {
        keys: handleObj.data
      };
    }

    // Only care when a possible input has been specified
    if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
      return;
    }

    var origHandler = handleObj.handler,
      keys = handleObj.data.keys.toLowerCase().split(" ");

    handleObj.handler = function(event) {
      //      Don't fire in text-accepting inputs that we didn't directly bind to
      if (this !== event.target &&
        (jQuery.hotkeys.options.filterInputAcceptingElements &&
          jQuery.hotkeys.textInputTypes.test(event.target.nodeName) ||
          (jQuery.hotkeys.options.filterContentEditable && jQuery(event.target).attr('contenteditable')) ||
          (jQuery.hotkeys.options.filterTextInputs &&
            jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
        return;
      }

      var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
        character = String.fromCharCode(event.which).toLowerCase(),
        modif = "",
        possible = {};

      jQuery.each(["alt", "ctrl", "shift"], function(index, specialKey) {

        if (event[specialKey + 'Key'] && special !== specialKey) {
          modif += specialKey + '+';
        }
      });

      // metaKey is triggered off ctrlKey erronously
      if (event.metaKey && !event.ctrlKey && special !== "meta") {
        modif += "meta+";
      }

      if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
        modif = modif.replace("alt+ctrl+shift+", "hyper+");
      }

      if (special) {
        possible[modif + special] = true;
      }
      else {
        possible[modif + character] = true;
        possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if (modif === "shift+") {
          possible[jQuery.hotkeys.shiftNums[character]] = true;
        }
      }

      for (var i = 0, l = keys.length; i < l; i++) {
        if (possible[keys[i]]) {
          return origHandler.apply(this, arguments);
        }
      }
    };
  }

  jQuery.each(["keydown", "keyup", "keypress"], function() {
    jQuery.event.special[this] = {
      add: keyHandler
    };
  });

})(jQuery || this.jQuery || window.jQuery);
;(function($) {

// jQuery on an empty object, we are going to use this as our Queue
var ajaxQueue = $({});

$.ajaxQueue = function( ajaxOpts ) {
    var jqXHR,
        dfd = $.Deferred(),
        promise = dfd.promise();

    // run the actual query
    function doRequest( next ) {
        jqXHR = $.ajax( ajaxOpts );
        jqXHR.done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }

    // queue our ajax request
    ajaxQueue.queue( doRequest );

    // add the abort method
    promise.abort = function( statusText ) {

        // proxy abort to the jqXHR if it is active
        if ( jqXHR ) {
            return jqXHR.abort( statusText );
        }

        // if there wasn't already a jqXHR we need to remove from queue
        var queue = ajaxQueue.queue(),
            index = $.inArray( doRequest, queue );

        if ( index > -1 ) {
            queue.splice( index, 1 );
        }

        // and then reject the deferred
        dfd.rejectWith( ajaxOpts.context || ajaxOpts, [ promise, statusText, "" ] );
        return promise;
    };

    return promise;
};

})(jQuery);
;(
    function()
    {
        var JihadCore = window.JihadCore = {
            $win: $(window),
            $doc: $(document),
            $html: $('html'),
            $body: $('body')
        };

        /**
         * List of registered blocks
         */

        JihadCore.blocks = {};

        /**
         * Main function to register
         */

        JihadCore.blockRegister = function(block)
        {
            var selector = block.getSelector();

            if (selector)
            {
                if (selector in JihadCore.blocks)
                {
                    console.log('Selector ' + selector + ' is already registered in other block');
                }
                else
                {
                    JihadCore.blocks[selector] = block;
                }
            }

            return this;
        };

        /**
         * Apply blocks
         */

        JihadCore.blocksRun = function(dom)
        {
            var parent = dom || document;

            $.each(
                JihadCore.blocks,
                function(selector, block)
                {
                    var $target = $(parent).filter(selector).add($(selector, parent));

                    if ($target.length)
                    {
                        $target.each(
                            function ()
                            {
                                if (block.inherit)
                                {
                                    $.each(
                                        block.inherit, function (i, name)
                                        {
                                            block = $.extend(
                                                {
                                                    super: function (selector)
                                                    {
                                                        return JihadCore.blocks[selector || name];
                                                    }
                                                },
                                                JihadCore.blocks[name] || {},
                                                block
                                            )
                                        }
                                    );
                                    JihadCore.blocks[selector] = block;
                                }
                                
                                block.run($(this));
                            }
                        );
                    }
                }
            );

            return this;
        };

        /**
         * Checks whether variable is defined or not.
         */

        JihadCore.isDefined = function (variable)
        {
            return variable != null;
        };


        var jihadDataCache = {};
        JihadCore.data = function (key, value) {
            if (arguments.length < 2) {
                return jihadDataCache[key];
            }
            jihadDataCache[key] = value;
        };


        /**
         * Make function throttled
         */
        JihadCore.throttle = function (fn, delay) {
            var timeoutId = null,
                queued = false,
                fnThis,
                fnArgs;

            function throttled() {
                fnThis = this;
                fnArgs = arguments;

                if (timeoutId) {
                    queued = true;
                } else {
                    fn.apply(fnThis, fnArgs);
                    timeoutId = setTimeout(function () {
                        timeoutId = null;
                        if (queued) {
                            queued = false;
                            throttled.apply(fnThis, fnArgs);
                        }
                    }, delay);
                }
            }

            function reset() {
                queued = false;
            }

            throttled.reset = reset;

            return throttled;
        };
    }()
);
;(
    function ()
    {
        var JihadBlock = window.JihadBlock = {};
        
        /**
         * Returns main block selector and children elements
         */
        
        JihadBlock.getSelector = function ()
        {
            return null;
        };
        
        JihadBlock.sel = function (q, n)
        {
            if (typeof q === 'number') return this.getSelector().slice(q);
            
            return q ? (this.getSelector() + '-' + q).slice(n) : this.getSelector();
        };
        
        /**
         * Communication between blocks
         */
        
        JihadBlock.emit = function (event)
        {
            if (!event) throw new Error('Event name is not set.');
            
            var props = $.makeArray(arguments).slice(1);
            
            $.each(
                JihadCore.blocks,
                function (selector)
                {
                    $(selector).each(
                        function ()
                        {
                            $(this).triggerHandler(
                                $.Event(
                                    event, {
                                        __jihadSelector: selector
                                    }
                                ),
                                props
                            );
                        }
                    )
                }
            );
        };
        
        /**
         * Returns bindings
         */
        
        JihadBlock.getBindings = function ()
        {
            return [];
        };
        
        /**
         * Returns initialized flag for block
         */
        
        JihadBlock.isInitialized = function ($target)
        {
            var initialized = $target.data('jihad-initialized');
            if (initialized)
            {
                var selector = this.getSelector();
                if (selector in initialized)
                    return true;
            }
            
            return false;
        };
        
        /**
         * Function to apply all bindings
         */
        
        JihadBlock.applyBindings = function ($target)
        {
            var block = this;
            
            $.each(
                this.getBindings($target),
                function (index, binding)
                {
                    $target.on.apply(
                        $target,
                        [
                            binding[0],
                            typeof binding[1] === 'string' ? binding[1] : handler(binding[1]),
                            binding[2] ? handler(binding[2]) : undefined
                        ]
                    );
                    
                    function handler(prime)
                    {
                        return function (e)
                        {
                            if (e.__jihadSelector)
                            {
                                if (block.getSelector() === e.__jihadSelector)
                                    return prime.apply(this, arguments);
                            }
                            else
                                return prime.apply(this, arguments);
                        }
                    }
                }
            );
        };
        
        /**
         * Returns initialize function
         */
        
        JihadBlock.initialize = function ($target)
        {
        };
        
        /**
         * Returns finalize function
         */
        
        JihadBlock.finalize = function ($target)
        {
        };
        
        /**
         * Run block
         */
        
        JihadBlock.run = function ($target)
        {
            var self = this;
            
            function _tmp() {}
            
            $.each(
                $target,
                function ()
                {
                    var $elem = $(this);
                    
                    _tmp.prototype = self;
                    self           = new _tmp();
                    _tmp.prototype = null;
                    
                    if (!self.isInitialized($elem))
                    {
                        var initialized                 = $elem.data('jihad-initialized') || {};
                        initialized[self.getSelector()] = 1;
                        $elem.data('jihad-initialized', initialized);
                        
                        self.el = function (q)
                        {
                            return q ? $(self.getSelector() + '-' + q, $elem) : $elem;
                        };
                        self.initialize($elem);
                        self.applyBindings($elem);
                        self.finalize($elem);
                    }
                }
            );
        };
    }()
);
;(
    function()
    {
        var JihadForm = window.JihadForm = {
            lock: null,
            lockSelector: null
        };
    
        $(window).on(
            'beforeunload', function ()
            {
                JihadForm.__unloaded = true;
            }
        );

        /**
         * Returns form action
         */

        JihadForm.getAction = function($form)
        {
            return $form.attr('action');
        };

        /**
         * Returns post method
         */

        JihadForm.getMethod = function($form)
        {
            return $form.attr('method') || 'POST';
        };

        /**
         * Returns post data
         */

        JihadForm.getData = function($form)
        {
            return $form.serialize();
        };

        /**
         * Returns lock
         */

        JihadForm.getLock = function()
        {
            if (this.lock === null)
                this.lock = this.createLock();

            return this.lock;
        };

        /**
         * Returns lock selector
         */

        JihadForm.getLockSelector = function()
        {
            return this.lockSelector;
        };

        /**
         * Creates lock
         */

        JihadForm.createLock = function()
        {
            return new JihadLock(this.getLockSelector());
        };

        /**
         * Hide all error fields
         */

        JihadForm.errorsHide = function($form)
        {
            $form.find('[data-role="error"],[role="error"]').hide();
        };

        /**
         * Show errors in the form
         */

        JihadForm.errorsShow = function($form, errors)
        {
            var self = this;

            $.each(
                errors,
                function(field, error)
                {
                    self.errorShow($form, field, error);
                }
            );
        };

        /**
         * Error show for field
         */

        JihadForm.errorShow = function($form, field, error)
        {
            $form.find('[role="error"][data-field="' + field + '"],[data-role="error"][data-field="' + field + '"]')
                .text(error.message)
                .show()
            ;
        };

        /**
         * Show global error
         */

        JihadForm.errorGlobal = function($form, error)
        {
            alert(error.code ? error.code + ': ' + error.message : error.message);
        };

        /**
         * Before send function
         */

        JihadForm.beforeSend = function($form)
        {
            this.submitsDisable($form);
            this.getLock().lock($form);
        };

        /**
         * After send function
         */

        JihadForm.afterSend = function($form)
        {
            this.submitsEnable($form);
            this.getLock().unlock($form);
        };

        /**
         * Submits disable
         */

        JihadForm.submitsDisable = function($form)
        {
            $form.find('[type="submit"],[role="submit"],[data-role="submit"]').prop('disabled', true);
        };

        /**
         * Submits enable
         */

        JihadForm.submitsEnable = function($form)
        {
            $form.find('[type="submit"],[role="submit"],[data-role="submit"]').prop('disabled', false);
        };

        /**
         * Success function
         */

        JihadForm.onSuccess = function($form, data, textStatus, jqXHR)
        {
            this.errorsHide($form);

            if (data && data.result)
            {
                if (data.result.errors)
                {
                    $form.trigger('jihad-fail', data);

                    this.fail($form, data.result);
                }
                else
                {
                    $form.trigger('jihad-success', data);

                    this.success($form, data.result);
                }
            }
            else if (data && data.error)
            {
                $form.trigger('jihad-fail', data);
                
                this.errorGlobal(
                    $form,
                    data.error
                );
            }
            else
            {
                $form.trigger('jihad-fail', data);

                this.errorGlobal(
                    $form,
                    {
                        message: 'Something is wrong'
                    }
                );
            }
        };

        /**
         * Method called on error
         */

        JihadForm.onError = function($form, jqXHR, textStatus, errorThrown)
        {
            $form.trigger('jihad-fail');

            if (!JihadForm.__unloaded)
                this.errorGlobal(
                    $form,
                    {
                        message: 'Something is wrong'
                    }
                );
        };

        /**
         * Fail function
         */

        JihadForm.fail = function($form, result)
        {
            this.errorsShow($form, result.errors);
        };

        /**
         * Success
         */

        JihadForm.success = function($form, result)
        {
        };

        /**
         * List of registered blocks
         */

        JihadForm.submit = function(form)
        {
            var self = this;
            var $form = $(form);

            if (this.getLock().isLocked($form))
                return false;

            $.ajax(
                this.getAction($form),
                {
                    beforeSend: function()
                    {
                        self.beforeSend($form);
                    },
                    complete: function()
                    {
                        self.afterSend($form);
                    },
                    dataType:   'json',
                    data:       this.getData($form),
                    type:       this.getMethod($form),
                    success:    function(data, textStatus, jqXHR)
                    {
                        self.onSuccess($form, data, textStatus, jqXHR);
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        self.onError($form, jqXHR, textStatus, errorThrown);
                    }
                }
            );

            return false;
        };
    }
    ()
);
;(
    function()
    {
        var JihadLock = window.JihadLock = function(toggle_selector)
        {
            /**
             * Toggle selector
             */

            this._toggle_selector = toggle_selector || '.js-lock-toggle';

            /**
             * Return toggle selector
             */

            this.getToggleSelector = function($elem)
            {
                return this._toggle_selector;
            };

            /**
             * Is locked
             */

            this.isLocked = function($elem)
            {
                if ($elem.data('jihad-locked'))
                    return true;

                return false;
            };

            /**
             * Lock
             */

            this.lock = function($elem)
            {
                $elem.data('jihad-locked', 1);

                this.afterLock($elem);
            };

            /**
             * After lock
             */

            this.afterLock = function($elem)
            {
                $elem.find(this.getToggleSelector($elem)).toggleClass('hidden');
            };

            /**
             * Unlock
             */

            this.unlock = function($elem)
            {
                $elem.data('jihad-locked', 0);

                this.afterUnlock($elem);
            };

            /**
             * After unlock
             */

            this.afterUnlock = function($elem)
            {
                $elem.find(this.getToggleSelector($elem)).toggleClass('hidden');
            };
        };
    }
    ()
);
;(
    function()
    {
        var JihadModal = window.JihadModal = {
            $active: null,
            tpl: 'modal',
            preprocess: true
        };

        /**
         * Returns base modal template
         */

        JihadModal.getTpl = function()
        {
            return this.tpl;
        };

        /**
         * Returns action for modal
         */

        JihadModal.getUrl = function()
        {
            return null;
        };

        /**
         * Preprocess URL function
         */

        JihadModal.preprocessUrl = function()
        {
            var url = this.getUrl();

            if (url && this.preprocess)
            {
                var parsed = JihadUrl.parse(url, true);

                parsed['pathname'] += '.json';
                parsed['search'] = parsed['query'];
                parsed['search']['layouts'] = ['layout_content'];

                url = JihadUrl.make(parsed);
            }

            return url;
        };

        /**
         * Returns post data
         */

        JihadModal.getData = function()
        {
            return {};
        };

        /**
         * Returns method
         */

        JihadModal.getMethod = function()
        {
            return 'POST';
        };

        /**
         * Before send function
         */

        JihadModal.beforeSend = function()
        {
        };

        /**
         * After send function
         */

        JihadModal.afterSend = function()
        {
        };

        /**
         * Returns modal
         */

        JihadModal.getActive = function()
        {
            return this.$active;
        };

        /**
         * Success function
         */

        JihadModal.onSuccess = function(data, textStatus, jqXHR)
        {
            if (data && data.result)
            {
                if (data.result.errors)
                {
                    this.fail(data.result);
                }
                else
                {
                    this.successLayout(data.result);
                    this.success(data.result);
                }
            }
            else
            {
                this.errorGlobal(
                    {
                        message: 'Something is wrong'
                    }
                );
            }
        };

        /**
         * Method called on error
         */

        JihadModal.onError = function(jqXHR, textStatus, errorThrown)
        {
            this.errorGlobal(
                {
                    message: 'Something is wrong'
                }
            );
        };

        /**
         * Fail function
         */

        JihadModal.fail = function(result)
        {
            this.errorGlobal(
                {
                    message: 'Something is wrong'
                }
            );
        };

        /**
         * Success
         */

        JihadModal.success = function(result)
        {
            JihadModal.getActive().modal('show');
        };

        /**
         * Success layout
         */

        JihadModal.successLayout = function(result)
        {
            var $content = JihadModal.getActive().find('.modal-content');

            $content.html(result['layouts']['layout_content']);
        };

        /**
         * Show global error
         */

        JihadModal.errorGlobal = function(error)
        {
            alert(error.message);
        };

        /**
         * Shows modal
         */

        JihadModal.show = function(options)
        {
            if (JihadModal.getActive())
                JihadModal.getActive().remove();

            JihadModal.$active = JihadTpl.html(this.getTpl(), options || {});
            JihadCore.$body.append(JihadModal.getActive());

            var url = this.preprocessUrl();
            if (url)
            {
                var self = this;
                $.ajax(
                    url,
                    {
                        beforeSend: function()
                        {
                            self.beforeSend();
                        },
                        complete: function()
                        {
                            self.afterSend();
                        },
                        dataType:   'json',
                        data:       this.getData(),
                        type:       this.getMethod(),
                        success:    function(data, textStatus, jqXHR)
                        {
                            self.onSuccess(data, textStatus, jqXHR);

                            // After do all job we assign bindings
                            JihadCore.blocksRun(JihadModal.getActive());
                        },
                        error: function(jqXHR, textStatus, errorThrown)
                        {
                            self.onError(jqXHR, textStatus, errorThrown);
                        }
                    }
                );
            }
            else
            {
                this.success({});

                JihadCore.blocksRun(JihadModal.getActive());
            }

            return false;
        };

        /**
         * Hide active modal
         */

        JihadModal.hide = function()
        {
            JihadModal.getActive().modal('hide');
        }
    }
    ()
);
;(
    function ()
    {
        var JihadModel = window.JihadModel = {};
        
        JihadModel.model = function (model)
        {
            var self = this;
            
            this._model = model || this._model;
            
            return {
                get: function (name)
                {
                    if (name) return self._model[name];
                    return self._model;
                },
                
                set: function (key, value)
                {
                    var targetNode = $(self.sel('model') + '[data-model$=":' + key + '"]');
                    var old_val    = self._model[key];
                    
                    self._model[key] = value;
                    
                    targetNode.each(
                        function ()
                        {
                            var it     = $(this);
                            var action = it.data('model').split(':');
                            var val    = value;
                            
                            if (it.is(':checkbox') || it.is(':radio'))
                                val = !!+val;
                            
                            if (action.length === 3)
                                it[action[0]](action[1], val);
                            else
                                it[action[0]](val);
                            
                            if (it.is('select') && !it.find('option[value="' + val + '"]').length)
                                it.val(it.find('option:first').val());
                            
                            it.trigger('change');
                        }
                    );
                    
                    self.el().trigger('model:change', [key, old_val, value])
                },
                
                apply: function ()
                {
                    $.each(
                        self._model,
                        function (key, value)
                        {
                            self.model().set(key, value)
                        }
                    );
                    
                    self.el().trigger('model:applied')
                },
                
                toParams: function ()
                {
                    return $.param(self._model);
                },
                
                serialize: function ()
                {
                    return JSON.stringify(self._model);
                }
            }
        };
        
        JihadModel.init = function (block)
        {
            if (block.model) return;
            
            block._model = {};
            block.model  = JihadModel.model;
            
            block.el().on(
                'input',
                block.sel('model') + '[data-model]',
                function ()
                {
                    console.log(this);
                    var it   = $(this);
                    var name = it.data('model').split(':');
                    
                    name = name[name.length - 1];
                    
                    block.model().set(name, this.value);
                }
            )
        }
    }
    ()
);
;(
    function()
    {
        var JihadRowUpdater = window.JihadRowUpdater = {
            container: null,
            data: {}
        };

        /**
         * Returns initialize function
         */

        JihadRowUpdater.id = function(id)
        {
            return id;
        };

        /**
         * Run block
         */

        JihadRowUpdater.run = function()
        {
            var $container = $(this.container);
            var self = this;

            $.each(
                this.data,
                function(id, html)
                {
                    var $elem = $container.find('#' + self.id(id));

                    if ($elem.length)
                    {
                        if (html)
                        {
                            $elem.replaceWith(html);
                            JihadCore.blocksRun($elem);
                        }
                        else
                        {
                            $elem.remove();
                        }
                    }
                    else
                    {
                        $container.prepend(html);
                    }
                }
            );
        };
    }()
);
;(
    function()
    {
        var JihadTpl = window.JihadTpl = {};

        // Changing template tags from "{{" to "[["
        ['evaluate', 'interpolate', 'encode', 'use', 'define', 'conditional', 'iterate'].forEach(
            function (tag)
            {
                var originalRegExp = this[tag],
                newSource = originalRegExp.source.replace(/\\{\\{/g, '\\[\\[').replace(/\\}\\}/g, '\\]\\]'),
                flags = (originalRegExp.global ? 'g' : '') + (originalRegExp.multiline ? 'm' : '') + (originalRegExp.ignoreCase ? 'i' : '');

                this[tag] = new RegExp(newSource, flags);
            },
            doT.templateSettings
        );

        /**
         * Template prefix constant
         */

        JihadTpl.TPL_PREFIX = 'tpl-';

        /**
         * Cache
         */

        JihadTpl.cache = {};

        /**
         * Helpers
         */

        JihadTpl.helpers = {

            params: function (obj)
            {
                return JSON.stringify(obj);
            },

            include: function (name, data)
            {
                return JihadTpl.html(name, data);
            }
        };

        /**
         * Push template to cache
         */

        JihadTpl.push = function (name, tmpl)
        {
            return JihadTpl.cache[name] = doT.compile(tmpl);
        };

        /**
         * Returns template by name
         */

        JihadTpl.get = function (name)
        {
            var $tmpl, tmpl;

            if (name)
            {
                // Searching in cache
                tmpl = JihadTpl.cache[name];

                if (tmpl === undefined)
                {
                    // Template not found in cache, so searching for it in DOM
                    $tmpl = $('#' + JihadTpl.TPL_PREFIX + name);

                    if ($tmpl.length)
                    {
                        // Template found in DOM, so putting it in templates cache.
                        // Trimming result string for easier use in jQuery >= 1.9
                        // (if it's not starts with "<" and ends with ">" it'll be treated as selector)
                        // http://jquery.com/upgrade-guide/1.9/#jquery-htmlstring-versus-jquery-selectorstring
                        tmpl = JihadTpl.push(name, $tmpl.html().trim());
                    }
                    else
                    {
                        // Putting `null` to templates cache not to search for it in DOM any more
                        tmpl = JihadTpl.cache[name] = null;
                    }
                }
            }

            return tmpl || null;
        };

        /**
         * Returns rendered text
         */

        JihadTpl.text = function(name, data)
        {
            var tmpl = JihadTpl.get(name);

            if (!tmpl)
                return '';

            return tmpl(data || {});
        };

        /**
         * Returns rendered template
         */

        JihadTpl.html = function(name, data)
        {
            return $(JihadTpl.text(name, data));
        };
    }
    ()
);
;(
    function()
    {
        var JihadUrl = window.JihadUrl = (function (window, document) {
            
            // Checks if string starts with some protocol
            var ABSOLUTE_URL = /^\w+:\/\//i,
            // RegExp to parse absolute URL (protocol://user:password@hostname:port/pathname?search#hash)
                PARSE_URL = /^(.+?:)\/\/(?:.+?(?::.+?)?@)?((.+?)(?::(\d+))?)(\/.*?)?(\?.*?)?(#.*)?$/,
                PLUS_SIGN = /\+/g,
                HISTORY_API_SUPPORTED = !!(window.history && window.history.pushState),
                inited = false,
                toAbsoluteUrl,
                getUrlUsingDOM,
                link = document.createElement('a'),
                div,
                currentPath = getPathFromLocation(),
                currentHash = unescapeHash(getHashFromLocation()),
                getPath,
                getHash,
                setHash,
                encodeUrlQuery = $.param.bind($),
            // DUDU-1372: replacing '+' with '%20'
                decodeQueryPart = function (str) {
                    return decodeURIComponent(str.replace(PLUS_SIGN, '%20'));
                },
                localOrigin;

            // ==================================== Common url methods ====================================

            // Making toAbsoluteUrl function
            // Проверка, работает ли преобразование урла в абсолютный через установку href у ссылки (не работает в IE<8)
            link.href = 'a';
            if (link.href === 'a') {
                div = document.createElement('div');
                getUrlUsingDOM = function (url) {
                    div.innerHTML = '<a href="' + url.replace(/"/g, '%22') + '"></a>';
                    
                    return div.firstChild.href;
                };
            } else {
                getUrlUsingDOM = function (url) {
                    link.href = url;
                    
                    return link.href;
                };
            }
            
            toAbsoluteUrl = function (url) {
                url = url || '';
                
                return ABSOLUTE_URL.test(url) ? url : getUrlUsingDOM(url);
            };

            function nativeNavigation(url, replace) {
                window.location[replace ? 'replace' : 'assign'](url);
            }

            function pseudoNavigation(url, replace) {
                if (HISTORY_API_SUPPORTED) {
                    window.history[replace ? 'replaceState' : 'pushState']({}, null, url);
                } else {
                    updateLocationHash(url, replace);
                }
            }

            function parseUrl(url, parseQueryParams) {
                var info = null;
                
                if (url) {
                    url = toAbsoluteUrl(url);
                    info = PARSE_URL.exec(url);
                }

                if (info) {
                    info = {
                        href: url,
                        protocol: info[1],
                        host: info[2] || '',
                        hostname: info[3] || '',
                        port: info[4] || '',
                        pathname: info[5] || '',
                        search: (!info[6] || info[6].length === 1) ? '' : info[6],
                        hash: (!info[7] || info[7].length === 1) ? '' : info[7]
                    };
                    info.path = info.pathname + info.search;
                    info.isLocal = isLocalUrl(info);
                    if (parseQueryParams) {
                        info.query = parseUrlQuery(info.search);
                    }
                }

                return info;
            }

            function makeUrl(urlInfo) {
                var url = '',
                    path,
                    search,
                    hash;

                urlInfo = urlInfo || {};

                // Protocol
                url += (urlInfo.protocol || location.protocol) + '//';

                // Host
                if (urlInfo.host) {
                    url += urlInfo.host;
                } else if (urlInfo.hostname) {
                    url += urlInfo.hostname + (urlInfo.port ? ':' + urlInfo.port : '');
                } else {
                    url += location.host;
                }

                // Path
                path = urlInfo.pathname;
                if (path && path.charAt(0) === '/') {
                    path = path.slice(1);
                }
                if (path) {
                    url += '/' + path;
                }

                // Query
                search = urlInfo.search;
                if (search) {
                    if (typeof search === 'string') {
                        if (search.charAt(0) === '?') {
                            search = search.slice(1);
                        }
                    } else {
                        search = encodeUrlQuery(search);
                    }
                    if (search) {
                        url += '?' + search;
                    }
                }

                // Hash
                hash = url.hash;
                if (hash && hash.charAt(0) === '#') {
                    hash = hash.slice(1);
                }
                if (hash) {
                    url += '#' + hash;
                }

                return url;
            }

            function parseUrlQuery(query) {
                var obj = {};

                // Stripping leading "?"
                if (query && query.charAt(0) === '?') {
                    query = query.slice(1);
                }

                if (query) {
                    query.split('&').forEach(function (pair) {
                        var key,
                            val;

                        pair = pair.split('=');
                        key = decodeQueryPart(pair[0]);
                        if (key) {
                            val = decodeQueryPart(pair.slice(1).join('='));
                            obj[key] = val;
                        }
                    });
                }

                return obj;
            }

            function isLocalUrl(url) {
                if (typeof url === 'string') {
                    url = parseUrl(url);
                }

                return (url && url.protocol === window.location.protocol && url.host === window.location.host);
            }
            
            // ==================================== Navigation methods ====================================

            function getPathFromLocation() {
                return window.location.pathname + window.location.search;
            }

            function getHashFromLocation() {
                return getHashFromStr(window.location.href);
            }

            function getHashFromStr(str) {
                return str.split('#').slice(1).join('#');
            }
            
            function unescapeHash(hash) {
                return hash.slice(0, 2) === '//' ? hash.slice(1) : hash;
            }

            function escapeHash(hash) {
                return hash.charAt(0) === '/' ? '/' + hash : hash;
            }

            function updateLocationHash(hash, replace) {
                if (replace) {
                    window.location.replace('#' + hash);
                } else {
                    window.location.hash = hash;
                }
            }

            function formUrl(path, hash) {
                return hash ? path + '#' + escapeHash(hash) : path;
            }

            if (HISTORY_API_SUPPORTED) {
                getPath = function (url) {
                    return url == null ? getPathFromLocation() : parseUrl(url).path;
                };
                
                getHash = function (url) {
                    return unescapeHash(url == null ? getHashFromLocation() : getHashFromStr(url));
                };
                
                setHash = function (hash) {
                    if (hash) {
                        updateLocationHash(escapeHash(hash), true);
                    } else {
                        window.history.replaceState({}, document.title, getPathFromLocation());
                    }
                };
            } else {
                getPath = function (url) {
                    if (url == null) {
                        url = getHashFromLocation();
                    }
                    
                    return parseUrl(url).path;
                };
                
                getHash = function (url) {
                    if (url == null) {
                        url = getHashFromLocation();
                    }

                    return unescapeHash(getHashFromStr(url));
                };
                
                setHash = function (hash) {
                    updateLocationHash(formUrl(getPath(), hash), true);
                };
            }

            /**
             * Checks url for changes
             * @private
             */
            function checkUrl() {
                handleNavigation(getPath(), getHash(), {
                    trigger: true,
                    replace: true,
                    ignoreSameUrl: true
                });
            }

            /**
             * @class JihadUrl
             * @singleton
             *
             * Provides methods to work with page url (parse, navigate and etc.)
             */
            return {

                /**
                 * Converts URL to absolute (with protocol, domain etc.)
                 *
                 *     // Current page is 'http://dudu.com/some/long/path'
                 *
                 *     JihadUrl.toAbsolute('../another/long/path');
                 *     // ==> 'http://dudu.com/some/another/long/path'
                 *     JihadUrl.toAbsolute('/user');
                 *     // ==> 'http://dudu.com/user'
                 *
                 * @param {String} url
                 * @return {String}
                 */
                toAbsolute: toAbsoluteUrl,

                /**
                 * Parses url and returns object with it's parts.
                 * Object attributes are the same as that of `window.location` object.
                 * 
                 * @param {String} url
                 * @return {Object|null} Object with url parts, if parsing was successful.
                 *   Otherwise `null`.
                 * @return {String} return.href  Absolute url
                 * @return {String} return.protocol  Protocol (with tailing `:`)
                 * @return {String} return.host  Host (with port, if it's explicitly specified)
                 * @return {String} return.hostname  Hostname (without port)
                 * @return {String} return.port  Port
                 * @return {String} return.pathname  Pathname (with leading `/`)
                 * @return {String} return.search  Search query (with leading `?`)
                 * @return {String} return.path  Pathname-part concatenated with search-part
                 * @return {String} return.hash  Hash (with leading `#`)
                 * @return {Boolean} return.isLocal  Is this url local (see #isLocal)
                 */
                parse: parseUrl,

                /**
                 * Makes url from object with url info.
                 * 
                 *   JihadUrl.make({
                 *     search: {
                 *       a: 1,
                 *       b: '',
                 *       c: null,
                 *       d: 'xaxa'
                 *     },
                 *     hash: '#'
                 *   });
                 *   // ==> 'http://dudu.com?a=1&b=&c=&d=xaxa'
                 * 
                 * @param {Object} urlInfo
                 * @param {String} [urlInfo.protocol=location.protocol]
                 * @param {String} [urlInfo.host=location.host]  If neither urlInfo.host nor urlInfo.hostname is specified, location.host is used.
                 * @param {String} [urlInfo.hostname]  It's used if urlInfo.host is not specified.
                 * @param {String|Number} [urlInfo.port]  Used only if urlInfo.hostname specified. 
                 * @param {String} [urlInfo.pathname]  Can be prefixed with "/".
                 * @param {String|Object} [urlInfo.search]  Can be prefixed with "?". If it's object, it's encoded to string with #encodeUrlQuery.
                 * @param {String|Object} [urlInfo.hash]  Can be prefixed with "#".
                 * @returns {String}  Full url.
                 */
                make: makeUrl,

                /**
                 * Parses search query string into object.
                 * Nested parameters are **not supported** (e.g. 'user[name]=th0r&user[email]=grunin.ya@ya.ru')
                 *
                 *     JihadUrl.parseQuery('a=1&b=false');
                 *     // ==> {a: '1', b: 'false'}
                 *     JihadUrl.parseQuery('?a=1&b=false', true)
                 *     // ==> {a: 1, b: false}
                 *
                 *     // Nested parameters are parsed not as expected:
                 *     JihadUrl.parseQuery('user[name]=th0r&user[email]=grunin.ya@ya.ru')
                 *     // ==> {'user[name]': 'th0r', 'user[email]': 'grunin.ya@ya.ru'}
                 *
                 * @param {String} query  Url search query string to parse (with or without leading `?`)
                 * @return {Object}
                 */
                parseQuery: parseUrlQuery,

                /**
                 * Encodes object to query string.
                 * Can encode arrays or objects.
                 * 
                 *   JihadUrl.encodeQuery({
                 *     a: 1,
                 *     b: null,
                 *     c: '',
                 *     d: 'xaxa',
                 *     e: [1, 2]
                 *   });
                 *   // ==> 'a=1&b=&c=&d=xaxa&e[]=1&e=2'
                 *   
                 * @param {Object} queryObj
                 * @return {String}
                 */
                encodeQuery: encodeUrlQuery,
                    
                /**
                 * Checks, whether passed url is local (protocol, host and port must be the same as at current page).
                 * @param {String|Object} url  Can be either string, or parsed url (with #parse method).
                 * @return {Boolean}
                 */
                isLocal: isLocalUrl,

                /**
                 * Fully reload current page, using native browser reloading method.
                 */
                reload: function () {
                    window.location.reload();
                },

                /**
                 * Return current path
                 * 
                 * @return {String} relative path
                 */
                getPath: function () {
                    return currentPath;
                },

                /**
                 * Return GET params for current url
                 *
                 * @return {Object}
                 */
                getQuery: function () {
                    return parseUrl(currentPath, true).query;
                },

                /**
                 * Get hash from url
                 * 
                 * @return {String}
                 */
                getHash: function () {
                    return getHash();
                },

                /**
                 * Returns current path with hash.
                 * 
                 * @return {String}
                 */
                getUrl: function () {
                    return formUrl(currentPath, getHash());
                },

                /**
                 * Return origin of passed url or local origin if argument is not provided.
                 * 
                 * @param {String}  [url]   Address from which to get origin
                 * @returns {String}
                 */
                getOrigin: function getOrigin(url) {
                    if (!url) {
                        localOrigin = localOrigin || window.location.origin || getOrigin(window.location.href);
                        
                        return localOrigin;
                    }
                    url = parseUrl(url);
                    
                    return url.protocol + '//' + url.host;
                },

                /**
                 * Set url hash
                 * 
                 * @param {String} hash
                 */
                setHash: setHash

            };

        }(window, document));
    }
    ()
);
;(
    function()
    {
        var AnimationBlock = {};

        JihadCore.blockRegister(
            $.extend(
                AnimationBlock,
                JihadBlock,
                {
                    /**
                     * Returns block selector
                     */

                    getSelector: function()
                    {
                        return '.jh-animation';
                    },

                    /**
                     * Returns block bindins
                     */

                    getBindings: function()
                    {
                        return [];
                    },

                    /**
                     * Initialize block
                     */

                    initialize: function($target)
                    {
                        var type = $target.data('type');

                        switch (type)
                        {
                            case 'rotating-plane':
                                AnimationBlock.initializeRotatingPlane($target);
                                break;

                            case 'double-bounce':
                                AnimationBlock.initializeDoubleBounce($target);
                                break;

                            case 'wave':
                                AnimationBlock.initializeWave($target);
                                break;

                            case 'pulse':
                                AnimationBlock.initializePulse($target);
                                break;

                            case 'three-bounce':
                                AnimationBlock.initializeThreeWave($target);
                                break;

                            case 'fading-circle':
                                AnimationBlock.initializeFadingCircle($target);
                                break;
                        }
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeDoubleBounce: function($target)
                    {
                        $target.addClass('sk-double-bounce');
                        $target.html(
                            [
                                '<div class="sk-child sk-double-bounce1"></div>',
                                '<div class="sk-child sk-double-bounce2"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for wave
                     */

                    initializeWave: function($target)
                    {
                        $target.addClass('sk-wave');
                        $target.html(
                            [
                                '<div class="sk-rect sk-rect1"></div>',
                                '<div class="sk-rect sk-rect2"></div>',
                                '<div class="sk-rect sk-rect3"></div>',
                                '<div class="sk-rect sk-rect4"></div>',
                                '<div class="sk-rect sk-rect5"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for pulse
                     */

                    initializePulse: function($target)
                    {
                        $target.addClass('sk-spinner-pulse');
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeThreeWave: function($target)
                    {
                        $target.addClass('sk-three-bounce');
                        $target.html(
                            [
                                '<div class="sk-child sk-bounce1"></div>',
                                '<div class="sk-child sk-bounce2"></div>',
                                '<div class="sk-child sk-bounce3"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeFadingCircle: function($target)
                    {
                        $target.addClass('sk-fading-circle');
                        $target.html(
                            [
                                '<div class="sk-circle1 sk-circle"></div>',
                                '<div class="sk-circle2 sk-circle"></div>',
                                '<div class="sk-circle3 sk-circle"></div>',
                                '<div class="sk-circle4 sk-circle"></div>',
                                '<div class="sk-circle5 sk-circle"></div>',
                                '<div class="sk-circle6 sk-circle"></div>',
                                '<div class="sk-circle7 sk-circle"></div>',
                                '<div class="sk-circle8 sk-circle"></div>',
                                '<div class="sk-circle9 sk-circle"></div>',
                                '<div class="sk-circle10 sk-circle"></div>',
                                '<div class="sk-circle11 sk-circle"></div>',
                                '<div class="sk-circle12 sk-circle"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize rotating plane
                     */

                    initializeRotatingPlane: function($target)
                    {
                        $target.addClass('sk-rotating-plane');
                    }
                }
            )
        );
    }
    ()
);
;(function () {
    var ListingBlock = {};

    /**
     * In HTML:
     *  <div class="js-list">
     *      ...
     *
     *      <button class="btn jh-list__more" data-more-url="{more_url}">Load More</button>
     *  </div>
     *
     * Expected response:
     *  {
     *      "result": {
     *          "html": "<h1>Hello</h1><button class=\"btn jh-list__more\" data-more-url=\"{new_more_url}\">Load More</button>",
     *      }
     *  }
     */

    JihadCore.blockRegister(
        $.extend(
            ListingBlock,
            JihadBlock,
            {
                /**
                 * Returns block selector
                 */

                getSelector: function()
                {
                    return '.jh-list';
                },

                /**
                 * Return initialize function
                 */

                initialize: function ($target)
                {
                    this._checkDistance = JihadCore.throttle(this._checkDistance.bind(this, $target), 500);
                    JihadCore.$win.on('load scroll resize', this._checkDistance);
                    this._checkDistance();
                },

                getMoreUrl: function($target)
                {
                    var $moreBtn,
                        hasMore;

                    if (this._noMore)
                    {
                        return null;
                    }

                    $moreBtn = this.getMoreBtn($target);
                    hasMore = !!$moreBtn.length;

                    if (!hasMore)
                    {
                        JihadCore.$win.off('load scroll resize', this._checkDistance);
                        this._noMore = true;
                    }

                    return hasMore
                        ? $moreBtn.data('more-url')
                        : null
                    ;
                },

                getMoreBtn: function($target)
                {
                    return $target.find('.jh-list__more');
                },

                _checkDistance: function($target)
                {
                    var lock = new JihadLock($target);

                    if (lock.isLocked($target))
                        return false;

                    var self = this,
                        $win = JihadCore.$win,
                        scrollBottom,
                        bottomEdge,
                        moreUrl = this.getMoreUrl($target)
                    ;

                    if (moreUrl)
                    {
                        scrollBottom = $win.scrollTop() + $win.height();
                        bottomEdge = $target.offset().top + $target.height();

                        if (bottomEdge - scrollBottom < 1000)
                        {
                            lock.lock($target);

                            $target.addClass('jh-list__loading');
                            $target
                                .find('.jh-list__toggle')
                                .toggleClass('jh-list__hidden')
                            ;

                            this.getMoreBtn($target).unbind();

                            $.ajax(
                                    {
                                        url: moreUrl,
                                        dataType: 'json',
                                        complete: function ()
                                        {
                                            lock.unlock($target);
                                        }
                                    }
                                )
                                .done(
                                    function (json)
                                    {
                                        var result = json && json.result || {},
                                            $html
                                        ;

                                        self.getMoreBtn($target).remove();

                                        lock.unlock($target);

                                        $target.removeClass('jh-list__loading');
                                        $target
                                            .find('.jh-list__toggle')
                                            .toggleClass('jh-list__hidden')
                                        ;

                                        if (result.html)
                                        {
                                            $html = $(result.html);
                                            $target.append($html);

                                            JihadCore.blocksRun($html);
                                        }
                                    }
                                )
                            ;
                        }
                    }
                }
            }
        )
    );
}());
;(
    function ()
    {
        var SelectBlock = {};
        
        JihadCore.blockRegister(
            $.extend(
                SelectBlock,
                JihadBlock,
                {
                    /**
                     * Returns block selector
                     */
                    
                    getSelector: function ()
                    {
                        return '.jh-select';
                    },
                    
                    /**
                     * Returns block bindins
                     */
                    
                    getBindings: function ()
                    {
                        var self = this;
                        
                        return [
                            [
                                'change',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem        = $(this);
                                    var $select      = $elem.closest('.jh-select');
                                    var $placeholder = $select.find('.jh-select__placeholder');
                                    var label_start  = $placeholder.data('label-start');
                                    var label_end    = $placeholder.data('label-end');
                                    var $option      = $select.find('option:selected');
                                    
                                    if ($option.val() !== '' && $option.val() != 0)
                                        $placeholder.empty().append(
                                            $('<span>', {
                                                class: 'jh-select__label jh-select__label--start',
                                                html : label_start
                                            }),
                                            $('<span>', {
                                                class: 'jh-select__label',
                                                html : $option.html()
                                            }),
                                            $('<span>', {
                                                class: 'jh-select__label jh-select__label--end',
                                                html : label_end
                                            })
                                        );
                                    else
                                        $select.find('.jh-select__placeholder').html($option.html());
                                    
                                    self.setOptionAccess($elem);
                                }
                            ],
                            [
                                'focus',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    
                                    $select.toggleClass('focus', true);
                                },
                            ],
                            [
                                'blur',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    
                                    $select.toggleClass('focus', false);
                                }
                            ],
                            [
                                'click, focus',
                                '.jh-select__input',
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    
                                    $select.toggleClass('focus', true);
                                    $elem.toggleClass('m-filled', true);
                                    
                                    var value = parseInt($elem.val().replace(/[^0-9]/g, '')) || 0;
                                    if (value == 0)
                                        $elem.val('');
                                }
                            ],
                            [
                                'blur',
                                '.jh-select__input',
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    var $label  = $select.find('.jh-select__placeholder');
                                    
                                    $select.toggleClass('focus', false);
                                    $elem.toggleClass('m-filled', false);
                                    
                                    var value = parseInt($elem.val().replace(/[^0-9]/g, '')) || 0;
                                    if (value == $select.data('default-value'))
                                    {
                                        $select.toggleClass('m-default-value', true);
                                    }
                                    else
                                    {
                                        $select.toggleClass('m-default-value', false);
                                    }
                                    
                                    if ($select.data('default-label'))
                                    {
                                        $label.text(
                                            JihadTpl.text(
                                                $select.data('default-label'),
                                                {
                                                    'value': value
                                                }
                                            )
                                        );
                                    }
                                    else
                                    {
                                        $label.html('');
                                    }
                                }
                            ]
                        ];
                    },
                    
                    setOptionAccess: function (select)
                    {
                        var rel = this.el().data('rel');
                        var options, index, isFrom;
                        
                        if (!rel) return;
                        
                        index = select.find('option:selected').index();
                        
                        rel    = rel.split(':');
                        isFrom = rel[0] === 'from';
    
                        if (!this.el().data('equality'))
                            isFrom ? index-- : index++;
                        
                        options = $('#' + rel[1] + ':visible option');
                        
                        if (select.val() === '' || select.val() == 0) return options.attr('disabled', false);
                        
                        options
                            .attr('disabled', false)
                            .eq(index)[isFrom ? 'nextAll' : 'prevAll']()
                            .attr('disabled', true);
                    }
                }
            )
        );
    }
    ()
);
;(
    function()
    {
        var StickBlock = {};

        JihadCore.blockRegister(
            $.extend(
                StickBlock,
                JihadBlock,
                {
                    /**
                     * Returns block selector
                     */

                    getSelector: function()
                    {
                        return '.jh-stick';
                    },

                    /**
                     * Returns block bindins
                     */

                    getBindings: function()
                    {
                        return [];
                    },

                    /**
                     * Initialize function
                     */

                    initialize: function($target)
                    {
                        $target.stick_in_parent(
                            $target.data('stick')
                        );
                    }
                }
            )
        );
    }
    ()
);
;(
    function()
    {
        var TextareaBlock = {};

        JihadCore.blockRegister(
            $.extend(
                TextareaBlock,
                JihadBlock,
                {
                    /**
                     * Returns block selector
                     */

                    getSelector: function()
                    {
                        return '.jh-textarea';
                    },

                    /**
                     * Returns block bindins
                     */

                    getBindings: function()
                    {
                        return [];
                    },

                    /**
                     * Initialize function
                     */

                    initialize: function($target)
                    {
                        JihadBlock.initialize($target);

                        var $textarea = $target.find('textarea');

                        autosize($textarea);
                        $textarea.on(
                            'keydown',
                            null,
                            'ctrl+return',
                            function()
                            {
                                $textarea.parents('form').submit();
                            }
                        );
                    }
                }
            )
        );
    }
    ()
);
