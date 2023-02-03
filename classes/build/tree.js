const { v4: uuid } = require('uuid');
export default class Tree {
    static #tree_list = [];
    #id;
    #name;
    #root;
    #end;
    #width;
    constructor(root, name) {
        // assign id
        this.#id = 'T' + uuid();
        // assign root
        this.#root = root;
        // assign name if present
        if (name) {
            this.#name = name;
        }
        else {
            this.#name = "Untitled Family Tree";
        }
        // calculate width
        this.#width = this.#root.width;
    }
    static getTreeList() {
        return Tree.#tree_list;
    }
    static getTreeByID(id) {
        return Tree.#tree_list.find(tree => tree.id === id);
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get root() {
        return this.#root;
    }
    get end() {
        return this.#end;
    }
    get width() {
        return this.#width;
    }
    set name(name) {
        this.#name = name;
    }
    set root(root) {
        this.#root = root;
        this.#width = this.#root.width;
    }
    set end(end) {
        this.#end = end;
    }
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            root: this.#root.id,
            end: this.#end.id,
            width: this.#width
        };
    }
}
