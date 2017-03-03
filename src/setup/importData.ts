import { IAddress, IEntity, IHouseholdProfile, ILDSData, IDatabaseEntry } from './lib';
var jsonfile = require('jsonfile');

// Convert LDS.org raw data to namelearner data for mongoDB.
const inputFile = 'temp/data/data.json';
const outputFile = 'temp/data/formatted-data.json';
let individuals: IDatabaseEntry[] = [];
let peopleData: ILDSData = jsonfile.readFileSync(inputFile);

processData();
console.log('Processed ' + individuals.length + ' individuals and families.');
jsonfile.writeFileSync(outputFile, individuals, {spaces: 2});
console.log('Successfully saved results to ' + outputFile);


// Helper functions
function processData() {
	const profiles = peopleData.householdProfiles;
	profiles.forEach((profile: IHouseholdProfile) => {
		profile.householdInfo.name += " Family";
		let address = getAddress(profile.householdInfo.address);
		processEntity(profile.householdInfo, address);
		processEntity(profile.headOfHousehold, address);
		processEntity(profile.spouse, address);
		profile.otherHouseholdMembers.forEach((member: IEntity) => {
			processEntity(member, address);
		});
	});
}

function processEntity(entity: IEntity, address: string) {
	if (!entity) { return; }
	let individual: IDatabaseEntry = {
		name: entity.name,
		phoneNumbers: entity.phone,
		address: address,
		picture: entity.filename
	};
	individuals.push(individual);
}

function getAddress(addr: IAddress): string {
	if (!addr) { return null; }
	let addresses: string[] = [];
	if (addr.addr1) { addresses.push(addr.addr1); }
	if (addr.addr2) { addresses.push(addr.addr2); }
	if (addr.addr3) { addresses.push(addr.addr3); }
	return addresses.join('\n');
}
