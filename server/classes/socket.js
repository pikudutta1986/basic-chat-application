// IMPORT SERVER DATA STORAGE
const serverStorage = require ('../server-storage');

class socketClass 
{
    constructor ()
    {
    }

    // THIS FUNCTION WILL BE CALLED WHEN NEW/OLD CLIENT'S SOCKET IS CONNECTED/RECONNECTED TO THE SERVER.
    clientuserConnected (socket)
    {
        console.log ('client socket connected');
        
        // SOCKET EVENT TO PROCESS A ROOM JOIN
        socket.on ("process_room_join", (data) =>
        {
            console.log ('on process_room_join called');
            socket.socket_id = data.socket_id;
            socket.join (data.room_id); // SUBSCRIBING SOCKET TO THE ROOM.

            var checkUser = serverStorage.roomUsers.find((x) => x.socket_id == data.socket_id); 

            if (!checkUser)
            {
                serverStorage.roomUsers.push({socket_id: data.socket_id, name: data.name});
            }
            
            // EMIT MESSAGE SOCKET EVENT TO CLIENT ON ROOM JOIN
            socket.emit ("message", {type: "room_join_success", name: data.name, chatdta: serverStorage.chatData});
            socket.broadcast.emit ('message', {type: "new_user_joined", name: data.name});
        });

        socket.on ("chat_message", (data) =>
        {
            serverStorage.chatData.push(data);
            socket.broadcast.emit ('message', {
                type: "chat_message", 
                chatdta: data
            });
        });

        // WHEN A USER IS DISCONNECTED FROM SOCKET.
        socket.on ('disconnect', (reason) =>
        {
            serverStorage.roomUsers = serverStorage.roomUsers.filter((x) => x.socket_id != socket.socket_id);
            if(serverStorage.roomUsers.length == 0)
            {
                serverStorage.chatData = [];
            }
            console.log ('client socket disconnected', serverStorage.roomUsers, serverStorage.chatData); 
        });

        // WHEN A SOCKET CONNECTS.
        socket.on ('connect', () =>
        {
            console.log ('on connect called');
            socket.broadcast.emit ('connect', data);
        });
        
        // IF THERE IS ANY ERROR THEN WE WILL LOG IT.
        socket.on ('error', (err) =>
        {
            console.error ('socket ERROR:', err);
        });

        // IF THERE IS ANY ERROR DURING THE CLIENT'S SOCKET CONNECTION.
        socket.on ('connect_error', (err) =>
        {
            console.error ('client connection error', err);
        });
    }
}

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = socketClass;
