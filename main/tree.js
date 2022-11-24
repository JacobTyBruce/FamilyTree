export default class Tree {

    name;
    root;
    end;
    width;

    constructor(pop_obj) {
        if (pop_obj.root) {
            this.root = pop_obj.root;
            this.width = this.root.width;
        } else {
            this.root = null;
            this.width = 0;
        }

        if (pop_obj.name) {
            this.name = pop_obj.name;
        } else {
            this.name = null;
        }  
        this.end = null;
    }
}
