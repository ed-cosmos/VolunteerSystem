<?php
require_once('class.FlipSession.php');
require_once('app/VolunteerAutoload.php');
require_once('../../class.SecurePage.php');
class VolunteerAdminPage extends \Http\FlipAdminPage
{
    use SecureWebPage;

    function __construct($title)
    {
        parent::__construct($title, 'VolunteerAdmins');
        $this->addLinks();
    }

    function addLinks()
    {
        $this->content['header']['sidebar'] = array();
        if($this->user === false && $this->user === null)
        {
            return;
        }
        $this->content['header']['sidebar']['Dashboard'] = array('icon' => 'fa-tachometer-alt', 'url' => 'index.php');
        $this->content['header']['sidebar']['Departments'] = array('icon' => 'fa-building', 'url' => 'departments.php');
        $this->content['header']['sidebar']['Shifts'] = array('icon' => 'fa-tshirt', 'url' => 'shifts.php');
    }
}