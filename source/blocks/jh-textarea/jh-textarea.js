(
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
