export interface IRuleBase {
	name: string;
	limit: number;
}

export class RuleBase implements IRuleBase {
	name: string = "";
	limit: number = 150;

	constructor(rule?: IRuleBase) {
		if (rule) {
			this.name = rule.name;
			this.limit = rule.limit;
		}
	}
}

export interface IRule extends IRuleBase{
	id: number;
}

export class Rule extends RuleBase implements IRule {
	id: number;

	constructor(rule: IRule) {
		super(rule);

		this.id = rule.id;
	}
}
