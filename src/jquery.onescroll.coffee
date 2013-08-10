do ($ = jQuery, window) ->

	pluginName = "onescroll"
	defaults =
		wrapperClassName: "#{pluginName}-wrapper"
		className: "#{pluginName}"
		railHorizontalClassName: "#{pluginName}-rail-h"
		railVerticalClassName: "#{pluginName}-rail-v"
		barHorizontalClassName: "#{pluginName}-bar-h"
		barVerticalClassName: "#{pluginName}-bar-v"
		height: "auto"
		width: "auto"

	# Not intended to be used as it is.
	class OnescrollGeneric
		constructor: (@onescroll, options) ->
			defaults =
				type: "Vertical" # Vertical must be in caps due to camelCase later
				barEdge: "top"
			@settings = $.extend {}, defaults, options
			@barEdge = if @settings.type is "Vertical" then "top" else "left"
			@railClassName = @onescroll.settings["rail#{@settings.type}ClassName"]
			@barClassName = @onescroll.settings["bar#{@settings.type}ClassName"]
			@onescroll.$elWrapper.on "onescroll:scrolled", (ev, top, left) =>
				@updateBarPosition(top, left)

		createRail: ->
			@$rail = $("<div class=\"#{@railClassName}\"></div>").uniqueId()
			@$railInner = $("<div class=\"#{@railClassName}-inner\"></div>")
			@$rail.append @$railInner
			# Save the id, future reference
			@railId = @$rail.get(0).id
			@onescroll.$elWrapper.append(@$rail)

		createBar: ->
			@$bar = $("<div class=\"#{@barClassName}\"></div>").uniqueId()
			# Save the id, future reference
			@barId = @$bar.get(0).id
			@onescroll.$elWrapper.append(@$bar)

	# Vertical scrollbar
	class OnescrollVertical extends OnescrollGeneric
		constructor: (@onescroll, options) ->
			settings = $.extend {}, options
			settings.type = "Vertical"
			super @onescroll, settings
			@createRail()

			@railPadding = [
				parseInt(@$rail.css("padding-top"), 10)
				parseInt(@$rail.css("padding-bottom"), 10)
			]

			@createBar()

		updateBarPosition: (top) ->
			top = top || 0
			percentage =  top / @onescroll.mostTop || 0
			barTop = (@$railInner.outerHeight() - @$bar.outerHeight()) * percentage + @railPadding[0]
			@$bar.css "top", barTop

		createBar: ->
			super
			@$bar.draggable(
				axis: "y"
				containment: @$railInner
				start: (ev) =>
					console.log ev
				drag: (ev) =>
					@onescroll.scrollTo(null, $(ev.target).position().top)
				stop: (ev) =>
					console.log ev
			)
			# Needed to update just in case, rail has padding of more than 0.
			# Not doing this will result in bar to appear before the rail begins.
			@updateBarPosition(0)

		getPercentage: ->
			(parseInt(@$bar.css(@barEdge), 10) - @railPadding[0]) / (@$railInner.outerHeight() - @$bar.outerHeight())

	# Horizontal scrollbar
	class OnescrollHorizontal extends OnescrollGeneric
		constructor: (@onescroll, options) ->
			settings = $.extend {}, options
			settings.type = "Horizontal"
			super @onescroll, settings
			@createRail()

			@railPadding = [
				parseInt(@$rail.css("padding-left"), 10)
				parseInt(@$rail.css("padding-right"), 10)
			]

			@createBar()

		updateBarPosition: (top, left) ->
			left = left || 0
			percentage =  left / @onescroll.mostLeft || 0
			barLeft = (@$railInner.outerWidth() - @$bar.outerWidth()) * percentage + @railPadding[0]
			@$bar.css "left", barLeft

		createBar: ->
			super
			@$bar.draggable(
				axis: "x"
				containment: @$railInner
				start: (ev) =>
					console.log ev
				drag: (ev) =>
					@onescroll.scrollTo($(ev.target).position().left, null)
				stop: (ev) =>
					console.log ev
			)
			# Needed to update just in case, rail has padding of more than 0.
			# Not doing this will result in bar to appear before the rail begins.
			@updateBarPosition(null, 0)

		getPercentage: ->
			(parseInt(@$bar.css(@barEdge), 10) - @railPadding[0]) / (@$railInner.outerWidth() - @$bar.outerWidth())


	# Onescroll constructor
	class Onescroll
		constructor: (@element, options) ->
			window.test = @element
			@settings = $.extend {}, defaults, options
			@before = {}
			@_defaults = defaults
			@_name = pluginName
			@init()

		destroy: ->
			@$el.unwrap()
			@$el.css "position", @before.elPosition

		createWrapper: ->
			@$el = $(@element).addClass(@settings.className).wrap("<div class=\"#{@settings.wrapperClassName}\"></div>")
			@$elWrapper = @$el.parent()

		init: ->
			@createWrapper();

			# Setting up
			@before.elPosition = @$el.css "position"
			@$el.css "position", "absolute"
			@$elWrapper.css "position", "relative"
			if !!@settings.height
				@$elWrapper.height @settings.height
				@$el.height "auto"
			else
				@$el.height "auto"
				@$elWrapper = @$elWrapper.parent().height()


			@mostTop = -(@$el.outerHeight() - @$elWrapper.outerHeight())
			@mostLeft = -(@$el.outerWidth() - @$elWrapper.outerWidth())

			@vertical = new OnescrollVertical(@)
			@horizontal = new OnescrollHorizontal(@)

			window.$el = @$el
			window.$elWrapper = @$elWrapper

			@addEventListeners()

		addEventListeners: ->
			@$elWrapper.on("mousewheel", @_onWheel)

		_onWheel: (ev, d, dX, dY) =>
			@scrollWheel(d, dX, dY)
			@$elWrapper.trigger("onescroll:mousewheel", d, dX, dY)
			ev.preventDefault()

		scrollTo: (left, top) ->
			if !!top
				@$el.css "top", @vertical.getPercentage() * @mostTop
			if !!left
				@$el.css "left", @horizontal.getPercentage() * @mostLeft

		# This enables mouse wheel to be working.
		scrollWheel: (d, dX, dY) ->
			top = parseInt(@$el.css("top"), 10) || 0
			left = parseInt(@$el.css("left"), 10) || 0
			effectiveTop = top + dY
			effectiveLeft = left - dX
			console.log d, dX, effectiveLeft
			if effectiveTop >= 0
				effectiveTop = 0
			else if effectiveTop <= @mostTop
				effectiveTop = @mostTop

			if effectiveLeft >= 0
				effectiveLeft = 0
			else if effectiveLeft <= @mostLeft
				effectiveLeft = @mostLeft

			@$el.css "top", effectiveTop
			@$el.css "left", effectiveLeft

			@$elWrapper.trigger "onescroll:scrolled", [effectiveTop, effectiveLeft]

	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			if !$.data(@, "plugin_#{pluginName}")
				$.data(@, "plugin_#{pluginName}", new Onescroll(@, options))
