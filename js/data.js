/* exported data */

var data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1
};

var previousDataJSON = localStorage.getItem('local-journal');
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function storeLocal(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('local-journal', dataJSON);
}
window.addEventListener('beoreunload', storeLocal);
