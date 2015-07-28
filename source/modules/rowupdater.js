(
    function()
    {
        var JihadRowUpdater = window.JihadRowUpdater = {
            container: null,
            data: {}
        };

        /**
         * Returns initialize function
         */

        JihadRowUpdater.id = function(id)
        {
            return id;
        };

        /**
         * Run block
         */

        JihadRowUpdater.run = function()
        {
            var $container = $(this.container);
            var self = this;

            $.each(
                this.data,
                function(id, html)
                {
                    var $elem = $container.find('#' + self.id(id));

                    if ($elem.length)
                    {
                        if (html)
                        {
                            $elem.replaceWith(html);
                            JihadCore.blocksRun($elem);
                        }
                        else
                        {
                            $elem.remove();
                        }
                    }
                    else
                    {
                        $container.prepend(html);
                    }
                }
            );
        };
    }()
);
