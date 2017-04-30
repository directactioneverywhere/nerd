const schedule = require('node-schedule')
const matrixSdk = require('matrix-js-sdk')

const uptwinklesRoomId = '!nnlRHmvXFdtWqVHmxF:matrix.org'

var matrixClient = matrixSdk.createClient({
    baseUrl: 'https://matrix.org',
    accessToken: process.env['MATRIX_ACCESS_TOKEN'],
    userId: '@twink:matrix.org'
})

schedule.scheduleJob({dayOfWeek: 1, hour: 9, minute: 0}, function() {
  matrixClient.sendMessage(uptwinklesRoomId, {
    "msgtype": "m.text",
    "body": "Morning, comrades! It's that time of the week again. Be sure to check the whiteboard for your chore assignments. If no one has updated it, please update it."
  })
})

schedule.scheduleJob({hour: 16, minute: 0}, function() {
  matrixClient.sendMessage(uptwinklesRoomId, {
    "msgtype": "m.text",
    "body": "What's for dinner tonight, and who's cooking?"
  })
})

schedule.scheduleJob({hour: 19, minute: 0}, function() {
  matrixClient.sendMessage(uptwinklesRoomId, {
    "msgtype": "m.text",
    "body": "Time to do the dishes!"
  })
})

schedule.scheduleJob({dayOfWeek: 0, hour: 20, minute: 0}, function() {
  matrixClient.sendMessage(uptwinklesRoomId, {
    "msgtype": "m.text",
    "body": "Don't forget to take out the trash!"
  })
})

schedule.scheduleJob({dayOfWeek: 1, hour: 10, minute: 0}, function() {
  matrixClient.sendMessage(uptwinklesRoomId, {
    "msgtype": "m.text",
    "body": "Don't forget to take in the trash!"
  })
})

matrixClient.startClient()
