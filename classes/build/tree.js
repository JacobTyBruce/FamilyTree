import Member from "./member.js";
const { v4: uuid } = require('uuid');
export default class Tree {
    static #tree_list = [];
    #id;
    #name;
    #root;
    #end;
    constructor(root_id, name) {
        // assign id
        this.#id = 'T:' + uuid();
        // assign root
        this.#root = root_id;
        // assign name if present
        if (name) {
            this.#name = name;
        }
        else {
            this.#name = "Untitled Family Tree";
        }
        // calculate width
        console.log("Constructor: Root Member", root_id);
        console.log("Constructor: Root Member Get", Member.getMemberByID(root_id));
    }
    static getTreeList() {
        return Tree.#tree_list;
    }
    static resetTreeList() {
        Tree.#tree_list = [];
    }
    static getTreeByID(id) {
        return Tree.#tree_list.find(tree => tree.id === id);
    }
    static addTree(tree) {
        Tree.#tree_list.push(tree);
    }
    static removeTree(id) {
        Tree.#tree_list = Tree.#tree_list.filter(tree => tree.id !== id);
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
        return Member.getMemberByID(this.#root).width;
    }
    set name(name) {
        this.#name = name;
    }
    set root(root) {
        this.#root = root;
    }
    set end(end) {
        this.#end = end;
    }
}
