export function FirstNameFilter() {
    return function(name) {
        return name.split(/\s+/)[0];
    }
}

export function LastNameFilter() {
    return function(name) {
        return name.split(/\s+/).slice(1).join(' ');
    }
}
