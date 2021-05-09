export interface ISeat {
	x: number;
	y: number;
	busy: boolean;
}

export class Seat implements ISeat {
	busy: boolean;

	constructor(public x: number, public y: number) {
		this.busy = false;
	}

	public toJson() {
		return {
			'x': this.x,
			'y': this.y,
			'busy': this.busy,
		}
	}
}

export class OptSeat extends Seat{
	disabled: boolean;

	constructor(public x: number, public y: number) {
		super(x, y);
		this.disabled = false;
	}

	public getSeat(): Seat {
		let seat: Seat = new Seat(this.x, this.y);
		seat.busy = this.busy;

		return seat;
	}
}

export class Metric {
	count: number = 5;
	distance: number = 150;
	offset: number = 0;
	offsetFirst: boolean = false;
}

export class SeatMapMetric {
	row: Metric = new Metric();
	col: Metric = new Metric();
}

export let SampleLayout = {
	row: {
		count: 0,
		space: 0,
		offset: {
			space: 0,
			fromFirst: false,
		},
	},
	col: {
		count: 0,
		space: 0,
		offset: {
			space: 0,
			fromFirst: false,
		},
	},
}



export class SeatLayout {
	constructor(public id: number|null, public name: string, public seats: Seat[], public thumbnail: string) {
	}
}

export class Solver {
	constructor(public id: number, public name: string, public description: string) {
	}
}

export class Solution {
	// id: number;
	// solver: Solver;
	constructor(public id: number, public solver: Solver) {
	}
}
