(
    function ()
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
                    
                    getSelector: function ()
                    {
                        return '.jh-select';
                    },
                    
                    /**
                     * Returns block bindins
                     */
                    
                    getBindings: function ()
                    {
                        var self = this;
                        
                        return [
                            [
                                'change',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem        = $(this);
                                    var $select      = $elem.closest('.jh-select');
                                    var $placeholder = $select.find('.jh-select__placeholder');
                                    var label_start  = $placeholder.data('label-start');
                                    var label_end    = $placeholder.data('label-end');
                                    var $option      = $select.find('option:selected');
                                    
                                    if ($option.val() !== '' && $option.val() != 0)
                                        $placeholder.empty().append(
                                            $('<span>', {
                                                class: 'jh-select__label jh-select__label--start',
                                                html : label_start
                                            }),
                                            $('<span>', {
                                                class: 'jh-select__label',
                                                html : $option.html()
                                            }),
                                            $('<span>', {
                                                class: 'jh-select__label jh-select__label--end',
                                                html : label_end
                                            })
                                        );
                                    else
                                        $select.find('.jh-select__placeholder').html($option.html());
                                    
                                    self.setOptionAccess($elem);
                                }
                            ],
                            [
                                'focus',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    
                                    $select.toggleClass('focus', true);
                                },
                            ],
                            [
                                'blur',
                                '.jh-select__control',
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    
                                    $select.toggleClass('focus', false);
                                }
                            ],
                            [
                                'click, focus',
                                '.jh-select__input',
                                function ()
                                {
                                    var $elem   = $(this);
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
                                function ()
                                {
                                    var $elem   = $(this);
                                    var $select = $elem.closest('.jh-select');
                                    var $label  = $select.find('.jh-select__placeholder');
                                    
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
                    },
                    
                    setOptionAccess: function (select)
                    {
                        var rel = this.el().data('rel');
                        var options, index, isFrom;
                        
                        if (!rel) return;
                        
                        index = select.find('option:selected').index();
                        
                        rel    = rel.split(':');
                        isFrom = rel[0] === 'from';
    
                        if (!this.el().data('equality'))
                            isFrom ? index-- : index++;
                        
                        options = $('#' + rel[1] + ':visible option');
                        
                        if (select.val() === '' || select.val() == 0) return options.attr('disabled', false);
                        
                        options
                            .attr('disabled', false)
                            .eq(index)[isFrom ? 'nextAll' : 'prevAll']()
                            .attr('disabled', true);
                    }
                }
            )
        );
    }
    ()
);
