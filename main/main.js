// family tree class import
import Tree from './tree.js';

// ERROR REPORTS
/*

  For some god damn reason i you have to freshen the members pledge class number at damn near every step in generation, i have no god damn clue what is going on here, but it is fucking annoying as hell
  It works for now, but is a very ruggid fix and would like to find out what is going on later

*/

// TODO:
/*

1. Make member class type and transform all functions that interact -- HUGE Overhaul
2. Clean up file and get rid of useless code

*/




// main file for html display

const main = document.getElementById("main");

// Pledge Class Dimensions
const pledge_class_row_height = 100;

const pledge_class_node_w = 150;
const pledge_class_node_h = 80;


// Generation View Setup

var canvas = document.getElementById("grid");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "red";

// Pledge Class View Setup
let pcts = window.getComputedStyle(document.getElementById('tree-pc'));

var stage = new Konva.Stage({
  container: "tree-pc",
  width: pcts.width.replace("px",""),
  height: pcts.height.replace("px",""),
  draggable: true,
});

var layer = new Konva.Layer();
stage.add(layer);

// select view code
const select_view = document.getElementById("view");
select_view.onchange = (v) => {
  if (v.target.value == "gen") {
    document.getElementById("tree").style.display = "block";
    document.getElementById("tree-pc").style.display = "none";
  } else {
    document.getElementById("tree").style.display = "none";
    document.getElementById("tree-pc").style.display = "block";
  }
}

// useless im mpretty sure -- legacy grid
var map = [];

// total members array
var members = [];

// download link/data str
var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members));

// greek alphabet for figuring out pledge class order
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

let slot_init = 0;

// Make sure these match up with canvas dimensions, they are shared across HTML, JS, and CSS in that order
// just make sure the computations can fit
// EVENTUALLY make it be based off of rendered size and width
// Padding = 1 Slot = 3 | 1-3-1 spacing
let slot_width = 61;
let slot_height = 61;
let slot_num = 9;
let gutter = 20;

canvas.width = (gutter + slot_width + gutter) * slot_num;
console.log("Changed width: " + canvas.width);
canvas.height = (gutter + slot_height + gutter) * slot_num;
console.log("Changed height: " + canvas.height);

// loop to create map points

