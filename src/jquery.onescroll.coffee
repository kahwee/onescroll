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

		createRail: ->
			@$rail = $("<div class=\"#{@railClassName}\"></div>").uniqueId()
			# Save the id, future reference
			@railId = @$rail.get(0).id
			@onescroll.$elWrapper.append(@$rail)

		createBar: ->
			@$bar = $("<div class=\"#{@barClassName}\"></div>").uniqueId()
			# Save the id, future reference
			@barId = @$bar.get(0).id
			@onescroll.$elWrapper.append(@$bar)


	#
	class OnescrollVertical extends OnescrollGeneric
		constructor: (@onescroll, options) ->
			@settings = $.extend {}, defaults, options
			super @onescroll, @settings
			@createRail()
			@createBar()

		createBar: ->
			super
			@$bar.draggable(
				axis: "y"
				containment: "parent"
				start: (ev) =>
					console.log ev
				drag: (ev) =>
					@onescroll.scrollTo(null, $(ev.target).position().top)
				stop: (ev) =>
					console.log ev
			)

		getPercentage: ->
			parseInt(@$bar.css(@barEdge), 10) / (@onescroll.$elWrapper.outerHeight() - @$bar.outerHeight())


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

			window.$el = @$el
			window.$elWrapper = @$elWrapper

			@addEventListeners()

		addEventListeners: ->
			@$elWrapper.on("mousewheel", @_onWheel)

		_onWheel: (ev, d, dX, dY) =>
			@scrollWheel(d, dX, dY)

		setScrollPercentage: (bar) ->
			console.log('he')

		scrollTo: (x, y) ->
			console.log(x, y)
			if !!y
				@$el.css "top", @vertical.getPercentage() * @mostTop

		# This enables mouse wheel to be working.
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

	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			if !$.data(@, "plugin_#{pluginName}")
				$.data(@, "plugin_#{pluginName}", new Onescroll(@, options))
