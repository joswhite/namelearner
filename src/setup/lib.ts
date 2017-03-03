export interface IDatabaseEntry {
    name: string,
    phoneNumbers: string,
    address: string,
    picture: string
}

export interface IHouseholdSummary {
    familyMembers: { individualId: number, directoryName: string }[],
    headOfHouseholdId: number,
    coupleName: string
}

export interface IAddress { addr1: string, addr2?: string, addr3?: string }

export interface IEntity {
    individualId: number,
    address: IAddress,
    name: string,
    phone: string,
    email: string,
    filename: string
}

export interface IHouseholdProfile {
    householdInfo: IEntity,
    headOfHousehold: IEntity,
    spouse: IEntity,
    otherHouseholdMembers: IEntity[]
}

export interface ILDSData {
    wardUnitNo: number;
    householdSummaries: IHouseholdSummary[],
    householdProfiles: IHouseholdProfile[]
}