// loop thru rows
for (let r = 0; r < slot_num; r++) {
  // then by slots in the ind. row to allow for left-to-right dir in grid
  for (let s = 0; s < slot_num; s++) {
    // init top left corner
    map[slot_init] = {
      tl: {
        /*
        x: s * slot_width + 1 + gutter * s + gutter,
        y: r * slot_height + 1 + gutter * r + gutter,
        */

        x: gutter + 1 + (gutter + slot_width + gutter) * s,
        y: gutter + 1 + (gutter + slot_height + gutter) * r,
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

    //const rect = canvas.getBoundingClientRect();
    //const x = e.clientX - rect.left;
    //const y = e.clientY - rect.top;
    const x = e.offsetX;
    const y = e.offsetY;
    console.log("x: " + x + " y: " + y);

    // figure out what box click was in, if any

    // first, divide click event position by padding+box length. This divides the grid into sectors.
    // Using INTEGER division, you can find what box/sector the click was in by dividing the click event position by the padding+box length.
    // Then, to find if the click event was in the padding or box region ofd the sector, use the MOD (%) of the posotion and box length + padding. This will return the reaminder i.e. how far in the sector it is, telling you if in paddong or in box

    // Index : Position / Box Length+Padding
    // Box or Padding : Position % Box Length+Padding

    let xSector = Math.floor(x / (gutter + slot_width + gutter));
    console.log(
      "Click in x sector: " +
        x +
        " / " +
        (gutter + slot_width + gutter) +
        " = " +
        xSector
    );

    let ySector = Math.floor(y / (gutter + slot_height + gutter));
    console.log(
      "Click in y sector: " +
        y +
        " / " +
        (gutter + slot_width + gutter) +
        " = " +
        ySector
    );

    let slot = ySector * slot_num + xSector;
    console.log("Slot #: " + slot);

    // find if clicked in slot or padding
    let sectorX = x % (gutter + slot_width + gutter);
    let sectorY = y % (gutter + slot_width + gutter);
    let clickedSlot =
      sectorX > gutter &&
      sectorX <= gutter + slot_width &&
      sectorY > gutter &&
      sectorY <= gutter + slot_height
        ? true
        : false;

    console.log(clickedSlot ? "Clicked in Slot" : "Clicked in margin");

    // display popup
    if (clickedSlot) {
      createPopup(e.pageX, e.pageY, map[slot]);
    } else {
      const previousPopup = document.getElementsByClassName("popup");
      if (previousPopup.length > 0) {
        previousPopup[0].remove();
      }
    }

    console.log("-------------------------");
  },
  false
);

// create btn function to reduce redundency
function createButton(text, color, parent) {
  const newBtn = document.createElement("button");
  newBtn.innerText = text;
  newBtn.style.background = color;
  parent.appendChild(newBtn);

  return newBtn;
}

// Create popup function
function createPopup(x, y, slot) {
  // PARAMS: x pos of click, y pos of click: both rel to page
  // slot: slot obj of the one clicked on

  // possibly put popup after slot, just use slot obj pos info to position

  // remove any container already on page
  const previousPopup = document.getElementsByClassName("popup");
  if (previousPopup.length > 0) {
    previousPopup[0].remove();
  }

  // create container div
  const container = document.createElement("div");
  container.classList.add("popup");
  container.style.left = x + "px";
  container.style.top = y + "px";

  // create button list
  const btn_ctnr = document.createElement("div");
  btn_ctnr.classList.add("btn-area");
  container.appendChild(btn_ctnr);

  const txt_ctnr = document.createElement("p");
  txt_ctnr.classList.add("txt-area");
  container.appendChild(txt_ctnr);

  // add exit btn
  const exit_btn = document.createElement("button");
  exit_btn.innerText = "X";
  exit_btn.classList.add("exit");
  btn_ctnr.appendChild(exit_btn);

  // add exit func
  exit_btn.onclick = () => {
    const popup = document.getElementsByClassName("popup");
    popup[0].remove();
  };

  // Create Map Button Function
  if (slot.content == null) {
    // if no content set
    txt_ctnr.innerText = "No info has been set for this slot.";
  } else {
    // if there is content set
    const view_btn = createButton("View", "blue", btn_ctnr);
    const edit_btn = createButton("Edit", "orange", btn_ctnr);
    const delete_btn = createButton("Delete", "maroon", btn_ctnr);

    view_btn.onclick = () => {
      alert(slot.content);
    };

    edit_btn.onclick = () => {
      create_slot_data(map.indexOf(slot), true);
    };
  }

  document.body.appendChild(container);
}

// family tree helper functions --------------
function findMemberByName(name) {
  for (let m in members) {
    if (members[m].name == name) return members[m];
  }
  return -1;
}


// button functionailties

// Slot Creating/Editing ----------------------

function create_slot_data(slot, existing) {
  // TODO - Edit this as it is not needed
  //document.getElementById("create-slot").value = slot;
  //slot = map[slot];

  // create slot data input menu
  document.body.classList.add("disable-scrolling");

  const overlay = document.getElementsByClassName("full-overlay")[0];
  overlay.style.display = "flex";

  // add exit btn func
  document.getElementsByClassName("add-exit")[0].onclick = () => {
    document.body.classList.remove("disable-scrolling");
    overlay.style.display = "none";
  };

  //-------------------------- Adjust search bar width

  const big_textbox = document.getElementById("big-entry");
  const big_search = document.getElementById("search");
  big_search.style.width = big_textbox.offsetWidth + "px";

  //--------------------------

  const submit = document.getElementById("form-submit");

  //-------------------------- Fill in values if existing

  if (existing) {
    const name_fill = document.getElementById("name-fill");
    const pc = document.getElementById("pledgeClass");
    // figure out what to do with picture
    const pic = document.getElementById("pic");

    name_fill.value = slot.content.name;
    console.log(slot.content.name);
    pc.value = slot.content.pledgeClass;
    pic.value = slot.content.picture;
    big_textbox.value = slot.content.big;

    submit.value = "Update";
    submit.style.background = "orange";
  } else {
    submit.value = "Create";
    submit.style.background = "lime";
  }

  //--------------------------

  // search feature
  big_textbox.oninput = (e) => {
    // get current input and try to match it with already inputted members
    let current_in = big_textbox.value;

    // remove previous entries
    big_search.innerHTML = "";

    // check for empty string
    if (big_textbox.value.length == 0) {
      big_search.innerHTML = "";
    } else {
      for (mem in members) {
        if (
          current_in.toLowerCase() ==
          members[mem].name.substring(0, current_in.length).toLowerCase()
        ) {
          let search_item = document.createElement("p");
          search_item.classList.add("search-item");
          search_item.innerText = members[mem].name;

          search_item.onclick = (e) => {
            big_textbox.value = e.target.innerText;
            big_search.innerHTML = "";
          };
          big_search.appendChild(search_item);
        }
      }
    }
  };

  // form submit
  const form = document.getElementById("slot-form");

  // freshen values by capping first letter of each word
  function freshen(str) {
    return (
      str
        .toLowerCase()
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        // .trim() have this work eventually, it doesnt return right value ot be chained
        .join(" ")
    );
  }

  form.onsubmit = (e) => {
    e.preventDefault();

    // TODO - convert picture to string to store
    let new_mem = {
      name: freshen(e.target[0].value),
      pledgeClass: freshen(e.target[1].value),
      pledgeClassNum: 0,
      picture: e.target[2].files.length > 0 ? "Picture" : null,
      big: freshen(big_textbox.value),
      littles: [],
      familyTree: null,
    };

    // add littles to new member if any apply, just search members array

    // Littles are entered first, Big is being populated here

    for (let m in members) {
      if (members[m].big == new_mem.name) {
        let new_little = members[m];
        // add in reverse numerical order by pledge class
        // oldest first
          new_mem.littles.unshift(new_little);
      }
    }

    // add to big's little array
    // Big is entered first, little second, populating big's little array with this member

    let big = findMemberByName(new_mem.big);
    console.log(new_mem.name + "'s big was " + ( (big != -1) ? " found!" : " not found!" ), big);
    // perhaps redefine big prop as big obj later on, will have to rework a few systems to display obj.name instead of name prop
    if (big != -1) {
      big.littles.unshift(new_mem);
      // sort bigs littles array
      big.littles.sort((a, b) => {
        if (a.pledgeClassNum < b.pledgeClassNum) {
          return -1;
        } else if (a.pledgeClassNum > b.pledgeClassNum) {
          return 1;
        } else {
        return 0;
        }
      })
      console.log(big.name + "'s little array sorted: ", big.littles);
    }
    

    // set pledgeClassNum
    let pledgeClassLetters = new_mem.pledgeClass.split(" ");
    if (pledgeClassLetters.length == 1) {
      new_mem.pledgeClassNum =
        alphabet.indexOf(pledgeClassLetters[0].toLocaleLowerCase()) + 1;
    } else {
      new_mem.pledgeClassNum =
        (alphabet.indexOf(pledgeClassLetters[0].toLowerCase())+1) * 24 +
        (alphabet.indexOf(pledgeClassLetters[1].toLowerCase()) + 1);
    }

    // add new mem for full members array in NEWEST first

    // if current method doesnt work, rewrite entire method and find poistion then do op rather than both at same time
    console.log("Adding new member, calculating position...");

    // find pos first

    // if array has no members
    console.log(new_mem.pledgeClassNum);
    if (members.length == 0) {
      members.push(new_mem);
    } else {
      // check if it goes first w/o looping
      if (new_mem.pledgeClassNum >= members[0].pledgeClassNum) {
        members.unshift(new_mem);
      } else if (
        new_mem.pledgeClassNum <= members[members.length - 1].pledgeClassNum
      ) {
        members.push(new_mem);
      } else {
        let pos = 0;
        for (let i = 0; i < members.length; i++) {
          if (new_mem.pledgeClassNum >= members[i].pledgeClassNum) {
            pos = i;
            break;
          }
        }
        console.log("inserting at " + pos);
        let fh = members.slice(0, pos);
        let sh = members.slice(pos);
        console.log(fh);
        console.log(sh);
        fh.push(new_mem);
        members = fh.concat(sh);
      }
    }

    // close overlay
    overlay.style.display = "none";
    document.body.classList.remove("disable-scrolling");
    const previousPopup = document.getElementsByClassName("popup");
    if (previousPopup.length > 0) {
      previousPopup[0].remove();
    }

    form.reset();

    console.log(new_mem);
    console.log(members);
    console.log(map);

    // update members string so download link works
    dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members));

    // refresh tree view
    gen_tree();
    gen_pc();
  };
}

