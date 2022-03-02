import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {SocketService} from '../../services/socket.service';
import $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public roomJoined: boolean = false;
  public chatContainerStyle: any = {};
  public leftListStyle: any = {};
  public chatboxStyle: any = {};
  public loginForm: FormGroup;
  public chatForm: FormGroup;
  public globalMessage: string = '';
  public localName: string = '';
  public localSocketId: any;

  public chatData: any;

  constructor(
    public socketService: SocketService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void 
  {
    this.chatData = [];

    this.loginForm = this.formBuilder.group
    ({
      name: ['', [Validators.required]]
    });

    this.chatForm = this.formBuilder.group
    ({
      message_text: ['', [Validators.required]]
    });

    this.adjustDashboardLayout();

    window.addEventListener("resize", () => {
      this.adjustDashboardLayout();
    });

    this.doAutoJoin();
  }

  generateId() 
  {
    var result  = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) 
    {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));
    }
    return result;
  }

  adjustDashboardLayout()
  {
    let viewportHeight = $(window).height()-2;
    this.chatContainerStyle['height'] = (viewportHeight-100)+'px';
    this.chatboxStyle['height'] = (viewportHeight-200)+'px';
  }

  SetNameAndJoinRoom()
  {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) 
    {
      let socket_id = this.generateId();
      sessionStorage.setItem('name', this.loginForm.controls['name'].value);
      sessionStorage.setItem('socket_id', socket_id);
      this.doAutoJoin();
    }
  }

  doAutoJoin()
  {
    if (sessionStorage.getItem('socket_id'))
    {
      this.localSocketId = sessionStorage.getItem('socket_id');
      this.localName = sessionStorage.getItem('name');
      this.roomJoined = true; 
      this.socketService.connectSocket ();
      this.socketService.joinRoom (this.localName, this.localSocketId);
      this.listenToSocketMessages();
    }
  }

  SendChatMessage()
  {
    if (this.chatForm.valid) 
    {
      let messageData = {
        socket_id: this.localSocketId,
        name: this.localName,
        message_text: this.chatForm.controls['message_text'].value
      };

      this.chatData.push(messageData);
      this.socketService.socket.emit ('chat_message', messageData);
      this.chatForm.controls['message_text'].setValue('');
    }
  }

  listenToSocketMessages()
  {
    this.socketService.socket.on("message", (data)=>
    {
      console.log(data);
      switch (data.type)
      {
        case "room_join_success":
        this.globalMessage = `Hey <i>${data.name}</i>, you are now successully connected to the room.`;
        this.chatData = data.chatdta;
        this.clearGlobalMessage();
        break;
        case "new_user_joined":
        this.globalMessage = `Hey <i>${this.localName}</i>, a new user <i>${data.name}</i> is connected to the room.`;
        this.clearGlobalMessage();
        break;
        case "chat_message":
        this.chatData.push(data.chatdta);
        break;
      }
    });
  }

  clearGlobalMessage()
  {
    setTimeout(() => {this.globalMessage = '';}, 3000);
  }

}
