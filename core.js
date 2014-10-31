/***********************************************************************************************\
*	
*	NOTE PAD:
*
*-----------------------------------------------------------------------------------------------

	#TODO:
	-		Create a string formatter function like prt('message' <string>[, 'param#' <*>])
	-		Create a wrapper function for console.log so we can easily turn them off n shit
	-		Look into using the validateproperties as an engine for threads?
	-		REFACTOR
	-		Create an error state and display mode for the entire application
	-		Make the error state object based so we can reuse it on every ui element.
	-		REFACTOR
	-		Look into creating a custom function object that allows more flexible testing.
	-		Create more definitions:

			-	At this point we need start defining the different testing functions and how we
				can apply them to the functions created using the new custom function
				object/prototype thing/whatever. Make it tie into the error state!
	-		Make coffee?

*-----------------------------------------------------------------------------------------------
\***********************************************************************************************/



// Just run it for now.
(function()
{
	// _internal_declarations
	var _container;
	var _screen;

	var _timer;

	var _addEventListener;
	var _document_ready_event;
	var _removeEventListener;

	// Initiators

	// _INTERNAL_CONSTANTS:
	var _PROPERTY_STATE_INITIATED = "_property_state_initiated";
	var _PROPERTY_STATE_INVALIDATED = "_propert_state_invalidated";
	var _PROPERTY_STATE_VALIDATED = "_property_state_validated";

	var _VALIDATOR_STATE_IDLE = "_validator_state_idle";
	var _VALIDATOR_STATE_VALIDATING = "_validator_state_validating";
	var _VALIDATOR_STATE_INITIATED = "_validator_state_initiated";

	var _validator_state = _VALIDATOR_STATE_IDLE;

	// These are values pretty much. Should probably turn them into setter/getters later
	var _frames_per_second = 60;
	var _seconds_per_frame = 1 / _frames_per_second;

	var _interval_unit = 1000 // Milliseconds

	var _interval_unit_per_frame = _seconds_per_frame * _interval_unit;

	// Internal knowledge
	var _property_list = {};

	var _current_chain_link;
	var _chain = {};

	/***********************************************************************************************\
	*	Core functions
	\***********************************************************************************************/
	function _isString(str)
	{
		return (typeof str === "string");
	}

	function _isInteger(value)
	{
		var regexp = /^(\-|\+)?([0-9]+)$/;

    	return regexp.test(value);
	}

	function _isNumber(num)
	{
		return (typeof num === "number");
	}

	function _isBoolean(bol)
	{
		return (typeof bol === "boolean");
	}

	function _isArray(arr)
	{
		return (Array.isArray(arr));
	}

	function _isObject(obj)
	{
		return (typeof obj === "object");
	}
	/*
	function _isAcceptableValue(val)
	{
		var result = false;

		if (_isString(val)
		||	_isNumber(val)
		||	_isBoolean(val)
		||	_isArray(val)
		||	_isObject(val))
		{
			result = true;
		}

		return result;
	}
	*/
	function _isFunction(fnc)
	{
		return (typeof fnc === "function");
	}

	function _isUndefined(value)
	{
		return (typeof value === "undefined");
	}


	function _getTimeStamp()
	{
		return Date.now();
	}

	/***********************************************************************************************\
	*	Contextual functionality
	\***********************************************************************************************/
	
	/**
	 * The whole idea behind this function is that we can, in the (near) future figure out a way to determine
	 * what version or environment we're running inside. Either by feature testing or by trying to read 
	 * standard methods available to read current version and software settings, etc.
	 * 
	 * Based on what we can figure out we can then try to load up different versions of certain key variables
	 * and functions that may differ per version or platform. I hope to be able to ease the ways of allowing
	 * backwards compatabilty of the project itself.
	 *
	 * Over time, when we have a self testing system running, we can tentatively try different versions to 
	 * test if we can optimise the system within those parameters.
	 */
	function _identifyEnvironment()
	{
		// This entire system requires a visualisation method. Right now I'm using a screen based on a canvas.
		_screen = document.createElement("canvas");

		//#QUESTION:
		// See if we can hook our initialisation on the onload call of the canvas, coz we did create it, we just didn't append it to the DOM yet, does that count?

		// If we don't have a canvas, then we might as well just exit right here and not bother with anything. For now at least.
		if (_screen == undefined)
		{
			alert("No screen could be detected.\nCore load finished unsuccesfully.");

			return false;
		}

		// To be able to hook the screen into the DOM we need to know when it's ready.
		if (document.addEventListener)
		{
			_addEventListener = document.addEventListener;
			_removeEventListener = document.removeEventListener;
			_document_ready_event = "DOMContentLoaded";

			console.log("Using First event listener option.");
		}
		else if (document.attachEvent)
		{
			_addEventListener = document.attachEvent;
			_removeEventListener = document.detachEvent;
			_document_ready_event = "onreadystatechange";
			
			console.log("Using Second event listener option.");
		}
		else
		{
			alert("Cannot determine document ready state.");

			return false;
		}
	}
	
	function _hookInitializationEvent()
	{
		function loadUp()
		{
			_removeEventListener.call(document, _document_ready_event, loadUp);
			_initialize();
		}

		_addEventListener.call(document, _document_ready_event, loadUp);
	}

	function _initialize()
	{
		// Lets try to get our screen online:
		_screen.style.position = "absolute";
		_screen.style.top = '0px';
		_screen.style.left = '0px';

		document.body.appendChild(_screen);

		_addProperty("_screen_dimensions", _validateScreenDimensions);

		// Lets try something a little dodgy:
		function resizeScreen()
		{
			_invalidateProperty("_screen_dimensions");
		}

		window.addEventListener("resize", resizeScreen);

		var testResults = _runTests()

		if (testResults.failed > 0)
		{
			alert(testResults.failed + "/" + testResults.total + " TESTS FAILED -- Program not running with certainty");
		}

		_screenTesting();
	}

	function _validateScreenDimensions()
	{
		_screen.height = window.innerHeight;
		_screen.width = window.innerWidth;

		// Quit yer lollygaggin and start doin' sommin'!
		_screenTest();
	}
	
	/***********************************************************************************************\
	*	Internal functions
	\***********************************************************************************************/

	function _isActiveTimer(timer)
	{
		return (!_isUndefined(_timer) && _isNumber(_timer));
	}

	function _initiateValidation()
	{
		if (_validator_state == _VALIDATOR_STATE_INITIATED
		||	_validator_state == _VALIDATOR_STATE_VALIDATING)
		{
			return false;
		}

		_validator_state = _VALIDATOR_STATE_INITIATED;

		_startValidationTimer();
	}

	function _startValidationTimer()
	{
		if (_isActiveTimer(_timer))
		{
			console.log("Attempt to activate excess timer.");

			return false;
		}

		var interval = _seconds_per_frame * _interval_unit;

		function intervalExecution()
		{
			_validateProperties(interval);
		}

		// Now we're officially validating.
		_validator_state = _VALIDATOR_STATE_VALIDATING;

		// So get the timer started so we can empty the validation chain.
		_timer = setInterval(intervalExecution, interval);

		console.log("started timer: ", _timer);
	}

	function _stopValidation()
	{
		if (!_isActiveTimer(_timer))
		{
			console.log("Attempt to deactivate inactive timer: ", _timer);

			return false;
		}

		clearInterval(_timer);

		console.log("closed timer:" , _timer);

		_timer = null;

		_validator_state = _VALIDATOR_STATE_IDLE;
	}

	// In here we need to iteratively do the first things on our to-do list till it's empty, or we ran out of time.
	function _validateProperties(time_left)
	{
		var current_property;

		var start_time;
		var execution_time;

		var properties_validated = 0;

		while (time_left > 0)
		{
			if (!_current_chain_link)
			{
				_stopValidation();

				break;
			}

			start_time = _getTimeStamp();

			_validateProperty(_current_chain_link.name);

			properties_validated++;

			execution_time = _getTimeStamp() - start_time;

			console.log("validated property number: " + properties_validated + " in " + execution_time + "ms.");

			time_left -= execution_time;
		}

		console.log("Properties validated:" + properties_validated);
	}

	function _addProperty(name, validationFunction)
	{
		if (!_isString(name))
		{
			console.log("Expected string as argument #1, received: ", name);

			return false;
		}

		if (!_isFunction(validationFunction))
		{
			console.log("Expected function as argument #2, received: ", validationFunction);

			return false;
		}

		var property = {
			name: name,
			validator: validationFunction,
			state: _PROPERTY_STATE_INITIATED,
			invalidation_calls: 0
		}

		_property_list[name] = property;

		_invalidateProperty(name);
	}

	function _invalidateProperty(property_name)
	{
		var property = _property_list[property_name];

		if (!property)
		{
			console.log("Attempt to invalidate unknown property: ", property_name);

			return false;
		}

		property.invalidation_calls++;

		if (property.state == _PROPERTY_STATE_INVALIDATED)
		{
			// No need to invalidate it again.
			return;
		}

		// Add it to the to-do chain so we know that we need to do something with it later.
		_addPropertyToChain(property);

		// Set the invalid flag inside the property itself as well.
		property.state = _PROPERTY_STATE_INVALIDATED;

		// Wake up our validator if it's sleeping again.
		_initiateValidation();
	}

	function _validateProperty(property_name)
	{
		var property = _property_list[property_name];

		if (!property)
		{
			console.log("Attempt to validate unknown property: ", property);

			return;
		}

		var validator = property.validator;
		
		if (!_isFunction(validator))
		{
			console.log("Attempt to call non-functional validator: ", validator);

			return;
		}

		validator();

		property.state = _PROPERTY_STATE_VALIDATED;

		_removePropertyFromChain(property);

		console.log(property_name + ' was invalidated ' + property.invalidation_calls + ' time(s) before validation.');

		property.invalidation_calls = 0;
	}

	/**
	 * Add given property to linked list behind current highlighted item if we have any.
	 */
	function _addPropertyToChain(property)
	{
		var name = property.name;

		if (_chain[property.name])
		{
			console.log("Attempt to add already existing property to chain: ", property);

			return;
		}

		// Create a new empty link.
		var new_link = {
			name: name,
			prev: name,
			next: name
		}

		// If we have a current highlighted link, then we need to inject the new link behind it.
		if (_current_chain_link)
		{
			// Hook the new link up behind the last item if we have any.
			if (_current_chain_link.prev)
			{
				new_link.prev = _current_chain_link.prev;

				_chain[_current_chain_link.prev].next = name;
			}

			_current_chain_link.prev = name;

			new_link.next = _current_chain_link.name;
		}
		else
		{
			_current_chain_link = new_link;
		}

		_chain[name] = new_link;
	}

	function _removePropertyFromChain(property)
	{
		/* Reference sheet of what we're doing
		{
			one: 	{prev: "three", 	name: "one", 	next: "two"},
			two: 	{prev: "one", 		name: "two", 	next: "three"},
			three: 	{prev: "two", 		name: "three", 	next: "one"}
		}
		*/

		var link = _chain[property.name];

		_chain[link.prev].next = link.next;
		_chain[link.next].prev = link.prev;

		if (_current_chain_link == link)
		{
			if (link.next == link.name)
			{
				// Prevent a dead loop here
				_current_chain_link = null;
			}
			else
			{
				_current_chain_link = _chain[link.next];
			}
		}

		// aaaaaand it's gone.
		delete _chain[property.name];
	}

	/***********************************************************************************************\
	*	Sandbox/Playground stuff || IGNORE THESE PLEASE
	\***********************************************************************************************/

	var _screenTest;

	function _screenTesting()
	{
		// Declarations
		var g;
		var current_colour;

		// Initiators
		g = _screen.getContext('2d'); // <-- This is immediate mode! Be careful!
		
		colours = {
			red: 		{name: 'red',		prev: 'purple',	next: 'orange'},
			orange: 	{name: 'orange',	prev: 'red',	next: 'yellow'},
			yellow: 	{name: 'yellow',	prev: 'orange',	next: 'green'},
			green: 		{name: 'green',		prev: 'yellow',	next: 'blue'},
			blue: 		{name: 'blue',		prev: 'green',	next: 'purple'},
			purple: 	{name: 'purple',	prev: 'blue',	next: 'red'}
		}

		current_colour = colours.red;

		// Checks
		if (g == undefined)
		{
			alert("Could not get hold of a graphics context");
		}

		_screen.addEventListener("click", _showNextColour, false);

		function _showNextColour()
		{
			_fillScreenWithLines(g, current_colour);

			current_colour = colours[current_colour.next];
		}

		function _fillScreenWithLines(g, colour)
		{
			// Declarations
			var unit;
			var rows;
			var columns;
			
			var i;
			var j;

			// Initiators
			unit = 1;
			rows = _screen.height;
			columns = _screen.width;

			i = 0;
			j = 0;

			// Body
			for (; i < rows; i += unit)
			{
				g.strokeStyle = current_colour.name;

				_putRowOnScreen(g, i, 0, columns);
			}
		}

		function _putRowOnScreen(graphics, x, start, end)
		{
			graphics.beginPath();

			// Start point
			graphics.moveTo(start, x);
			// End point
			graphics.lineTo(end, x);

			graphics.stroke();
			graphics.closePath();
		}

		_screenTest = function()
		{
			_showNextColour();
		}
	}
	
	
	/***********************************************************************************************\
	*	Test area.
	\***********************************************************************************************/
	var _tests_total = 0;
	var _tests_succeeded = 0;
	var _tests_failed = 0;

	var _tests = {};

	function _registerAsTestFunction(name, func)
	{
		if (!_isFunction(func))
		{
			console.log("Attempt to register non-function as test function: ", func);

			return;
		}

		_tests[name] = func;
	}

	function _runTests()
	{
		var result = {};

		for (var test_name in _tests)
		{
			_tests_total++;

			try
			{
				_tests[test_name]();
			}
			catch (e)
			{
				console.log(e);
				_tests_failed++
			}
		}

		result.succeeded = _tests_succeeded || 0;
		result.failed = _tests_failed || 0;
		result.total = _tests_total || 0;

		return result;
	}

	function _testSucceededIf(statement)
	{
		if (statement === true)
		{
			_tests_succeeded++;
		}
		else // Fail by default
		{
			// Test FAIL
			_tests_failed++;
		}
	}
	
	// Update test -> Old value should change to intended value
	_registerAsTestFunction('update_test',
		function()
		{
			var temp = _validator_state;

			_validator_state = _VALIDATOR_STATE_IDLE;

			_initiateValidation();

			_testSucceededIf(_validator_state == _VALIDATOR_STATE_INITIATED);

			_validator_state = temp;
		}	
	);

	// redundancy test -> Current value stays the same
	_registerAsTestFunction('redundancy_test',
		function()
		{
			var temp = _validator_state;

			_validator_state = _VALIDATOR_STATE_INITIATED;

			_initiateValidation();

			_testSucceededIf(_validator_state == _VALIDATOR_STATE_INITIATED);

			_validator_state = temp;
		}
	);
	

	/***********************************************************************************************\
	*	Run da maddafakka!!!
	\***********************************************************************************************/

	// Time to figure out who loaded us up and what we're dealing with here.
	_identifyEnvironment();

	_hookInitializationEvent();

})();