// -------------- Updating and Editing -----------

// -----------------------------------------------

// ---------- Creating and Loading Map -----------
const scnd_elms = document.getElementsByClassName("scnd-bar");

// Create Map Button

const create_map_btn = document.getElementById("create");
create_map_btn.onclick = () => {
  if (scnd_elms.length > 0) {
    main.removeChild(scnd_elms[0]);
  }

  const scnd_bar = document.createElement("div");
  scnd_bar.classList.add("bar");
  scnd_bar.classList.add("scnd-bar");

  main.insertBefore(scnd_bar, main.children[1]);

  const create_btn = createButton("Add Member", "green", scnd_bar);
  create_btn.onclick = () => {
    create_slot_data(map.indexOf(slot), false);
  };

  const download_map_btn = document.createElement('a');
  download_map_btn.innerText = "Download Map";
  scnd_bar.appendChild(download_map_btn);


  // change to display button instead of anchor tag and have the button
  // click make an anchor elm and trigger the download same way then remove anchor tag
  download_map_btn.onclick = (e) => {
    download_map_btn.setAttribute('href', dataStr);
    download_map_btn.setAttribute('download', 'map.json');
    //download_map_btn.click();
    //e.preventDefault();
}
};

// -----------------------------------------------

// GENERATING TIME BABY

