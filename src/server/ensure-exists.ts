import * as fs from 'fs';

export default function ensureExists(dir: string) {
    try {
        fs.mkdirSync(dir);
    }
    catch (err) {
        if (err['code'] != 'EEXIST') {
            throw err;
        }
    }
}
