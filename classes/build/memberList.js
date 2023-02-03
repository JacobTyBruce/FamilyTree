import List from "./list.js";
export default class MemberList extends List {
    #members;
    constructor() {
        super();
        this.#members = [];
    }
    getMemberById(id) {
        return this.#members.find((member) => member.id === id);
    }
    getMemberByName(name) {
        return this.#members.find((member) => member.name === name);
    }
    add(item) {
        // check if already in the list
        if (this.#members.includes(item)) {
            return;
        }
        // add item to data in descending order of member's pledgeClassNum
        this.#members.forEach((member) => {
            if (item.pledgeClassNum < member.pledgeClassNum) {
                this.#members.splice(this.#members.indexOf(member), 0, item);
            }
        });
    }
}
