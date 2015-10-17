(function () {
    var ListingBlock = {};

    /**
     * In HTML:
     *  <div class="js-list">
     *      ...
     *
     *      <button class="btn jh-list__more" data-more-url="{more_url}">Load More</button>
     *  </div>
     *
     * Expected response:
     *  {
     *      "result": {
     *          "html": "<h1>Hello</h1><button class=\"btn jh-list__more\" data-more-url=\"{new_more_url}\">Load More</button>",
     *      }
     *  }
     */

    JihadCore.blockRegister(
        $.extend(
            ListingBlock,
            JihadBlock,
            {
                /**
                 * Returns block selector
                 */

                getSelector: function()
                {
                    return '.jh-list';
                },

                /**
                 * Return initialize function
                 */

                initialize: function ($target)
                {
                    this._checkDistance = JihadCore.throttle(this._checkDistance.bind(this, $target), 500);
                    JihadCore.$win.on('load scroll resize', this._checkDistance);
                    this._checkDistance();
                },

                getMoreUrl: function($target)
                {
                    var $moreBtn,
                        hasMore;

                    if (this._noMore)
                    {
                        return null;
                    }

                    $moreBtn = this.getMoreBtn($target);
                    hasMore = !!$moreBtn.length;

                    if (!hasMore)
                    {
                        JihadCore.$win.off('load scroll resize', this._checkDistance);
                        this._noMore = true;
                    }

                    return hasMore
                        ? $moreBtn.data('more-url')
                        : null
                    ;
                },

                getMoreBtn: function($target)
                {
                    return $target.find('.jh-list__more');
                },

                _checkDistance: function($target)
                {
                    var lock = new JihadLock($target);

                    if (lock.isLocked($target))
                        return false;

                    var self = this,
                        $win = JihadCore.$win,
                        scrollBottom,
                        bottomEdge,
                        moreUrl = this.getMoreUrl($target)
                    ;

                    if (moreUrl)
                    {
                        scrollBottom = $win.scrollTop() + $win.height();
                        bottomEdge = $target.offset().top + $target.height();

                        if (bottomEdge - scrollBottom < 1000)
                        {
                            lock.lock($target);

                            $target.addClass('jh-list__loading');
                            $target
                                .find('.jh-list__toggle')
                                .toggleClass('jh-list__hidden')
                            ;

                            this.getMoreBtn($target).unbind();

                            $.ajax(
                                    {
                                        url: moreUrl,
                                        dataType: 'json',
                                        complete: function ()
                                        {
                                            lock.unlock($target);
                                        }
                                    }
                                )
                                .done(
                                    function (json)
                                    {
                                        var result = json && json.result || {},
                                            $html
                                        ;

                                        self.getMoreBtn($target).remove();

                                        lock.unlock($target);

                                        $target.removeClass('jh-list__loading');
                                        $target
                                            .find('.jh-list__toggle')
                                            .toggleClass('jh-list__hidden')
                                        ;

                                        if (result.html)
                                        {
                                            $html = $(result.html);
                                            $target.append($html);

                                            JihadCore.blocksRun($html);
                                        }
                                    }
                                )
                            ;
                        }
                    }
                }
            }
        )
    );
}());
