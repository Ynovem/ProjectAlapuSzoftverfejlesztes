import { Component, OnInit } from '@angular/core';

import { User } from '../user'

import { UserService } from "../user.service";
import { MessageService } from "../message.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  selectedUser?: User;

  users: User[] = [];

  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers()
        .subscribe(users => this.users = users)
  }
}
