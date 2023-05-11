import Member from "./member.js"
const { v4: uuid } = require('uuid');


export default class Tree {

    static #tree_list: NonNullable<Tree>[] = []; 

    #id: NonNullable<string>;
    #root: NonNullable<string>;
    #end: NonNullable<string>;

    constructor(root_id: string) {
        // assign id
        this.#id = 'T:'+uuid();

        // assign root
        this.#root = root_id;
        this.#end = root_id;

        // add to tree list
        Tree.#tree_list.push(this);
    }

    static getTreeList(): NonNullable<Tree[]> {
        return JSON.parse(JSON.stringify(Tree.#tree_list))
    }

    static resetTreeList(): void {
        Tree.#tree_list = [];
    }

    static getTreeByID(id: string): NonNullable<Tree> {
        return Tree.#tree_list.find(tree => tree.id === id);
    }

    get id(): NonNullable<string> {
        return this.#id;
    }

    get root(): NonNullable<string> {
        return this.#root;
    }

    get end(): NonNullable<string> {
        return this.#end;
    }

    getWidth(): NonNullable<number> {
        return Member.getMemberByID(this.#root).width;
    }

    set root(root: NonNullable<string>) {
        this.#root = root;
    }
 
    set end(end: NonNullable<string>) {
        this.#end = end;
    }

    del(): void {
        // delete object
        Tree.#tree_list = Tree.#tree_list.filter(tree => tree.id !== this.#id);
    }

    toJSON(): Object {
        return {
            id: this.#id,
            root: this.#root,
            end: this.#end
        }
    }

}
