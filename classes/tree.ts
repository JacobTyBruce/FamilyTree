import Member from "./member.js"
const { v4: uuid } = require('uuid');


export default class Tree {

    static #tree_list: NonNullable<Tree>[] = []; 

    #id: NonNullable<string>;
    #name: string;
    #root: NonNullable<string>;
    #end: NonNullable<string>;
    #width: NonNullable<number>;

    constructor(root_id: string, name: string) {
        // assign id
        this.#id = 'T:'+uuid();

        // assign root
        this.#root = root_id;

        // assign name if present
        if (name) {
            this.#name = name;
        } else {
            this.#name = "Untitled Family Tree";
        }


        // calculate width
        console.log("Constructor: Root Member", root_id)
        console.log("Constructor: Root Member Get", Member.getMemberByID(root_id));

        this.#width = Member.getMemberByID(this.#root).width;
    }

    static getTreeList(): NonNullable<Tree[]> {
        return Tree.#tree_list;
    }

    static resetTreeList(): void {
        Tree.#tree_list = [];
    }

    static getTreeByID(id: string): NonNullable<Tree> {
        return Tree.#tree_list.find(tree => tree.id === id);
    }

    static addTree(tree: NonNullable<Tree>): void {
        Tree.#tree_list.push(tree);
    }

    static removeTree(id: string): void {
        Tree.#tree_list = Tree.#tree_list.filter(tree => tree.id !== id);
    }

    get id(): NonNullable<string> {
        return this.#id;
    }

    get name(): string {
        return this.#name;
    }

    get root(): NonNullable<string> {
        return this.#root;
    }

    get end(): NonNullable<string> {
        return this.#end;
    }

    get width(): NonNullable<number> {
        return this.#width;
    }

    set name(name: string) {
        this.#name = name;
    }

    set root(root: NonNullable<string>) {
        this.#root = root;
        this.#width = Member.getMemberByID(this.#root).width;
    }
 
    set end(end: NonNullable<string>) {
        this.#end = end;
    }

}
