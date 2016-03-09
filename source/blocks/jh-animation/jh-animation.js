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
                            case 'rotating-plane':
                                AnimationBlock.initializeRotatingPlane($target);
                                break;

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

                            case 'fading-circle':
                                AnimationBlock.initializeFadingCircle($target);
                                break;
                        }
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeDoubleBounce: function($target)
                    {
                        $target.addClass('sk-double-bounce');
                        $target.html(
                            [
                                '<div class="sk-child sk-double-bounce1"></div>',
                                '<div class="sk-child sk-double-bounce2"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for wave
                     */

                    initializeWave: function($target)
                    {
                        $target.addClass('sk-wave');
                        $target.html(
                            [
                                '<div class="sk-rect sk-rect1"></div>',
                                '<div class="sk-rect sk-rect2"></div>',
                                '<div class="sk-rect sk-rect3"></div>',
                                '<div class="sk-rect sk-rect4"></div>',
                                '<div class="sk-rect sk-rect5"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for pulse
                     */

                    initializePulse: function($target)
                    {
                        $target.addClass('sk-spinner-pulse');
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeThreeWave: function($target)
                    {
                        $target.addClass('sk-three-bounce');
                        $target.html(
                            [
                                '<div class="sk-child sk-bounce1"></div>',
                                '<div class="sk-child sk-bounce2"></div>',
                                '<div class="sk-child sk-bounce3"></div>'
                            ].join('')
                        );
                    },

                    /**
                     * Initialize spinner for double bounce
                     */

                    initializeFadingCircle: function($target)
                    {
                        $target.addClass('sk-fading-circle');
                        $target.html(
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
                    },

                    /**
                     * Initialize rotating plane
                     */

                    initializeRotatingPlane: function($target)
                    {
                        $target.addClass('sk-rotating-plane');
                    }
                }
            )
        );
    }
    ()
);
