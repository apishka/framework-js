(
    function()
    {
        var JihadLock = window.JihadLock = {
        };

        /**
         * Return toggle selector
         */

        JihadLock.getToggleSelector = function($elem)
        {
            return '.js-lock-toggle';
        };

        /**
         * Is locked
         */

        JihadLock.isLocked = function($elem)
        {
            if ($elem.data('jihad-locked'))
                return true;

            return false;
        };

        /**
         * Lock
         */

        JihadLock.lock = function($elem)
        {
            $elem.data('jihad-locked', 1);

            this.afterLock($elem);
        };

        /**
         * After lock
         */

        JihadLock.afterLock = function($elem)
        {
            $elem.find(this.getToggleSelector($elem)).toggleClass('hidden');
        };

        /**
         * Unlock
         */

        JihadLock.unlock = function($elem)
        {
            $elem.data('jihad-locked', 0);

            this.afterUnlock($elem);
        };

        /**
         * After unlock
         */

        JihadLock.afterUnlock = function($elem)
        {
            $elem.find(this.getToggleSelector($elem)).toggleClass('hidden');
        };
    }
    ()
);
