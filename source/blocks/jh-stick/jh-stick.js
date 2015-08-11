(
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
