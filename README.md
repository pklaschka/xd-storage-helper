# :file_folder: xd-storage-helper

[![Build Status](https://travis-ci.com/pklaschka/xd-storage-helper.svg?branch=master)](https://travis-ci.com/pklaschka/xd-storage-helper)
[![npm version](https://badge.fury.io/js/xd-storage-helper.svg)](https://badge.fury.io/js/xd-storage-helper)
![David](https://img.shields.io/david/pklaschka/xd-storage-helper.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/51782a0bf71f3c02260a/maintainability)](https://codeclimate.com/github/pklaschka/xd-storage-helper/maintainability)


[![NPM](https://nodei.co/npm/xd-storage-helper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/xd-storage-helper/)

---

A little helper to make storing key-value-pairs (e.g. settings) for plugins for Adobe XD CC easier.

It allows to
- Store settings with key-value-pairs
- Retrieve settings (or default values, if nothing was previously saved)
- Reset the settings

## Usage

### Option 1: With a package manager (npm)
If you already use a package manager like npm or yarn and have a bundler like webpack for your plugin, you can simply integrate the helper by running
```
npm install xd-storage-helper
```

or

```
yarn add xd-storage-helper
```

in a terminal inside your project folder. After that, you can simply get a reference to the helper by using

```javascript
const storageHelper = require('xd-storage-helper');
```

and access its static functions (e.g., `storageHelper.set([...])`).

### Option 2: Without a package manager
First, you'll need to copy the `storage-helper.js` file into your project. In this case, it gets inserted in a `lib`-folder (relative to the plugin's root folder). Then, the folder structure should be something like this:

* lib
  * storage-helper.js
* main.js
* mainfest.json

All functions are static members of the `storageHelper`. Therefore, you simply need to get a reference to it in your code (here from the `main.js` file):
```javascript
const storageHelper = require('./lib/storage-helper')
```

After that, you can simply call the different functions on the `storageHelper` class.

## Example
One common example would be to fill form fields in a dialog with previously used values while I won't show the whole boilerplate code for creating the dialog here (please refer to the Adobe XD plugin documentation for that), here is the basic concept of how to do it:

```javascript
const storageHelper = require('./lib/storage-helper') // or const storageHelper = require('xd-storage-helper') if you chose option 1

// [...] Create the dialog, so that you have a reference to your text input with the name myInput

const lastInput = await storageHelper.get('myLastInput', 'my default value'); // Retrieves last input or default 'my default value', if nothing is saved
myInput.value = lastInput; // and sets it as the input's default value

// [...]

function onsubmit() {
  storageHelper.set('myLastInput', myInput.value).then(() => { // Save value when form gets submitted
    dialog.close(myInput.value); // And then close the dialog
  }); 
}
form.onsubmit = onsubmit;

const result = await dialog.showModal();

// [...] Do stuff with the results
```

## Functions reference
Here is a list of the functions you can call:

#### `storageHelper.get(key: string, defaultValue:*): Promise<*>`
Retrieves a value from storage. Saves default value if none is set.

Parameters:
* `key: string`: The identifier (the key of the key-value-pair)
* `defaultValue: *`: The default value. Gets saved and returned if no value was previously set for the speciefied key.

Returns:
Promise for the value retrieved from storage. If none is saved, the `defaultValue` is returned.


#### `storageHelper.set(key: string, value:*): Promise<void>`
Saves a certain key-value-pair to the storage.

Parameters:
* `key: string`: The identifier (the key of the key-value-pair)
* `value: *`: The value that get's saved

Returns:
Promise that resolves when the value got saved successfully

#### `storageHelper.delete(key: string): Promise<void>`
Deletes a certain key-value-pair from the storage

Parameters:
* `key: string`: The identifier (the key of the key-value-pair)

Returns:
Promise that resolves when the value got deleted successfully

#### `storageHelper.reset(): Promise<void>`
Resets (i.e. purges) all stored settings.

Returns:
Promise that resolves when the storage got reset
