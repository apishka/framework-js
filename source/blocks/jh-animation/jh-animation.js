(
    function()
    {
        var AnimationBlock = {};

        JihadCore.blockRegister(
            $.extend(
                AnimationBlock,
                JihadBlock,
                {
                    /**
                     * Returns block selector
                     */

                    getSelector: function()
                    {
                        return '.jh-animation';
                    },

                    /**
                     * Returns block bindins
                     */

                    getBindings: function()
                    {
                        return [];
                    },

                    /**
                     * Initialize block
                     */

                    initialize: function($target)
                    {
                        var type = $target.data('type');

                        switch (type)
                        {
                            case 'double-bounce':
                                AnimationBlock.initializeDoubleBounce($target);
                                break;

                            case 'wave':
                                AnimationBlock.initializeWave($target);
                                break;

                            case 'pulse':
                                AnimationBlock.initializePulse($target);
                                break;

                            case 'three-bounce':
                                AnimationBlock.initializeThreeWave($target);
                                break;

                            case 'circle':
                                AnimationBlock.initializeCircle($target);
                                break;
                        }
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeDoubleBounce: function($target)
                    {
                        $target.addClass('sk-spinner sk-double-bounce');
                        $target.innerHTML(
                            [
                                '<div class="sk-double-bounce1"></div>',
                                '<div class="sk-double-bounce2"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for wave
                     */

                    initializeWave: function($target)
                    {
                        $target.addClass('sk-spinner sk-wave');
                        $target.innerHTML(
                            [
                                '<div class="sk-rect1"></div>',
                                '<div class="sk-rect2"></div>',
                                '<div class="sk-rect3"></div>',
                                '<div class="sk-rect4"></div>',
                                '<div class="sk-rect5"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for pulse
                     */

                    initializePulse: function($target)
                    {
                        $target.addClass('sk-spinner sk-spinner-pulse');
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeThreeWave: function($target)
                    {
                        $target.addClass('sk-spinner sk-three-bounce');
                        $target.innerHTML(
                            [
                                '<div class="sk-bounce1"></div>',
                                '<div class="sk-bounce2"></div>',
                                '<div class="sk-bounce3"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeCircle: function($target)
                    {
                        $target.addClass('sk-spinner sk-fading-circle');
                        $target.innerHTML(
                            [
                                '<div class="sk-circle1 sk-circle"></div>',
                                '<div class="sk-circle2 sk-circle"></div>',
                                '<div class="sk-circle3 sk-circle"></div>',
                                '<div class="sk-circle4 sk-circle"></div>',
                                '<div class="sk-circle5 sk-circle"></div>',
                                '<div class="sk-circle6 sk-circle"></div>',
                                '<div class="sk-circle7 sk-circle"></div>',
                                '<div class="sk-circle8 sk-circle"></div>',
                                '<div class="sk-circle9 sk-circle"></div>',
                                '<div class="sk-circle10 sk-circle"></div>',
                                '<div class="sk-circle11 sk-circle"></div>',
                                '<div class="sk-circle12 sk-circle"></div>'
                            ].join('')
                        );
                    }
                }
            )
        );
    }
    ()
);
