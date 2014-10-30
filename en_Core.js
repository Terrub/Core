
/*
	NOTEPAD:
	
	It starts to look like the system itself has seperate phases it goes through for declaration and initiation.

	* We have identification of self.
		Think about variables we need to exist, like States and positions, ancestry and offspring, etc.
	* Declaring constants and axioms.
		Think about constants we use and assumptions we make.
		What is an array and how does it work. Logic and mathematics are always part of this.
		Perhaps an other way of wording this: "The things we define as the elements we use."
	* Describe the tools we need.
		Think: private functions and the variables they use or require. This is seperate from constants and axioms 
		because these are tools. We can use them, but don't strictly need to to exists. We need them to do certain
		things, but we may not be required to do those things at all over a given period.
	* Describe how we need to do the things we can.
		Think: Public functions, methods and possibly event handlers. Us reacting to outside stimuli.
	* Some form of initiation to declare our t(0).
		We need to know when now is now and when then was then. To give a sense of direction we need a starting point.
		Initiation is probably the best way to describe this. Do this last.

	Actually, the above is perhaps a bit dry and floaty for most people...
	What we do need to keep track of is each individidiual layer of certainty.
	Once we've established specific certainties, or able to make certain assumptions, we can make a statement and
	then move on to make larger and larger assumptions.
	Think along the lines of:
		* What environment are we running in?
		2 Does the shit we need exist in this environment?
		c Do we know which features we can abuse and which rules we can bend?
		IV Is our debugger online?
		c.2 Are we all there?
		# Is the DOM ready and able to accept our garbage?
		- Do we have access to our error functionality?
		n Can we randomly navigate the user to some dodgy site with just a bit too much skin for office policy?
*/

var en_Core;

/*if ("undefined" === typeof jQuery)
{
	//#QUESTION: Why fail here? We can register the fault, halt initiation of depending logic and delegate the error to when the error handler is operational!
	_throwError("JQUERY NOT FOUND!");
}*/

//alert(document.URL);
//alert(document.baseURI);

