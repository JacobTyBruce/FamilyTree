export default class List {
    #data: NonNullable<any[]>;

    constructor() {
        this.#data = []; // this is bad but it works
    }

    add(item: NonNullable<any>) {
        this.#data.push(item);
    }

    remove(item: NonNullable<any>) {
        this.#data = this.#data.filter((x) => x !== item);
    }

    get length() {
        return this.#data.length;
    }
}