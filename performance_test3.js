// This would be core stuff:
function _isUndefined(value)
{
	return (typeof value === "undefined");
}

function _isNumber(num)
{
	return (typeof num === "number");
}

function _getTimeStamp()
{
	return Date.now();
}

var validator = (function()
{
	var _validator = {};

	var _current_chain_link;

	var _VALIDATOR_STATE_IDLE = "_validator_state_idle";
	var _VALIDATOR_STATE_VALIDATING = "_validator_state_validating";
	var _VALIDATOR_STATE_INITIATED = "_validator_state_initiated";

	var _validator_state = _VALIDATOR_STATE_IDLE;

	var _timer;

	var _frames_per_second = 60;
	var _seconds_per_frame = 1 / _frames_per_second;

	var _interval_unit = 1000 // Milliseconds
	var _interval_per_frame = _seconds_per_frame * _interval_unit;
		
	function _isActiveTimer (timer)
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

		function intervalExecution()
		{
			_validateProperties(_interval_per_frame);
		}

		// Now we're officially validating.
		_validator_state = _VALIDATOR_STATE_VALIDATING;

		// So get the timer started so we can empty the validation chain.
		_timer = setInterval(intervalExecution, _interval_per_frame);

		console.log("started timer: ", _timer);
	}

	// In here we need to iteratively do the first things on our to-do list till it's empty, or we
	// ran out of time.
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


	_validator.InitiateValidation = function()
	{
		_initiateValidation();
	}

	return _validator;
})();

// function _addProperty(name, validationFunction)
// {
// 	if (!_isString(name))
// 	{
// 		console.log("function '_addProperty' expected string as argument #1, received: ", name);

// 		return false;
// 	}

// 	if (!_isFunction(validationFunction))
// 	{
// 		console.log("function '_addProperty' expected function as argument #2, received: ", validationFunction);

// 		return false;
// 	}

// 	var property = {
// 		name: name,
// 		validator: validationFunction,
// 		state: _PROPERTY_STATE_INITIATED,
// 		invalidation_calls: 0
// 	}

// 	_property_list[name] = property;

// 	_invalidateProperty(name);
// }

// function _invalidateProperty(property_name)
// {
// 	var property = _property_list[property_name];

// 	if (!property)
// 	{
// 		console.log("Attempt to invalidate unknown property: ", property_name);

// 		return false;
// 	}

// 	property.invalidation_calls++;

// 	if (property.state == _PROPERTY_STATE_INVALIDATED)
// 	{
// 		// No need to invalidate it again.
// 		return;
// 	}

// 	// Add it to the to-do chain so we know that we need to do something with it later.
// 	_addPropertyToChain(property);

// 	// Set the invalid flag inside the property itself as well.
// 	property.state = _PROPERTY_STATE_INVALIDATED;

// 	// Wake up our validator if it's sleeping again.
// 	_initiateValidation();
// }

// function _validateProperty(property_name)
// {
// 	var property = _property_list[property_name];

// 	if (!property)
// 	{
// 		console.log("Attempt to validate unknown property: ", property);

// 		return;
// 	}

// 	var validator = property.validator;
	
// 	if (!_isFunction(validator))
// 	{
// 		console.log("Attempt to call non-functional validator: ", validator);

// 		return;
// 	}

// 	validator();

// 	property.state = _PROPERTY_STATE_VALIDATED;

// 	_removePropertyFromChain(property);

// 	console.log("Number of invalidations prior to validating '" + property_name + "': " + property.invalidation_calls);

// 	property.invalidation_calls = 0;
// }

(function performance_test()
{
	var total_execution_time = 0;
	var average_execution_time = 0;
	var maximum_execution_time = 15000; // 15 seconds.

	var start;
	var end;
	var execution_time;
	var number_of_iterations;

	var iteration_tests = [
		1
		, 10
		, 100
		, 1000
		, 10000
		, 100000
		, 1000000 // million
		, 10000000
		, 100000000
	];
	//console.log("iteration_tests: ",iteration_tests);
	var number_of_test_iterations = iteration_tests.length;
	//console.log("number_of_test_iterations: ", number_of_test_iterations);
	for (var i = 0; i < number_of_test_iterations; i++)
	{
		number_of_iterations = iteration_tests[i];
		
		console.log("Starting test number: ", i+1);
		
		total_execution_time = 0;

		for (var j = 0; j < number_of_iterations; j++)
		{
			try
			{
				start = _getTimeStamp();
			
				functionToTest_1();

				end = _getTimeStamp()
				
				execution_time = end - start;

				total_execution_time += execution_time;

				// 15 seconds execution time out limit.
				if (total_execution_time >= maximum_execution_time)
				{
					console.log("maximum_execution_time: ", maximum_execution_time, "ms");
					console.log("Aborted at iteration: ", j);

					number_of_iterations = (j + 1);

					break;
				}
			}
			catch(e)
			{
				console.log("Error detected. Aborting.");
				return;
			}
		}

		average_execution_time = total_execution_time / number_of_iterations;

		console.log("total_execution_time: ", total_execution_time, "ms");
		console.log("number_of_iterations: ", number_of_iterations);
		console.log("average_execution_time: ", average_execution_time, "ms");
		console.log("Ending test number: ", i+1, "\n");
	}

	function functionToTest_1()
	{
		validator.InitiateValidation();
	}
})();