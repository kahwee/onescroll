do ($ = jQuery, window) ->

	pluginName = "onescroll"
	validScrollbarTypes = [
		"Vertical" # For custom vertical
		"VerticalRight"
		"VerticalLeft"
		"Horizontal" # For custom horizontal
		"HorizontalTop"
		"HorizontalBottom"
	]
	defaults =
		wrapperClassName: "#{pluginName}-wrapper"
		className: "#{pluginName}"
		railHorizontalClassName: "#{pluginName}-rail-h"
		railVerticalClassName: "#{pluginName}-rail-v"
		barHorizontalClassName: "#{pluginName}-bar-h"
		barVerticalClassName: "#{pluginName}-bar-v"
		height: "auto"
		width: "auto"
		scrollbars: [{
			type: "VerticalRight"
		}, {
			type: "HorizontalBottom"
		}]

	# Not intended to be used as it is.
	class OnescrollGeneric

		constructor: (@onescroll, options) ->
			scrollDefaults =
				type: "Vertical" # Vertical must be in caps due to camelCase later
				railPadding: ["0px", "8px"]
			@scrollSettings = $.extend {}, scrollDefaults, options
			[@edgesName, @edgesNameCap] = if @scrollSettings.type is "Vertical" then [["top", "bottom"], ["Top", "Bottom"]] else [["left", "right"], ["Left", "Right"]]
			[@lengthName, @lengthNameCap] = if @scrollSettings.type is "Vertical" then ["height", "Height"] else ["width", "Width"]
			@railClassName = @onescroll.settings["rail#{@scrollSettings.type}ClassName"]
			@barClassName = @onescroll.settings["bar#{@scrollSettings.type}ClassName"]
			@onescroll.$elWrapper.on "onescroll:scrolled", (ev, top, left, target) =>
				if not target?
					@updateBarPosition(top, left)
				else
					if @barId isnt target.barId
						@updateBarPosition(top, left)

		createRail: ->
			@$rail = $("<div class=\"#{@railClassName}\"></div>")
				.uniqueId()
				.css(@scrollSettings.railCss)
			@$railInner = $("<div class=\"#{@railClassName}-inner\"></div>")
				.css(@scrollSettings.railInnerCss)
				.appendTo(@$rail)
			# Save the id, future reference
			@railId = @$rail.get(0).id
			@onescroll.$elWrapper.append(@$rail)
			@$rail.css "padding-#{@edgesName[0]}", @scrollSettings.railPadding[0]
			@$rail.css "padding-#{@edgesName[1]}", @scrollSettings.railPadding[1]

		getBarBoxOffset: ->
			parseInt(@$bar.css(@edgesName[0]), 10)

		getRailBoxOffset: ->
			parseInt(@scrollSettings.railPadding[0], 10)

		refreshBarSize: ->
			if not @scrollSettings.barCss[@lengthName]?
				barPropotionToRail = parseInt(@onescroll.$elWrapper.css(@lengthName), 10) / parseInt(@onescroll.$canvas.css(@lengthName), 10)
				barPropotionToRail = if barPropotionToRail > 1 then 1 else barPropotionToRail
				@$bar.css @lengthName, Math.ceil(barPropotionToRail * @$railInner.get(0)["offset#{@lengthNameCap}"])

		getCurrentBarBoxOffsetWithoutRailPadding: ->
			@getBarBoxOffset() - @getRailBoxOffset()

		_setBarBoxOffset: (position) ->
			if @scrollSettings.railCss[position]?
				@$bar.css position, @scrollSettings.railCss[position]

		createBar: ->
			@$bar = $("<div class=\"#{@barClassName}\"></div>")
				.uniqueId()
				.css(@scrollSettings.barCss)
			# Save the id, future reference
			@barId = @$bar.get(0).id
			@_setBarBoxOffset pos for pos in ["right", "top", "left", "bottom"]
			@onescroll.$elWrapper.append(@$bar)
			@refreshBarSize()

	# Vertical scrollbar
	class OnescrollVertical extends OnescrollGeneric
		constructor: (@onescroll, options) ->
			settings = $.extend {}, options
			settings.type = "Vertical"
			super @onescroll, settings
			@createRail()
			@createBar()

		updateBarPosition: (top) ->
			if top?
				percentage =  top / @onescroll.mostTop || 0
				barTop = (@$railInner.outerHeight() - @$bar.outerHeight()) * percentage + parseInt(@scrollSettings.railPadding[0], 10)
				@$bar.css "top", barTop

		createBar: ->
			super
			@$bar.draggable(
				axis: "y"
				containment: @$railInner
				drag: (ev) =>
					@onescroll.scrollTo(@, null, $(ev.target).position().top)
			)
			# Needed to update just in case, rail has padding of more than 0.
			# Not doing this will result in bar to appear before the rail begins.
			@updateBarPosition(0)

		getPercentage: ->
			(@getBarBoxOffset() - @getRailBoxOffset()) / (@$railInner.outerHeight() - @$bar.outerHeight())

	# Horizontal scrollbar
	class OnescrollHorizontal extends OnescrollGeneric
		constructor: (@onescroll, options) ->
			settings = $.extend {}, options
			settings.type = "Horizontal"
			super @onescroll, settings
			@createRail()

			@createBar()

		updateBarPosition: (top, left) ->
			if left?
				percentage =  left / @onescroll.mostLeft || 0
				barLeft = (@$railInner.outerWidth() - @$bar.outerWidth()) * percentage + parseInt(@scrollSettings.railPadding[0], 10)
				@$bar.css "left", barLeft

		createBar: ->
			super
			@$bar.draggable(
				axis: "x"
				containment: @$railInner
				drag: (ev) =>
					@onescroll.scrollTo(@, $(ev.target).position().left, null)
			)
			# Needed to update just in case, rail has padding of more than 0.
			# Not doing this will result in bar to appear before the rail begins.
			@updateBarPosition(null, 0)

		getPercentage: ->
			(@getBarBoxOffset() - @getRailBoxOffset()) / (@$railInner.outerWidth() - @$bar.outerWidth())


	# Onescroll constructor
	class Onescroll
		constructor: (@element, options) ->
			@scrollbars = []
			@settings = $.extend {}, defaults, options
			@$el = $(@element)
			if @settings.canvasClass?
				@$canvas = @$el.find(@settings.canvasClass)
			else
				@$canvas = @$el
			@before = {}
			@_defaults = defaults
			@_name = pluginName
			@init()

		destroy: ->
			@$el.unwrap()
			@$el.css "position", @before.elPosition

		createWrapper: ->
			@$el.addClass(@settings.className).wrap("<div class=\"#{@settings.wrapperClassName}\"></div>")
			@$elWrapper = @$el.parent()
			@$elWrapper.height(@settings.height)
			@$elWrapper.width(@settings.width)

		createScrollbar: (options) ->
			scrollbarDefaults =
				railCss: {}
				railInnerCss: {}
				barCss: {}
			settings = $.extend {}, scrollbarDefaults, options
			type = options.type
			if type in validScrollbarTypes
				switch type
					when "Vertical"
						@scrollbars.push new OnescrollVertical(@, settings)
					when "VerticalRight"
						settings.railCss.right = 0
						@scrollbars.push new OnescrollVertical(@, settings)
					when "VerticalLeft"
						settings.railCss.left = 0
						@scrollbars.push new OnescrollVertical(@, settings)
					when "Horizontal"
						@scrollbars.push new OnescrollHorizontal(@, settings)
					when "HorizontalTop"
						settings.railCss.top = 0
						@scrollbars.push new OnescrollHorizontal(@, settings)
					when "HorizontalBottom"
						settings.railCss.bottom = 0
						@scrollbars.push new OnescrollHorizontal(@, settings)
			else
				throw "#{options.type} is not supported. Supported types are: " + validScrollbarTypes.join(', ')


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

			@mostTop = -(@$canvas.outerHeight() - @$elWrapper.outerHeight())
			@mostLeft = -(@$canvas.outerWidth() - @$elWrapper.outerWidth())

			@createScrollbar(scrollbar) for scrollbar in @settings.scrollbars
			window.$el = @$el
			window.$elWrapper = @$elWrapper

			@addEventListeners()

		addEventListeners: ->
			@$elWrapper.on("mousewheel", @_onWheel)

		_onWheel: (ev, d, dX, dY) =>
			@scrollWheel(ev, d, dX, dY)
			@$elWrapper.trigger("onescroll:mousewheel", d, dX, dY)

		scrollTo: (context, left, top) ->
			effectiveTop = if top? then context.getPercentage() * @mostTop else null
			effectiveLeft = if left? then context.getPercentage() * @mostLeft else null
			@$elWrapper.trigger "onescroll:scrolled", [effectiveTop, effectiveLeft, context]
			@$el.css "top", effectiveTop
			@$el.css "left", effectiveLeft

		# This enables mouse wheel to be working.
		scrollWheel: (ev, d, dX, dY) ->
			top = parseInt(@$el.css("top"), 10) || 0
			left = parseInt(@$el.css("left"), 10) || 0
			effectiveTop = top + dY
			effectiveLeft = left - dX
			if @$el.height() <= @$elWrapper.height()
				return ev
			if @$el.width() <= @$elWrapper.width()
				return ev
			if effectiveTop >= 0
				effectiveTop = 0
			else if effectiveTop <= @mostTop
				effectiveTop = @mostTop
			else
				ev.preventDefault()

			if effectiveLeft >= 0
				effectiveLeft = 0
			else if effectiveLeft <= @mostLeft
				effectiveLeft = @mostLeft
			else
				ev.preventDefault()

			@$el.css "top", effectiveTop
			@$el.css "left", effectiveLeft

			@$elWrapper.trigger "onescroll:scrolled", [effectiveTop, effectiveLeft]
			ev

	# A really lightweight plugin wrapper around the constructor,
	# preventing against multiple instantiations
	$.fn[pluginName] = (options) ->
		@each ->
			if !$.data(@, "plugin_#{pluginName}")
				$.data(@, "plugin_#{pluginName}", new Onescroll(@, options))
