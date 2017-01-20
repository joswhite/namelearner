/* Download all household info and photos from your lds.org ward directory.
 * Set DEBUG and DEBUG_MAX_HOUSEHOLDS, then test by copying 'test()', run using 'run()'.
 * - Remove 'run()' at end of file before testing.
 * - Important! You cannot simply execute the test() function. You must copy-paste the asynchronous functions manually.
 * - Other Notes:
 *   * Test this before executing it to make sure the lds.org API hasn't changed
 *   * Pause task runner execution by calling taskRunner.pause(), continue by calling taskRunner.execute()
 *   * The photoUrl property is null for individuals or households with no photo.
 *   * A given photo url expires after about 3 minutes (Download it before then)
 */
// TODO: add NO_INTERVAL, INTERVAL, NO_CALLBACK, CALLBACK constants to be used when adding taskRunner tasks
// TODO: when ajax request fails, retry. (At the moment, you must redo it manually, then call taskRunner.execute()
// Test the number of photos downloaded to make sure it is correct:
// photos = 0
// data.householdProfiles.forEach(function(profile) { if (profile.headOfHousehold.filename) { photos++; } } );
// data.householdProfiles.forEach(function(profile) { if (profile.householdInfo.filename) { photos++; } } );
// data.householdProfiles.forEach(function(profile) { if (profile.spouse && profile.spouse.filename) { photos++; } } );
// data.householdProfiles.forEach(function(profile) { if (profile.otherHouseholdMembers) {
// 	profile.otherHouseholdMembers.forEach(function(profile) { if (profile.filename) {photos++;}})
// }});
// photos

// Variables ===========================================================================================================
interface PhotoEntity { photoUrl: string, filename?: string };

var DEBUG = true;
var DEBUG_MAX_HOUSEHOLDS = 200;
var photos = {};
var data = {
	wardUnitNo: null,
	householdSummaries: null,
	householdProfiles: []
};

function resetVariables() {
	taskRunner.clearTasks();
	photos = {};
	data = {
		wardUnitNo: null,
		householdSummaries: null,
		householdProfiles: []
	};
}

// Configure photo and object downloads ================================================================================
var downloadElement = $('<a id="custom-download"></a>');

function downloadPhoto(url, filename) {   // See http://stackoverflow.com/questions/31691679
	if (DEBUG) { console.log('downloading photo: ' + filename + ' (' + url + ')'); }
	if (!url || !filename) {
		throw new Error('downloadPhoto ' + [url, filename].join(' '));
	}
	downloadElement.attr('download', filename);
	downloadElement.attr('href', url);
	downloadElement[0].click();
}

function downloadObject(data, filename) { // See http://stackoverflow.com/questions/11849562
	if (!data || !filename) {
		throw new Error('downloadObject ' + [data, filename].join(' '));
	}

	if(typeof data === 'object') {
		data = JSON.stringify(data, undefined, 2);
	}

	downloadElement.attr('download', filename);
	var blob = new Blob([data], {type: 'text/json'});
	downloadElement.attr('href', window.URL.createObjectURL(blob));
	downloadElement[0].click();
}

// Download info =======================================================================================================
declare var ajaxTrapDataErrorWrapper: {ajaxJson: any};
var ajaxFunction = ajaxTrapDataErrorWrapper.ajaxJson;
var getJSONFunction = $.getJSON;
var api = {
	ward: 'services/web/v3.0/unit/current-user-ward-stake/',
	households: 'services/web/v3.0/mem/household-members/WARD/',
	householdProfile: 'services/web/v3.0/mem/householdProfile/INDIVIDUAL?imageSize=MEDIUM'
};

function getWardUnitNo(callback) {
	ajaxFunction(api.ward, function(data) {
		var wardUnitNo = data.wardUnitNo;
		if (!wardUnitNo) { throw new Error('Data has no ward unit number! ' + JSON.stringify(data)); }
		callback(wardUnitNo);
	});
}

function getHouseholds(wardUnitNo, callback) {
	if (!wardUnitNo) { throw new Error('No ward unit number!'); }
	ajaxFunction(api.households.replace('WARD', wardUnitNo), function(data) {
		if (!data || !data.length) {
			throw new Error('No households data! ' + JSON.stringify(data));
		}
		callback(data);
	});
}

