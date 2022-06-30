// main file for html display

// Grid Setup

var canvas = document.getElementById("grid");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "red";

var map = [];

let slot_init = 0;

let slot_width = 101;
let slot_height = 101;
let slot_num = 9;
let gutter = 30;

// canvas.width = slot_num * slot_width + gutter * slot_num + gutter;
// canvas.height = slot_num * slot_height + gutter * slot_num + gutter;

canvas.width = (gutter + slot_width + gutter) * slot_num;
canvas.height = (gutter + slot_height + gutter) * slot_num;

// loop to create map points

// loop thru rows
for (let r = 0; r < slot_num; r++) {
  // then by slots in the ind. row to allow for left-to-right dir in grid
  for (let s = 0; s < slot_num; s++) {
    // init top left corner
    map[slot_init] = {
      tl: {
        x: s * slot_width + 1 + gutter * s + gutter,
        y: r * slot_height + 1 + gutter * r + gutter,
      },
      content: null,
    };

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

// draw boxes around each grid slot
// Loops through eahc slot object and draws based on TopLeft coord stored
for (let slot in map) {
  ctx.beginPath();
  ctx.moveTo(map[slot].tl.x, map[slot].tl.y);
  //ctx.lineTo(map[slot].tl.x+slot_width/2, map[slot].tl.y+slot_height/2);
  ctx.rect(map[slot].tl.x, map[slot].tl.y, slot_width, slot_height);
  ctx.stroke();
}

console.log("Map Slots: ", map);

// Slot Content Checker Interval
setInterval(() => {
  for (let s in map) {
    if (map[s].content != null) {
      ctx.beginPath();
      ctx.arc(
        map[s].tl.x + slot_width / 2 + 0.5,
        map[s].tl.y + slot_height / 2 + 0.5,
        slot_width / 2 - 10,
        0,
        2 * Math.PI
      );
      ctx.stroke();
    }
  }
}, 100);

// Canvas click event to check if slot clicked
canvas.addEventListener(
  "click",
  (e) => {
    console.log("-------Click Event-------");

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("x: " + x + " y: " + y);

    // figure out what box click was in, if any

    // first, divide click event position by padding+box length. This divides the grid into sectors.
    // Using INTEGER division, you can find what box/sector the click was in by dividing the click event position by the padding+box length.
    // Then, to find if the click event was in the padding or box region ofd the sector, use the MOD (%) of the posotion and box length + padding. This will return the reaminder i.e. how far in the sector it is, telling you if in paddong or in box

    // Index : Position / Box Length+Padding
    // Box or Padding : Position % Box Length+Padding

    let xSector = Math.floor(x / (slot_height + gutter));
    console.log("Click in x sector: " + xSector);

    let ySector = Math.floor(y / (slot_width + gutter));
    console.log("Click in y sector: " + ySector);

    let slot = (ySector*slot_num)+xSector;
    console.log("Slot #: " + slot);

    console.log("-------------------------");
  },
  false
);

// Create Map Button Function

var createBtn = document.getElementById("create");

createBtn.addEventListener("click", (e) => {
  console.log("Create Clicked");
  map[0].content = "test";
  console.log(map[0]);
});
