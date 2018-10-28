/*
 * Copyright (c) 2018. by Pablo Klaschka
 */

const storage = require('uxp').storage;
const fs = storage.localFileSystem;

class storageHelper {
    /**
     * Creates a data file if none was previously existent.
     * @return {Promise<storage.File>} The data file
     * @private
     */
    static async init() {
        let dataFolder = await fs.getDataFolder();
        try {
            const file = await dataFolder.getEntry('data.json');
            if (file) { // noinspection JSValidateTypes
                return file;
            }
            else {
                throw new Error('Text Toolbox file data.json was not a file.');
            }

        } catch {
            const file = await dataFolder.createEntry('data.json', {type: storage.types.file, overwrite: true});
            if (file.isFile) {
                await file.write('{}', {append: false});
                // noinspection JSValidateTypes
                return file;
            } else {
                throw new Error('Text Toolbox file data.json was not a file.');
            }
        }
    }

    /**
     * Retrieves a value from storage. Saves default value if none is set.
     * @param {string} key The identifier
     * @param {*} defaultValue The default value. Gets saved and returned if no value was previously set for the speciefied key.
     * @return {Promise<*>} The value retrieved from storage. If none is saved, the `defaultValue` is returned.
     */
    static async get(key, defaultValue) {
        const dataFile = await this.init();
        let object = JSON.parse((await dataFile.read({format: storage.formats.utf8})).toString());
        if (object[key] === undefined) {
            await this.set(key, defaultValue);
            return defaultValue;
        } else {
            return object[key];
        }
    }

    /**
     * Saves a certain key-value-pair to the storage.
     * @param {string} key The identifier
     * @param {*} value The value that get's saved
     * @return {Promise<void>}
     */
    static async set(key, value) {
        const dataFile = await this.init();
        let object = JSON.parse((await dataFile.read({format: storage.formats.utf8})).toString());
        object[key] = value;
        return await dataFile.write(JSON.stringify(object), {append: false, format: storage.formats.utf8})
    }

    /**
     * Resets (i.e. purges) all stored settings.
     * @returns {Promise<void>}
     */
    static async reset() {
        const dataFile = await this.init();
        return await dataFile.write('{}', {append: false, format: storage.formats.utf8})

    }
}

module.exports = storageHelper;
