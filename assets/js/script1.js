// Set the date we're counting down to
end_time="Jun 29, 2021 20:00:00" //pass the variable from backend when the times end
var countDownDate = new Date(end_time).getTime();
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
    var now = new Date().getTime();
  // Find the distance between now and the count down date
    var distance =countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML = minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "0m 0s";
        console.log("Times UP")
        document.getElementById('san').click()
    }
}, 1000);