// array for storing tress
var trees = [];

// members to be added is reffed as members_needed
// alphabet is reffed as alphabet
// full map is reffed as full_map and should be either cleared before each gen or ensured that change will result in no change to complete map, etc: adding one little in the middle of map

function findFamilyTree(member) {
  if (member.familyTree != null) {
    return;
  }

  // get first in family tree
  let top = member;
  while (top.big != null) {
    top = top.big;
  }

  let tree = {
    start: top,
    end: null,
    width: 1,
  };

  // get last, can be multiple
  let cg = [];
  let ng = [];
  let lc = 99;
  cg.push(top);
  while (lc != 0) {
    lc = 0;

    for (let mem in cg) {
      for (let little in cg[mem].littles) {
        ng.push(cg.littles[little]);
        lc++;
      }
    }

    tree.width += lc - cg.length;

    cg = ng;
    ng = [];
  }

  tree.end = cg;
}

// Load Map Button
const load_map_btn = document.getElementById('load');

load_map_btn.onclick = () => {
  if (scnd_elms.length > 0) {
    // if elms are already slotted into bar below, clear
    main.removeChild(scnd_elms[0]);
  }
  // add else chain to be able to clear bar for both create and load btn

  const scnd_bar = document.createElement("div");
  scnd_bar.classList.add("bar");
  scnd_bar.classList.add("scnd-bar");

  main.insertBefore(scnd_bar, main.children[1]);

  const load_file_btn = createButton("Load from File", "orange", scnd_bar);
  const load_from_str = createButton("Load from String", 'blue', scnd_bar);

  load_file_btn.onclick = () => {
    let input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
      let file = e.target.files[0];
      console.log(file);

      let reader = new FileReader();

      reader.addEventListener('load', (r) => {
        let text = r.target.result;

        try {
          let data = JSON.parse(text);
          members = data;
        } catch (error) {
          console.log(error);
          alert('Invalid File! Check console for error.');
        }
        
      })

      reader.readAsText(file);
      
    }

    input.click();
  };

  load_from_str.onclick = (e) => {
    // change this later
    let res = window.prompt("Copy the object here", "JSON Object");
    members = JSON.parse(res);
  }

};

