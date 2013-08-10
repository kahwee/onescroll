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

	# Onescroll constructor
	class Onescroll
		constructor: (@element, options) ->
			window.test = @element
			window.s = "s"
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

			# Place initialization logic here
			# You already have access to the DOM element and the options via the instance,
			# e.g., @element and @settings
			@type = "vertical"
			@barEdge = if @type is "vertical" then "top" else "left"


			@mostTop = -(@$el.outerHeight() - @$elWrapper.outerHeight())
			@mostLeft = -(@$el.outerWidth() - @$elWrapper.outerWidth())


			@createRailVertical()
			@createBarVertical()

			window.$el = @$el
			window.$elWrapper = @$elWrapper

			@addEventListeners()

		addEventListeners: ->
			@$elWrapper.on("mousewheel", @_onWheel)

		_onWheel: (ev, d, dX, dY) =>
			@scrollWheel(d, dX, dY)

		getScrollPercentage: ->
			parseInt(@$bar.css(@barEdge), 10) / (@$elWrapper.outerHeight() - @$bar.outerHeight())

		scrollTo: (x, y) ->
			scrollPercentage = @getScrollPercentage()
			if !!y
				@$el.css "top", scrollPercentage * @mostTop
			ss = x = y

		scrollWheel: (d, dX, dY) ->
			top = parseInt(@$el.css("top"), 10) || 0
			left = parseInt(@$el.css("left"), 10) || 0
			effectiveTop = top + dY
			effectiveLeft = left + dX
			console.log("effective", effectiveTop, effectiveLeft)

			if effectiveTop >= 0
				@$el.css "top", 0
			else if effectiveTop <= @mostTop
				@$el.css "top", @mostTop
			else
				@$el.css "top", effectiveTop

			if effectiveLeft >= 0
				@$el.css "left", 0
			else if effectiveLeft <= @mostLeft
				@$el.css "left", @mostLeft
			else
				@$el.css "left", effectiveLeft

			console.log d, dX, dY, top, left

		scrollContent: (y, isWheel, isJump) ->
			delta = y
			console.log y, isWheel, isJump

		createRailVertical: ->
			@$rail = @railVertical = $("<div class=\"#{@settings.railVerticalClassName}\"></div>")
			@$elWrapper.append(@railVertical)

		createBarVertical: ->
			@$bar = @barVertical = $("<div class=\"#{@settings.barVerticalClassName}\"></div>")
			@$elWrapper.append(@barVertical)
			@barVertical.draggable(
				axis: "y"
				containment: "parent"
				start: (ev) =>
					console.log ev
				drag: (ev) =>
					@scrollTo(null, $(ev.target).position().top)
				stop: (ev) =>
					console.log ev
			)

	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			if !$.data(@, "plugin_#{pluginName}")
				$.data(@, "plugin_#{pluginName}", new Onescroll(@, options))
