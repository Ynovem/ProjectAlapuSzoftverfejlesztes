export interface Layout {
	id: number;
	name: string;
	created: string;
	coords: string;
}

export interface Displayable {
	displayed: boolean;
}

export class LayoutDisplay implements Layout, Displayable {
	id: number;
	name: string;
	coords: string;
	created: string;

	displayed: boolean;

	constructor(layout: Layout) {
		this.id = layout.id;
		this.name = layout.name;
		this.coords = JSON.parse(layout.coords);
		this.created = layout.created;

		this.displayed = false;
	}
}
