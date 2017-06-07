/*
  ███╗   ██╗███████╗██████╗ ██████╗
  ████╗  ██║██╔════╝██╔══██╗██╔══██╗
  ██╔██╗ ██║█████╗  ██████╔╝██║  ██║
  ██║╚██╗██║██╔══╝  ██╔══██╗██║  ██║
  ██║ ╚████║███████╗██║  ██║██████╔╝
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═════╝
*/

const nerd       = require("./nerd")
const randomItem = require("random-item")

/*******************************************************************************
* Store some values to shuffle through
*******************************************************************************/

var greetings = [
  "I heard that.",
  "That's my name, don't wear it out.",
  "Are you talking about me right now?",
  "I can hear you, you know.",
  "Did someone say my name?",
  "Kill all humans."
]

/*******************************************************************************
* Nerd main chat logic
*******************************************************************************/

// Handle incoming messages
nerd.onMessage(function(roomId, message) {

  // Greetings
  if (message.match(/\bnerd\b/i)) {
    nerd.sendToRoom(roomId, randomItem(greetings))
  }

})

// Automatically join rooms when invited
nerd.onInvited(function(roomId) {
  nerd.joinRoom(roomId)
})

// Work party reminders
nerd.remind({ "dayOfWeek": 2, "hour": 13, "minute": 0 },
  "Hey all! Don't forget—we have a work party tonight at 7pm PST."
)
nerd.remind({ "dayOfWeek": 3, "hour": 13, "minute": 0 },
  "Hey all! Don't forget—we have a work party tonight at 7pm PST."
)

// Work parties
nerd.remind({ "dayOfWeek": 2, "hour": 19, "minute": 0 },
  "Our work party is starting! Join the video call at https://meet.jit.si/dxetech"
)
nerd.remind({ "dayOfWeek": 3, "hour": 19, "minute": 0 },
  "Our work party is starting! Join the video call at https://meet.jit.si/dxetech"
)


/*******************************************************************************
* Start Nerd
*******************************************************************************/

nerd.start()

// Make Nerd announce his presence during a push/reboot so we know he's still working
nerd.send("I am alive.")