(function()
{
	// Now we're starting to define the object itself.
	en_Core = {};

	function _DEFAULT_FUNCTION(){};

	var _TYPE_FUNCTION = "function";
	var _TYPE_STRING = "string";
	var _TYPE_DEBUG_MODE = "debug mode";

	var _DIV = "div";

	var _WORKING_AS_INTENDED = "ERHMERGHERD IT WORKS";
	var _GENERIC_ERROR = '(\\/)\n(x_x)\n(")(")\nDED BUNEH';

	var _DEBUG_MODE_PREFIX = "DEBUG_MODE_";

	/****************************************************************
	 * Array stuff
	 ****************************************************************/
/* Not using this anymore atm.
	var _ARRAY_LENGTH_EMPTY = [].length;
	var __i = _ARRAY_LENGTH_EMPTY;

	//#IMPLICATION: Used in en_Core.js due to constant "_ARRAY_LENGTH_EMPTY";
	//#IMPLICATION: Used in JavaScript due to array method: "indexOf()";
	var _keyInArray = function(key, arr)
	{
		// interesting stuff: http://web.mit.edu/jwalden/www/isArray.html
		if (!Array.isArray)
		{
			_throwError("Current environment does not carry native function: 'Array.isArray'");
		}

		if (!Array.isArray(arr))
		{
			_throwError("_keyInArray requires a valid array as second argument.");

			return false;
		}

		__i = arr.indexOf(key);
		
		return !( (__i < _ARRAY_LENGTH_EMPTY) || (__i >= arr.length) )
	};
*/


	/****************************************************************
	 * Version control stuff
	 ****************************************************************/
	// We need this for our initiation...
	var _addEventListener;
	var _document_ready_event;
	var _removeEventListener;

	if (document.addEventListener)
	{
		_addEventListener = document.addEventListener;
		_removeEventListener = document.removeEventListener
		_document_ready_event = "DOMContentLoaded";
	}
	else if (document.attachEvent)
	{
		_addEventListener = document.attachEvent;
		_removeEventListener = document.detachEvent;
		_document_ready_event = "onreadystatechange";
	}
	else
	{
		// We alert intead of throwing an error, as our error throwing arm might not be fully grown yet at this point.
		alert("Cannot determine document ready state.");
	}

	// Test to see we have f.caller:
	var _functionCaller;

/*	(function _functionCallerChecker()
		{
			var _GLOBAL_SCOPE = "Global Scope"
			if (_functionCallerChecker.caller)
			{
				_functionCaller = function(self)
				{
					return self.caller || _GLOBAL_SCOPE;
				}
			}
			else 
			{
				// 
				alert("_functionCaller is 'undefined'");
			}
		}
	)();*/

	// This answers the following question I had:
	//
	// --snippit from: _addDebugMode--
	//#QUESTION: 	So... I wanted to put depency checks here, but that would turn into a big mess
	//			 	pretty quickly. Because if I tested for the array _debug_modes here I'd technically
	//				also have to check if Array.isArray() exists which we may have already established
	//				elsewhere, but this function doesn't know that, so how do we make sure that this
	//				program, housing these functions knows that?
	//
	//				The alternative is to not test for it, but to just force it if it doesn't allow us
	//				to inject a new value, but that causes a whole slew of other possible problems later.
	//				Think things like naming issues or property statechange detection later down the line.
	//
	// Simply because now we have a custom method that can rely on, because we can guarantee it inside
	// the core or else it will cause errors. We'd know if something went wrong or is missing this way!
	function _isArray(value)
	{
		if (Array.isArray)
		{
			return Array.isArray(value);
		}
		else
		{
			_throwError("Current environment does not carry native function: 'Array.isArray'");
		}
	}

	function _isBoolean(value)
	{
		return (value === true) || (value === false);
	}

	function _isInteger(value)
	{
		var regexp = /^(\-|\+)?([0-9]+|Infinity)$/;

    	return regexp.test(value);
	}

	function _isNumber(value)
	{
		return !isNaN(value);
	}

	function _stringify()
	{
		return JSON.stringify(arguments);
	}

	function WIP_stringify(value, key, indentation)
	{
		var normalised_value = value.toString();
		var normalised_key;

		var _NEWLINE = "\n";
		var _TAB = "\t";

		var indent = indentation || "";
		var str = "";

		if (key != undefined)
		{
			normalised_key = key.toString();
			str += _NEWLINE;
		}
		else
		{
			normalised_key = typeof value;
		}

		str += indent + "[" + normalised_key + "] ";
		
		if (_isBoolean(value))
		{
			str += value ? "true" : "false";
		}
		else if (_isInteger(value))
		{
			str += parseInt(value, 10); // This is default base 10 for the time being!.
		}
		else if (_isNumber(value))
		{
			str += parseFloat(value);
		}
		else if (_isArray(value))
		{
			for (var i = 0, l = value.length; i < l; ++i)
			{
				str += WIP_stringify(value[i], i, indent + _TAB);
			}
		}
		// else if (_isObject(value))
		// {
		// 	for (var k in value)
		// 	{
		// 		str += WIP_stringify(value[k], k, indent + _TAB);
		// 	}
		// }
		else
		{
			// No idea man... debug message for future tracking? ERROR like a maddafakka?... sound fun :P

			// For now just default to str:
			str += normalised_value;
		}
		
		return str;
	}

	en_Core.stringify = WIP_stringify;

	/****************************************************************
	 * Error stuff
	 ****************************************************************/
	// Ok so we need something of a way to display errors on screen.
	// We can build the functionality here and have the actual displaying done during initialisation

	var _error_pane;

	// Using a function declaration instead of expression to be able to pass along itself. See [>1]
	function _throwError(message)
	{
		// Delegate any messages to the error pane?
		
		var error_message = message || _GENERIC_ERROR;

		// Do we have a way to check who threw that?
		if (_functionCaller)
		{
			// [>1]: We can pass along "_throwError" because it's declared and not passed to an expression (i.e.: "var _throwError = function(){};")
			error_message = _functionCaller(_throwError) + " says:\n" + error_message;
		}

		// Well we need an error pane first.
		if (!_error_pane)
		{
			alert(error_message);
			return;
		}

		// Bit messy, but works for now I guess?
		_error_pane.innerHTML += "<p>" + error_message +"</p>";

		// Now we need styling and error delegation.
		// I want to be able to flood our error log before we can display it, because source and display
		// should be seperate.
		// Also, I should go to sleep...
	}

	en_Core.ThrowError = _throwError;

	var _createErrorPane = function()
	{
		_error_pane = document.createElement(_DIV);
	 	document.body.appendChild(_error_pane);
	}

	/****************************************************************
	 * Debugger stuff
	 ****************************************************************/
	/* 
		#TODO: This should not just be a var declaration. This should be a property declaration.
		That means we need to define what a property is, and what it does. Because I want to make
		a property announce that it is changed by default. i.e. unless specified to stfu it should
		raise an event of sorts so others can tie into it.
	*/
	var _debug_mode;

	var _debug_modes = [];

	function _newDebugMode(name, description, add_debug_message_handler)
	{
		// Type checking
		if (!name || typeof name != _TYPE_STRING)
		{
			_throwError("_newDebugMode requires parameter #1: 'name' <string>");
		}

		if (!description || typeof name != _TYPE_STRING)
		{
			_throwError("_newDebugMode requires parameter #2: 'description' <string>");
		}

		if (typeof add_debug_message_handler != _TYPE_FUNCTION)
		{
			_throwError("_newDebugMode requires parameter #3: 'add_debug_message_handler' <function>");
		}

		var mode = {
			type: _TYPE_DEBUG_MODE,
			name: name,
			description: description,
			AddDebugMessage: add_debug_message_handler
		};

		return mode;
	}

	function _addDebugMode(mode)
	{
		if (mode.type != _TYPE_DEBUG_MODE)
		{
			_throwError("Attempt to register non-Debug_mode object: " + _stringify(mode));
		}

		// Inject
		_debug_modes[mode.name] = mode;

		// And make sure the outside world can see it.
		en_Core[_prefixDebugModeName(mode.name)] = mode.name;

		return mode;
	}

	function _prefixDebugModeName(debug_mode_name)
	{
		if (typeof debug_mode_name != _TYPE_STRING)
		{
			_throwError("requires parameter #1: 'debug_mode_name' <string>");
		}

		return _DEBUG_MODE_PREFIX + debug_mode_name.toUpperCase();
	}

	function _populateDebugModes()
	{
		// Reset for now
		_debug_modes = [];

		// This feels ugly! :X
		_addDebugMode( _newDebugMode("none", "Not debugging at the moment", _DEFAULT_FUNCTION) );
		_addDebugMode( _newDebugMode("verbose", "spamming console with debug data", _captureAndPrintMessage) );
		_addDebugMode( _newDebugMode("silent", "Registering debug messages but not spamming console", _captureMessage) );
	}

	var _captured_messages = [];

	//#IMPLICATION: Used in JavaScript due to global variable: "console"
	//#IMPLICATION: Used in JavaScript due to console method: "log()"
	function _printMessage()
	{
		console.log("en_Core: " + _stringify(arguments));
	};

	//#IMPLICATION: Used in JavaScript due to use of locally implied variable: "arguments"
	function _newCapturedMessage(args)
	{
		// Create a new message.
		var cap_msg = {
			timestamp: +( new Date() ),
			message: null
		};

		cap_msg.message = _stringify(args);

		return cap_msg;
	};

	//#IMPLICATION: Used in JavaScript due to use of locally implied variable: "arguments"
	function _captureMessage()
	{
		/*
			I don't just want to stick in the arguments so we'll have to create something of a standard object in which we stick some data.
			We can always change the data object format and what not, at a later time if we see fit.
		*/

		var capture_message = _newCapturedMessage(arguments);

		_captured_messages.push(capture_message);
	};

	//#IMPLICATION: Used in JavaScript due to use of locally implied variable: "arguments", twice!
	function _captureAndPrintMessage()
	{
		_captureMessage.apply(null, arguments);

		_printMessage.apply(null, arguments);
	};

	en_Core.AddDebugMessage = function()
	{
		if (!_debug_mode)
		{
			_throwError("No debug mode has been set");
		}

		_debug_mode.AddDebugMessage.call(null, arguments);
	}

	en_Core.SetDebugMode = function(mode)
	{
		var debug_mode = _debug_modes[mode];

		if (!debug_mode)
		{
			_throwError("Attempt to set debug mode with unrecognised mode: '" + mode + "'. Keeping current mode.");

			return;
		}

		//#TODO: Make this a property change.

		// Wait... this isn't that hard. Switch mode object here.
		// The mode object contains it's specific debug message handle thingy.
		// That way we can never do it wrong and the outside cannot get a hold
		// of our internal function nor a reference pointing towards it! HA!
		_debug_mode = debug_mode;
	};

	en_Core.GetDebugMode = function()
	{
		return _debug_mode;
	};
	
	en_Core.GetCapturedDebugMessages = function()
	{
		return _captured_messages;
	};


	/****************************************************************
	 * Contextual stuff
	 ****************************************************************/

	var _initialize = function()
	{
		if (!_error_pane)
		{
			_createErrorPane();
		}

		_populateDebugModes();
		en_Core.SetDebugMode("verbose");

	 	en_Core.AddDebugMessage("Switching to Silent debug mode.");
		en_Core.SetDebugMode(en_Core.DEBUG_MODE_SILENT);
		en_Core.AddDebugMessage("I shouldn't see this now debug mode is set to Silent");

		en_Core.RunTests();

	 	alert(_WORKING_AS_INTENDED);
	}


	/****************************************************************
	 * Event listener stuff for initiation.
	 ****************************************************************/

	// If we have an _initialize function declared, we should probably make sure we can run it.
	if (_initialize)
	{
		_addEventListener.call(document, _document_ready_event, function()
		{
			_removeEventListener.call(document, _document_ready_event);

			_initialize();
		});
	}

	// All tests for this document.
	//
	// CAUTION: They should all be declared underneath en_Core.RunTests using declarative function notation:
	//	i.e.: function nameOfTest_test(){};
	//	NOT: var nameOfTest_test = function(){};
	en_Core.RunTests = function()
	{
		//#QUESTION: 	How do we know we have full test coverage? Should we register each function in en_Core (The API so
		// 				to speak) and check for each function whether it has a test?
	
		_newDebugMode_test();
		_addDebugMode_test();

		GetDebugMode_test();
		GetCapturedDebugMessages_test();
		SetDebugMode_test();
	}

	/****************************************************************
	 * _newDebugMode()
	 ****************************************************************/
	function _newDebugMode_test()
	{
		// PREP
		var debug_mode_name = "debug_mode_create_test_name";
		var debug_mode_description = "debug_mode_create_test_description";
		var debug_mode_message_function_works = false;
		var debugModeMessageFunction = function()
		{
			debug_mode_message_function_works = true;
		};

		// EXECUTE
		var mode_to_check = _newDebugMode(debug_mode_name, debug_mode_description, debugModeMessageFunction);

		// TESTS
		if (mode_to_check.name != debug_mode_name)
		{
			_throwError("expected en_Core." + debug_mode_name + ".name to contain value: " + debug_mode_name + ". Received: " + mode_to_check.name);
		}

		if (mode_to_check.description != debug_mode_description)
		{
			_throwError("expected en_Core." + debug_mode_name + ".description to contain value: " + debug_mode_description + ". Received: " + mode_to_check.description);
		}

		if (mode_to_check.AddDebugMessage != debugModeMessageFunction)
		{
			_throwError("expected en_Core." + debug_mode_name + ".AddDebugMessage to contain value: " + debugModeMessageFunction + ". Received: " + mode_to_check.AddDebugMessage);
		}

		mode_to_check.AddDebugMessage();
		if (!debug_mode_message_function_works)
		{
			_throwError("en_Core." + debug_mode_name + ".AddDebugMessage() did not execute properly.");
		}

		// CLEAN
		delete mode_to_check;
	}

	/****************************************************************
	 * _addDebugMode()
	 ****************************************************************/
	function _addDebugMode_test()
	{
		var temp = _debug_modes;

		_debug_modes = [];

		var mode_to_check = {
			type: _TYPE_DEBUG_MODE,
			name: "_addDebugMode_test_name",
			description: "_addDebugMode_test_description",
			AddDebugMessage: function(){}
		}

		_addDebugMode(mode_to_check);

		var prefixed_name = _prefixDebugModeName(mode_to_check.name);

		if (en_Core[prefixed_name] !== mode_to_check.name)
		{
			_throwError("TEST FAILED: expected 'en_Core." + prefixed_name + " to contain value: " + mode_to_check.name + ". Received: " + en_Core[prefixed_name]);
		}

		// Time to clean up:
		delete en_Core[prefixed_name];

		delete mode_to_check;

		_debug_modes = temp;

	}
	
	/****************************************************************
	 * en_Core.GetDebugMode()
	 ****************************************************************/
	function GetDebugMode_test()
	{
		// Store current variables
		var temp = _debug_mode;
		
		_debug_mode = "TEST";

		var _retrieved_debug_mode = en_Core.GetDebugMode()
		if (_retrieved_debug_mode != "TEST")
		{
			_throwError("TEST FAILED: expected en_Core.GetDebugMode to return value: " + _debug_mode + ". Received: " + _retrieved_debug_mode);
		}

		_debug_mode = temp;
	}

	/****************************************************************
	 * en_Core.GetCapturedDebugMessages()
	 ****************************************************************/
	function GetCapturedDebugMessages_test()
	{
		temp = _captured_messages;

		_captured_messages = [];

		// Return should be an array:
		if ( !_isArray(en_Core.GetCapturedDebugMessages()) )
		{
			_throwError("TEST FAILED: en_Core.GetCapturedDebugMessages() did not return an array as expected");
		}

		_captured_messages = temp;
	}

	/****************************************************************
	 * en_Core.SetDebugMode()
	 ****************************************************************/
	 function SetDebugMode_test()
	 {
	 	var temp = _debug_mode;

		// Empty sets should not be accepted:
		en_Core.SetDebugMode();

		// testing for 'undefined'.
		// See: var s="a";console.log("s after initiation:",s);var f=function(p){s=p};f();console.log("s after f():",s);console.log(s==undefined);
		if (_debug_mode == undefined)
		{
			_throwError("TEST FAILED: en_Core.SetDebugMode() allows empty calls");
		}

		// Values not in en_Core.DEBUG_MODES should not be accepted:
		en_Core.SetDebugMode("Random string");

		if (_debug_mode == "Random string")
		{
			_throwError("TEST FAILED: en_Core.SetDebugMode() executes values not in en_Core.DEBUG_MODES");
		}

		// Make sure it actually still works.
		en_Core.SetDebugMode(temp.name);

		if (_debug_mode != temp)
		{
			_throwError("TEST FAILED: en_Core.SetDebugMode() expected value: '" + _stringify(temp) + "' but received: '" + _stringify(_debug_mode));
		}

		_debug_mode = temp;
	 }

})();

