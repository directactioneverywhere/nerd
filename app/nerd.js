const schedule  = require('node-schedule')
const matrixSdk = require('matrix-js-sdk')

/*******************************************************************************
* Matrix connect
*******************************************************************************/

const dxetechRoomId = '!NEvbMnDonJFUuaxsuw:matrix.org'
const nerdUserId    = '@dxetech_nerd:matrix.org'

var matrixClient = matrixSdk.createClient({
    baseUrl: 'https://matrix.org',
    accessToken: process.env['MATRIX_ACCESS_TOKEN'],
    userId: nerdUserId
})

/*******************************************************************************
* Core functions
*******************************************************************************/

// Messages any Matrix room
function sendToRoom(roomId, message) {
  // 2 second delay in messages so it shows Nerd "typing"
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

// Messages the DxE Tech room
function send(message) {
  sendToRoom(dxetechRoomId, message)
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
        if (toStartOfTimeline || event.getSender() === nerdUserId) {
          return // Ignore Nerd's own messages
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
    if (member.membership === "invite" && member.userId === nerdUserId) {
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

// Starts Nerd
function start() {
  matrixClient.startClient()
}

/*******************************************************************************
* Export as a module
*******************************************************************************/

module.exports = {
  dxetechRoomId: dxetechRoomId,
  nerdUserId: nerdUserId,

  onMessage: onMessage,
  remind: remind,
  send: send,
  sendToRoom: sendToRoom,
  onInvited: onInvited,
  joinRoom: joinRoom,
  start: start
}
