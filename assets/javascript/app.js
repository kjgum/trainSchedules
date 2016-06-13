var scheduleData = new Firebase('https://trainschedules.firebaseio.com/');
$(function() {
    $('#t1').clockface();
});


$('#submit').on('click', function() {
    // convert to military time
    var time = $("#t1").val();
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    var newTrainName = $('#trainName').val().trim();
    var newTrainDestination = $('#destination').val().trim();
    var newTrainFirstDeparture = sHours + sMinutes;
    var newTrainFrequency = $('#frequency').val().trim();
    var newTrain = {
        train: newTrainName,
        destination: newTrainDestination,
        firstDeparture: newTrainFirstDeparture,
        frequency: newTrainFrequency
    };
    scheduleData.push(newTrain);
    $('#trainName').val('');
    $('#destination').val('');
    $('#frequency').val('');
    return false;
});


scheduleData.on('child_added', function(snapshot, prevChildKey) {
    var newPost = snapshot.val();
    var trainName = snapshot.val().train;
    var trainDestination = snapshot.val().destination;
    var trainFirstDeparture = snapshot.val().firstDeparture;
    var trainFrequency = snapshot.val().frequency;
    var t = moment(trainFirstDeparture, 'HH:mm');
    var mmFirstTime = (t.hours() * 60) + (t.minutes());
    var timeNow = moment();
    var mmTimeNow = (timeNow.hours() * 60) + (timeNow.minutes());
    var diff = mmTimeNow - mmFirstTime;
    var remainder = diff % trainFrequency;
    var minsAway = trainFrequency - remainder;
    var nextTrain = minsAway + mmTimeNow;
    var hours = Math.floor(nextTrain / 60);
    var minutes = nextTrain % 60;
    var nextTrainM = hours + '' + minutes;
    var nextTrainAMPM = moment(nextTrainM, 'HH:mm').format('hh:mm A');
    
    $('tbody').prepend("<tr>" + "<td>" + trainName + "</td>" + "<td>" +
        trainDestination + "</td>" + "<td>" + trainFrequency +
        "</td>" + "<td>" + nextTrainAMPM + "</td>" + "<td>" +
        minsAway + "</td>" + "</tr>");
});




    $("#clearAll").click(function() {
            $("#trainName").val('');
            $("#destination").val('');
            $("#t1").val('');
            $("#frequency").val('');
        });