function getHouseholdProfile(householdNo, callback) {
	if (!householdNo) { throw new Error('No household number!'); }
	getJSONFunction(api.householdProfile.replace('INDIVIDUAL', householdNo), function(data) {
		if (!data || typeof data !== 'object') {
			throw new Error('No household profile! ' + JSON.stringify(data));
		}
		callback(data);
	});
}

// Download photos =====================================================================================================
function formatToTwoDigits(number) {
	return (number > 9) ? ''+number : '0'+number;
}

function replaceNonAlphaNumeric(string) {
	var noWhitespace = string.trim().replace(/\s/g, '_');
	return noWhitespace.replace(/\W/g, '-');
}

function addEntityPhoto(lastName, entity) {
    var url = entity.photoUrl;
	if (!url) {
		if (DEBUG) { console.log('No photo url for ' + entity.name); }
		return;
	}

	if (!photos[lastName]) {
		photos[lastName] = [];
	}

	entity.filename = lastName + '_' + formatToTwoDigits(photos[lastName].length);
	var photo = { url: url, filename: entity.filename };
    photos[lastName].push(photo);
    return photo;
}

function addHouseholdPhotos(householdProfile) {
	var profile = householdProfile;

	if (!profile.householdInfo) {
		throw new Error('No household info! ' + JSON.stringify(profile));
	}

	if (!profile.headOfHousehold) {
		throw new Error('No head of household! ' + JSON.stringify(profile));
	}

	var lastName = replaceNonAlphaNumeric(profile.householdInfo.name);

	var entities = [profile.householdInfo, profile.headOfHousehold];
	if (profile.spouse) { entities.push(profile.spouse); }
	if (profile.otherHouseholdMembers) {
		profile.otherHouseholdMembers.forEach(function(member) {
			entities.push(member);
		});
	}

	var photosToDownload = [];
	entities.forEach(function(entity) {
		var photo = addEntityPhoto(lastName, entity);
		if (photo) { photosToDownload.push(photo); }
	});
	return photosToDownload;
}

// Task runner =========================================================================================================
var taskRunner = {
	callback: null,
	lastTimeoutID: null,
	setTimeoutFn: null,
	tasks: [],
	MIN_INTERVAL: 2000,
	MAX_INTERVAL: 5000,
	add: function(taskFunction, useCallback, useInterval) {
		this.tasks.push(this.createTask(taskFunction, useCallback, useInterval));
	},
	addMultipleToFront: function(taskFunctions, useCallback, useInterval) {
		var self = this;
		var tasks = taskFunctions.map(function(taskFunction) {
			return self.createTask(taskFunction, useCallback, useInterval);
		});
		this.tasks = tasks.concat(this.tasks);
	},
	addToFront: function(taskFunction, useCallback, useInterval) {
		this.tasks.unshift(this.createTask(taskFunction, useCallback, useInterval));
	},
	clearTasks: function() {
		this.tasks = [];
	},
	createTask: function(taskFunction, useCallback, useInterval) {
		return { taskFunction: taskFunction, useCallback: useCallback, useInterval: useInterval };
	},
	execute: function() {
		if (this.isEmpty()) {
			if (this.callback) { this.callback(); }
			else { console.error('Finished executing all tasks with no callback function provided!'); }
		} else {
			this.runNextTask();
		}
	},
	runNextTask: function () {
		var task = this.remove();
		if (task.useCallback) {
			var self = this;
			task.taskFunction(function() {
				self.queueNextExecute(task.useInterval);
			});
		}
		else {
			task.taskFunction();
			this.queueNextExecute(task.useInterval);
		}
	},
	isEmpty: function() {
		return (this.tasks.length == 0);
	},
	getNewInterval() {
		return Math.floor(Math.random() * (this.MAX_INTERVAL - this.MIN_INTERVAL) + this.MIN_INTERVAL);
	},
	pause() {
		if (this.lastTimeoutID) {
			clearTimeout(this.lastTimeoutID);
		}
		else {
			throw new Error('Cannot pause execution! No timeoutID provided!');
		}
	},
	queueNextExecute: function (useInterval) {
		if (!useInterval) {
			this.execute();
			return;
		}

		var self = this;
		this.lastTimeoutID = this.setTimeoutFn(function() {
			self.execute();
		}, this.getNewInterval());
	},
	remove: function() {
		return this.tasks.shift();
	},
	start: function(callback, setTimeoutFnOverride) {
		this.callback = callback;
		this.setTimeoutFn = setTimeoutFnOverride || window.setTimeout.bind(window);
		this.execute();
	}
};

