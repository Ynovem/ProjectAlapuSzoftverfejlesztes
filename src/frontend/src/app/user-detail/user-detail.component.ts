import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  @Input() user?: User;

  constructor(
      private route: ActivatedRoute,
      private userSerivce: UserService,
      private location: Location,
  ) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    if (!this.route.snapshot.paramMap.has('id')) {
      return;
    }

    let id = +this.route.snapshot.paramMap.get('id')!;
    this.userSerivce.getUser(id)
        .subscribe(user => this.user = user);
  }

  goBack(): void {
    this.location.back();
  }
}
