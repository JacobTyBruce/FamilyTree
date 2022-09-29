// main file for html display

const main = document.getElementById("main");

// Grid Setup

var canvas = document.getElementById("grid");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "red";

var map = [];

// full map that is generated after generation, it is fuller size than dislpay map abd contains all info, resieable and malleable
var full_map = [];

// total members array
var members = [];

// download link/data str
var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(members));

// counter for members to be added
var updates_needed = 0;

// greek alphabet for figuring out pledge class order
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
  "omega",
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
  for (m in members) {
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

    for (let m in members) {
      if (members[m].big == new_mem.name) {
        let new_little = members[m];
        // add in reverse numerical order by pledge class
        // oldest first
          new_mem.littles.unshift(new_little);
      }
    }

    // add to big's little array
    let big = findMemberByName(new_mem.big);
    if (big != -1) {
      big.littles.unshift(new_mem);
      // sort bigs littles array
      big.littles.sort((a, b) => {
        if (a.pledgeClassNum < b.pledgeClassNum) {
          return -1;
        } else {
          return 1;
        }
        return 0;
      })
    }
    

    // set pledgeClassNum
    let pledgeClassLetters = new_mem.pledgeClass.split(" ");
    if (pledgeClassLetters.length == 1) {
      new_mem.pledgeClassNum =
        alphabet.indexOf(pledgeClassLetters[0].toLocaleLowerCase()) + 1;
    } else {
      new_mem.pledgeClassNum =
        alphabet.indexOf(pledgeClassLetters[0].toLowerCase()) * 23 +
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

function gen_map() {
  // begin dfs
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
  for (m in members) {
    members[m].tree_id = c_id;
    c_id++;
  }

  // now create object for nodes
  let tree_nodes = [];
  for (m in members) {
    let c_mem = members[m];
    console.log("---------------------");
    console.log(c_mem);
    let node_obj = {};

    node_obj.id = c_mem.tree_id;

    let big = findMemberByName(c_mem.big);
    if (big != -1) {node_obj.fid = big.tree_id; }
    console.log(big);
    
    // assignment works as node_obj[ defined field name ]

    node_obj.Name = c_mem.name;

    node_obj["Pledge Class"] = c_mem.pledgeClass;

    console.log(node_obj);
    console.log("---------------------");
    console.log("\n\n")

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
past_members = members;
setInterval(() => {
  if (past_members != members) {
    past_members = members;
    gen_tree();
    console.log("Generating Tree");
  }
}, 500)