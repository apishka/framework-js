(
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
