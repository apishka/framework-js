(
    function()
    {
        var JihadBlock = window.JihadBlock = {
        };

        /**
         * Returns main block selector
         */

        JihadBlock.getSelector = function()
        {
            return null;
        };

        /**
         * Returns bindings
         */

        JihadBlock.getBindings = function()
        {
            return [];
        };

        /**
         * Returns initialized flag for block
         */

        JihadBlock.isInitialized = function($target)
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

        JihadBlock.applyBindings = function($target)
        {
            $.each(
                this.getBindings($target),
                function(index, binding)
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

        JihadBlock.initialize = function($target)
        {
        };

        /**
         * Returns finalize function
         */

        JihadBlock.finalize = function($target)
        {
        };

        /**
         * Run block
         */

        JihadBlock.run = function($target)
        {
            var self = this;

            $.each(
                $target,
                function()
                {
                    var $elem = $(this);

                    if (!self.isInitialized($elem))
                    {
                        var initialized = $elem.data('jihad-initialized') || {};
                        initialized[this.getSelector()] = 1;
                        $elem.data('jihad-initialized', initialized);

                        self.initialize($elem);
                        self.applyBindings($elem);
                        self.finalize($elem);
                    }
                }
            );
        };
    }()
);
