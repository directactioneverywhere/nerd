/*
  ████████╗██╗    ██╗██╗███╗   ██╗██╗  ██╗
  ╚══██╔══╝██║    ██║██║████╗  ██║██║ ██╔╝
     ██║   ██║ █╗ ██║██║██╔██╗ ██║█████╔╝
     ██║   ██║███╗██║██║██║╚██╗██║██╔═██╗
     ██║   ╚███╔███╔╝██║██║ ╚████║██║  ██╗
     ╚═╝    ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
*/

const twink      = require("./twink")
const randomItem = require("random-item")

/*******************************************************************************
* Store some values to shuffle through
*******************************************************************************/

var greetings = [
  "Hello world!",
  "Who goes there?",
  "That's my name, don't wear it out.",
  "Are you talking about me right now?",
  "What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo."
]

var dinnerSuggestions = [
  "tiki masala chickpeas over rice",
  "tacos",
  "something with a lot of tomatoes",
  "tofu scramble",
  "pasta"
]

/*******************************************************************************
* Twink main chat logic
*******************************************************************************/

// Handle incoming messages
twink.onMessage(function(roomId, message) {

  if (message.match(/recipe/i)) {
    twink.sendToRoom(roomId, "http://lmgtfy.com/?s=d&q=vegan+dinner+recipes")
    return
  }

  if (message.match(/\bTwink\b/i)) {
    twink.sendToRoom(roomId, randomItem(greetings))
  }

})

// Set chore reminders
twink.remind({ "dayOfWeek": 1, "hour": 7, "minute": 30 },
  "Morning, comrades! It's that time of the week again. Be sure to check the whiteboard for your chore assignments. If no one has updated it, please update it."
)

twink.remind({ "hour": 16, "minute": 0 },
  `What's for dinner tonight, and who's cooking? I suggest ${randomItem(dinnerSuggestions)}!`
)

twink.remind({ "hour": 19, "minute": 0 },
  "Time to do the dishes!"
)

twink.remind({ "dayOfWeek": 0, "hour": 20, "minute": 0 },
  "Don't forget to take out the trash!"
)

twink.remind({ "dayOfWeek": 1, "hour": 10, "minute": 0 },
  "Don't forget to take in the trash!"
)

/*******************************************************************************
* Start Twink
*******************************************************************************/

twink.start()

// Make Twink announce his presence during a push/reboot so we know he's still working
twink.send("I am alive.")
