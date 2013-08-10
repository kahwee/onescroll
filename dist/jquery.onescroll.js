(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    var Onescroll, OnescrollVertical, defaults, pluginName;
    pluginName = "onescroll";
    defaults = {
      wrapperClassName: "" + pluginName + "-wrapper",
      className: "" + pluginName,
      railHorizontalClassName: "" + pluginName + "-rail-h",
      railVerticalClassName: "" + pluginName + "-rail-v",
      barHorizontalClassName: "" + pluginName + "-bar-h",
      barVerticalClassName: "" + pluginName + "-bar-v",
      height: "auto",
      width: "auto"
    };
    OnescrollVertical = (function() {
      function OnescrollVertical(onescroll, options) {
        this.onescroll = onescroll;
        this.settings = $.extend({}, defaults, options);
        this.barEdge = "top";
        this.init();
      }

      OnescrollVertical.prototype.init = function() {
        this.createRail();
        return this.createBar();
      };

      OnescrollVertical.prototype.createRail = function() {
        this.$rail = $("<div class=\"" + this.onescroll.settings.railVerticalClassName + "\"></div>").uniqueId();
        this.railId = this.$rail.get(0).id;
        return this.onescroll.$elWrapper.append(this.$rail);
      };

      OnescrollVertical.prototype.createBar = function() {
        var _this = this;
        this.$bar = $("<div class=\"" + this.onescroll.settings.barVerticalClassName + "\"></div>").uniqueId();
        this.barId = this.$bar.get(0).id;
        this.onescroll.$elWrapper.append(this.$bar);
        return this.$bar.draggable({
          axis: "y",
          containment: "parent",
          start: function(ev) {
            return console.log(ev);
          },
          drag: function(ev) {
            return _this.onescroll.scrollTo(null, $(ev.target).position().top);
          },
          stop: function(ev) {
            return console.log(ev);
          }
        });
      };

      OnescrollVertical.prototype.getPercentage = function() {
        return parseInt(this.$bar.css(this.barEdge), 10) / (this.onescroll.$elWrapper.outerHeight() - this.$bar.outerHeight());
      };

      return OnescrollVertical;

    })();
    Onescroll = (function() {
      function Onescroll(element, options) {
        this.element = element;
        this._onWheel = __bind(this._onWheel, this);
        window.test = this.element;
        this.settings = $.extend({}, defaults, options);
        this.before = {};
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Onescroll.prototype.destroy = function() {
        this.$el.unwrap();
        return this.$el.css("position", this.before.elPosition);
      };

      Onescroll.prototype.createWrapper = function() {
        this.$el = $(this.element).addClass(this.settings.className).wrap("<div class=\"" + this.settings.wrapperClassName + "\"></div>");
        return this.$elWrapper = this.$el.parent();
      };

      Onescroll.prototype.init = function() {
        this.createWrapper();
        this.before.elPosition = this.$el.css("position");
        this.$el.css("position", "absolute");
        this.$elWrapper.css("position", "relative");
        if (!!this.settings.height) {
          this.$elWrapper.height(this.settings.height);
          this.$el.height("auto");
        } else {
          this.$el.height("auto");
          this.$elWrapper = this.$elWrapper.parent().height();
        }
        this.type = "vertical";
        this.barEdge = this.type === "vertical" ? "top" : "left";
        this.mostTop = -(this.$el.outerHeight() - this.$elWrapper.outerHeight());
        this.mostLeft = -(this.$el.outerWidth() - this.$elWrapper.outerWidth());
        this.vertical = new OnescrollVertical(this);
        window.$el = this.$el;
        window.$elWrapper = this.$elWrapper;
        return this.addEventListeners();
      };

      Onescroll.prototype.addEventListeners = function() {
        return this.$elWrapper.on("mousewheel", this._onWheel);
      };

      Onescroll.prototype._onWheel = function(ev, d, dX, dY) {
        return this.scrollWheel(d, dX, dY);
      };

      Onescroll.prototype.setScrollPercentage = function(bar) {
        return console.log('he');
      };

      Onescroll.prototype.scrollTo = function(x, y) {
        console.log(x, y);
        if (!!y) {
          return this.$el.css("top", this.vertical.getPercentage() * this.mostTop);
        }
      };

      Onescroll.prototype.scrollWheel = function(d, dX, dY) {
        var effectiveLeft, effectiveTop, left, top;
        top = parseInt(this.$el.css("top"), 10) || 0;
        left = parseInt(this.$el.css("left"), 10) || 0;
        effectiveTop = top + dY;
        effectiveLeft = left + dX;
        console.log("effective", effectiveTop, effectiveLeft);
        if (effectiveTop >= 0) {
          this.$el.css("top", 0);
        } else if (effectiveTop <= this.mostTop) {
          this.$el.css("top", this.mostTop);
        } else {
          this.$el.css("top", effectiveTop);
        }
        if (effectiveLeft >= 0) {
          this.$el.css("left", 0);
        } else if (effectiveLeft <= this.mostLeft) {
          this.$el.css("left", this.mostLeft);
        } else {
          this.$el.css("left", effectiveLeft);
        }
        return console.log(d, dX, dY, top, left);
      };

      Onescroll.prototype.scrollContent = function(y, isWheel, isJump) {
        var delta;
        delta = y;
        return console.log(y, isWheel, isJump);
      };

      return Onescroll;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Onescroll(this, options));
        }
      });
    };
  })(jQuery, window);

}).call(this);
