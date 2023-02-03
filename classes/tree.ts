import Member from "./member.js"
const { v4: uuid } = require('uuid');


export default class Tree {

    static #tree_list: NonNullable<Tree>[] = []; 

    #id: NonNullable<string>;
    #name: string;
    #root: NonNullable<Member>;
    #end: NonNullable<Member>;
    #width: NonNullable<number>;

    constructor(root: Member, name: string) {
        // assign id
        this.#id = 'T'+uuid();

        // assign root
        this.#root = root;

        // assign name if present
        if (name) {
            this.#name = name;
        } else {
            this.#name = "Untitled Family Tree";
        }


        // calculate width
        this.#width = this.#root.width;
    }

    static getTreeList(): NonNullable<Tree[]> {
        return Tree.#tree_list;
    }

    static getTreeByID(id: string): NonNullable<Tree> {
        return Tree.#tree_list.find(tree => tree.id === id);
    }

    get id(): NonNullable<string> {
        return this.#id;
    }

    get name(): string {
        return this.#name;
    }

    get root(): NonNullable<Member> {
        return this.#root;
    }

    get end(): NonNullable<Member> {
        return this.#end;
    }

    get width(): NonNullable<number> {
        return this.#width;
    }

    set name(name: string) {
        this.#name = name;
    }

    set root(root: NonNullable<Member>) {
        this.#root = root;
        this.#width = this.#root.width;
    }
 
    set end(end: NonNullable<Member>) {
        this.#end = end;
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            root: this.#root.id,
            end: this.#end.id,
            width: this.#width
        }
    }

}
