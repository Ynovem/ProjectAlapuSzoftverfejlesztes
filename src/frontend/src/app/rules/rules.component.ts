import { Component, OnInit } from '@angular/core';

class Rule {
  constructor(public id: number, public name: string, public limit: number)
  {
  }
}

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules: Rule[] = []

  constructor() { }

  ngOnInit(): void {
    this.rules = [
        new Rule(1, "Standard covid rules - 15cm", 150),
    ]
  }
}
