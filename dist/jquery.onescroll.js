(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    var Onescroll, defaults, pluginName;
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
    Onescroll = (function() {
      function Onescroll(element, options) {
        this.element = element;
        this._onWheel = __bind(this._onWheel, this);
        window.test = this.element;
        window.s = "s";
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
        this.createRailVertical();
        this.createBarVertical();
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

      Onescroll.prototype.getScrollPercentage = function() {
        return parseInt(this.$bar.css(this.barEdge), 10) / (this.$elWrapper.outerHeight() - this.$bar.outerHeight());
      };

      Onescroll.prototype.scrollTo = function(x, y) {
        var scrollPercentage, ss;
        scrollPercentage = this.getScrollPercentage();
        if (!!y) {
          this.$el.css("top", scrollPercentage * this.mostTop);
        }
        return ss = x = y;
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

      Onescroll.prototype.createRailVertical = function() {
        this.$rail = this.railVertical = $("<div class=\"" + this.settings.railVerticalClassName + "\"></div>");
        return this.$elWrapper.append(this.railVertical);
      };

      Onescroll.prototype.createBarVertical = function() {
        var _this = this;
        this.$bar = this.barVertical = $("<div class=\"" + this.settings.barVerticalClassName + "\"></div>");
        this.$elWrapper.append(this.barVertical);
        return this.barVertical.draggable({
          axis: "y",
          containment: "parent",
          start: function(ev) {
            return console.log(ev);
          },
          drag: function(ev) {
            return _this.scrollTo(null, $(ev.target).position().top);
          },
          stop: function(ev) {
            return console.log(ev);
          }
        });
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