// Test ================================================================================================================
function expect(name, a, b) {
	if (a != b) {
		var responses = JSON.stringify(a) + ' to equal ' + JSON.stringify(b);
		throw new Error('failed "' + name + '": expected ' + responses);
	}
	else if (DEBUG) {
		console.log('passed "' + name + '"');
	}
}

function testTaskRunner() {
	taskRunner.clearTasks();
	var obj = {prop: 3};
	var testData = {hi: 4};
	var status = 0;
	var self = this;
	expect('task runner empty at beginning', taskRunner.isEmpty(), true);
	taskRunner.add(fn2.bind(this, obj), true, false);
	taskRunner.addToFront(fn1.bind(this, obj), false, true);
	taskRunner.addMultipleToFront([fnBefore1, fnBefore2], false, false);
	taskRunner.start(tasksFinished, timeout);

	function fn1(obj) {
		expect('task runner function order fn1', status, 2); status++;
		expect('task runner fn1 receives obj', obj.prop, 3);
		expect('task runner fn1 can access local object', testData.hi, 4);
		taskRunner.add(fn3.bind(self, obj), false, false);
		// Timeout function should be called afterwards (tested in timeout below)
	}
	function fn2(obj, callback) {
		expect('task runner function order fn2', status, 4); status++;
		expect('task runner fn2 receives obj', obj.prop, 3);
		expect('task runner fn2 can access local object', testData.hi, 4);
		callback();
	}

	function fn3(obj) {
		expect('task runner function order fn3', status, 5); status++;
		expect('task runner fn3 receives obj', obj.prop, 3);
		expect('task runner fn3 can access local object', testData.hi, 4);
	}

	function fnBefore1(obj) {
		expect('task runner function order fnBefore1', status, 0); status++;
	}

	function fnBefore2(obj) {
		expect('task runner function order fnBefore2', status, 1); status++;
	}

	function tasksFinished() {
		expect('task runner function order tasksFinished', status, 6); status++;
		expect('task runner empty at end', taskRunner.isEmpty(), true);
		console.log('Task runner test finished!');
	}

	function timeout(fn, interval) {
		expect('task runner function order timeout', status, 3); status++;
		expect('task function min generated interval', interval < taskRunner.MIN_INTERVAL, false);
		expect('task function max generated interval', interval > taskRunner.MAX_INTERVAL, false);
		fn();
		return null;
	}
}

function executeAutomatedTests() {
	// Test: Download photos (parts 1 and 2)
	// Part 1 - Helpers
	expect('format single digit', formatToTwoDigits(2), '02');
	expect('format double digit', formatToTwoDigits(15), '15');
	expect('trim whitespace', replaceNonAlphaNumeric('   5a5c '), '5a5c');
	expect('replace whitespace', replaceNonAlphaNumeric('5a 5c'), '5a_5c');
	expect('replace whitespace globally', replaceNonAlphaNumeric('5a   5c'), '5a___5c');
	expect('replace nonalphanumeric', replaceNonAlphaNumeric('5a$5c'), '5a-5c');
	expect('replace nonalphanumeric globally', replaceNonAlphaNumeric('a`~!%&'), 'a-----');
	// Part 2 - Queueing photo for download
	var entity: PhotoEntity = { photoUrl: 'b42' };
	resetVariables();
	expect('add photo to entity - photo object empty length', photos['white24'], undefined);
	addEntityPhoto('white24', entity);
	expect('add photo to entity - entity filename', entity.filename, 'white24_00');
	expect('add photo to entity - photo object begin length', photos['white24'].length, 1);
	expect('add photo to entity - photo object url property', photos['white24'][0].url, 'b42');
	expect('add photo to entity - photo object filename property', photos['white24'][0].filename, 'white24_00');
	addEntityPhoto('white24', entity);
	expect('add photo to entity - photo object continuing length', photos['white24'].length, 2);

	// Test: Task runner
	testTaskRunner();
}

