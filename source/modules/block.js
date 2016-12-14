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
        
        JihadBlock.sel = function (q)
        {
            return q ? this.getSelector() + '-' + q : this.getSelector();
        };
        
        /**
         * Communication between blocks
         */
        
        JihadBlock.emit = function (event)
        {
            if (!event) throw new Error('Event name is not set.');
            
            var props = Array.prototype.slice.call(arguments, 1);
            
            $.each(
                JihadCore.blocks,
                function (selector)
                {
                    $(selector).triggerHandler(event, selector, props);
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
            $.each(
                this.getBindings($target),
                function (index, binding)
                {
                    $target.on.apply(
                        $target,
                        binding
                    );
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
            
            function _tmp(){}
            
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
