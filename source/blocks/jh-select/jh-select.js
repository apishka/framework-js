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
                                    var $option = $select.find('option:selected');

                                    $select.find('.jh-select__placeholder').html(
                                        $option.html()
                                    );

                                    var $input = $select.find('.jh-select__input');
                                    if ($input.length)
                                        $input.val($option.attr('value'));
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
                            ],
                            [
                                'click, focus',
                                '.jh-select__input',
                                function()
                                {
                                    var $elem = $(this);
                                    var $select = $elem.closest('.jh-select');

                                    $select.toggleClass('focus', true);
                                    $elem.toggleClass('m-filled', true);

                                    var value = parseInt($elem.val().replace(/[^0-9]/g, '')) || 0;
                                    if (value == 0)
                                        $elem.val('');
                                }
                            ],
                            [
                                'blur',
                                '.jh-select__input',
                                function()
                                {
                                    var $elem = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    var $label = $select.find('.jh-select__placeholder');

                                    $select.toggleClass('focus', false);
                                    $elem.toggleClass('m-filled', false);

                                    var value = parseInt($elem.val().replace(/[^0-9]/g, '')) || 0;
                                    if (value == $select.data('default-value'))
                                    {
                                        $select.toggleClass('m-default-value', true);
                                    }
                                    else
                                    {
                                        $select.toggleClass('m-default-value', false);
                                    }

                                    if ($select.data('default-label'))
                                    {
                                        $label.text(
                                            JihadTpl.text(
                                                $select.data('default-label'),
                                                {
                                                    'value': value
                                                }
                                            )
                                        );
                                    }
                                    else
                                    {
                                        $label.html('');
                                    }
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
