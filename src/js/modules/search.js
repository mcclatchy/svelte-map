// SOURCE: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// SOURCE: https://www.googlecloudcommunity.com/gc/Apigee/Searching-for-a-substring-in-a-json-object-using-node-js-script/m-p/20783
export function searchArrayOfObjects(substring, arrayOfObjects, indexes=[], minCharacters=1) {
  if (substring.length <= minCharacters) {
    return arrayOfObjects
  }
  var found = [];
  var re = new RegExp(escapeRegExp(substring), 'i');
  arrayOfObjects.forEach(function(item, ix) {
    Object.keys(item).forEach(function(key) {
      if (typeof item[key] !== 'string') return;
      if (indexes.length > 0 && !indexes.includes(key)) return;
      if (re.test(item[key])) {
        if (found.indexOf(ix) === -1) { found.push(arrayOfObjects[ix]); }
      }
    });
  });
  return found;
}

