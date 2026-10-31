/**
 * Here's how this file works.
 * 
 * 1. Make sure a copy of this file is in your production environment with the
 *    variable set to true.
 * 
 * 2. Make sure a copy of this file is in your development environments with
 *    the variable set to false.
 * 
 * 3. Use .gitignore etc to prevent changes to this file in both environments.
 * 
 * 4. Have this script get loaded somewhere, such as in your App or your HTML.
 * 
 */

const IS_PROD = true;

if (IS_PROD) {
	// Overwrites console.log so that nothing can use it.
	// Note that this will not prevent uncaught Errors from logging.
	console.log = function() {};
}

export default IS_PROD;