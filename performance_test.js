// Definitions:
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

function _isFunction(fnc)
{
	return (typeof fnc === "function");
}

function _isUndefined(value)
{
	return (typeof value === "undefined");
}

// Common functions:
function _getTimeStamp()
{
	return Date.now();
}

function _getFormatizer()
{
	var _formatizer = {};

	var args;

	// This is temporary to speed things up. Should be a property with CRUD and invalidation.
	var supported_types = {
			b: _isBoolean,
			i: _isInteger,
			n: _isNumber,
			s: _isString
		}
	var type_flags = "bins";

	function _addFormatType(flag, typedefinitionTest)
	{
		if (!_isString(flag))
		{
			return;
		}

		if (!_isFunction(typedefinitionTest))
		{
			return;
		}

		type_flags += flag;
		supported_types[flag] = typedefinitionTest;
	}

	// Attempt to find n replace en masse to prevent loops. Hopefully the 'g' modifier is enough
	var pattern = new RegExp("\{@([0-9]+):([a-z])\}", "gi");

	function typeCheckOrBust(match, position, type_flag)
	{
		var insert_value = args[position];

		if (!insert_value)
		{
			// console.log("Formatize parameter mismatch");
			
			return "<parameter mismatch>";
		} 

		var type_check = supported_types[type_flag];

		if (!type_check)
		{
			// console.log("Formatize unsupported type");

			return "<unsupported type>";
		}

		if (!type_check(insert_value))
		{
			// console.log("Formatize type mismatch");

			return "<type mismatch>";
		}

		return insert_value;
	}

	function _formatize(format)
	{
		if (!_isString(format))
		{
			console.log("function '_formatize' expected string as argument #1, received: ", format);

			return false;
		}
		
		args = arguments;

		return format.replace(pattern, typeCheckOrBust);
	}

	_formatizer["Format"] = _formatize;
	_formatizer["AddFormatType"] = _addFormatType;

	return _formatizer;
}

var Formatize = _getFormatizer();

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
		, 2
		, 128
		, 1024
		, 16384
		, 131072
		, 1048576
		, 16777216
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

				// START OF PERFORMANCE TEST FUNCTION \\
				
				test_text = Formatize['Format']("The integer '{@2:i}' is written as \"{@1:s}\"", "one", 1);
				// Formatize("The integer '{@2:i}' is written as \"{@1:s}\"", "one", 1);

				// END OF PERFORMANCE TEST FUNCTION \\

				end = _getTimeStamp();
				
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
		console.log("Ending test number: ", i+1, "\n\r");
	}
})();