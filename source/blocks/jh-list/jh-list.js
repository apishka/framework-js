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
                getSelector: function()
                {
                    return '.jh-list';
                },

                initialize: function ($target)
                {
                    this.$ = $target;
                    this._checkDistance = JihadCore.throttle(this._checkDistance.bind(this, $target), 500);
                    JihadCore.$win.on('load scroll resize', this._checkDistance);
                    this._checkDistance();
                },

                getMoreUrl: function()
                {
                    var $moreBtn,
                        hasMore;

                    if (this._noMore)
                    {
                        return null;
                    }

                    $moreBtn = this.getMoreBtn();
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

                getMoreBtn: function ()
                {
                    return this.$.find(this.getSelector() + '__more');
                },

                _checkDistance: function ($elem)
                {
                    var self = this,
                        $win = JihadCore.$win,
                        scrollBottom,
                        bottomEdge,
                        moreUrl = this.getMoreUrl()
                    ;

                    if (moreUrl && !this.request)
                    {
                        scrollBottom = $win.scrollTop() + $win.height();
                        bottomEdge = $elem.offset().top + $elem.height();

                        if (bottomEdge - scrollBottom < 1000)
                        {
                            this.getMoreBtn().unbind().remove();

                            this.request = $.ajax(
                                    {
                                        url: moreUrl,
                                        dataType: 'json',
                                        complete: function () {
                                            self.request = null;
                                        }
                                    }
                                )
                                .done(
                                    function (json)
                                    {
                                        var result = json && json.result || {},
                                            $html
                                        ;

                                        if (result.html)
                                        {
                                            $html = $(result.html);
                                            $elem.append($html);
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
