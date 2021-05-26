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
                        createEntry: async () => {
                            return await {
                                read: () => {
                                    return mockFileContents
                                },
                                write: (contents) => {
                                    mockFileContents = contents;
                                },
                                isFile: () => true
                            }
                        },
                        getEntry: async () => {
                            return await mockFileExists ? {
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

    describe('storageHelper', () => {
        it('should load without any errors', () => {
            const storageHelper = require('../storage-helper');
            expect(storageHelper).toBeDefined()
        });

        it('should call init() without any errors', async () => {
            const storageHelper = require('../storage-helper');
            // noinspection JSAccessibilityCheck
            expect(await storageHelper.init()).toBeDefined();
        });
    });

    describe('storageHelper.get()', ()=>{
        it('should call get() without any errors', async () => {
            const storageHelper = require('../storage-helper');
            expect(await storageHelper.get('a', 3)).toBe(5);
        });

        it('should return the default value if no other is it wasn\'t defined before', async () => {
            const storageHelper = require('../storage-helper');
            expect(await storageHelper.get('unknown', 3)).toBe(3);
        });

        it('should save the default value if no other is it wasn\'t defined before', async () => {
            const storageHelper = require('../storage-helper');
            expect(await storageHelper.get('unknown', 3)).toBe(3);
            expect(await storageHelper.get('unknown', 5)).toBe(3);
        });
    });

    describe('storageHelper.set()', () => {
        it('should override the value if one was previously stored', async () => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.set('a',-5);
            expect(await storageHelper.get('a', undefined)).toBe(-5);
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
        });

        it('should create a new value if the key wasn\'t previously stored', async () => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.set('b',-5);
            expect(await storageHelper.get('b', undefined)).toBe(-5);
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(2);
        });
    });

    describe('storageHelper.delete()', () => {
        it('should delete a previously stored value', async () => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.delete('a');
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(0);
        });

        it('should ignore a key that wasn\'t previously stored', async () => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.delete('d');
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
        });
    });

    describe('storageHelper in special situations', () => {
        it('should correctly handle calling reset()', async () => {
            const storageHelper = require('../storage-helper');
            await (storageHelper.reset());
            expect(mockFileContents).toBe('{}');
        });

        it('should behave correctly even if no file exists', async () => {
            const storageHelper = require('../storage-helper');
            mockFileExists = false;
            expect(mockFileExists).toBe(false);
            expect(await storageHelper.get('unknown', 111)).toBe(111);
            expect(await storageHelper.get('unknown', 5)).toBe(111);
            expect(mockFileExists).toBe(true);
        });
    });
});
