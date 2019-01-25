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

        it('should call init() without any errors', async done => {
            const storageHelper = require('../storage-helper');
            // noinspection JSAccessibilityCheck
            expect(await storageHelper.init()).toBeDefined();
            done();
        });
    });

    describe('storageHelper.get()', ()=>{
        it('should call get() without any errors', async (done) => {
            const storageHelper = require('../storage-helper');
            expect(await storageHelper.get('a', 3)).toBe(5);
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
    });

    describe('storageHelper.set()', () => {
        it('should override the value if one was previously stored', async done => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.set('a',-5);
            expect(await storageHelper.get('a', undefined)).toBe(-5);
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            done();
        });

        it('should create a new value if the key wasn\'t previously stored', async done => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.set('b',-5);
            expect(await storageHelper.get('b', undefined)).toBe(-5);
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(2);
            done();
        });
    });

    describe('storageHelper.delete()', () => {
        it('should delete a previously stored value', async done => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.delete('a');
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(0);
            done();
        });

        it('should ignore a key that wasn\'t previously stored', async done => {
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            const storageHelper = require('../storage-helper');
            await storageHelper.delete('d');
            expect(Object.keys(JSON.parse(mockFileContents)).length).toBe(1);
            done();
        });
    });

    describe('storageHelper in special situations', () => {
        it('should correctly handle calling reset()', async (done) => {
            const storageHelper = require('../storage-helper');
            await (storageHelper.reset());
            expect(mockFileContents).toBe('{}');
            done();
        });

        it('should behave correctly even if no file exists', async done => {
            const storageHelper = require('../storage-helper');
            mockFileExists = false;
            expect(mockFileExists).toBe(false);
            expect(await storageHelper.get('unknown', 111)).toBe(111);
            expect(await storageHelper.get('unknown', 5)).toBe(111);
            expect(mockFileExists).toBe(true);
            done();
        });
    });
});