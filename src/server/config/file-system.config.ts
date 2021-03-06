import * as fs from 'fs';
import * as path from 'path';


export const CONTENT_DIR = path.join(process.cwd(), 'dist/client');
export const DEFAULT_PERSON_PICTURE = 'default.jpg';
export const IMAGES_DIR = path.join(CONTENT_DIR, 'images');
export const PEOPLE_IMAGES_DIR = path.join(IMAGES_DIR, 'people');
export const PEOPLE_IMAGES_WEB = 'images/people';

function ensureExists(dir: string) {
    try {
        fs.mkdirSync(dir);
    }
    catch (err) {
        if (err['code'] != 'EEXIST') {
            throw err;
        }
    }
}

export function initialize() {
    ensureExists(IMAGES_DIR);
    ensureExists(PEOPLE_IMAGES_DIR);
}