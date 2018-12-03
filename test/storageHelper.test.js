let mockFileContents = '{"a":5}';
let mockFileExists = true;

jest.mock('uxp', () => {
    return {
        storage: {
            formats: {
                utf8: 'utf8'
            },
            localFileSystem: {
                getDataFolder: () => {
                    mockFileExists = true;
                    return {
                        createEntry: (name, options) => {
                            return {
                                read: () => {
                                    return mockFileContents
                                },
                                write: (contents) => {
                                    mockFileContents = contents;
                                },
                                isFile: () => true
                            }
                        },
                        getEntry: (name) => {
                            return mockFileExists ? {
                                read: () => {
                                    return mockFileContents
                                },
                                write: (contents) => {
                                    mockFileContents = contents;
                                },
                                isFile: () => true
                            } : null;
                        }
                    };
                }
            }
        }
    }
}, {virtual: true});

describe('storage helper', () => {
    beforeEach(() => {
        mockFileContents = '{"a":5}';
        mockFileExists = true;
    });

    it('should load without any errors', () => {
        const storageHelper = require('../storage-helper');
    });

    it('should call init() without any errors', () => {
        const storageHelper = require('../storage-helper');
        expect(storageHelper.init()).toBeDefined();
    });

    it('should call get() without any errors', async (done) => {
        const storageHelper = require('../storage-helper');
        expect(await storageHelper.get('a', 3)).toBe(5);
        done();
    });

    it('should correctly handle calling reset()', async (done) => {
        const storageHelper = require('../storage-helper');
        await (storageHelper.reset());
        expect(mockFileContents).toBe('{}');
        done();
    });

    it('should return the default value if no other is it wasn\'t defined before', async done => {
        const storageHelper = require('../storage-helper');
        expect(await storageHelper.get('unknown', 3)).toBe(3);
        done();
    });

    it('should save the default value if no other is it wasn\'t defined before', async done => {
        const storageHelper = require('../storage-helper');
        expect(await storageHelper.get('unknown', 3)).toBe(3);
        expect(await storageHelper.get('unknown', 5)).toBe(3);
        done();
    });

    it('should behave correctly even if no file exists', async done => {
        const storageHelper = require('../storage-helper');
        mockFileExists = false;
        expect(mockFileExists).toBe(false);
        await storageHelper.init();
        expect(mockFileExists).toBe(true);
        done();
    });
});