function gen_tree() {
  // perhaps change this to use api to change programmatically 
  // instead of packaging in one function

  // create tree objects from members array
  // NEEDED PROPS
  // id, fid, name (fid = big id)

  // assign id's to everyone
  let c_id = 1;
  for (let m in members) {
    members[m].tree_id = c_id;
    c_id++;
  }

  // now create object for nodes
  let tree_nodes = [];
  for (let m in members) {
    let c_mem = members[m];
    let node_obj = {};

    node_obj.id = c_mem.tree_id;

    let big = findMemberByName(c_mem.big);
    if (big != -1) {node_obj.fid = big.tree_id; }
    
    // assignment works as node_obj[ defined field name ]

    node_obj.Name = c_mem.name;

    node_obj["Pledge Class"] = c_mem.pledgeClass;

    tree_nodes.push(node_obj);
  }

  console.log(tree_nodes);

  // Tree Generation --------------------
  var tree = new FamilyTree(document.getElementById('tree'), {
    nodeBinding: {
      field_0: "Name",
      field_1: "Pledge Class"
    },
    nodes: tree_nodes
  });
}

// check if members ever changes and to update family tree
// eqasier than changing each spot, again, making progrmatic change
// will reduce comp power needed
let past_members = members;
setInterval(() => {
  if (past_members != members) {
    correctPC(members); // all are right here
    past_members = members;
    gen_tree(); // all are right here
    gen_pc();
    dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members));
  }
}, 100)

// --------------- Second Gen - By Pledge Class ---------------------

// find widths of family tree BELOW this member INCLUDING member passed in

// also assign width BELOW member INCLUDING THEM to member

// make recursive
// if no littles, assign 1 and return 1
// otherwise, add 1+ sum of widths of littles and assign then return

// make seperate function to find largest width in family tree, should be easy once assigned to member
function findWidth(member) {
  if (member.littles.length == 0) {
    member.width = 1;
    return 1;
  }

  let sum = 0;
  for (let little in member.littles) {
    sum += findWidth(member.littles[little]);
  }

  member.width = sum;
  return sum;

}

// get largest width in family tree using the members width property

// bout useless as fuck
function findTreeWidth(root) {
  let max = 0;
  let cg = [];
  let ng = [];
  cg.push(root);
  while (cg.length > 0) {
    for (let mem in cg) {
      if (cg[mem].width > max) {
        max = cg[mem].width;
      }

      for (let little in cg[mem].littles) {
        ng.push(cg[mem].littles[little]);
      }
    }

    cg = ng;
    ng = [];
  }

  return max;
}

