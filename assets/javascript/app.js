$(document).ready(function() {

// var modal = $("#myModal");

// Initialize Firebase

  var trainObj = {};

	 var config = {
      apiKey: "AIzaSyCxFO9UDYzEdUINfqmeEkRj_5jeqJyVu2M",
      authDomain: "train-schedule-4c1b9.firebaseapp.com",
      databaseURL: "https://train-schedule-4c1b9.firebaseio.com",
      projectId: "train-schedule-4c1b9",
      storageBucket: "",
      messagingSenderId: "110818611750"
  	 };
     
	  firebase.initializeApp(config);

    // Create a variable to reference the database

    var database = firebase.database();

    // Capture Button Click
    $("#add-train-btn").on("click", function() {
      // Stops the page from refreshing
      event.preventDefault();

      // Takes the value from the id in html and assigns it to the object
      trainObj.name = $("#name").val().trim();
      trainObj.destination = $("#destination").val().trim();
      trainObj.firstTrain = moment($("#first-train").val().trim(), 'hh:mm a').format('HH:mm');
      trainObj.frequency = $("#frequency").val().trim();

      database.ref().push(trainObj);

      //Clears the values entered by user in the form
      $("#name").val("");
      $("#destination").val("");
      $("#first-train").val("");
      $("#frequency").val("");

      // $('#myModal').modal("toggle");

  	});

    // Function that calls the values in firebase so new variables can be assigned
    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().firstTrain);
      console.log(childSnapshot.val().frequency);

      var timeNow = moment();

      var name = childSnapshot.val().name;
      
      var destination = childSnapshot.val().destination;
      
      // converts first train time to Unix
      var firstTrain = moment(childSnapshot.val().firstTrain, 'HH:mm').subtract(1, "years");
      console.log("first train at: " + firstTrain);
      
      // stores frequency of train in a variable
      var frequency = childSnapshot.val().frequency;
      console.log("frequency of train: " + frequency);
      
      // calculates the difference between the first train and the current time
      var difference = moment().diff(moment(firstTrain), "minutes");
      console.log("diff between first train and current time: " + difference);
      
      // calculates the times the train has arrived from first train to now
      var timeLeft = difference % frequency;
      console.log("number of times train arrived: "+ timeLeft);
      
      // calculates the amount of minutes left
      var minutes = frequency - timeLeft;
      console.log("minutes til train: " + minutes);
      
      // adds minutes to last arrival for next arrival
      var nextArrival = moment().add(minutes, "minutes").format("hh:mm A");
      console.log("arrival time: "+ nextArrival);

      var newTR = $("<tr>");

      var newName = $("<td>");
      newName.html(name);
      newTR.append(newName);

      var newDestination = $("<td>");
      newDestination.html(destination);
      newTR.append(newDestination);

      var newFrequency = $("<td>");
      newFrequency.html(frequency);
      newTR.append(newFrequency);

      var newNextArrival = $("<td>");
      newNextArrival.html(nextArrival);
      newTR.append(newNextArrival);
      
      var newMinutes = $("<td>");
      newMinutes.html(minutes);
      newTR.append(newMinutes);

      $(".train-content").append(newTR);

  	});

  })
