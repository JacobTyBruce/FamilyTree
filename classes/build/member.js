const { v4: uuid } = require('uuid');
import Tree from './tree.js';
const alphabet = [
    "alpha",
    "beta",
    "gamma",
    "delta",
    "epsilon",
    "zeta",
    "eta",
    "theta",
    "iota",
    "kappa",
    "lambda",
    "mu",
    "nu",
    "xi",
    "omicron",
    "pi",
    "rho",
    "sigma",
    "tau",
    "upsilon",
    "phi",
    "chi",
    "psi",
    "omega", // 24
];
export default class Member {
    // TODO: Sort member array by pledgeClassNum
    static #member_list = [];
    static alphabet = alphabet;
    #id; // fck uuid types
    #name;
    #pledgeClass;
    #pledgeClassNum;
    #big; // UUID's OR Member Name if not created
    #littles; // UUID's
    #picture;
    #bio;
    #familyTree; // figure out how to implement this later/assign automatically once added to tree?
    #width;
    constructor(type, name, pc, big, pic, bio, id, littles) {
        // If at any point, any param is give  as an UUID, that means it comes from a JSON conversion and the member needs to be looked up because they exist
        // TYPES OF CONSTRUCTION
        // 1. new Member
        // (type = 1, name, pc, big, pic (optional), bio (optional))
        // 2. reconstruction from JSON 
        // (type = 0, name, pc, big, pic, bio, id, littles)
        // if big == 'root' then this.big = null
        // add to array at start so that search function will work and not return null
        Member.#member_list.push(this);
        if (type == 1) {
            // check if member already exists in member array
            Member.#member_list.forEach((member) => {
                if (member.name == name) {
                    throw new Error('Member already exists');
                }
            });
            this.#name = name;
            this.#id = 'M:' + uuid();
            this.#pledgeClass = pc;
            this.#pledgeClassNum = this.genPCNum();
            // assign big
            if (big == 'root') {
                this.#big = null;
            }
            else {
                // lookup if big exists, if not assign big to string name
                Member.#member_list.forEach((member) => {
                    if (member.name == big) {
                        this.#big = member.id;
                        // add this member to big's littles array
                        member.addLittle(this.#id);
                        // add to family tree -- set as end if pledge class is greater then end
                        this.#familyTree = member.familyTree;
                        if (Member.getMemberByID(member.familyTree.end).pledgeClassNum < this.#pledgeClassNum) {
                            member.familyTree.end = this.id;
                        }
                    }
                });
                if (this.#big == undefined) {
                    this.#big = big;
                    // assig new family tree
                    this.#familyTree = new Tree(this.#id);
                }
            }
            // check for littles
            console.log('TEST: ID TO ASSIGN TO LITTLES: ', this.#id);
            let temp_littles = [];
            Member.#member_list.forEach((member) => {
                if (member.big == this.#name) {
                    temp_littles.push(member.id);
                    member.big = this.#id;
                }
            });
            if (temp_littles.length == 0) {
                this.#littles = null;
            }
            else {
                this.#littles = temp_littles;
            }
            if (pic == undefined) {
                this.#picture = null;
            }
            else {
                this.#picture = pic;
            }
            if (bio == undefined) {
                this.#bio = null;
            }
            else {
                this.#bio = bio;
            }
            // assign width
            this.#width = this.#calculateWidth();
        }
        else if (type == 0) { //------------------------------------------------------------------
            // reconstruct member from JSON
            this.#name = name;
            this.#id = id;
            this.#pledgeClass = pc;
            this.#pledgeClassNum = this.genPCNum();
            this.#big = big;
            this.#littles = littles;
            this.#picture = pic;
            this.#bio = bio;
            this.#familyTree = null;
        }
        else {
            throw new Error("Invalid type of member");
        }
        // sort in order of pledgeClassNum in descending order
        Member.#member_list.sort((a, b) => {
            return b.pledgeClassNum - a.pledgeClassNum;
        });
    }
    static getMemberByID(searchID) {
        // log out both strings, for testing
        console.log('----- getMemberByID -----');
        console.log("Search: ", searchID);
        let found = null;
        Member.#member_list.forEach((mem) => {
            if (mem.id.trim() == searchID.trim()) {
                console.log("Found: ", mem.id);
                console.log("-------------------------");
                found = mem;
            }
            ;
        });
        if (found != null) {
            return found;
        }
        else {
            console.log("Not Found");
            console.log("-------------------------");
            return null;
        }
    }
    static delete(mem) {
        let tempMem = mem;
        mem = undefined;
        return tempMem;
    }
    static getMemberList() {
        return JSON.parse(JSON.stringify(Member.#member_list));
    }
    genPCNum() {
        if (this.#pledgeClass == null) {
            return null;
        }
        let pledgeClassLetters = this.#pledgeClass.split(" ");
        if (pledgeClassLetters.length == 1) {
            return alphabet.indexOf(pledgeClassLetters[0].toLocaleLowerCase()) + 1;
        }
        else {
            return ((alphabet.indexOf(pledgeClassLetters[0].toLowerCase()) + 1) * 24 +
                (alphabet.indexOf(pledgeClassLetters[1].toLowerCase()) + 1));
        }
    }
    #calculateWidth() {
        if (this.#littles) {
            let new_width = this.#littles.length;
            // add each littles length to width
            this.#littles.forEach((little) => {
                let littleMem = Member.getMemberByID(little);
                if (littleMem.width > 1) {
                    new_width += littleMem.width - 1;
                }
            });
            return new_width;
        }
        else {
            return 1;
        }
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get pledgeClass() {
        return this.#pledgeClass;
    }
    get pledgeClassNum() {
        return this.#pledgeClassNum;
    }
    get picture() {
        return this.#picture;
    }
    get bio() {
        return this.#bio;
    }
    get littles() {
        if (this.#littles == null)
            return null;
        let lilArray = [];
        this.#littles.forEach(lil => lilArray.push(Member.getMemberByID(lil)));
        return lilArray;
    }
    get big() {
        return this.#big;
    }
    get familyTree() {
        return this.#familyTree;
    }
    get width() {
        return this.#width;
    }
    set name(name) {
        this.#name = name;
    }
    set pledgeClass(pc) {
        this.#pledgeClass = pc;
        this.#pledgeClassNum = this.genPCNum();
    }
    set picture(pic) {
        this.#picture = pic;
    }
    set bio(bio) {
        this.#bio = bio;
    }
    addLittle(lil) {
        // check if little is already in littles array
        if (this.#littles != null) {
            if (this.#littles.indexOf(lil) != -1) {
                throw new Error("Little already exists in littles array");
            }
            else {
                // insert then sort
                this.#littles.unshift(lil);
                this.#littles.sort((a, b) => {
                    if (Member.getMemberByID(a).pledgeClassNum > Member.getMemberByID(b).pledgeClassNum) {
                        return -1;
                    }
                    else if (Member.getMemberByID(a).pledgeClassNum < Member.getMemberByID(b).pledgeClassNum) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                });
                // recalculate width
                this.#calculateWidth();
            }
        }
        else {
            this.#littles = [lil];
        }
    }
    removeLittle(lil) {
        if (this.#littles != null) {
            if (this.#littles.indexOf(lil) != -1) {
                this.#littles.splice(this.#littles.indexOf(lil), 1);
                // check if little array is now empty
                if (this.#littles.length == 0) {
                    this.#littles = null;
                }
                // recalculate width
                this.#calculateWidth();
            }
            else {
                throw new Error("Little does not exist in littles array");
            }
        }
        else {
            throw new Error("Littles array is null");
        }
    }
    set big(big) {
        console.log("Big: ", big);
        // check if big is string or id
        // if big is string (name), set big to name
        if (!(big.startsWith("M:", 0))) {
            // remove self from old big's littles array if the member exists
            if (Member.getMemberByID(this.#big) != null) {
                Member.getMemberByID(this.#big).removeLittle(this.#id);
            }
            this.#big = big;
        }
        else {
            // check if current big is name or id
            if (this.#big.startsWith("M:", 0)) {
                // remove self from old big's littles array
                Member.getMemberByID(this.#big).removeLittle(this.#id);
            }
            // set new big
            this.#big = big;
            // add self to new big's littles array
            Member.getMemberByID(big).addLittle(this.#id);
        }
    }
    set familyTree(tree) {
        this.#familyTree = tree;
    }
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            familyTree: null,
            pledgeClass: this.#pledgeClass,
            pledgeClassNum: this.#pledgeClassNum,
            picture: this.#picture,
            bio: this.#bio,
            //big: this.#big.id,
            littles: this.#littles,
            width: this.#width
        };
    }
    delete() {
        // remove self from big's little array
        Member.getMemberByID(this.#big).removeLittle(this.#id);
        // replace littles big with name instead of ID
        this.#littles.forEach(littleID => {
            let little = Member.getMemberByID(littleID);
            little.big = this.#name;
        });
        // remove from member array and delete
        Member.getMemberList().splice(Member.getMemberList().indexOf(this), 1);
        Member.delete(this);
    }
}