function makeTrees(mems) {
  // error tracker 
  // input is fine
  // error statrs after root member

  let trees = [];

  console.log(JSON.stringify(mems[mems.length-2])) // IS FINE HERE
  console.log(JSON.stringify(mems[mems.length-1])) // WRONG HERE, BUT WHY

  // make family tree, and everytime member is discovered, remove from members array passed in

  // go thru each mem in array, array will be removing items during iteration
  while (mems.length > 0) {
    let start = mems[mems.length-1];
    findWidth(start);

    console.log(start.littles) // wrong here
    // start at last member in member array, and then gen tree off of him, then move to next member

    let new_tree = new Tree({root: start});
    let youngest = start.pledgeClassNum;

    // remove first member from array
    mems = mems.filter(x => x.name != start.name)

    let next_mems = start.littles;

    // simply nav thru each member in tree -- GOTTA be because of shallow copy or something
    while (next_mems.length > 0) {
      let temp_mems = [];
      next_mems.forEach(mem => {
        // try and freshen value with correctPC
        correctPC(mem);

        // fuck shallow copies of objects
        mem = findMemberByName(mem.name);

        // check if pledgeClassNum is less than current youngest
        if (mem.pledgeClassNum > youngest) {
          // if so, set as new youngest
          youngest = mem.pledgeClassNum;
        }
        
        // add littles to temp lil's if exist
        // ERROR, not finding all littles -- got fixed???

        if (mem.littles.length > 0) { temp_mems = temp_mems.concat(mem.littles); }

        // filter members out of mems array and also assign width at time -- MAYBE find better time to assign width, this just so happens to iterate over each member
        findWidth(mem);
        mems = mems.filter(x => x.name != mem.name);
      })

      // copy temp to main
      next_mems = temp_mems;
    }
    new_tree.end = youngest;
    trees.push(new_tree);

  }
  return trees;
}

const node_width = 55;
const node_height = 25;

// responsive layout
window.addEventListener('resize', () => {
  let pcts = window.getComputedStyle(document.getElementById('tree-pc'));

  stage = new Konva.Stage({
    container: "tree-pc",
    width: pcts.width.replace("px",""),
    height: pcts.height.replace("px",""),
    draggable: true,
  });

  stage.add(layer)

})

// doesnt get used, could use ig?
function tree_alloc(width, length, x, y) {
  return {
    x: x,
    y: y,
    width: width,
    height: height,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  }
}

function gen_pc() {

  layer.destroyChildren();


  // use JSON hack, update to structuredClone once more research and adaptation is done/support to detect if iOS or not
  let copy_mems = JSON.parse(JSON.stringify(members));

  let family_trees =makeTrees(copy_mems);
  console.log("Family Trees Generated from makeTrees", family_trees); // starts here too

  // make grid lines for each pledge class

  console.log('Making Grid Lines')

  let end = members[0].pledgeClassNum;
  for (let i = 1; i <= end; i++) {
    let color = (i%2 == 0) ? 'blue' : 'orange';
    let pc_end_line = new Konva.Line({
      points: [ 100, i*pledge_class_row_height, 2000, i*pledge_class_row_height ],
      stroke: color,
      strokeWidth: 4
    });

    let pledge_class_name = "";
    if (i <= 24) {
      pledge_class_name = alphabet[i-1];
    }
    else if (i%24 == 0) {
      pledge_class_name = alphabet[Math.floor(i/24)-2];
      pledge_class_name += " " + alphabet[23];
    } else {
      pledge_class_name = alphabet[Math.floor(i/24)-1];
      pledge_class_name += " " + alphabet[i-(Math.floor(i/24)*24)-1];
    }


    let pc_name = new Konva.Text({
      x: 0,
      y: i*pledge_class_row_height - 10,
      text: i + ' ' + pledge_class_name,
      fontSize: 12,
      fontFamily: 'Calibri',
      fill: 'black',
    });

    layer.add(pc_end_line);
    layer.add(pc_name);
  }

  // reserve tree space / develop trees

  console.log('Developing Trees')
  // space where family trees can begin developing, start after line generation
  const start_space = 110;

  // array for next available space in row
  let next_available_space = []
  next_available_space.fill(start_space,0,members[0].pledgeClassNum-1);

  // defined boxes for each family tree
  family_trees.forEach(tree => {
    console.log(tree);

    // get x value by looping over next_available_space to find most compatible space
    // compatible space = the largest value in next_available_space that corresponds to pc numbers
    let x = start_space;

    for (let i = tree.root.pledgeClassNum; i < end+1; i++) {
      if (next_available_space[i-1] > x) {
        x = next_available_space[i-1];
      }
    }

    // update next_avaialbe_space array
    // loops over next_available_space in regards to the pledsge class numbers and updates the next available space to the width of the tree added
    for (let i = tree.root.pledgeClassNum; i < end+1; i++) {
      next_available_space[i-1] = x+(tree.width*pledge_class_node_w)+50;
    }

    // Not sure what the fuck is going on, but somehow it knows when next big is and reserves space up until that class, but also doesnt claim all the way down, at least one tree doesn't (with luke)

    // also probably need to update width, because riley's family tree is fat in spreadsheet but takes up less than cam's in program
    // ^^^^ figure out better 'real width' claculation, one right now is fat as fuck ^^^

    // w = 2| 51 | 2
    // 51 so odd can be centered

    console.log("Tree reserved space: x: " + x + "->" + x+tree.width*55 + " y: " + tree.root.pledgeClassNum*25 + "->" + tree.end*25);

    let res_bloc = {
      x: x,
      y: tree.root.pledgeClassNum*pledge_class_row_height,
      width: tree.width*pledge_class_node_w,
      height: (tree.end+1)*pledge_class_row_height-tree.root.pledgeClassNum*pledge_class_row_height,
      stroke: '#' + Math.floor(Math.random()*16777215).toString(16),
    }

    let reserved_space = new Konva.Rect(res_bloc)

    layer.add(reserved_space);

    // add members to resrved place
    // go to first member in tree and generate from there
    drawGen(x, [tree.root])

  })

  // for testing purposes
  // pledgeClasses are wrong here - ERROR 
  console.log("Family Trees: ", family_trees)
  return family_trees;
}

