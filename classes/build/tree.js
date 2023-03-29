import Member from "./member.js";
const { v4: uuid } = require('uuid');
export default class Tree {
    static #tree_list = [];
    #id;
    #root;
    #end;
    constructor(root_id) {
        // assign id
        this.#id = 'T:' + uuid();
        // assign root
        this.#root = root_id;
        this.#end = root_id;
        // add to tree list
        Tree.#tree_list.push(this);
        // calculate width
        console.log("Constructor: Root Member", root_id);
        console.log("Constructor: Root Member Get", Member.getMemberByID(root_id));
    }
    static getTreeList() {
        console.log("Tree List", Tree.#tree_list);
        console.log(JSON.stringify(Tree.#tree_list));
        return JSON.parse(JSON.stringify(Tree.#tree_list));
    }
    static resetTreeList() {
        Tree.#tree_list = [];
    }
    static getTreeByID(id) {
        return Tree.#tree_list.find(tree => tree.id === id);
    }
    get id() {
        return this.#id;
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
    set root(root) {
        this.#root = root;
    }
    set end(end) {
        this.#end = end;
    }
    del() {
        // delete object
        Tree.#tree_list = Tree.#tree_list.filter(tree => tree.id !== this.#id);
    }
    toJSON() {
        return {
            id: this.#id,
            root: this.#root,
            end: this.#end
        };
    }
}
