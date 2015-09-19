(
    function()
    {
        var JihadModal = window.JihadModal = {
            $active: null,
            tpl: 'modal',
            preprocess: true
        };

        /**
         * Returns base modal template
         */

        JihadModal.getTpl = function()
        {
            return this.tpl;
        };

        /**
         * Returns action for modal
         */

        JihadModal.getUrl = function()
        {
            return null;
        };

        /**
         * Preprocess URL function
         */

        JihadModal.preprocessUrl = function()
        {
            var url = this.getUrl();

            if (url && this.preprocess)
            {
                var parsed = JihadUrl.parse(url, true);

                parsed['pathname'] += '.json';
                parsed['search'] = parsed['query'];
                parsed['search']['layouts'] = ['layout_content'];

                url = JihadUrl.make(parsed);
            }

            return url;
        };

        /**
         * Returns post data
         */

        JihadModal.getData = function()
        {
            return {};
        };

        /**
         * Returns method
         */

        JihadModal.getMethod = function()
        {
            return 'POST';
        };

        /**
         * Before send function
         */

        JihadModal.beforeSend = function()
        {
        };

        /**
         * After send function
         */

        JihadModal.afterSend = function()
        {
        };

        /**
         * Returns modal
         */

        JihadModal.getActive = function()
        {
            return this.$active;
        };

        /**
         * Success function
         */

        JihadModal.onSuccess = function(data, textStatus, jqXHR)
        {
            if (data && data.result)
            {
                if (data.result.errors)
                {
                    this.fail(data.result);
                }
                else
                {
                    this.successLayout(data.result);
                    this.success(data.result);
                }
            }
            else
            {
                this.errorGlobal(
                    {
                        message: 'Something is wrong'
                    }
                );
            }
        };

        /**
         * Method called on error
         */

        JihadModal.onError = function(jqXHR, textStatus, errorThrown)
        {
            this.errorGlobal(
                {
                    message: 'Something is wrong'
                }
            );
        };

        /**
         * Fail function
         */

        JihadModal.fail = function(result)
        {
            this.errorGlobal(
                {
                    message: 'Something is wrong'
                }
            );
        };

        /**
         * Success
         */

        JihadModal.success = function(result)
        {
            JihadModal.getActive().modal('show');
        };

        /**
         * Success layout
         */

        JihadModal.successLayout = function(result)
        {
            var $content = JihadModal.getActive().find('.modal-content');

            $content.html(result['layouts']['layout_content']);
        };

        /**
         * Show global error
         */

        JihadModal.errorGlobal = function(error)
        {
            alert(error.message);
        };

        /**
         * Shows modal
         */

        JihadModal.show = function(options)
        {
            if (JihadModal.getActive())
                JihadModal.getActive().remove();

            JihadModal.$active = JihadTpl.html(this.getTpl(), options || {});
            JihadCore.$body.append(JihadModal.getActive());

            var url = this.preprocessUrl();
            if (url)
            {
                var self = this;
                $.ajax(
                    url,
                    {
                        beforeSend: function()
                        {
                            self.beforeSend();
                        },
                        complete: function()
                        {
                            self.afterSend();
                        },
                        dataType:   'json',
                        data:       this.getData(),
                        type:       this.getMethod(),
                        success:    function(data, textStatus, jqXHR)
                        {
                            self.onSuccess(data, textStatus, jqXHR);

                            // After do all job we assign bindings
                            JihadCore.blocksRun(self.getActive());
                        },
                        error: function(jqXHR, textStatus, errorThrown)
                        {
                            self.onError(jqXHR, textStatus, errorThrown);
                        }
                    }
                );
            }
            else
            {
                this.success({});

                JihadCore.blocksRun(JihadModal.getActive());
            }

            return false;
        };

        /**
         * Hide active modal
         */

        JihadModal.hide = function()
        {
            JihadModal.getActive().modal('hide');
        }
    }
    ()
);
