import List from "./list";
export default class TreeList extends List {
    #data;
    constructor() {
        super();
    }
    getTreeByName(name) {
        return this.#data.find((tree) => tree.name === name);
    }
}
