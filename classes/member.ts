const { v4: uuid } = require('uuid');
import Tree from './tree.js'
 
type greekLetter =
    "alpha"   | // 1
    "beta"    | // 2
    "gamma"   | // 3
    "delta"   | // 4
    "epsilon" | // 5
    "zeta"    | // 6
    "eta"     | // 7
    "theta"   | // 8
    "iota"    | // 9
    "kappa"   | // 10
    "lambda"  | // 11
    "mu"      | // 12
    "nu"      | // 13
    "xi"      | // 14
    "omicron" | // 15
    "pi"      | // 16
    "rho"     | // 17
    "sigma"   | // 18
    "tau"     | // 19
    "upsilon" | // 20
    "phi"     | // 21
    "chi"     | // 22
    "psi"     | // 23
    "omega" // 24

type pledgeClass = `${greekLetter} ${greekLetter}`

type image = `data:image/${'png' | 'jpg' | 'jpeg' | 'gif' | 'svg' | 'webp'};base64,${string}`

const alphabet = [
    "alpha", // 1
    "beta", // 2
    "gamma", // 3
    "delta", // 4
    "epsilon", // 5
    "zeta", // 6
    "eta", // 7
    "theta", // 8
    "iota", // 9
    "kappa", // 10
    "lambda", // 11
    "mu", // 12
    "nu", // 13
    "xi", // 14
    "omicron", // 15
    "pi", // 16
    "rho", // 17
    "sigma", // 18
    "tau", // 19
    "upsilon", // 20
    "phi", // 21
    "chi", // 22
    "psi", // 23
    "omega", // 24
  ];

export default class Member {

    // TODO: Sort member array by pledgeClassNum
    static #member_list = [];

    #id: NonNullable<string>; // fck uuid types
    #name: NonNullable<string>;
    #pledgeClass: pledgeClass | null;
    #pledgeClassNum: number | null;
    #big: Member | string | null;
    #littles: Member[] | null;
    #picture: image | null;
    #bio: string | null;   
    #familyTree: Tree | null; // figure out how to implement this later/assign automatically once added to tree?
    #width: NonNullable<number>;

    constructor(
        type: NonNullable<number>,
        name: NonNullable<string>, 
        pc: pledgeClass | undefined, 
        big: string | undefined, 
        id: string | undefined, 
        littles: string[] | undefined, 
        pic: image | undefined,
        bio: string | undefined
        ) {

        // If at any point, any param is give  as an UUID, that means it comes from a JSON conversion and the member needs to be looked up because they exist

        // TYPES OF CONSTRUCTION
        // 1. new Member(type = 1, name, pc, big, id (undefined), littles (undefined), pic (optional), bio (optional))
        // 2. reconstruction from JSON (type = 0, name, pc, big, id, littles, pic, bio)


        // if big == 'root' then this.big = null

        if (type == 1) {

            // check if member already exists in member array
            Member.#member_list.forEach((member) => {
                if (member.name == name) {
                    throw new Error('Member already exists');
                }
            });

            this.#name = name;
            this.#id = 'M'+uuid();


            this.#pledgeClass = pc;
            this.#pledgeClassNum = this.getPCNum();


