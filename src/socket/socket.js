import io from 'socket.io-client'

let socket = io('https://server-who-is-this-pokmeon.onrender.com')
//let socket = io('//localhost:5052')

export default socket