const schedule  = require('node-schedule')
const matrixSdk = require('matrix-js-sdk')

const uptwinklesRoomId = '!nnlRHmvXFdtWqVHmxF:matrix.org'
const twinkUserId      = '@twink:matrix.org'

var matrixClient = matrixSdk.createClient({
    baseUrl: 'https://matrix.org',
    accessToken: process.env['MATRIX_ACCESS_TOKEN'],
    userId: twinkUserId
})

// Messages the Uptwinkles room
function sendToRoom(roomId, message) {
  matrixClient.sendMessage(roomId, {
    "msgtype": "m.text",
    "body": message
  })
}

// Messages any Matrix room
function send(message) {
  sendToRoom(uptwinklesRoomId, message)
}

module.exports = {
  uptwinklesRoomId: uptwinklesRoomId,
  twinkUserId: twinkUserId,

  // Provides a callback to handle incoming messages
  onMessage: function(callback) {
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
  },

  // Schedules reminders
  remind: function(frequency, message) {
    schedule.scheduleJob(frequency, function() {
      send(message)
    })
  },

  send: send,
  sendToRoom: sendToRoom,

  // Starts Twink
  start: function() {
    matrixClient.startClient()
  }
}
