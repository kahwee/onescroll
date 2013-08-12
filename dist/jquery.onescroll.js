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
      width: "auto",
      scrollbars: [
        {
          type: "VerticalRight"
        }, {
          type: "HorizontalBottom"
        }
      ]
    };
    OnescrollGeneric = (function() {
      function OnescrollGeneric(onescroll, options) {
        var scrollDefaults, _ref, _ref1,
          _this = this;
        this.onescroll = onescroll;
        scrollDefaults = {
          type: "Vertical",
          railPadding: ["0px", "8px"]
        };
        this.scrollSettings = $.extend({}, scrollDefaults, options);
        _ref = this.scrollSettings.type === "Vertical" ? [["top", "bottom"], ["Top", "Bottom"]] : [["left", "right"], ["Left", "Right"]], this.edgesName = _ref[0], this.edgesNameCap = _ref[1];
        _ref1 = this.scrollSettings.type === "Vertical" ? ["height", "Height"] : ["width", "Width"], this.lengthName = _ref1[0], this.lengthNameCap = _ref1[1];
        this.railClassName = this.onescroll.settings["rail" + this.scrollSettings.type + "ClassName"];
        this.barClassName = this.onescroll.settings["bar" + this.scrollSettings.type + "ClassName"];
        this.onescroll.$elWrapper.on("onescroll:scrolled", function(ev, top, left, target) {
          var pos;
          pos = _this.scrollSettings.type === "Vertical" ? top : left;
          if (target == null) {
            return _this.updateBarPosition(pos);
          } else {
            if (_this.barId !== target.barId) {
              return _this.updateBarPosition(pos);
            }
          }
        });
      }

      OnescrollGeneric.prototype.createRail = function() {
        this.$rail = $("<div class=\"" + this.railClassName + "\"></div>").uniqueId().css(this.scrollSettings.railCss);
        this.$railInner = $("<div class=\"" + this.railClassName + "-inner\"></div>").css(this.scrollSettings.railInnerCss).appendTo(this.$rail);
        this.railId = this.$rail.get(0).id;
        this.onescroll.$elWrapper.append(this.$rail);
        this.$rail.css("padding-" + this.edgesName[0], this.scrollSettings.railPadding[0]);
        return this.$rail.css("padding-" + this.edgesName[1], this.scrollSettings.railPadding[1]);
      };

      OnescrollGeneric.prototype.getBarBoxOffset = function() {
        return parseInt(this.$bar.css(this.edgesName[0]), 10);
      };

      OnescrollGeneric.prototype.getRailBoxOffset = function() {
        return parseInt(this.scrollSettings.railPadding[0], 10);
      };

      OnescrollGeneric.prototype.updateBarPosition = function(edge) {
        var barEdge, percentage;
        if (edge != null) {
          percentage = edge / this.onescroll["most" + this.edgesNameCap[0]] || 0;
          barEdge = (this.$railInner.get(0)["offset" + this.lengthNameCap] - this.$bar.get(0)["offset" + this.lengthNameCap]) * percentage + parseInt(this.scrollSettings.railPadding[0], 10);
          if ((this.previousPercentage != null) && this.previousPercentage !== percentage) {
            this.onescroll.$elWrapper.trigger("onescroll:barPositionChanged", [this.scrollSettings.type, percentage, edge, barEdge]);
          }
          this.previousPercentage = percentage;
          return this.$bar.css(this.edgesName[0], barEdge);
        }
      };

      OnescrollGeneric.prototype.refreshBarSize = function() {
        var barPropotionToRail;
        if (this.scrollSettings.barCss[this.lengthName] == null) {
          barPropotionToRail = parseInt(this.onescroll.$elWrapper.css(this.lengthName), 10) / parseInt(this.onescroll.$canvas.css(this.lengthName), 10);
          barPropotionToRail = barPropotionToRail > 1 ? 1 : barPropotionToRail;
          return this.$bar.css(this.lengthName, Math.ceil(barPropotionToRail * this.$railInner.get(0)["offset" + this.lengthNameCap]));
        }
      };

      OnescrollGeneric.prototype.getCurrentBarBoxOffsetWithoutRailPadding = function() {
        return this.getBarBoxOffset() - this.getRailBoxOffset();
      };

      OnescrollGeneric.prototype._setBarBoxOffset = function(position) {
        if (this.scrollSettings.railCss[position] != null) {
          return this.$bar.css(position, this.scrollSettings.railCss[position]);
        }
      };

      OnescrollGeneric.prototype.getPercentage = function() {
        return (this.getBarBoxOffset() - this.getRailBoxOffset()) / (this.$railInner.get(0)["offset" + this.lengthNameCap] - this.$bar.get(0)["offset" + this.lengthNameCap]);
      };

      OnescrollGeneric.prototype.createBar = function() {
        var pos, _i, _len, _ref;
        this.$bar = $("<div class=\"" + this.barClassName + "\"></div>").uniqueId().css(this.scrollSettings.barCss);
        this.barId = this.$bar.get(0).id;
        _ref = ["right", "top", "left", "bottom"];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          pos = _ref[_i];
          this._setBarBoxOffset(pos);
        }
        this.onescroll.$elWrapper.append(this.$bar);
        this.refreshBarSize();
        return this.updateBarPosition(0);
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

      OnescrollVertical.prototype.createBar = function() {
        var _this = this;
        OnescrollVertical.__super__.createBar.apply(this, arguments);
        return this.$bar.draggable({
          axis: "y",
          containment: this.$railInner,
          drag: function(ev) {
            return _this.onescroll.scrollTo(_this, null, $(ev.target).position().top);
          }
        });
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

      OnescrollHorizontal.prototype.createBar = function() {
        var _this = this;
        OnescrollHorizontal.__super__.createBar.apply(this, arguments);
        return this.$bar.draggable({
          axis: "x",
          containment: this.$railInner,
          drag: function(ev) {
            return _this.onescroll.scrollTo(_this, $(ev.target).position().left, null);
          }
        });
      };

      return OnescrollHorizontal;

    })(OnescrollGeneric);
    Onescroll = (function() {
      function Onescroll(element, options) {
        this.element = element;
        this._onWheel = __bind(this._onWheel, this);
        this.scrollbars = [];
        this.settings = $.extend({}, defaults, options);
        this.$el = $(this.element);
        if (this.settings.canvasClass != null) {
          this.$canvas = this.$el.find(this.settings.canvasClass);
        } else {
          this.$canvas = this.$el;
        }
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
        this.$el.addClass(this.settings.className).wrap("<div class=\"" + this.settings.wrapperClassName + "\"></div>");
        this.$elWrapper = this.$el.parent();
        this.$elWrapper.height(this.settings.height);
        return this.$elWrapper.width(this.settings.width);
      };

      Onescroll.prototype.createScrollbar = function(options) {
        var scrollbarDefaults, settings, type;
        scrollbarDefaults = {
          railCss: {},
          railInnerCss: {},
          barCss: {}
        };
        settings = $.extend({}, scrollbarDefaults, options);
        type = options.type;
        if (__indexOf.call(validScrollbarTypes, type) >= 0) {
          switch (type) {
            case "Vertical":
              return this.scrollbars.push(new OnescrollVertical(this, settings));
            case "VerticalRight":
              settings.railCss.right = 0;
              return this.scrollbars.push(new OnescrollVertical(this, settings));
            case "VerticalLeft":
              settings.railCss.left = 0;
              return this.scrollbars.push(new OnescrollVertical(this, settings));
            case "Horizontal":
              return this.scrollbars.push(new OnescrollHorizontal(this, settings));
            case "HorizontalTop":
              settings.railCss.top = 0;
              return this.scrollbars.push(new OnescrollHorizontal(this, settings));
            case "HorizontalBottom":
              settings.railCss.bottom = 0;
              return this.scrollbars.push(new OnescrollHorizontal(this, settings));
          }
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
        this.mostTop = -(this.$canvas.outerHeight() - this.$elWrapper.outerHeight());
        this.mostLeft = -(this.$canvas.outerWidth() - this.$elWrapper.outerWidth());
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
        this.scrollWheel(ev, d, dX, dY);
        return this.$elWrapper.trigger("onescroll:mousewheel", d, dX, dY);
      };

      Onescroll.prototype.scrollTo = function(context, left, top) {
        var effectiveLeft, effectiveTop;
        effectiveTop = top != null ? context.getPercentage() * this.mostTop : null;
        effectiveLeft = left != null ? context.getPercentage() * this.mostLeft : null;
        this.$elWrapper.trigger("onescroll:scrolled", [effectiveTop, effectiveLeft, context]);
        this.$el.css("top", effectiveTop);
        return this.$el.css("left", effectiveLeft);
      };

      Onescroll.prototype.scrollWheel = function(ev, d, dX, dY) {
        var effectiveLeft, effectiveTop, left, top;
        top = parseInt(this.$el.css("top"), 10) || 0;
        left = parseInt(this.$el.css("left"), 10) || 0;
        dY = dY != null ? dY : d;
        effectiveTop = top + dY;
        effectiveLeft = left - dX;
        if (effectiveTop >= 0) {
          effectiveTop = 0;
        } else if (effectiveTop <= this.mostTop) {
          effectiveTop = this.mostTop;
        } else {
          ev.preventDefault();
        }
        if (effectiveLeft >= 0) {
          effectiveLeft = 0;
        } else if (effectiveLeft <= this.mostLeft) {
          effectiveLeft = this.mostLeft;
        } else {
          ev.preventDefault();
        }
        this.$el.css("top", effectiveTop);
        if (this.$el.height() > this.$elWrapper.height()) {
          this.$el.css("top", effectiveTop);
        }
        if (this.$el.width() > this.$elWrapper.width()) {
          this.$el.css("left", effectiveLeft);
        }
        this.$elWrapper.trigger("onescroll:scrolled", [effectiveTop, effectiveLeft]);
        return ev;
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
