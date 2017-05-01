const twink         = require("./twink")
const data          = require("./data.json")
const preprocessors = require("./preprocessors")

// Preprocesses messages through a filter if one is set for that object
function preprocess(obj) {
  if (obj.preprocessor) {
    var preprocessor = preprocessors[obj.preprocessor]
    return preprocessor(obj.message)
  } else {
    return obj.message
  }
}

// Finds a response for an incoming message
function matchResponse(message) {
  for (var response of data.responses) {
    var trigger = new RegExp(response.trigger, 'i')
    if (message.match(trigger)) {
      return response
    }
  }
}

// Handle incoming messages with JSON responses
twink.onMessage(function(roomId, message) {
  var response = matchResponse(message)
  if (response) {
    var reply = preprocess(response)
    twink.sendToRoom(roomId, reply)
  }
})

// Set reminders from JSON
for (var reminder of data.reminders) {
  var message = preprocess(reminder)
  twink.remind(reminder.frequency, message)
}

// Start Twink
twink.start()

// Make Twink announce his presence during a push/reboot so we know he's still working.
twink.send("I am alive.")
