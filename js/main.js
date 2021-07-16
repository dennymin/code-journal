/* global data */
/* exported data */

// variables
// variables of new entry form
var $photoUrl = document.querySelector('.photoUrl');
var $previewPhoto = document.querySelector('.preview-photo');
var $form = document.forms[0];
var $submitButton = document.querySelector('.submit-button');

// variables of entries list
var $entriesList = document.querySelector('.entries-list');
var $entriesUnorderedList = document.querySelector('ul');
var $liList = $entriesUnorderedList.children;
var $emptyList = document.querySelector('.empty-entry-list');
var $newEntryButton = document.querySelector('.new-entry-button');

// variables of edit form
var $delete = document.querySelector('.delete-button-container');
var $deleteButton = document.querySelector('.delete-button');
var $modalScreen = document.querySelector('.modal-container');
var $cancelButton = document.querySelector('.cancel-button');
var $confirmButton = document.querySelector('.confirm-button');

// variables of perpetual existence
var $entriesLink = document.querySelector('.header-entries-link');
var pages = document.querySelectorAll('.page');

// event listeners
$photoUrl.addEventListener('input', updateSRC);
$submitButton.addEventListener('click', storeData);
document.addEventListener('DOMContentLoaded', generateDOM);
$newEntryButton.addEventListener('click', retrieveTargetLink);
$entriesLink.addEventListener('click', retrieveTargetLink);
window.addEventListener('DOMContentLoaded', showLastViewVisited);
$entriesList.addEventListener('click', editButtonListener);
$deleteButton.addEventListener('click', revealModal);
$cancelButton.addEventListener('click', modalCanceled);
$confirmButton.addEventListener('click', entryDeleted);

// functions list
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
    switchViewTo('entries');
    prependDOM(tempEntry);
  } else {
    var updatingEntry = {};
    for (var dataEntriesIndex2 = 0; dataEntriesIndex2 < data.entries.length; dataEntriesIndex2++) {
      if (data.editing === data.entries[dataEntriesIndex2].entryId.toString()) {
        updatingEntry = createDataEntry($form.elements);
        data.entries[dataEntriesIndex2] = updatingEntry;
        var $updatedEntryObject = createEntry(updatingEntry);
        $updatedEntryObject.setAttribute('data-entry-id', updatingEntry.entryId);
        for (var childElementIndex = 0; childElementIndex < $liList.length; childElementIndex++) {
          if ($liList[childElementIndex].getAttribute('data-entry-id') === updatingEntry.entryId) {
            $liList[childElementIndex].replaceWith($updatedEntryObject);
          }
        }
        switchViewTo('entries');
        data.entries.splice(dataEntriesIndex2, 1, updatingEntry);
      }
    }
    data.editing = null;
  }
}

function prependDOM(selectEntry) {
  var $newestEntry = createEntry(selectEntry);
  $newestEntry.setAttribute('data-entry-id', selectEntry.entryId);
  $entriesUnorderedList.prepend($newestEntry);
}

function createEntry(entry) {
  $emptyList.setAttribute('class', 'hidden');
  var $newEntry = document.createElement('li');
  $newEntry.setAttribute('class', 'entry-container full-flex');

  var $newEntryImageContainer = document.createElement('div');
  $newEntryImageContainer.setAttribute('class', 'column-half image-container');
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

// utility functions
// functions for hiding or resetting
function setHidden(targetObject) { // sets class to hidden
  targetObject.className = 'hidden';
}

function resetFormAndPicture() { // resets entry form picture and form inputs
  $form.reset();
  $previewPhoto.src = 'images/placeholder-image-square.jpg';
}

function updateSRC(event) { // makes the source of the preview photo what it is on the value
  $previewPhoto.src = $photoUrl.value;
}

// functions for viewing
function retrieveTargetLink(event) {
  switchViewTo(event.target.getAttribute('data-view'));
  data.editing = null;
  resetFormAndPicture();
}

function switchViewTo(targetPage) { // changes the view property of data to the targetPage
  for (var j = 0; j < pages.length; j++) {
    if (pages[j].getAttribute('data-view') === targetPage) {
      data.view = targetPage;
      pages[j].className = 'view';
    } else {
      pages[j].className = 'view hidden';
    } // makes the page you want to see visible and the other page hidden
  }
}

function showLastViewVisited(event) {
  switchViewTo(data.view);
}

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

function revealDelete(event) {
  if (data.editing === null) {
    setHidden($delete);
  } else {
    $delete.setAttribute('class', 'delete-button-container');
  }
}

function revealModal(event) {
  event.preventDefault();
  $modalScreen.setAttribute('class', 'modal-container row centered');
  switchViewTo('entry-form');
}

function modalCanceled(event) {
  setHidden($modalScreen);
}

function entryDeleted(event) {
  for (var dataEntriesIndex3 = 0; dataEntriesIndex3 < data.entries.length; dataEntriesIndex3++) {
    if (data.entries[dataEntriesIndex3].entryId.toString() === data.editing) {
      data.entries.splice(dataEntriesIndex3, 1);
    }
  }
  for (var objectsIndex = 0; objectsIndex < $liList.length; objectsIndex++) {
    if ($liList[objectsIndex].getAttribute('data-entry-id') === data.editing) {
      $liList[objectsIndex].remove();
    }
  }
  if (data.entries.length === 0) {
    $emptyList.setAttribute('class', 'empty-entry-list');
  }
  modalCanceled();
  switchViewTo('entries');
  data.editing = null;
}
