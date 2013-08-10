(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($, window) {
    var Onescroll, OnescrollGeneric, OnescrollHorizontal, OnescrollVertical, defaults, pluginName, validScrollbarTypes;
    pluginName = "onescroll";
    validScrollbarTypes = ["Vertical", "VerticalRight", "VerticalLeft", "Horizontal", "HorizontalTop", "HorizontalBottom"];
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
        this.onescroll.$elWrapper.on("onescroll:scrolled", function(ev, top, left, target) {
          if (target == null) {
            return _this.updateBarPosition(top, left);
          } else {
            console.log(target.barId, _this.barId, target.barId !== _this.barId);
            if (_this.barId !== target.barId) {
              console.log("new", top, left);
              return _this.updateBarPosition(top, left);
            }
          }
        });
      }

      OnescrollGeneric.prototype.createRail = function() {
        this.$rail = $("<div class=\"" + this.railClassName + "\"></div>").uniqueId().css(this.settings.railCss);
        this.$railInner = $("<div class=\"" + this.railClassName + "-inner\"></div>").css(this.settings.railInnerCss);
        this.$rail.append(this.$railInner);
        this.railId = this.$rail.get(0).id;
        return this.onescroll.$elWrapper.append(this.$rail);
      };

      OnescrollGeneric.prototype.setBarPosition = function(position) {
        if (this.settings.railCss[position] != null) {
          return this.$bar.css(position, this.settings.railCss[position]);
        }
      };

      OnescrollGeneric.prototype.createBar = function() {
        var pos, _i, _len, _ref;
        this.$bar = $("<div class=\"" + this.barClassName + "\"></div>").uniqueId();
        this.barId = this.$bar.get(0).id;
        _ref = ["right", "top", "left", "bottom"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pos = _ref[_i];
          this.setBarPosition(pos);
        }
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
        this.railPadding = [parseInt(this.$rail.css("padding-top"), 10), parseInt(this.$rail.css("padding-bottom"), 10)];
        this.createBar();
      }

      OnescrollVertical.prototype.updateBarPosition = function(top) {
        var barTop, percentage;
        top = top || 0;
        percentage = top / this.onescroll.mostTop || 0;
        barTop = (this.$railInner.outerHeight() - this.$bar.outerHeight()) * percentage + this.railPadding[0];
        return this.$bar.css("top", barTop);
      };

      OnescrollVertical.prototype.createBar = function() {
        var _this = this;
        OnescrollVertical.__super__.createBar.apply(this, arguments);
        this.$bar.draggable({
          axis: "y",
          containment: this.$railInner,
          start: function(ev) {
            return console.log(ev);
          },
          drag: function(ev) {
            return _this.onescroll.scrollTo(_this, null, $(ev.target).position().top);
          },
          stop: function(ev) {
            return console.log(ev);
          }
        });
        return this.updateBarPosition(0);
      };

      OnescrollVertical.prototype.getPercentage = function() {
        return (parseInt(this.$bar.css(this.barEdge), 10) - this.railPadding[0]) / (this.$railInner.outerHeight() - this.$bar.outerHeight());
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
        this.railPadding = [parseInt(this.$rail.css("padding-left"), 10), parseInt(this.$rail.css("padding-right"), 10)];
        this.createBar();
      }

      OnescrollHorizontal.prototype.updateBarPosition = function(top, left) {
        var barLeft, percentage;
        left = left || 0;
        percentage = left / this.onescroll.mostLeft || 0;
        barLeft = (this.$railInner.outerWidth() - this.$bar.outerWidth()) * percentage + this.railPadding[0];
        return this.$bar.css("left", barLeft);
      };

      OnescrollHorizontal.prototype.createBar = function() {
        var _this = this;
        OnescrollHorizontal.__super__.createBar.apply(this, arguments);
        this.$bar.draggable({
          axis: "x",
          containment: this.$railInner,
          start: function(ev) {
            return console.log(ev);
          },
          drag: function(ev) {
            return _this.onescroll.scrollTo(_this, $(ev.target).position().left, null);
          },
          stop: function(ev) {
            return console.log(ev);
          }
        });
        return this.updateBarPosition(null, 0);
      };

      OnescrollHorizontal.prototype.getPercentage = function() {
        return (parseInt(this.$bar.css(this.barEdge), 10) - this.railPadding[0]) / (this.$railInner.outerWidth() - this.$bar.outerWidth());
      };

      return OnescrollHorizontal;

    })(OnescrollGeneric);
    Onescroll = (function() {
      function Onescroll(element, options) {
        this.element = element;
        this._onWheel = __bind(this._onWheel, this);
        this.scrollbars = [];
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

      Onescroll.prototype.createScrollbar = function(options) {
        var settings, type;
        defaults = {
          railCss: {},
          railInnerCss: {},
          barCss: {}
        };
        settings = $.extend({}, defaults, options);
        type = options.type;
        if (__indexOf.call(validScrollbarTypes, type) >= 0) {
          switch (type) {
            case "Vertical":
              this.scrollbars.push(new OnescrollVertical(this, settings));
              break;
            case "VerticalRight":
              settings.railCss.right = 0;
              this.scrollbars.push(new OnescrollVertical(this, settings));
              break;
            case "VerticalLeft":
              this.scrollbars.push(new OnescrollVertical(this, settings));
              break;
            case "Horizontal":
              this.scrollbars.push(new OnescrollHorizontal(this, settings));
              break;
            case "HorizontalRight":
              this.scrollbars.push(new OnescrollHorizontal(this, settings));
              break;
            case "HorizontalLeft":
              this.scrollbars.push(new OnescrollHorizontal(this, settings));
          }
          return console.log("HSSS");
        } else {
          throw ("" + options.type + " is not supported. Supported types are: ") + validScrollbarTypes.join(', ');
        }
      };

      Onescroll.prototype.init = function() {
        var scrollbar, _i, _len, _ref;
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
        _ref = this.settings.scrollbars;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          scrollbar = _ref[_i];
          this.createScrollbar(scrollbar);
        }
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

      Onescroll.prototype.scrollTo = function(context, left, top) {
        var effectiveLeft, effectiveTop;
        effectiveTop = top != null ? context.getPercentage() * this.mostTop : null;
        effectiveLeft = left != null ? context.getPercentage() * this.mostLeft : null;
        this.$elWrapper.trigger("onescroll:scrolled", [effectiveTop, effectiveLeft, context]);
        this.$el.css("top", effectiveTop);
        return this.$el.css("left", effectiveLeft);
      };

      Onescroll.prototype.scrollWheel = function(d, dX, dY) {
        var effectiveLeft, effectiveTop, left, top;
        top = parseInt(this.$el.css("top"), 10) || 0;
        left = parseInt(this.$el.css("left"), 10) || 0;
        effectiveTop = top + dY;
        effectiveLeft = left - dX;
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
        return this.$elWrapper.trigger("onescroll:scrolled", [effectiveTop, effectiveLeft]);
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
