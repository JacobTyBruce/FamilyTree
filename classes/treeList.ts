import Tree from "./tree"
import List from "./list"

export default class TreeList extends List {
    #data: NonNullable<Tree[]>;

    constructor() {
        super();
    }

    getTreeByName(name: NonNullable<string>): Tree {
        return this.#data.find((tree) => tree.name === name);
    }

}