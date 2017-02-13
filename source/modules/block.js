(
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
