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
function storeData(event) {
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
  $entriesList.setAttribute('class', 'entries-list');
  data.view = 'entries';
  switchViewTo('entries');
}
$form.addEventListener('submit', storeData);

function prependDOM(event) {
  $entriesUnorderedList.prepend(createEntry(data.entries[0]));
}
$form.addEventListener('submit', prependDOM);

// entries list generation code
var $entriesList = document.querySelector('.entries-list');
var $entriesUnorderedList = document.querySelector('ul');
var $emptyList = document.querySelector('.empty-entry-list');

function createEntry(entry) {
  $emptyList.setAttribute('class', 'hidden');
  var $newEntry = document.createElement('li');
  $newEntry.setAttribute('class', 'entry-container full-flex');

  var $newEntryImageContainer = document.createElement('div');
  $newEntryImageContainer.setAttribute('class', 'column-half image-container no-padding');
  var $newEntryImage = document.createElement('img');
  $newEntryImage.setAttribute('src', entry.pictureLink);
  $newEntryImageContainer.appendChild($newEntryImage);
  $newEntry.appendChild($newEntryImageContainer);

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
  for (var dataLength = 0; dataLength < data.entries.length; dataLength++) {
    $entriesUnorderedList.appendChild(createEntry(data.entries[dataLength]));
  }
}
document.addEventListener('DOMContentLoaded', generateDOM);

// links
var $newEntryButton = document.querySelector('.new-entry-button');
$newEntryButton.addEventListener('click', function (event) { switchViewTo('entry-form'); });
var $entriesLink = document.querySelector('.header-entries-link');
$entriesLink.addEventListener('click', function (event) { switchViewTo('entries'); });

// function switchView(event) {
//   var $activeView = event.target.getAttribute('data-view');
//   for (var j = 0; j < pages.length; j++) {
//     if (pages[j].getAttribute('data-view') === $activeView) {
//       data.view = event.target.getAttribute('data-view');
//       pages[j].className = 'view';
//     } else {
//       pages[j].className = 'view hidden';
//     }
//   }
// }
var pages = document.querySelectorAll('.page');
function switchViewTo(targetPage) {
  for (var j = 0; j < pages.length; j++) {
    if (pages[j].getAttribute('data-view') === targetPage) {
      data.view = targetPage;
      pages[j].className = 'view';
    } else {
      pages[j].className = 'view hidden';
    }
  }
}

// prevent page from refreshing
function showLastViewVisited(event) {
  if (data.view === 'entries') {
    switchViewTo('entries');
  } else if (data.view === 'entry-form') {
    switchViewTo('entry-form');
  }
}
window.addEventListener('DOMContentLoaded', showLastViewVisited);
