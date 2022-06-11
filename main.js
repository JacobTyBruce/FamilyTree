// main file for html display

var canvas = document.getElementById('grid')
var ctx = canvas.getContext('2d')
ctx.fillStyle = 'red'

var map = []

let slot_init = 0;

let slot_width = 100;
let slot_height = 100;
let slot_num = 9;
let gutter = 30;

canvas.width = (slot_num*slot_width)+(gutter*slot_num)+gutter;
canvas.height = (slot_num*slot_height)+(gutter*slot_num)+gutter;

// loop to create map points

// loop thru rows
for (let r  = 0; r < slot_num; r++) {
    // then by slots in the ind. row to allow for left-to-right dir in grid
    for (let s = 0; s < slot_num; s++) {
        // init top left corner
        map[slot_init] = {
            tl: {
                x: s*slot_width+1+gutter*s+gutter,
                y: r*slot_height+1+gutter*r+gutter,
            },
            content: null,
        }
        
        /*
        // remove gutter margin if applicable
        if (r == 0) {
            map[slot_init].tl.y -= gutter;
        }
        if (s == 0) {
            map[slot_init].tl.x -= gutter;
        }
        */
        slot_init++;
    }
}

// draw dots in each tl corner
for (let slot in map) {
    ctx.beginPath();
    ctx.moveTo(map[slot].tl.x, map[slot].tl.y);
    //ctx.lineTo(map[slot].tl.x+slot_width/2, map[slot].tl.y+slot_height/2);
    ctx.rect(map[slot].tl.x, map[slot].tl.y, slot_width, slot_height)
    ctx.stroke();
}

console.log("Map Slots: ", map)