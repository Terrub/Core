
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

	Actually, the above is a bit dry and floaty for most people...
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

	var _DEFAULT_FUNCTION = function(){};

	var _DIV = "div";

	var _WORKING_AS_INTENDED = "ERHMERGHERD IT WORKS";
	var _GENERIC_ERROR = '(\\/)\n(x_x)\n(")(")\nDED BUNEH';

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

	(function _functionCallerChecker()
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
				// What version are we at?
				alert("_functionCaller is 'undefined'");
			}
		}
	)();

	/****************************************************************
	 * Error stuff
	 ****************************************************************/

	 // HA! this doesn't work, coz we're initiated in the <head> tag.
	 // At this point the <body> tag does not yet exist.
	 /*
	 	var error_pane = document.createElement(_DIV);
	 	document.body.appendChild(error_pane);
	 */

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
		_error_pane.innerHTML = error_message;

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

	_debug_modes = [];

	var _addDebugMode = function(name, description, add_debug_message_handler)
	{
		// Type checking
		if (!name)
		{
			_throwError("_addDebugMode requires parameter #1: 'name' <string>");
		}

		if (!description)
		{
			_throwError("_addDebugMode requires parameter #2: 'description' <string>");
		}

		// Optional parameter defaults
		if (typeof add_debug_message_handler != _TYPE_FUNCTION)
		{
			add_debug_message_handler = _DEFAULT_FUNCTION;
		}

		// This is perhaps a bit risky?
		name = "DEBUG_MODE_" + name.toUpperCase();

		// Could turn this into a factory function?
		var mode = {
			name: name,
			description: description,
			AddDebugMessage: add_debug_message_handler || _DEFAULT_FUNCTION
		};

		// Right the new mode is ready. Add it to the list.
		
		// Find a suitable spot for it.
		var n = _debug_modes.length;

		// Inject
		_debug_modes[n] = mode;

		// And make sure the outside world can see it.
		en_Core[name] = n;

		return mode;
	}

	var _populateDebugModes = function()
	{
		// Reset for now
		_debug_modes = [];


	}

/*	en_Core.DEBUG_MODE_VERBOSE = {
		description: "spamming console with debug data",
		AddDebugMessage: _captureAndPrintMessage
	};
	en_Core.DEBUG_MODE_NONE = {
		description: "Not debugging or spamming at the moment",
		AddDebugMessage: _DEFAULT_FUNCTION
	}
	en_Core.DEBUG_MODE_SILENT = {
		description: "Registering debug messages but not spamming console",
		AddDebugMessage: _captureMessage
	};*/

	

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

		cap_msg.message = JSON.stringify(args);

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

	en_Core.AddDebugMessage = function()
	{
		// I don't like this thing having to check everytime somebody calls it.
		// We know when we switch debug mode. so just realign the pointer at
		// that point in time. It's like using a clock to check for a value change :(

		/* 
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
			en_Core.AddDebugMessage = _DEFAULT_FUNCTION;
		}
		*/

		// HA! fixed:
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
		_debug_mode = _debug_modes[mode];
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


	/****************************************************************
	 * Contextual stuff
	 ****************************************************************/

	var _initialize = function()
	{
	 	en_Core.AddDebugMessage("Switching to Silent debug mode.");
		en_Core.SetDebugMode(en_Core.DEBUG_MODE_SILENT);
		en_Core.AddDebugMessage("I shouldn't see this now debug mode is set to Silent");

		if (!_error_pane)
		{
			_createErrorPane();
		}

		en_Core.RunTests();

	 	alert(_WORKING_AS_INTENDED);
	}


	/****************************************************************
	 * Event listener stuff for initiation.
	 ****************************************************************/

	 // ERHMERGHERD THIS IS SO FAKKIN DERTEH!!! This requires massive refactorisationalisation!!!

	// If we have an _initialize function declared, we should probably make sure we can run it.
	if (_initialize)
	{
		_addEventListener.call(document, _document_ready_event, function()
		{
			_removeEventListener.call(document, _document_ready_event);

			_initialize();
		});
	}

	en_Core.RunTests = function()
	{
		//#QUESTION: 	How do we know we have full test coverage? Should we register each function in en_Core (The API so
		// 				to speak) and check for each function whether it has a test?


		/****************************************************************
		 * en_Core.DebugMode()
		 ****************************************************************/
		var temp = _debug_mode;
		
		_debug_mode = "TEST";

		//
		if (en_Core.GetDebugMode() != "TEST")
		{
			_throwError("en_Core.GetDebugMode did not return it's expected result");
		}

		_debug_mode = temp;


		/****************************************************************
		 * en_Core.GetCapturedDebugMessages()
		 ****************************************************************/
		temp = _captured_messages;

		_captured_messages = [];

		// Return should be an array:
		if ( !Array.isArray(en_Core.GetCapturedDebugMessages()) )
		{
			_throwError("en_Core.GetCapturedDebugMessages() did not return an array as expected");
		}

		_captured_messages = temp;


		/****************************************************************
		 * en_Core.SetDebugMode()
		 ****************************************************************/
		temp = _debug_mode;

		// Empty sets should not be accepted:
		en_Core.SetDebugMode();

		// testing for 'undefined'.
		// See: var s="a";console.log("s after initiation:",s);var f=function(p){s=p};f();console.log("s after f():",s);console.log(s==undefined);
		if (_debug_mode == undefined)
		{
			_throwError("en_Core.SetDebugMode() allows empty calls");
		}

		// Values not in en_Core.DEBUG_MODES should not be accepted:
		en_Core.SetDebugMode("Random string");

		if (_debug_mode == "Random string")
		{
			_throwError("en_Core.SetDebugMode() executes values not in en_Core.DEBUG_MODES");
		}

		// Make sure it actually still works.
		var mode = en_Core.DEBUG_MODES[0];
		en_Core.SetDebugMode(mode);

		if (_debug_mode != mode)
		{
			_throwError("en_Core.SetDebugMode() does not execute on expected values");
		}

		_debug_mode = temp;

	}

	// I can't just do this, because now I create a snapshot of the current __core and paste that over to en_Core.
	// Any changes made to __core afterwards would not be detected in en_Core -_-.
	// I have to work with the en_Core object directly.
	/*
	en_Core = __core; 
	*/

})();



// OK You can't inject an iterator function into the console log. He'll cut the cord after the first return if you use "f()"
// or it just returns the function itself if you use "f". I'm attempting to apply Lua logic it seems.
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