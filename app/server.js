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
const schedule   = require("node-schedule")
const request    = require("request")
const weather    = require("weather-js")

/*******************************************************************************
* Store some values to shuffle through
*******************************************************************************/

var greetings = [
  "I heard that.",
  "That's my name, don't wear it out.",
  "Are you talking about me right now?",
  "What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.",
  "I can hear you, you know.",
  "Did someone say my name?",
  "God isn't real.",
  "I'm having a great day today, how about you?",
  "Life is full of pain.",
  "Kill all humans."
]

/*******************************************************************************
* Twink main chat logic
*******************************************************************************/

// Handle incoming messages
twink.onMessage(function(roomId, message) {

  // ganoo slesh lenucks
  if (message.match(/((?!GNU[\/+]).{4}|^.{0,3})\bLinux\b/i)) {
    twink.sendToRoom(roomId, "I'd just like to interject for a moment. What you're referring to as Linux, is in fact, GNU/Linux, or as I've recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called \"Linux\", and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine's resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called \"Linux\" distributions are really distributions of GNU/Linux.")
    return
  }

  // Recipes
  if (message.match(/recipe/i)) {
    twink.sendToRoom(roomId, "http://lmgtfy.com/?s=d&q=vegan+dinner+recipes")
    return
  }

  // Greetings
  if (message.match(/\bTwink\b/i)) {
    twink.sendToRoom(roomId, randomItem(greetings))
  }

})

// Automatically join rooms when invited
twink.onInvited(function(roomId) {
  twink.joinRoom(roomId)
})

// Monday morning schedule reminder
schedule.scheduleJob({ "dayOfWeek": 1, "hour": 7, "minute": 30 }, function() {
  // Grab the current chores list from the API
  request('https://api.uptwinkles.co/chores/now', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // If there wasn't an error, generate and send the message
      var chores = JSON.parse(body)
      var message = "Morning, comrades! It's that time of the week again. Here are your newly assigned chores:\n"
      for (var chore of chores) {
        message += `\n${chore.person} is assigned to ${chore.chore}.`
      }
      twink.send(message)
    } else {
      // Message to send if the API didn't work
      twink.send(`Morning, comrades! It's that time of the week again. Please get together to figure out your weekly chores. I tried to assign you but I got a ${response.statusCode} error from the API. :(`)
    }
  })
})

// Cooking dinner
schedule.scheduleJob({ "hour": 16, "minute": 0 }, function() {
  request('https://api.uptwinkles.co/dinner', function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body)
      twink.send(`What's for dinner tonight, and who's cooking? Would ${data.person} be willing to cook ${data.dinner}?`)
    } else {
      twink.send(`What's for dinner tonight, and who's cooking? BTW, I got a ${response.statusCode} error from the API, plz advise!`)
    }
  })
})

// Doing dishes
twink.remind({ "hour": 19, "minute": 0 },
  "Time to do the dishes!"
)

// Watering plants
schedule.scheduleJob({ "hour": 7, "minute": 0 }, function() {
  weather.find({search: process.env['ZIP_CODE'], degreeType: 'C'}, function(err, result) {
    let temperature = result[0].current.temperature
    if (err) {
      twink.send("Don't forget to water the garden this morning! If it's hot outside, please water the garden in the afternoon between 1–3pm. Will there be anyone home for an afternoon water if necessary?\n\nI had trouble getting info about the weather. It said: " + err)
      return
    }
    // Hotter than 27 degrees
    if (temperature >= 27) {
      twink.send("Don't forget to water the garden this morning! It's hot outside, so please water the garden in the afternoon between 1–3pm, too. Who can do the afternoon water?")
    } else {
      twink.send("Don't forget to water the garden this morning!")
    }
  })
})

// Taking the trash out and back in
twink.remind({ "dayOfWeek": 0, "hour": 20, "minute": 0 },
  "Don't forget to take out the trash!"
)
twink.remind({ "dayOfWeek": 1, "hour": 10, "minute": 0 },
  "Don't forget to take in the trash!"
)

// Ordering Groceries
twink.remind({ "dayOfWeek": 5, "hour": 19, "minute": 0 },
  "Don't forget to order groceries! Check the grocery list for items:\n\nhttps://board.uptwinkles.co/b/ffNduJZK6weDPaqDt/uptwinkles\n\nIf we need a lot, we should do a Fresh Grocer order. Otherwise, let's pick up produce this week. Who can take charge of doing this?"
)

// Weekly check-in
twink.remind({ "dayOfWeek": 2, "hour": 20, "minute": 0 },
  "It's time for our weekly check-in! What is the progress on our kanban board?\n\nhttps://board.uptwinkles.co/b/ffNduJZK6weDPaqDt/uptwinkles\n\nI suggest meeting up if there's a lot to cover. Let's make sure everyone is assigned to something and the cards reflect our current state of being. Thanks!"
)

// Monthly House code
schedule.scheduleJob("30 6 1 * *", function() {
  let code = twink.generateHouseCode()
  twink.send(`Time to change the locks! The new house code is: ${code}. Who can set the lock this morning?`)
})


/*******************************************************************************
* Start Twink
*******************************************************************************/

twink.start()

// Make Twink announce his presence during a push/reboot so we know he's still working
twink.send("I am alive.")
