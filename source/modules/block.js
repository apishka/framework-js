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
            if ($target.data('jihad-initialized'))
                return true;

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
                        $elem.data('jihad-initialized', 1);

                        self.initialize($elem);
                        self.applyBindings($elem);
                    }
                }
            );
        };
    }()
);
