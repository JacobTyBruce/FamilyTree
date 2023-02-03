export default class List {
    #data;
    constructor() {
        this.#data = []; // this is bad but it works
    }
    add(item) {
        this.#data.push(item);
    }
    remove(item) {
        this.#data = this.#data.filter((x) => x !== item);
    }
    get length() {
        return this.#data.length;
    }
}