            // assign big
            if (big == 'root') {
                this.#big = null;
            } else {
                // lookup if big exists, if not assign big to string name
                Member.#member_list.forEach((member) => {
                    if (member.name == big) {
                        this.#big = member;
                        // add this member to big's littles array
                        member.addLittle(this);

                    }
                });
                if (this.#big == undefined) {
                    this.#big = big;
                }
            }

            // check for littles
            let temp_littles = [];
            Member.#member_list.forEach((member) => {
                // big is string and not reference to member at this point, so add to littles array and change big to reference to this member
                if (member.big == name) {
                    temp_littles.push(member);
                    member.big = this;
                }
            });
            if (temp_littles.length == 0) {
                this.#littles = null;
            } else {
                this.#littles = temp_littles;
            }

            if (pic == undefined) {
                this.#picture = null;
            } else {
                this.#picture = pic;
            }

            if (bio == undefined) {
                this.#bio = null;
            } else {
                this.#bio = bio;
            }

            this.#familyTree = null;
            // assign width
            this.#width = this.#calculateWidth();

        } else if (type == 0) {

            // reconstruct member from JSON
            this.#name = name;
            this.#id = id;
            this.#pledgeClass = pc;
            this.#pledgeClassNum = this.getPCNum();

            if (big == 'root') {
                this.#big = null;
            } else {
                // check if big is created
                Member.#member_list.forEach((member) => {
                    if (member.name == big) {
                        this.#big = member;
                        member.addLittle(this);
                    }
                });
                if (this.#big = undefined) {
                    // assign name of big
                    this.#big = big;
                }
            }

            // littles array is array of ID's of littles
            // find littles by ID if they exist
            if (littles.length == 0) {

                let temp_littles = [];
                littles.forEach((little) => {
                    let found = false;
                    Member.#member_list.forEach((member) => {
                        if (member.id == little) {
                            member.addLittle(this);
                            member.big = this;
                            found = true;
                        }
                    });
                    if (!found) {
                        
                    }
                });
                this.#littles = temp_littles;
            } else {
                this.#littles = null;
            }

            if (pic == undefined) {
                this.#picture = null;
            } else {
                this.#picture = pic;
            }

            if (bio == undefined) {
                this.#bio = null;
            } else {
                this.#bio = bio;
            }

            this.#familyTree = null;

        } else {
            throw new Error("Invalid type of member");
        }

        Member.#member_list.push(this);
        // sort in order of pledgeClassNum in descending order
        Member.#member_list.sort((a, b) => {
            return b.pledgeClassNum - a.pledgeClassNum;
        });  
    }

    static getMemberList(): Member[] {
        return Member.#member_list;
    }

    getPCNum(): number | null {
        if (this.#pledgeClass == null) {
            return null;
        }

        let pledgeClassLetters = this.#pledgeClass.split(" ");
        if (pledgeClassLetters.length == 1) {
            return alphabet.indexOf(pledgeClassLetters[0].toLocaleLowerCase()) + 1;
        } else {
            return (
                (alphabet.indexOf(pledgeClassLetters[0].toLowerCase())+1) * 24 +
                (alphabet.indexOf(pledgeClassLetters[1].toLowerCase()) + 1)
            );
        }
    }

    #calculateWidth(): NonNullable<number> {
        if (this.#littles) {
            let new_width: number = this.#littles.length;
            // add each littles length to width
            this.#littles.forEach((little) => {
                if (little.width > 1) {
                    new_width += little.width-1;
                }
            });
            return new_width;
        } else {
            return 1;
        }
    }

    get id(): NonNullable<string> {
        return this.#id;
    }

    get name(): NonNullable<string> {
        return this.#name;
    }

    get pledgeClass(): pledgeClass | null {
        return this.#pledgeClass;
    }

    get pledgeClassNum(): NonNullable<number> {
        return this.#pledgeClassNum;
    }

    get picture(): image | null {
        return this.#picture;
    }

    get bio(): string {
        return this.#bio;
    }

    get littles(): Member[] | null {
        return this.#littles;
    }

    get big(): Member | string {
        return this.#big;
    }


    get familyTree(): NonNullable<Tree | null> {
        return this.#familyTree;
    }

    get width(): NonNullable<number> {
        return this.#width;
    }

    set name(name: NonNullable<string>) {
        this.#name = name;
    }

    set pledgeClass(pc: NonNullable<pledgeClass>) {
        this.#pledgeClass = pc;
        this.#pledgeClassNum = this.getPCNum();
    }

    set picture(pic: image | null) {
        this.#picture = pic;
    }

    set bio(bio: string) {
        this.#bio = bio;
    }

    // move to Member constructor, when member is added check if member would be little of big, and if so, add to littles array
    addLittle(lil: Member): void {

        // check if little is already in littles array
        if (this.#littles != null) {
            if (this.#littles.indexOf(lil) != -1) {
                throw new Error("Little already exists in littles array");
            } else {
                // check if little is first or last in descneidng order of pledgeClassNum
                if (lil.pledgeClassNum > this.#littles[0].pledgeClassNum) {
                    this.#littles.unshift(lil);
                    return;
                } else if (lil.pledgeClassNum < this.#littles[this.#littles.length - 1].pledgeClassNum) {
                    this.#littles.push(lil);
                    return;
                } else {
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
        } else {
            this.#littles = [lil];
        }
    }

    removeLittle(lil: Member): void {
        if (this.#littles != null) {
            if (this.#littles.indexOf(lil) != -1) {
                this.#littles.splice(this.#littles.indexOf(lil), 1);

                // check if little array is now empty
                if (this.#littles.length == 0) {
                    this.#littles = null;
                }

                // recalculate width
                this.#calculateWidth();
            } else {
                throw new Error("Little does not exist in littles array");
            }
        } else {
            throw new Error("Littles array is null");
        }
    }

    set big(big: Member | string) {
        if (typeof big === "string") {
            // just reassig big to new big since old one doesnt exsist
            this.#big = big;
        } else {
            // remove self from old big's littles array
            //this.#big.removeLittle(this);
            // add self to new big's littles array
            big.addLittle(this);
            // set new big
            this.#big = big;
        }
    }

    set familyTree(tree: NonNullable<Tree>) {
        this.#familyTree = tree;
    }

    toJSON() {
        // get littles ID into an array
        let littles: string[] = [];
        if (this.#littles) {
            this.#littles.forEach((little) => {
                littles.push(little.id);
            });
        } else {
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
            //big: this.#big.id,
            littles: littles,
            width: this.#width
        }
    }
        
    delete() {
        // check if shallow member
        if (this.#big === null) {
            throw new Error("Cannot delete shallow member");
        }
        // remove from member array
        Member.#member_list.splice(Member.#member_list.indexOf(this), 1);

        // remove self from big's little array
        //this.#big.removeLittle(this);

        // reset littles big to shallow instead of member
        let new_big = new Member(2, this.#name, undefined, undefined, undefined, undefined, undefined, undefined);
        if (this.#littles) {
            this.#littles.forEach((little) => {
                little.#big = new_big
            });
        }
    }
}
