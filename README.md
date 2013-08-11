## Onescroll

A customizable scrollbar solution for jQuery.

## Dependencies

* [jQuery](http://jquery.com/)
* [jQuery UI](jqueryui.com) (Core, Widget, Mouse and Draggable)
* [jQuery Mousewheel](https://github.com/brandonaaron/jquery-mousewheel)

## Install via Bower

```bash
bower install jquery.onescroll --save
```

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.3/jquery.mousewheel.min.js"></script>
	```

2. Include plugin's code:

	```html
	<link href="../dist/onescroll.css" rel="stylesheet" type="text/css" />
	<script src="dist/jquery.onescroll.min.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").onescroll({
		width: "500px",
		height: "300px"
	});
	```

## Examples

Let's try having four scrollbars, because why not:

```javascript
$("#demo1").onescroll({
	height: "200px",
	width: "400px",
	scrollbars: [{
		type: "VerticalLeft",
		railPadding: ['2px', '3px'],
		railCss: {

		}
	}, {
		type: "VerticalRight",
		railPadding: ['40px', '30px'],
		railCss: {
		}
	}, {
		type: "HorizontalTop",
		railPadding: ['2px', '108px'],
		railCss: {
		}
	}, {
		type: "HorizontalBottom",
		railPadding: ['2px', '3px'],
		railCss: {
			visibility: 'hidden'
		}
	}]
});
```

To access the Onescroll object:

```javascript
yourJQueryElement.data('plugin_onescroll')
```
## Browser support

I have only tested this in the latest browsers.

* Chrome
* Firefox
* Internet Explorer (Only tested in IE10)
* Safari

## Contributing

Check [CONTRIBUTING.md](https://github.com/kahwee/onescroll/blob/master/CONTRIBUTING.md)

## License

MIT License
