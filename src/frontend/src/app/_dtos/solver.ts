export interface ISolver {
	id: number;
	name: string;
	description: string;
}

export class Solver implements ISolver {
	id: number;
	name: string;
	description: string;

	constructor(solver: ISolver) {
		this.id = solver.id;
		this.name = solver.name;
		this.description = solver.description;
	}
}