function test() {
	// Test: Downloader functions
	// 1. Populate the test photo url: Go to 'Network' and right-click on any member photo
	//    (filename MEDIUM) > Copy > Copy link address
	var url = 'https://www.lds.org/api/mlu/scdn/v2/img/dc5c15c6-03f8-4200-b7fd-59def66f2653/MEDIUM';
	downloadPhoto(url, 'test1');
	downloadObject({ id: 2, info: [1, 5, 9] }, 'test2.json');
	// 2. Verify downloaded photo and object: check content and filename extensions (jfif, json)

	// Test: Info functions
	var wardUnitNo;
	getWardUnitNo(function(unit) { console.log(unit); wardUnitNo = unit; });
	// 3. Verify ward unit number is printed to screen
	var households;
	getHouseholds(wardUnitNo, function(members) { console.log(members); households = members; });
	// 4. Verify households are printed to screen
	var id = households[0].headOfHouseholdId;
	var householdProfile;
	getHouseholdProfile(id, function(profile) { console.log(profile); householdProfile = profile; });
	// 5. Verify household profile is printed to screen

	// Test: Download photos parts 1 & 2; task runner
	executeAutomatedTests();
	// 6. Verify there are no errors from these tests

	// Test: Download photos part 3
	// Queueing household photos for download
	resetVariables();
	addHouseholdPhotos(householdProfile);
	console.log(JSON.stringify(photos, undefined, 2));
	console.log(JSON.stringify(householdProfile, undefined, 2));
	// 7. Verify photos is populated with 3+ {url, filename} objects; also verify householdProfile is populated
	//    with filename for each of the same entities (householdInfo, headOfHousehold, spouse, otherHouseholdMembers
}

// Run =================================================================================================================
function setWard(callback) {
	getWardUnitNo(function(wardUnitNo) {
		if (DEBUG) { console.log('got ward: ' + wardUnitNo); }
		data.wardUnitNo = wardUnitNo;
		callback();
	});
}

function setHouseholds(callback) {
	if (!data.wardUnitNo) { throw new Error('setHouseholds has no ward unit number available!'); }
	getHouseholds(data.wardUnitNo, function(households) {
		if (DEBUG) { console.log('got households: ' + households.length); }
		data.householdSummaries = households;
		callback();
	});
}

function downloadHouseholds(callback) {
	if (DEBUG) { console.log('setting household profiles...'); }
	if (!data.householdSummaries || !data.householdSummaries.length) {
		throw new Error('downloadHouseholds has no householdSummaries available!');
	}
	var taskFunctions = [];
	data.householdSummaries.forEach(function(summary) {
		taskFunctions.push(downloadHousehold.bind(null, summary));
	});
	taskRunner.addMultipleToFront(taskFunctions, true, true);

	callback();
}

function downloadHousehold(householdSummary, callback) {
	if (!householdSummary) { throw new Error('downloadHousehold has no householdSummary available!'); }
	var id = householdSummary.headOfHouseholdId;
	getHouseholdProfile(id, function(profile) {
		if (DEBUG) { console.log('got profile: ' + profile.householdInfo.name); }
		data.householdProfiles.push(profile);

		var photosToDownload = addHouseholdPhotos(profile);
		var taskFunctions = [];
		photosToDownload.forEach(function(photo) {
			taskFunctions.push(downloadPhoto.bind(null, photo.url, photo.filename));
		});
		taskRunner.addMultipleToFront(taskFunctions, false, true);

		callback();
	});
}

function downloadData() {
	if (!data.wardUnitNo || data.householdSummaries.length==0 || data.householdProfiles.length==0) {
		throw new Error('Cannot save data! Incomplete.');
	}
	if (DEBUG) { console.log('downloading data'); }
	downloadObject(data, 'data.json');
}

function run() {
	resetVariables();
	taskRunner.add(setWard, true, true);
	taskRunner.add(setHouseholds, true, true);
	taskRunner.add(downloadHouseholds, true, true);
	taskRunner.add(downloadData, false, true);
	taskRunner.start(function() { console.log('Finished retrieving all data and photos!'); }, null);
}

run();