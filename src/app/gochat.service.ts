import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs/Rx";
import { WebsocketService } from "./websocket.service";

const CHAT_URL = "ws://localhost:8080/ws";
//const CHAT_URL = "ws://echo.websocket.org/";

export interface Message {
  author: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class GochatService {
  public messages: Subject<Message>;
  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).map(
        (response: MessageEvent): Message => {
          /*let data = JSON.parse(response.data);
          return {
            author: data.author,
            message: data.message
          };*/
            return response.data
        }
    );
  }
}
