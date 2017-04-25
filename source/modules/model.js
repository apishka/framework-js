(
    function ()
    {
        var JihadModel = window.JihadModel = {};
        
        JihadModel.model = function (model)
        {
            var self = this;
            
            this._model = model || this._model;
            
            return {
                get: function (name)
                {
                    if (name) return self._model[name];
                    return self._model;
                },
                
                set: function (key, value)
                {
                    var targetNode = $(self.sel('model') + '[data-model$=":' + key + '"]');
                    var old_val    = self._model[key];
                    
                    self._model[key] = value;
                    
                    targetNode.each(
                        function ()
                        {
                            var it     = $(this);
                            var action = it.data('model').split(':');
                            
                            if (action.length === 3)
                                it[action[0]](action[1], value);
                            else
                                it[action[0]](value);
                        }
                    );
                    
                    self.el().trigger('model:change', [key, old_val, value])
                },
                
                apply: function ()
                {
                    $.each(
                        self._model,
                        function (key, value)
                        {
                            self.model().set(key, value)
                        }
                    );
                    
                    self.el().trigger('model:applied')
                },
                
                toParams: function ()
                {
                    return $.param(self._model);
                },
                
                serialize: function ()
                {
                    return JSON.stringify(self._model);
                }
            }
        };
        
        JihadModel.init = function (block)
        {
            if (block.model) return;
            
            block._model = {};
            block.model  = JihadModel.model;
            
            block.el().on(
                'input',
                block.sel('model') + '[data-model]',
                function ()
                {
                    var it   = $(this);
                    var name = it.data('model').split(':');
                    
                    name = name[name.length - 1];
                    
                    block.model().set(name, this.value);
                }
            )
        }
    }
    ()
);
