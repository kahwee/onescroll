(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($, window) {
    var Onescroll, OnescrollGeneric, OnescrollHorizontal, OnescrollVertical, defaults, pluginName;
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
    OnescrollGeneric = (function() {
      function OnescrollGeneric(onescroll, options) {
        var _this = this;
        this.onescroll = onescroll;
        defaults = {
          type: "Vertical",
          barEdge: "top"
        };
        this.settings = $.extend({}, defaults, options);
        this.barEdge = this.settings.type === "Vertical" ? "top" : "left";
        this.railClassName = this.onescroll.settings["rail" + this.settings.type + "ClassName"];
        this.barClassName = this.onescroll.settings["bar" + this.settings.type + "ClassName"];
        this.onescroll.$elWrapper.on("onescroll:scrolled", function(ev, top, left) {
          return _this.updatePosition(top, left);
        });
      }

      OnescrollGeneric.prototype.createRail = function() {
        this.$rail = $("<div class=\"" + this.railClassName + "\"></div>").uniqueId();
        this.railId = this.$rail.get(0).id;
        return this.onescroll.$elWrapper.append(this.$rail);
      };

      OnescrollGeneric.prototype.createBar = function() {
        this.$bar = $("<div class=\"" + this.barClassName + "\"></div>").uniqueId();
        this.barId = this.$bar.get(0).id;
        return this.onescroll.$elWrapper.append(this.$bar);
      };

      return OnescrollGeneric;

    })();
    OnescrollVertical = (function(_super) {
      __extends(OnescrollVertical, _super);

      function OnescrollVertical(onescroll, options) {
        var settings;
        this.onescroll = onescroll;
        settings = $.extend({}, options);
        settings.type = "Vertical";
        OnescrollVertical.__super__.constructor.call(this, this.onescroll, settings);
        this.createRail();
        this.createBar();
      }

      OnescrollVertical.prototype.updatePosition = function(top, left) {
        var barTop, percentage;
        if (top) {
          percentage = top / this.onescroll.mostTop;
          barTop = (this.onescroll.$elWrapper.outerHeight() - this.$bar.outerHeight()) * percentage;
          return this.$bar.css("top", barTop);
        }
      };

      OnescrollVertical.prototype.createBar = function() {
        var _this = this;
        OnescrollVertical.__super__.createBar.apply(this, arguments);
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

    })(OnescrollGeneric);
    OnescrollHorizontal = (function(_super) {
      __extends(OnescrollHorizontal, _super);

      function OnescrollHorizontal(onescroll, options) {
        var settings;
        this.onescroll = onescroll;
        settings = $.extend({}, options);
        settings.type = "Horizontal";
        OnescrollHorizontal.__super__.constructor.call(this, this.onescroll, settings);
        this.createRail();
        this.createBar();
      }

      OnescrollHorizontal.prototype.updatePosition = function(top, left) {
        var barLeft, percentage;
        if (left) {
          percentage = left / this.onescroll.mostLeft;
          barLeft = (this.onescroll.$elWrapper.outerWidth() - this.$bar.outerWidth()) * percentage;
          return this.$bar.css("left", barLeft);
        }
      };

      OnescrollHorizontal.prototype.createBar = function() {
        var _this = this;
        OnescrollHorizontal.__super__.createBar.apply(this, arguments);
        return this.$bar.draggable({
          axis: "x",
          containment: "parent",
          start: function(ev) {
            return console.log(ev);
          },
          drag: function(ev) {
            return _this.onescroll.scrollTo($(ev.target).position().left, null);
          },
          stop: function(ev) {
            return console.log(ev);
          }
        });
      };

      OnescrollHorizontal.prototype.getPercentage = function() {
        return parseInt(this.$bar.css(this.barEdge), 10) / (this.onescroll.$elWrapper.outerWidth() - this.$bar.outerWidth());
      };

      return OnescrollHorizontal;

    })(OnescrollGeneric);
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
        this.mostTop = -(this.$el.outerHeight() - this.$elWrapper.outerHeight());
        this.mostLeft = -(this.$el.outerWidth() - this.$elWrapper.outerWidth());
        this.vertical = new OnescrollVertical(this);
        this.horizontal = new OnescrollHorizontal(this);
        window.$el = this.$el;
        window.$elWrapper = this.$elWrapper;
        return this.addEventListeners();
      };

      Onescroll.prototype.addEventListeners = function() {
        return this.$elWrapper.on("mousewheel", this._onWheel);
      };

      Onescroll.prototype._onWheel = function(ev, d, dX, dY) {
        this.scrollWheel(d, dX, dY);
        this.$elWrapper.trigger("onescroll:mousewheel", d, dX, dY);
        return ev.preventDefault();
      };

      Onescroll.prototype.scrollTo = function(left, top) {
        if (!!top) {
          this.$el.css("top", this.vertical.getPercentage() * this.mostTop);
        }
        if (!!left) {
          return this.$el.css("left", this.horizontal.getPercentage() * this.mostLeft);
        }
      };

      Onescroll.prototype.scrollWheel = function(d, dX, dY) {
        var effectiveLeft, effectiveTop, left, top;
        top = parseInt(this.$el.css("top"), 10) || 0;
        left = parseInt(this.$el.css("left"), 10) || 0;
        effectiveTop = top + dY;
        effectiveLeft = left - dX;
        console.log(d, dX, effectiveLeft);
        if (effectiveTop >= 0) {
          effectiveTop = 0;
        } else if (effectiveTop <= this.mostTop) {
          effectiveTop = this.mostTop;
        }
        if (effectiveLeft >= 0) {
          effectiveLeft = 0;
        } else if (effectiveLeft <= this.mostLeft) {
          effectiveLeft = this.mostLeft;
        }
        this.$el.css("top", effectiveTop);
        this.$el.css("left", effectiveLeft);
        return this.$elWrapper.trigger("onescroll:scrolled", effectiveTop, effectiveLeft);
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
