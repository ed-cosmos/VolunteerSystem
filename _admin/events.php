<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once('class.VolunteerAdminPage.php');
$page = new VolunteerAdminPage('Burning Flipside Volunteer System - Admin');
$page->setTemplateName('admin-table-new.html');

$page->addWellKnownJS(JS_BOOTBOX);
$page->addJS('../js/wizard.js');

$page->content['pageHeader'] = 'Events';
$page->content['table'] = array('id' => 'events');
if($page->user->isInGroupNamed('VolunteerAdmins'))
{
    $page->content['selectors'] = '<button type="button" class="btn btn-primary" onclick="showEventWizard();">New Event</button>';
}
$page->content['body'] = '
<div class="modal fade bd-example-modal-lg" id="eventWizard" tabindex="-1" role="dialog" aria-labelledby="eventWizardTitle" aria-hidden="true" data-backdrop="static" data-complete="newEvent">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="profileWizardTitle">New Event</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row flex-xl-nowrap">
          <div class="col-12 col-md-4 col-xl-3 bd-sidebar">
            <ul class="list-group">
              <li class="list-group-item active">Basic Info</li>
              <li class="list-group-item">Private Event</li>
              <li class="list-group-item">Departments</li>
              <li class="list-group-item">Tickets</li>
              <li class="list-group-item">Review</li>
            </ul>
          </div>
          <div class="col-12 col-md-8 col-xl-8 bd-content">
            <div id="eventBasic" class="visible">
              This is some basic information about the event.
              <div class="row">
                <label for="name" class="col-sm-2 col-form-label">Event Name:</label>
                <div class="col-sm-10">
                  <input class="form-control" type="text" name="name" id="name" required/>
                </div>
                <div class="w-100"></div>
                <label for="startTime" class="col-sm-2 col-form-label">Start:</label>
                <div class="col-sm-10">
                  <input class="form-control" type="datetime-local" name="startTime" id="startTime" required/>
                </div>
                <div class="w-100"></div>
                <label for="endTime" class="col-sm-2 col-form-label">End:</label>
                <div class="col-sm-10">
                  <input class="form-control" type="datetime-local" name="endTime" id="endTime" required/>
                </div>
              </div>
            </div>
            <div id="eventPrivacy" class="invisible">
            </div>
            <div id="eventDepartments" class="invisible">
            </div>
            <div id="eventTickets" class="invisible">
            </div>
            <div id="eventReview" class="invisible">
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary mr-auto" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary" id="prevStep" disabled onClick="prevWizardStep(this);">Previous</button>
        <button type="button" class="btn btn-outline-primary" id="nextStep" onClick="nextWizardStep(this);">Next</button>
      </div>
    </div>
  </div>
</div>
';

$page->printPage();
/* vim: set tabstop=4 shiftwidth=4 expandtab: */