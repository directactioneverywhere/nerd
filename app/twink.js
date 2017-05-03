const schedule  = require('node-schedule')
const matrixSdk = require('matrix-js-sdk')

/*******************************************************************************
* Matrix connect
*******************************************************************************/

const uptwinklesRoomId = '!nnlRHmvXFdtWqVHmxF:matrix.org'
const twinkUserId      = '@twink:matrix.org'

var matrixClient = matrixSdk.createClient({
    baseUrl: 'https://matrix.org',
    accessToken: process.env['MATRIX_ACCESS_TOKEN'],
    userId: twinkUserId
})

/*******************************************************************************
* Core functions
*******************************************************************************/

// Messages any Matrix room
function sendToRoom(roomId, message) {
  // 2 second delay in messages so it shows Twink "typing"
  const typingTime = 2000
  matrixClient.sendTyping(roomId, true, typingTime, function() {
    setTimeout(function() {
      matrixClient.sendMessage(roomId, {
        "msgtype": "m.text",
        "body": message
      })
      matrixClient.sendTyping(roomId, false)
    }, typingTime)
  })
}

// Messages the Uptwinkles room
function send(message) {
  sendToRoom(uptwinklesRoomId, message)
}

// Joins any Matrix room
function joinRoom(roomId) {
  matrixClient.joinRoom(roomId).done(function() {
    sendToRoom(roomId, "Hello world!")
  })
}

// Provides a callback to handle incoming messages
function onMessage(callback) {
  matrixClient.once('sync', function(state, prevState) {
    if (state === 'PREPARED') {
      matrixClient.on("Room.timeline", function(event, room, toStartOfTimeline) {
        if (toStartOfTimeline || event.getSender() === twinkUserId) {
          return // Ignore Twink's own messages
        }
        if (event.getType() !== "m.room.message") {
          return // Only respond to normal messages
        }
        callback(room.roomId, event.getContent().body)
      })
    }
  })
}

// Provides a callback to handle room invitations
function onInvited(callback) {
  matrixClient.on("RoomMember.membership", function(event, member) {
    if (member.membership === "invite" && member.userId === twinkUserId) {
      callback(member.roomId)
    }
  })
}

// Schedules reminders
function remind(frequency, message) {
  schedule.scheduleJob(frequency, function() {
    send(message)
  })
}

// Starts Twink
function start() {
  matrixClient.startClient()
}

/*******************************************************************************
* Export as a module
*******************************************************************************/

module.exports = {
  uptwinklesRoomId: uptwinklesRoomId,
  twinkUserId: twinkUserId,

  onMessage: onMessage,
  remind: remind,
  send: send,
  sendToRoom: sendToRoom,
  onInvited: onInvited,
  joinRoom: joinRoom,
  start: start
}
