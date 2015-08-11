(
    function()
    {
        var SelectBlock = {};

        JihadCore.blockRegister(
            $.extend(
                SelectBlock,
                JihadBlock,
                {
                    /**
                     * Returns block selector
                     */

                    getSelector: function()
                    {
                        return '.jh-select';
                    },

                    /**
                     * Returns block bindins
                     */

                    getBindings: function()
                    {
                        return [
                            [
                                'change',
                                '.jh-select__control',
                                function()
                                {
                                    var $elem = $(this);
                                    var $select = $elem.closest('.jh-select');

                                    $select.find('.jh-select__placeholder').html(
                                        $select.find('option:selected').html()
                                    );
                                }
                            ],
                            [
                                'focus',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem = $(this);
                                    var $select = $elem.closest('.jh-select');

                                    $select.toggleClass('focus', true);
                                },
                            ],
                            [
                                'blur',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem = $(this);
                                    var $select = $elem.closest('.jh-select');

                                    $select.toggleClass('focus', false);
                                }
                            ]
                        ];
                    }
                }
            )
        );
    }
    ()
);
