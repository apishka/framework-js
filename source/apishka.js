(
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
