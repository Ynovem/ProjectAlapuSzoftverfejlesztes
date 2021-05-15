export interface ILayout {
	id: number;
	name: string;
	created: string;
	coords: string;
}

export interface Displayable {
	displayed: boolean;
}

export class Layout implements ILayout{
	id: number;
	name: string;
	coords: string;
	created: string;

	constructor(layout: ILayout) {
		this.id = layout.id;
		this.name = layout.name;
		this.coords = layout.coords;
		this.created = layout.created;
	}
}

export class LayoutDisplay extends Layout implements Displayable {
	displayed: boolean;

	constructor(layout: ILayout) {
		super(layout);

		this.displayed = false;
	}
}
