/* global data */
/* exported data */

// photo url and preview photo code
var $photoUrl = document.querySelector('.photoUrl');
var $previewPhoto = document.querySelector('.preview-photo');
function updateSRC(event) {
  $previewPhoto.src = $photoUrl.value;
}

$photoUrl.addEventListener('input', updateSRC);

// save button interactions code
var $form = document.forms[0];
function retrieveData(event) {
  event.preventDefault();
  var dataEntry = {};
  dataEntry.title = $form.elements.title.value;
  dataEntry.pictureLink = $form.elements.photoUrl.value;
  dataEntry.notes = $form.elements.notes.value;
  dataEntry.entryId = data.nextEntryId;
  data.entries.unshift(dataEntry);
  data.nextEntryId++;
  $form.reset();
  $previewPhoto.src = 'images/placeholder-image-square.jpg';
}
$form.addEventListener('submit', retrieveData);

// entries code
var $entriesList = document.querySelector('ul');
var $emptyList = document.querySelector('.empty-entry-list');

function createEntry(entry) {
  var $newEntry = document.createElement('li');
  $newEntry.setAttribute('class', 'entry-container full-flex');

  var $newEntryImage = document.createElement('img');
  $newEntryImage.setAttribute('class', 'column-half object-fit-contain object-position-start');
  $newEntryImage.setAttribute('src', entry.pictureLink);
  $newEntry.appendChild($newEntryImage);

  var $newEntryTextDiv = document.createElement('div');
  $newEntryTextDiv.setAttribute('class', 'column-half entry-text');

  var $newEntryTitle = document.createElement('h2');
  var $newEntryTitleText = document.createTextNode(entry.title);
  $newEntryTitle.setAttribute('class', 'entry-title-text');
  $newEntryTitle.appendChild($newEntryTitleText);
  $newEntryTextDiv.appendChild($newEntryTitle);

  var $newEntryNotes = document.createElement('p');
  var $newEntryNotesText = document.createTextNode(entry.notes);
  $newEntryNotes.setAttribute('class', 'entry-notes-text');
  $newEntryNotes.appendChild($newEntryNotesText);
  $newEntryTextDiv.appendChild($newEntryNotes);

  $newEntry.appendChild($newEntryTextDiv);
  return $newEntry;
}

function generateDOM(event) {
  $emptyList.setAttribute('class', 'hidden');
  for (var dataLength = 0; dataLength < data.entries.length; dataLength++) {
    $entriesList.appendChild(createEntry(data.entries[dataLength]));
  }
}

document.addEventListener('DOMContentLoaded', generateDOM);
