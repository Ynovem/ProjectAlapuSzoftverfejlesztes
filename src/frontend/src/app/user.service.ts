import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

import {MessageService} from "./message.service";

import {User} from "./user";
import {USERS} from "./mock-users";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private messageService: MessageService) { }

  getUser(id: number): Observable<User | undefined> {
    const users = USERS;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(users.find(user => user.id === id));
  }

  getUsers(): Observable<User[]> {
    this.messageService.add('UserService: fetched users');
    return of(USERS);
  }
}
