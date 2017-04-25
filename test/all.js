!function()
{
    var Module   = {};
    
    JihadCore.blockRegister(
        $.extend(
            Module,
            JihadBlock,
            {
                /**
                 * Returns block selector
                 */
                
                getSelector: function ()
                {
                    return '.block1';
                },
                
                /**
                 * Returns block bindins
                 */
                
                getBindings: function (block)
                {
                    var self = this;
                    
                    return [
                        [
                            'some-event',
                            function (e, data)
                            {
                                /* Emitter
                                 ================================================== */
            
                                describe(
                                    "Difference events", function ()
                                    {
                                        it(
                                            "__jihadSelector", function ()
                                            {
                                                expect(e.__jihadSelector).toBe('.block1');
                                            }
                                        );
                                    }
                                );
                            }
                        ]
                    ];
                },
                
                initialize: function(block)
                {
                    var self = this;
                    
                    /* Get selectors
                    ================================================== */
    
                    describe(
                        "Get selectors", function ()
                        {
                            it(
                                ".getSelector", function ()
                                {
                                    expect(self.getSelector()).toBe('.block1');
                                }
                            );
    
                            it(
                                ".sel", function ()
                                {
                                    expect(self.sel()).toBe('.block1');
                                }
                            );
    
                            it(
                                ".el", function ()
                                {
                                    expect(self.el()).toBe(block);
                                }
                            );
    
                            it(
                                "Child", function ()
                                {
                                    expect(self.sel('child')).toBe('.block1-child');
                                }
                            );
    
                            it(
                                "Child element", function ()
                                {
                                    expect(self.el('child')).toBe(block.find('.block1-child'));
                                }
                            );
                        }
                    );
                    
                    
                    /* Emitter
                    ================================================== */
                    
                    setTimeout(
                        function()
                        {
                            self.emit('some-event', 'some-data');
                        },
                        1
                    )
                }
            }
        )
    );
}();


!function ()
{
    var Module = {};
    
    JihadCore.blockRegister(
        $.extend(
            Module,
            JihadBlock,
            {
                /**
                 * Returns block selector
                 */
                
                getSelector: function ()
                {
                    return '.block2';
                },
                
                /**
                 * Returns block bindins
                 */
                
                getBindings: function ()
                {
                    var self = this;
                    
                    return [
                        [
                            'some-event',
                            function(e, data)
                            {
                                /* Emitter
                                 ================================================== */
                                
                                describe(
                                    "Catch event", function ()
                                    {
                                        it(
                                            "Type some-event", function ()
                                            {
                                                expect(e.type).toBe('some-event');
                                            }
                                        );
    
                                        it(
                                            "Some-data", function ()
                                            {
                                                expect(data).toBe('some-data');
                                            }
                                        );
    
                                        it(
                                            "Difference events", function ()
                                            {
                                                expect(e.__jihadSelector).toBe('.block2');
                                            }
                                        );
                                    }
                                );
                            }
                        ]
                    ];
                },
                
                initialize: function ()
                {
                }
            }
        )
    );
}();