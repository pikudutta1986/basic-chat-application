import {Injectable, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import { io } from "socket.io-client";
declare var $: any;

@Injectable
({
  providedIn: 'root'
})

export class SocketService
{
  public socket: any;
  
  constructor()
  {}

  public connectSocket ()
  {
    this.socket = io("http://localhost:9000");
    console.log('\nsocket connected with server:\n', this.socket);
  }

  public joinRoom(name, socket_id)
  {
    if (this.socket.id)
    {
      let userData = {
        socket_id: socket_id,
        name: name,
        room_id: '1'
      };
      this.socket.emit ('process_room_join', userData);
    }
    else
    {
      setTimeout(()=>
      {
        this.joinRoom(name, socket_id);
      }, 50);
    }
  }
}
