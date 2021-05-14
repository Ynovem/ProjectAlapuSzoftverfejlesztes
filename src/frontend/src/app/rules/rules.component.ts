import { Component, OnInit } from '@angular/core';
import { RuleBase, Rule } from '../_dtos/rule';
import { RuleService } from '../_services/rule.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules: Rule[] = [];
  newRule: RuleBase;

  constructor(private ruleService: RuleService) {
    this.newRule = new RuleBase();
  }

  ngOnInit(): void {
    this.getRules();
  }

  getRules(): void {
    this.ruleService.getRules()
        .subscribe(rules => this.rules = rules);
  }

  saveRule(): void {
    this.ruleService.saveRule(this.newRule).subscribe(data => {
      this.getRules();
      console.log(data);
    });
  }
}
