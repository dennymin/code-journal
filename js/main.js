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
var $saveButton = document.querySelector('.save-button');
function createDataEntry(formTemplate) {
  var dataEntry = {
    title: formTemplate.title.value,
    pictureLink: formTemplate.photoUrl.value,
    notes: formTemplate.notes.value
  };
  if (data.editing === null) {
    dataEntry.entryId = data.nextEntryId;
    data.nextEntryId++;
  } else {
    dataEntry.entryId = data.editing;
  }
  return dataEntry;
}
function storeData(event) {
  event.preventDefault();
  if (data.editing === null) {
    var tempEntry = createDataEntry($form.elements);
    data.entries.unshift(tempEntry);
    resetFormAndPicture();
    $entriesList.setAttribute('class', 'entries-list');
    switchViewTo('entries');
    var newDataEntry = data.entries[0];
    prependDOM(newDataEntry);
  } else {
    var updatedEntry = {};
    for (var dataEntriesIndex2 = 0; dataEntriesIndex2 < data.entries.length; dataEntriesIndex2++) {
      if (data.editing === data.entries[dataEntriesIndex2].entryId.toString()) {
        updatedEntry = createDataEntry($form.elements);
        data.entries[dataEntriesIndex2] = updatedEntry;
        var $updatedEntry = createEntry(updatedEntry);
        $updatedEntry.setAttribute('data-entry-id', updatedEntry.entryId);
        for (var childElementIndex = 0; childElementIndex < $entriesUnorderedList.children.length; childElementIndex++) {
          if ($entriesUnorderedList.children[childElementIndex].getAttribute('data-entry-id') === updatedEntry.entryId) {
            $entriesUnorderedList.children[childElementIndex].replaceWith($updatedEntry);
          }
        }
        switchViewTo('entries');
        data.entries.splice(dataEntriesIndex2, 1, updatedEntry);
      }
    }
    data.editing = null;
  }
}
$saveButton.addEventListener('click', storeData);

function prependDOM(selectEntry) {
  var $newestEntry = createEntry(selectEntry);
  $newestEntry.setAttribute('data-entry-id', selectEntry.entryId);
  $entriesUnorderedList.prepend($newestEntry);
}

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

  var $editEntryIconButton = document.createElement('button');
  $editEntryIconButton.className = ('float-right pen-button');
  var $editEntryIcon = document.createElement('i');
  $editEntryIcon.className = 'fas fa-pen';
  $editEntryIconButton.appendChild($editEntryIcon);
  $newEntryTitle.appendChild($editEntryIconButton);

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
    var $appendedEntry = createEntry(data.entries[dataLength]);
    $appendedEntry.setAttribute('data-entry-id', data.entries[dataLength].entryId);
    $entriesUnorderedList.appendChild($appendedEntry);
  }
}
document.addEventListener('DOMContentLoaded', generateDOM);

// links
var $newEntryButton = document.querySelector('.new-entry-button');
$newEntryButton.addEventListener('click', retrieveTargetLink);
var $entriesLink = document.querySelector('.header-entries-link');
$entriesLink.addEventListener('click', retrieveTargetLink);

function retrieveTargetLink(event) {
  var destination = event.target.getAttribute('data-view');
  switchViewTo(destination);
  data.editing = null;
  resetFormAndPicture();
}

function resetFormAndPicture() {
  $form.reset();
  $previewPhoto.src = 'images/placeholder-image-square.jpg';
}

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
  switchViewTo(data.view);
}
window.addEventListener('DOMContentLoaded', showLastViewVisited);

// listening for clicks on the parent element of all rendered entries
// we need to get the value of the selected data entry
function editButtonListener(event) {
  if (event.target && event.target.nodeName === 'I') {
    var $parentEntryContainer = event.target.closest('.entry-container');
    data.editing = $parentEntryContainer.getAttribute('data-entry-id');
    var $entryNeedsEditing = {};
    for (var dataEntriesIndex = 0; dataEntriesIndex < data.entries.length; dataEntriesIndex++) {
      if (data.editing === data.entries[dataEntriesIndex].entryId.toString()) {
        $entryNeedsEditing = data.entries[dataEntriesIndex];
      }
    }
    switchViewTo('entry-form');
    // console.log($entryNeedsEditing);
    var $currentTitle = $entryNeedsEditing.title;
    var $currentPhotoUrl = $entryNeedsEditing.pictureLink;
    var $currentNotes = $entryNeedsEditing.notes;
    // console.log($currentNotes, $currentPhotoUrl, $currentTitle);

    $form.elements.title.value = $currentTitle;
    $form.elements.photoUrl.value = $currentPhotoUrl;
    $form.elements.notes.value = $currentNotes;
    $previewPhoto.setAttribute('src', $currentPhotoUrl);
  }
  revealDelete();
}
$entriesList.addEventListener('click', editButtonListener);

// delete button
var $delete = document.querySelector('.delete-button-container');
function revealDelete(event) {
  if (data.editing === null) {
    setHidden($delete);
  } else {
    $delete.setAttribute('class', 'delete-button-container');
  }
}

var $deleteButton = document.querySelector('.delete-button');
var $modalScreen = document.querySelector('.modal-container');
function revealModal(event) {
  event.preventDefault();
  $modalScreen.setAttribute('class', 'modal-container row centered');
  switchViewTo('entry-form');
}
$deleteButton.addEventListener('click', revealModal);

var $cancelButton = document.querySelector('.cancel-button');
var $confirmButton = document.querySelector('.confirm-button');

function setHidden(targetObject) {
  targetObject.className = 'hidden';
}

function modalCanceled(event) {
  setHidden($modalScreen);
}
$cancelButton.addEventListener('click', modalCanceled);

function entryDeleted(event) {
  for (var dataEntriesIndex3 = 0; dataEntriesIndex3 < data.entries.length; dataEntriesIndex3++) {
    if (data.entries[dataEntriesIndex3].entryId.toString() === data.editing) {
      data.entries.splice(dataEntriesIndex3, 1);
    }
  }
  for (var objectsIndex = 0; objectsIndex < $entriesUnorderedList.children.length; objectsIndex++) {
    if ($entriesUnorderedList.children[objectsIndex].getAttribute('data-entry-id') === data.editing) {
      $entriesUnorderedList.children[objectsIndex].remove();
    }
  }
  if (data.entries.length === 0) {
    $emptyList.className('empty-entry-list');
  }
  modalCanceled();
  switchViewTo('entries');
  data.editing = null;
}
$confirmButton.addEventListener('click', entryDeleted);
