<?php
class ParticipantAPI extends VolunteerAPI
{
    public function __construct()
    {
        parent::__construct('participants', 'uid');
    }

    protected function canCreate($request)
    {
        $this->validateLoggedIn($request);
        return true;
    }

    protected function canRead($request)
    {
        if($this->isVolunteerAdmin($request))
        {
            return true;
        }
        //TODO give access to department leads
        return true;
    }

    protected function canUpdate($request, $entity)
    {
 	if($this->isVolunteerAdmin($request))
        {
            return true;
        }       
        //TODO give access to department lead
        return false;
    }

    protected function canDelete($request, $entity)
    {
        return $this->canUpdate($request, $entity);
    }

    protected function validateCreate(&$obj, $request)
    {
        if(isset($obj['uid']))
        {
            return false;
        }
        $uid = $this->user->uid;
        $dataTable = $this->getDataTable();
        $filter = $this->getFilterForPrimaryKey($uid);
        $users = $dataTable->read($filter);
        if(!empty($users))
        {
            //User is already created...
            return false;
        }
        $obj['uid'] = $uid;
        return true;
    }

    public function readEntry($request, $response, $args)
    {
        $this->validateLoggedIn($request);
        $uid = $args['name'];
        if($uid === 'me')
        {
            $uid = $this->user->uid;
        }
        else if($uid !== $this->user->uid && $this->canRead($request) === false)
        {
            return $response->withStatus(401);
        }
        $dataTable = $this->getDataTable();
        $odata = $request->getAttribute('odata', new \ODataParams(array()));
        $filter = $this->getFilterForPrimaryKey($uid);
        $areas = $dataTable->read($filter, $odata->select, $odata->top,
                                  $odata->skip, $odata->orderby);
        if(empty($areas))
        {
            return $response->withStatus(404);
        }
        if(method_exists($this, 'processEntry'))
        {
            $areas[0] = $this->processEntry($areas[0], $request);
        }
        return $response->withJson($areas[0]);
    }
}
