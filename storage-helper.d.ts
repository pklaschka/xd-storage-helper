/*
 * Copyright (c) 2018 by Pablo Klaschka
 */

/**
 * The xd-storage-helper module
 * @module xd-storage-helper
 */
declare module 'xd-storage-helper' {
    /**
     * @class StorageHelper
     * The main LocalizationHelper class
     * @alias module:xd-storage-helper
     * @static
     * @hideconstructor
     */
    export default class StorageHelper {
        /**
         * Retrieves a value from storage. Saves default value if none is set.
         * @param {string} key The identifier
         * @param {*} defaultValue The default value. Gets saved and returned if no value was previously set for the speciefied key.
         * @return {Promise<*>} The value retrieved from storage. If none is saved, the `defaultValue` is returned.
         */
        public static get(key:string, defaultValue:any): Promise<any>;

        /**
         * Saves a certain key-value-pair to the storage.
         * @param {string} key The identifier
         * @param {*} value The value that get's saved
         * @return {Promise<void>}
         */
        public static set(key: string, value:any): Promise<void>;

        /**
         * Deletes a certain key-value-pair from the storage
         * @param {string} key The key of the deleted pair
         * @return {Promise<void>}
         */
        public static delete(key: string): Promise<void>;

        /**
         * Resets (i.e. purges) all stored settings.
         * @returns {Promise<void>}
         */
        public static reset(): Promise<void>;
    }
}