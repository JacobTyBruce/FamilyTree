import Member from "./member.js";
import List from "./list.js";

export default class MemberList extends List {
    #members: NonNullable<Member[]>;

    constructor() {
        super();
        this.#members = [];
    }

    getMemberById(id: NonNullable<string>): Member {
        return this.#members.find((member) => member.id === id);
    }

    getMemberByName(name: NonNullable<string>): Member {
        return this.#members.find((member) => member.name === name);
    }

    add(item: NonNullable<Member>): void {
        // check if already in the list
        if (this.#members.includes(item)) {
            return;
        }
        // add item to data in descending order of member's pledgeClassNum
        this.#members.forEach((member) => {
            if (item.pledgeClassNum < member.pledgeClassNum) {
                this.#members.splice(this.#members.indexOf(member), 0, item);
            }
        })
        
    }

    remove(item: NonNullable<Member>): void {
        this.#members.splice(this.#members.indexOf(item), 1);
    }

}