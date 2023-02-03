const { v4: uuid } = require('uuid');
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
    static #shallow_members = [];
    #id; // fck uuid types
    #name;
    #pledgeClass;
    #pledgeClassNum;
    #big;
    #littles;
    #picture;
    #bio;
    #familyTree; // figure out how to implement this later/assign automatically once added to tree?
    #width;
    constructor(type, name, pc, big, id, littles, pic, bio) {
        // If at any point, any param is give  as an UUID, that means it comes from a JSON conversion and the member needs to be looked up because they exist
        // TYPES OF CONSTRUCTION
        // 1. new Member(type = 1, name, pc, big, id (undefined), littles (undefined), pic (optional), bio (optional))
        // 2. reconstruction from JSON (type = 0, name, pc, big, id, littles, pic, bio)
        // 3. Shallow member (type = 2, name)
        // 4. Populate Shallow member (type = 3, name, pc, big, id, littles, pic, bio)
        // Type 0, 1 & 3 get added to members array 
        if (type == 1) {
            // check if member already exists in either array
            Member.#member_list.forEach((member) => {
                if (member.name == name) {
                    throw new Error('Member already exists');
                }
            });
            let shallow_member = null;
            Member.#shallow_members.forEach((member) => {
                if (member.name == name) {
                    shallow_member = member;
                }
            });
            if (shallow_member != null) {
                // shallow member exists, change Id and remove from shallow list
                shallow_member.#id = 'M' + shallow_member.#id.substring(1);
                Member.#shallow_members.splice(Member.#shallow_members.indexOf(shallow_member), 1);
            }
            else {
                this.#name = name;
                this.#id = 'M' + uuid();
            }
            this.#pledgeClass = pc;
            this.#pledgeClassNum = this.getPCNum();
            // lookup if big exists, if not create shallow member
            Member.#member_list.forEach((member) => {
                if (member.name == big) {
                    this.#big = member;
                }
            });
            if (this.#big == undefined) {
                this.#big = new Member(2, big, undefined, undefined, undefined, undefined, undefined, undefined);
            }
            // check for littles
            let temp_littles = [];
            Member.#member_list.forEach((member) => {
                if (member.big.name == name) {
                    temp_littles.push(member);
                }
            });
            // sort little arrya according to pledgeClassNum is descending order
            temp_littles.sort((a, b) => {
                return a.pledgeClassNum - b.pledgeClassNum;
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
            this.#familyTree = null;
            // assign width
            this.#width = this.#calculateWidth();
        }
        else if (type == 0) {
            // reconstruct member from JSON
            this.#name = name;
            this.#id = id;
            this.#pledgeClass = pc;
            this.#pledgeClassNum = this.getPCNum();
            // big is already created
            Member.#member_list.forEach((member) => {
                if (member.name == big) {
                    this.#big = member;
                }
            });
            if (this.#big = undefined) {
                // check shallow members
                Member.#shallow_members.forEach((member) => {
                    if (member.name == big) {
                        this.#big = member;
                    }
                });
            }
            // littles array is array of ID's of littles --i dont think this works
            if (littles.length == 0) {
                let temp_littles = [];
                littles.forEach((little) => {
                    if (little[0] == 'S') {
                        // shallow member
                        Member.#shallow_members.forEach((member) => {
                            if (member.id == little) {
                                temp_littles.push(member);
                            }
                        });
                    }
                    else {
                        // member
                        Member.#member_list.forEach((member) => {
                            if (member.id == little) {
                                temp_littles.push(member);
                            }
                        });
                    }
                });
                this.#littles = temp_littles;
            }
            else {
                this.#littles = null;
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
            this.#familyTree = null;
        }
        else if (type == 2) {
            // create shallow member
            this.#name = name;
            this.#id = 'S' + uuid();
            this.#pledgeClass = null;
            this.#pledgeClassNum = null;
            this.#big = null;
            // check for littles
            let temp_littles = [];
            Member.#member_list.forEach((member) => {
                if (member.big.name == name) {
                    this.#littles.push(member);
                }
            });
            if (temp_littles.length == 0) {
                this.#littles = null;
            }
            else {
                this.#littles = temp_littles;
            }
            this.#picture = null;
            this.#bio = null;
            this.#familyTree = null;
            this.#width = this.#calculateWidth();
        }
        else if (type == 3) {
            // find unpopulatted shallow member
            let shallow_populate = Member.#shallow_members.find((member) => member.name == name);
            if (shallow_populate == undefined) {
                throw new Error('Shallow member not found');
            }
            shallow_populate.#id = 'M' + shallow_populate.#id.slice(1);
            shallow_populate.#pledgeClass = pc;
            shallow_populate.#pledgeClassNum = shallow_populate.getPCNum();
            // lookup if big exists, if not create shallow member
            Member.#member_list.forEach((member) => {
                if (member.name == big) {
                    shallow_populate.#big = member;
                }
            });
            if (shallow_populate.#big == undefined) {
                // check shallow members
                Member.#shallow_members.forEach((member) => {
                    if (member.name == big) {
                        shallow_populate.#big = member;
                    }
                });
                if (shallow_populate.#big == undefined) {
                    shallow_populate.#big = new Member(2, big, undefined, undefined, undefined, undefined, undefined, undefined);
                }
            }
        }
        else {
            throw new Error("Invalid type of member");
        }
        if (type == 0 || type == 1 || type == 3) {
            Member.#member_list.push(this);
            // sort in order of pledgeClassNum in descending order
            Member.#member_list.sort((a, b) => {
                return b.pledgeClassNum - a.pledgeClassNum;
            });
        }
    }
    static getMemberList() {
        return Member.#member_list;
    }
    getPCNum() {
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
                if (little.width > 1) {
                    new_width += little.width - 1;
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
        return this.#littles;
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
        this.#pledgeClassNum = this.getPCNum();
    }
    set picture(pic) {
        this.#picture = pic;
    }
    set bio(bio) {
        this.#bio = bio;
    }
    // move to Member constructor, when member is added check if member would be little of big, and if so, add to littles array
    addLittle(lil) {
        // check if little is already in littles array
        if (this.#littles != null) {
            if (this.#littles.indexOf(lil) != -1) {
                throw new Error("Little already exists in littles array");
            }
            else {
                // check if little is first or last in descneidng order of pledgeClassNum
                if (lil.pledgeClassNum > this.#littles[0].pledgeClassNum) {
                    this.#littles.unshift(lil);
                    return;
                }
                else if (lil.pledgeClassNum < this.#littles[this.#littles.length - 1].pledgeClassNum) {
                    this.#littles.push(lil);
                    return;
                }
                else {
                    // insert little in correct position in descending order
                    this.#littles.forEach((little) => {
                        if (lil.pledgeClassNum < little.pledgeClassNum) {
                            this.#littles.splice(this.#littles.indexOf(little), 0, lil);
                        }
                    });
                }
                // loop through little array and insert in descending order of pledgeClassNum
                this.#littles.forEach((little) => {
                    if (little.pledgeClassNum < lil.pledgeClassNum) {
                        this.#littles.splice(this.#littles.indexOf(little), 0, lil);
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
        // remove self from old big's littles array
        this.#big.removeLittle(this);
        // add self to new big's littles array
        big.addLittle(this);
        // set new big
        this.#big = big;
    }
    set familyTree(tree) {
        this.#familyTree = tree;
    }
    toJSON() {
        // get littles ID into an array
        let littles = [];
        if (this.#littles) {
            this.#littles.forEach((little) => {
                littles.push(little.id);
            });
        }
        else {
            littles = null;
        }
        return {
            id: this.#id,
            name: this.#name,
            familyTree: this.#familyTree.id,
            pledgeClass: this.#pledgeClass,
            pledgeClassNum: this.#pledgeClassNum,
            picture: this.#picture,
            bio: this.#bio,
            big: this.#big.id,
            littles: littles,
            width: this.#width
        };
    }
    delete() {
        // check if shallow member
        if (this.#big === null) {
            throw new Error("Cannot delete shallow member");
        }
        // remove from member array
        Member.#member_list.splice(Member.#member_list.indexOf(this), 1);
        // remove self from big's little array
        this.#big.removeLittle(this);
        // reset littles big to shallow instead of member
        let new_big = new Member(2, this.#name, undefined, undefined, undefined, undefined, undefined, undefined);
        if (this.#littles) {
            this.#littles.forEach((little) => {
                little.#big = new_big;
            });
        }
    }
}
