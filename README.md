# xd-storage-helper
A little helper to make storing key-value-pairs (e.g. settings) for plugins for Adobe XD CC easier.

It allows to
- Store settings with key-value-pairs
- Retrieve settings (or default values, if nothing was previously saved)
- Reset the settings

## Usage
All functions are static members of the `storageHelper`. Therefore, you simply need to get a reference to it in your code:
```javascript
const storageHelper = require('./lib/storage-helper')
```

After that, you can simply call the different functions on the `storageHelper` class.

## Example
One common example would be to fill form fields in a dialog with previously used values while I won't show the whole boilerplate code for creating the dialog here (please refer to the Adobe XD plugin documentation for that), here is the basic concept of how to do it:

```javascript
const storageHelper = require('./lib/storage-helper')

[...] // Create the dialog, so that you have a reference to your text input with the name myInput

const lastInput = await storageHelper.get('myLastInput', 'my default value'); // Retrieves last input or default 'my default value', if nothing is saved
myInput.value = lastInput;

[...]

function onsubmit() {
  storageHelper.set('myLastInput', myInput.value).then(() => { // Save value when form gets submitted
    dialog.close(myInput.value); // And then close the dialog
  }); 
}
form.onsubmit = onsubmit;
```
