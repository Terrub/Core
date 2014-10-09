if ("undefined" === typeof jQuery)
{
	//#ERROR:
	alert("JQUERY NOT FOUND!");
}

var en_Core = {};

(function()
{
	var DEFAULT_FUNCTION = function(){};
	
	// Debug modes
	en_Core.DEBUG_MODE_VERBOSE = "spamming console with debug data";
	en_Core.DEBUG_MODE_NONE = "Not debugging or spamming at the moment";
	en_Core.DEBUG_MODE_SILENT = "Registering debug messages but not spamming console";

	en_Core.DEBUG_MODES = [
		en_Core.DEBUG_MODE_VERBOSE,
		en_Core.DEBUG_MODE_NONE,
		en_Core.DEBUG_MODE_SILENT
	];

	en_Core.AddDebugMessage = DEFAULT_FUNCTION;

	var ARRAY_LENGTH_EMPTY = [].length;
	var __i = 0;

	//#IMPLICATION: Used in en_Core.js due to constant "ARRAY_LENGTH_EMPTY";
	//#IMPLICATION: Used in JavaScript due to array method: "indexOf()";
	var _keyInArray = function(key, arr)
	{
		// interesting stuff: http://web.mit.edu/jwalden/www/isArray.html
		if (!Array.isArray)
		{
			//#ERROR:
			alert("Current environment does not carry native function: 'Array.isArray'");
		}

		__i = arr.indexOf(key);
		
		return !( (__i < ARRAY_LENGTH_EMPTY) || (__i >= arr.length) )
	};

	/* 
		#TODO: This should not just be a var declaration. This should be a property declaration.
		That means we need to define what a property is, and what it does. Because I want to make
		a property announce that it is changed by default. i.e. unless specified to stfu it should
		raise an event of sorts so others can tie into it.
	*/
	var _debug_mode;

	var _captured_messages = [];

	//#IMPLICATION: Used in JavaScript due to global variable: "console"
	//#IMPLICATION: Used in JavaScript due to console method: "log()"
	var _printMessage = function()
	{
		console.log("en_Core: ", arguments);
	};

	//#IMPLICATION: Used in JavaScript due to use of locally implied variable: "arguments"
	var _new_captureMessage = function(args)
	{
		// Create a new message.
		var cap_msg = {
			timestamp: +( new Date() ),
			message: null
		};

		cap_msg.message = args;

		return cap_msg;
	};

	//#IMPLICATION: Used in JavaScript due to use of locally implied variable: "arguments"
	var _captureMessage = function()
	{
		/*
			I don't just want to stick in the arguments so we'll have to create something of a standard object in which we stick some data.
			We can always change the data object format and what not, at a later time if we see fit.
		*/

		var capture_message = _new_captureMessage(arguments);

		_captured_messages.push(capture_message);
	};

	//#IMPLICATION: Used in JavaScript due to use of locally implied variable: "arguments", twice!
	var _captureAndPrintMessage = function()
	{
		_captureMessage.apply(null, arguments);

		_printMessage.apply(null, arguments);
	};

	en_Core.SetDebugMode = function(mode)
	{
		if (!_keyInArray(mode, en_Core.DEBUG_MODES))
		{
			en_Core.AddDebugMessage("Attempt to set debug mode with unrecognised mode:", mode);

			return;
		}

		//#TODO: Make this a property change.
		_debug_mode = mode;

		if (_debug_mode === en_Core.DEBUG_MODE_VERBOSE)
		{
			// Realign pointer to capture and print functionality
			en_Core.AddDebugMessage = _captureAndPrintMessage;
		}
		else if (_debug_mode === en_Core.DEBUG_MODE_SILENT)
		{
			// Realign pointer to our message capture functionality
			en_Core.AddDebugMessage = _captureMessage;
		}
		else
		{
			en_Core.AddDebugMessage = DEFAULT_FUNCTION;
		}
	};

	en_Core.GetDebugMode = function()
	{
		return _debug_mode;
	};

	en_Core.SetDebugMode(en_Core.DEBUG_MODE_VERBOSE); // Setting debug mode to verbose by default.

	en_Core.GetCapturedDebugMessages = function()
	{
		return _captured_messages;
	};

})();

// OK You can't inject an iterator function into the console log. He'll cut the cord after the first return if you use f() or the function itself.
/*
	console.log("a", "b", "c");

	var arr = ["a", "b", "c"];

	var _unpack = function(params)
	{
		var i = -1;
		var n = params.length;

		return function() {
			i++; 
			if (i < n)
			{
				return params[i];
			}
		}
	}
	var f = _unpack(arr);
	console.log(f());
*/

// Another problem. We can't just use Array.join(" ") because:
/*
	var arr = []; arr.push("a", "b", 1); var obj = {c:2,d:3}; arr.push(obj);arr.join(" ")
	which returns: "a b 1 [object Object]"
*/