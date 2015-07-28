(
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
