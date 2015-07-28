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
            var jihadNodeData = $.data($target[0]);
            return jihadNodeData.blocks && jihadNodeData.blocks[this.getSelector()];
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
            var jihadNodeData = $.data($target[0]);
            jihadNodeData.blocks = jihadNodeData.blocks || {};
            jihadNodeData.blocks[this.getSelector()] = true;
        };

        /**
         * Run block
         */

        JihadBlock.run = function($target)
        {
            if (!this.isInitialized($target))
            {
                this.initialize($target);
                this.applyBindings($target);
                if (typeof this.init === 'function') {
                    this.init($target);
                }
            }
        };
    }()
);
