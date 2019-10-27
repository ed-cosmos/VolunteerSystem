Chart.pluginService.register({
  beforeDraw: function (chart) {
    if (chart.config.options.elements.center) {
      //Get ctx from string
      var ctx = chart.chart.ctx;

      //Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding/100) * (chart.innerRadius * 2)
      //Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight);

      //Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse+"px " + fontStyle;
      ctx.fillStyle = color;

      //Draw text in center
      ctx.fillText(txt, centerX, centerY);
    }
  }
});

function gotDepartments(jqXHR) {
  if(jqXHR.responseJSON !== undefined) {
    $('#deptCount').html(jqXHR.responseJSON['@odata.count']);
    var array = jqXHR.responseJSON.value;
    array = array.sort((a,b) => {
      return a.departmentName.localeCompare(b.departmentName);
    });
    $('#deptName').html('Unable to locate department!');
    var departments = $('#departments');
    departments.change(showDepartmentDetails);
    for(var i = 0; i < array.length; i++) {
      if(array[i].isAdmin) {
        $('#deptName').html(array[i].departmentName);
        addOptiontoSelect(departments[0], array[i].departmentID, array[i].departmentName);
      }
    }
    if(chart === null) {
      var eventID = $('#events').val();
      var deptID = $('#departments').val();
      var url = '../api/v1/events/'+eventID+'/shifts?$filter=departmentID eq '+deptID;
      $.ajax({
        url: url,
        complete: gotShifts
      });
    }
  }
}

function gotRoles(jqXHR) {
  if(jqXHR.responseJSON !== undefined) {
    var roles = jqXHR.responseJSON;
    var count = 0;
    for(var i = 0; i < roles.length; i++) {
      if(roles[i].isAdmin) {
        count++;
      }
    }
    $('#roleCount').html(count);
  }
}

var chart = null;

function gotShifts(jqXHR) {
  var canvas = document.getElementById('shiftsFilled');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(chart !== null) {
    chart.destroy();
  }
  if(jqXHR.status !== 200) {
    ctx.fillText('Unable to obtain shift data', 10, 50);
    console.log(jqXHR);
  }
  else {
    var data = jqXHR.responseJSON;
    if(data.length === 0) {
      ctx.fillText('Event has no shifts!', 10, 50);
    }
    else {
      var filled = 0;
      var pending = 0;
      var unfilled = data.length;
      for(var i = 0; i < data.length; i++) {
        if(data[i].status && data[i].status === 'filled') {
          filled++;
          unfilled--;
        }
        else if(data[i].status && data[i].status === 'pending') {
          pending++;
          unfilled--;
        }
      }
      var percent = (filled/unfilled)*100;
      var text = Number.parseFloat(percent).toPrecision(4)+'%';
      if(percent !== 0 && percent < 1) {
        text = '<1%';
      }
      var options = {
        elements: {
          center: {
            text: text
          }
        }
      };
      var data = {
        datasets: [{
          data: [unfilled, filled, pending],
          backgroundColor: ["#d53e4f", "#66c2a5", "#f46d43"]
        }],
        labels: ['Unfilled', 'Filled', 'Pending']
      };
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
      });
    }
  }
}

function showEventDetails(e) {
  var eventID = e.target.value;
  if($('#departments').val() !== null) {
    $.ajax({
      url: '../api/v1/events/'+eventID+'/shifts',
      complete: gotShifts
    });
  }
}

function showDepartmentDetails(e) {
  var eventID = $('#events').val();
  var deptID = e.target.value;
  var url = '../api/v1/events/'+eventID+'/shifts?$filter=departmentID eq '+deptID;
  if(deptID === '*') {
    url = '../api/v1/events/'+eventID+'/shifts';
  }
  $.ajax({
    url: url,
    complete: gotShifts
  });
}

function gotEvents(jqXHR) {
  if(jqXHR.responseJSON !== undefined) {
    var resp = jqXHR.responseJSON;
    $('#eventCount').html(resp['@odata.count']);
    var events = $('#events');
    events.change(showEventDetails);
    for(var i = 0; i < resp.value.length; i++) {
      events.append('<option value="'+resp.value[i]['_id']['$oid']+'">'+resp.value[i].name+'</option>');
    }
    showEventDetails({target: events[0]});
  }
}

function gotVols(jqXHR) {
  if(jqXHR.responseJSON !== undefined) {
    var resp = jqXHR.responseJSON;
    $('#volCount').html(resp['@odata.count']);
  }
}

function initIndex() {
  $.ajax({
    url: '../api/v1/departments?$count=true',
    complete: gotDepartments
  });
  $.ajax({
    url: '../api/v1/roles',
    complete: gotRoles
  });
  $.ajax({
    url: '../api/v1/events?$count=true',
    complete: gotEvents
  });
  $.ajax({
    url: '../api/v1/participants?$count=true',
    complete: gotVols
  });
}

$(initIndex);