// helper if pledge classes ever change or something wierd happens with them, used during initial testing
function correctPC(set) {
  if (set.pledgeClassNum || set.name) {
    let pcl = set.pledgeClass.split(" ");
    let correctPc = (alphabet.indexOf(pcl[0].toLowerCase())+1) * 24 +
                    (alphabet.indexOf(pcl[1].toLowerCase()) + 1);

    if (set.pledgeClassNum != correctPc) {
      console.log("Corrected " + set.name + "'s pledge class number from " + set.pledgeClassNum + " to " + correctPc);
      set.pledgeClassNum = correctPc;
    }
  } else {
    for (let mem of set) {
      let pcl = mem.pledgeClass.split(" ");
      let correctPc = (alphabet.indexOf(pcl[0].toLowerCase())+1) * 24 +
                      (alphabet.indexOf(pcl[1].toLowerCase()) + 1);

      if (mem.pledgeClassNum != correctPc) {
        console.log("Corrected " + mem.name + "'s pledge class number from " + mem.pledgeClassNum + " to " + correctPc);
        mem.pledgeClassNum = correctPc;
      } else {
        //console.log(mem.name +"'s pledge class number was correct: " + mem.pledgeClass + ": " + mem.pledgeClassNum);
      }
    }
  }
}

function drawGen(avail_space, generation, last_line) {
  // fix pledgec class numbers
  correctPC(generation);


  // avail_space is where the available space starts
  // generation is an array of members in the generation
  // last_line is the line draw from center down 10 pixels, used to draw children towards
  //      if there is one child, draw straight up, otherwise make L connection
  //      is passed as [x,y]

  // if generation is larger than 1 person, go from first member to left and get the width property on member and use it to reserve portion of avail_space
  // then use the space used in avail_space as next avail_space and the littles as generation
  if (generation.length == 1) {
    let person = new Konva.Rect({
      x: (avail_space+((generation[0].width*pledge_class_node_w)/2))-(pledge_class_node_w/2),
      y: generation[0].pledgeClassNum*pledge_class_row_height,
      width: pledge_class_node_w,
      height: pledge_class_node_h,
      fill: 'blue',
    });

    let name = new Konva.Text({
      x: (avail_space+((generation[0].width*pledge_class_node_w)/2))-(pledge_class_node_w/2)+3,
      y: generation[0].pledgeClassNum*pledge_class_row_height+4,
      text: generation[0].name.split(" ")[0],
      fontSize: 12,
      fontFamily: 'Calibri',
      fill: 'green',
    });

    if (last_line != undefined) {
      // draw line up to previous line
      let line = new Konva.Line({
        points: [avail_space+((generation[0].width*pledge_class_node_w)/2), generation[0].pledgeClassNum*pledge_class_row_height , avail_space+((generation[0].width*pledge_class_node_w)/2), last_line[1]],
        stroke: 'black',
        strokeWidth: 1,
      })
      layer.add(line);
    }
    

    layer.add(person);
    layer.add(name);

    // run again if there are littles
    if (generation[0].littles.length > 0) {
      // draw line 10 pixels below node, centered
      let line = new Konva.Line({
        points: [avail_space+((generation[0].width*pledge_class_node_w)/2), generation[0].pledgeClassNum*pledge_class_row_height+pledge_class_node_h, avail_space+((generation[0].width*pledge_class_node_w)/2), generation[0].pledgeClassNum*pledge_class_row_height+pledge_class_node_h+10],
        stroke: 'black',
        strokeWidth: 1,
      })
      layer.add(line);
      drawGen(avail_space, generation[0].littles, [avail_space+((generation[0].width*pledge_class_node_w)/2),generation[0].pledgeClassNum*pledge_class_row_height+pledge_class_node_h+10]);
    }

  } else {
    let next_available_space = avail_space;
    for (let mem of generation) {

      let person = new Konva.Rect({
        x: next_available_space+((mem.width*pledge_class_node_w)/2)-(pledge_class_node_w/2),
        y: mem.pledgeClassNum*pledge_class_row_height,
        width: pledge_class_node_w,
        height: pledge_class_node_h,
        fill: 'orange',
      })

      let name = new Konva.Text({
        x: next_available_space+((mem.width*pledge_class_node_w)/2)-(pledge_class_node_w/2)+1,
        y: mem.pledgeClassNum*pledge_class_row_height+4,
        text: mem.name.split(" ")[0],
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: 'green',
      });

      layer.add(person);
      layer.add(name);

      if (last_line != undefined) {
        // draw line using L connectopn, using two lines, one up, and one to the side
        let up_line = new Konva.Line({
          points: [next_available_space+((mem.width*pledge_class_node_w)/2), mem.pledgeClassNum*pledge_class_row_height, next_available_space+((mem.width*pledge_class_node_w)/2), last_line[1]],
          stroke: 'black',
          strokeWidth: 1,
        })

        let side_line = new Konva.Line({
          points: [next_available_space+((mem.width*pledge_class_node_w)/2), last_line[1], last_line[0], last_line[1]],
          stroke: 'black',
          strokeWidth: 1,
        })

        layer.add(up_line);
        layer.add(side_line);
      }

      // add line below and run again if there are littles
      if (mem.littles.length > 0) {
        // draw a line below the node 10 points below, centered in middle of node
        let line = new Konva.Line({
          points: [next_available_space+((mem.width*pledge_class_node_w)/2), mem.pledgeClassNum*pledge_class_row_height+pledge_class_node_h, next_available_space+((mem.width*pledge_class_node_w)/2), mem.pledgeClassNum*pledge_class_row_height+pledge_class_node_h+10],
          stroke: 'black',
          strokeWidth: 1,
        })
        layer.add(line);
        drawGen(next_available_space, mem.littles, [next_available_space+((mem.width*pledge_class_node_w)/2), mem.pledgeClassNum*pledge_class_row_height+pledge_class_node_h+10]);
      }
      // go to next generation using next available space and current mem.length and then this members littles
      next_available_space += mem.width*pledge_class_node_w;
    }
  }
}