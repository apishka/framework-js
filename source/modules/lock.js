(
    function()
    {
        var JihadLock = window.JihadLock = function(toggle_selector)
        {
            /**
             * Toggle selector
             */

            this._toggle_selector = toggle_selector || '.js-lock-toggle';

            /**
             * Return toggle selector
             */

            this.getToggleSelector = function($elem)
            {
                return this._toggle_selector;
            };

            /**
             * Is locked
             */

            this.isLocked = function($elem)
            {
                if ($elem.data('jihad-locked'))
                    return true;

                return false;
            };

            /**
             * Lock
             */

            this.lock = function($elem)
            {
                $elem.data('jihad-locked', 1);

                this.afterLock($elem);
            };

            /**
             * After lock
             */

            this.afterLock = function($elem)
            {
                $elem.find(this.getToggleSelector($elem)).toggleClass('hidden');
            };

            /**
             * Unlock
             */

            this.unlock = function($elem)
            {
                $elem.data('jihad-locked', 0);

                this.afterUnlock($elem);
            };

            /**
             * After unlock
             */

            this.afterUnlock = function($elem)
            {
                $elem.find(this.getToggleSelector($elem)).toggleClass('hidden');
            };
        };
    }
    ()
);
