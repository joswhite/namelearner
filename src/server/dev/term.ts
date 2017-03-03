import fs = require('fs');
import { ClientError } from './logger';

var readcommand = require('readcommand');
var colors = require('colors');
var debug: any = require('debug')('console');
var HISTORY_SIZE = 15;
var historyFile = './temp/consoleHistory.log';
var history;
var evalFn = null;
var contexts: any = {};
var term: any = {err: null, alog: alog, vlog: vlog,
	context: switchContexts, contexts: contexts
};

//Start the console
start();

//Set up exports
export = addContext;

/**
 * Add the eval context to those we have; switch to it
 * @param {Function} givenEval The eval function
 * @param {string}   namespace The module name for the eval
 */
function addContext(givenEval: Function, namespace: string) {
	contexts[namespace] = givenEval;
	setContext(namespace);
	return term;
}

/**
 * Switch to the given eval context
 * @param {any} context The name of the module to switch to, or its index
 */
function switchContexts(context: any): any {
	var contextArray: string[] = Object.keys(contexts);
	if (typeof context == 'number' && context < contextArray.length)
		return setContext(contextArray[context]);
	else if (contexts[context])
		return setContext(context);
	else {
		var item: string = findInContexts(context);
		if (item)
			return setContext(item);
		else
			throw new Error('Error: No context ' + context + ' exists!');
	}
}

//Find a context that contains the given string
function findInContexts(context: string): string {
	if (typeof context != 'string')
		return null;

	var match = null;
	var items: string[] = Object.keys(contexts);
	items.forEach(function(item: string) {
		if (item.indexOf(context) != -1)
			match = item;
	});
	return match;
}

//Actually switch the context
function setContext(namespace: string) {
	evalFn = contexts[namespace];
	var keys: string[] = Object.keys(evalFn('exports'));
	return (' ' + namespace + ' ').yellow + keys.join(', ').blue.bold;
}

/**
 * Start the console prompt
 * @param {Function} givenEval The eval function for the module (or null, if one will not be used)
 * @param {string}   context   Name of module to add to context.
 */
function start() {
	//Set up 'evalFn' context
	addContext(function(expr: string) { return eval(expr); }, 'term');

	//Read history from file
	try {
		history = fs.readFileSync(historyFile).toString().split('\n');
	} 
	catch(err) {
		console.log('Info: could not read history from file');
		history = [];
	}

	//Prompt user for input and execute it
	readcommand.loop({'history': history}, executeCommand);	
}

//Execute input from user (called by readcommand module)
function executeCommand(error: ClientError, args: string[], str: string, next: Function) {
	if (error)
		handleErr(error);
	else {
		try {
			if (str.charAt(str.length - 1) == ';') { //A ';' surpresses console output of result
				if (evalFn)
					evalFn(str);
				else
					eval(str);
			}	
			else if (str.length) {
				if (evalFn)
					console.log(evalFn(str));
				else
					console.log(eval(str));
			}
		}
		catch (e) {
			console.log('Error'.bgBlue.red + ': '.magenta + e.message.red);
			term.err = e.stack;
		}
	}

	writeHistory();
	next();
}

//Handle an error (quit if CTRL^C and write history to file)
function handleErr(err: ClientError) {
	if (err.code == 'SIGINT') {
		writeHistory();
		process.exit(0);
	}
	else
		console.log('Prompt error - ' + err.message ? err.message.red : err);
}

function writeHistory() {
	var fileContents: string = '';
	for (var i: number = Math.max(history.length - HISTORY_SIZE, 0); i < history.length; i++) {
		if (history[i].length)
			fileContents = fileContents + history[i] + '\n';
	}
	fs.writeFileSync(historyFile, fileContents);
}

/**
 * Log function with same arguments as those in 'async' library
 * @param {ClientError} err    The error, if exists
 * @param {any}         result The result, if exists
 */
function alog(err: ClientError, result: any) {
    console.log('Error: ' + (err && err.message ? err.message.red : '-'),
    			'\nResult: ' + (result ? JSON.stringify(result).green : '-'));
}

/**
 * Log function with variable number of arguments
 */
function vlog() {
	console.log(JSON.stringify(Array.prototype.slice.call(arguments), null, 1).yellow);
}