// OK You can't inject an iterator function into the console log. He'll cut the cord after the first return if you use "f()"
// or it just returns the function itself if you use "f".
/*
	console.log("a", "b", "c");

	var arr = ["a", "b", "c"];

	var _unpack = function(params)
	{
		var i = -1;
		var n = params.length;

		return function _f() {
			i++; 
			if (i < n)
			{
				return params[i], _f();
			}
		}
	}
	var f = _unpack(arr);
	console.log(f());
*/

// I was attempting to apply Lua logic it seems because the following returns "undefined 2" instead of the expected "1 2";
/* 
	var a,b = (function(){return 1,2;})(); console.log(a,b);
*/

// Another problem. We can't just use Array.join(" ") because:
/*
	var arr = []; arr.push("a", "b", 1); var obj = {c:2,d:3}; arr.push(obj);arr.join(" ")
	which returns: "a b 1 [object Object]"
*/

// Why does this not work?!... Wait now it does!
/*
var _functionCaller;
(function _functionCallerChecker()
{
	var _GLOBAL_SCOPE = "Global Scope";

	if (_functionCallerChecker.caller)
	{
		_functionCaller = function(self)
		{
			if (!self) {console.log("undefined self")}
			console.log("self = ", self);
			return self.caller || _GLOBAL_SCOPE;
		}
	}
	else {alert("_functionCaller is 'undefined'.");}
})();
var str="";
function x()
{
	console.log("_functionCaller: ", _functionCaller);
	str=_functionCaller(x);
};
function y()
{
	x()
};
y();
console.log("The actual function: ",str);
*/