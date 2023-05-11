/*

Program Stats:

  Suicide Attempts: 5
  Pounds of hair lost: 15.64
  Lines of Code Written & Then Deleted: Way too fukin many

*/

import Tree from "../classes/build/tree.js";
import Member from "../classes/build/member.js";

// ERROR REPORTS
/*

  For some god damn reason i you have to freshen the members pledge class number at damn near every step in generation, i have no god damn clue what is going on here, but it is fucking annoying as hell
  It works for now, but is a very ruggid fix and would like to find out what is going on later

*/

// main file for html display

const main = document.getElementById("main");

// Pledge Class View Dimensions
const pledge_class_row_height = 100;
const pledge_class_node_w = 150;
const pledge_class_node_h = 80;

// Pledge Class View Setup
let pcts = window.getComputedStyle(document.getElementById("tree-pc"));

var stage = new Konva.Stage({
  container: "tree-pc",
  width: pcts.width.replace("px", ""),
  height: pcts.height.replace("px", ""),
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
};

// SECTION - Buttons

// load button - and sub sections
const load_btn = document.querySelector("#load");

load_btn.onclick = () => {
  let input = document.createElement("input");
  input.type = "file";

  input.onchange = (e) => {
    console.log("file selected");
    // getting a hold of the file reference
    let file = e.target.files[0];

    let reader = new FileReader();
    //  read file contents
    reader.readAsText(file);
    console.log("file loaded");

    reader.onload = (event) => {
      console.log("File Reader ready");
      let r = event.target.result;

      try {
        let data = JSON.parse(r);

        // convert data to member objects
        for (let m in data) {
          console.log("adding member");
          new Member(
            0,
            data[m].name,
            data[m].pledgeClass,
            data[m].big,
            data[m].pic,
            data[m].bio,
            data[m].id,
            data[m].littles
          );
        }

        // generate tree view
        gen_tree();
        gen_pc();
      } catch (e) {
        alert("Invalid File");
        console.log(e);
      }
    };

    reader.onerror = (event) => {
      alert("Error reading file");
    };
  };

  input.click();
};

// edit button - and sub sections
const edit_btn = document.querySelector("#edit");

let sub = false;
edit_btn.onclick = () => {
  if (sub) {
    document.getElementById("edit-sub").style.display = "none";
    sub = false;
  } else {
    document.getElementById("edit-sub").style.display = "block";
    sub = true;
  }
};

// add button
const add_btn = document.querySelector("#add");
const edit_mem = document.querySelector("#edit-mem");
const delete_btn = document.querySelector("#delete");

add_btn.onclick = () => {
  add_member();
};

edit_mem.onclick = () => {
  document.body.classList.add("disable-scrolling");

  const overlay = document.getElementsByClassName("full-overlay")[1];
  overlay.style.display = "flex";

  const memberList = Member.getMemberList();
  const search = document.querySelector("#member-name-search");
  search.oninput = (e) => {
    const search = e.target.value;
    const results = document.querySelector("#search-results");

    results.innerHTML = "";

    for (let m in memberList) {
      if (memberList[m].name.toLowerCase().includes(search.toLowerCase())) {
        let div = document.createElement("div");
        div.classList.add("search-result");
        div.innerHTML = memberList[m].name;
        div.onclick = () => {
          add_member(memberList[m]);
        };
        results.appendChild(div);
      }
    }
  };

  const close = document.querySelector("#find-member > p");
  close.onclick = () => {
    overlay.style.display = "none";
    document.body.classList.remove("disable-scrolling");
  };
};

delete_btn.onclick = () => {
  document.body.classList.add("disable-scrolling");
  const overlay = document.getElementsByClassName("full-overlay")[1];
  overlay.style.display = "flex";

  const memberList = Member.getMemberList();
  const search = document.querySelector("#member-name-search");
  search.oninput = (e) => {
    const search = e.target.value;
    const results = document.querySelector("#search-results");

    results.innerHTML = "";

    for (let m in memberList) {
      if (memberList[m].name.toLowerCase().includes(search.toLowerCase())) {
        let div = document.createElement("div");
        div.classList.add("search-result");
        div.innerHTML = memberList[m].name;
        div.onclick = () => {
          memberList[m].delete();
        };
        results.appendChild(div);
      }
    }
  };
};

// save button
const download_btn = document.querySelector("#download");

download_btn.onclick = () => {
  let a = document.createElement("a");
  a.href = dataStr;
  a.download = "theta-pi-family-trees.json";
  a.click();
};

// TODO = edit add member function below to work with new member class

// Member Creating/Editing ----------------------

function add_member(existing_mem) {
  // create member data input menu
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

  if (existing_mem != undefined) {
    const name_fill = document.getElementById("name-fill");
    const pc = document.getElementById("pledgeClass");
    // figure out what to do with picture
    const pic = document.getElementById("pic");

    name_fill.value = existing_mem.name;
    pc.value = existing_mem.pledgeClass;
    pic.value = existing_mem.picture;
    big_textbox.value = existing_mem.big;

    submit.value = "Update";
    submit.style.background = "orange";
  } else {
    submit.value = "Create";
    submit.style.background = "lime";
  }

  //--------------------------

  // search feature
  big_textbox.oninput = (e) => {
    let members = Member.getMemberList();
    // get current input and try to match it with already inputted members
    let current_in = big_textbox.value;

    // remove previous entries
    big_search.innerHTML = "";

    // check for empty string
    if (big_textbox.value.length == 0) {
      big_search.innerHTML = "";
    } else {
      for (let mem in members) {
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

    let c_mem = null;
    if (existing_mem == undefined) {
      // create new member object
      c_mem = new Member(
        1,
        freshen(e.target[0].value),
        freshen(e.target[1].value),
        freshen(big_textbox.value),
        e.target[2].files.length > 0 ? "Picture" : null,
        "Bio"
      );
    } else {
      // update changes
      existing_mem.name = freshen(e.target[0].value);
      existing_mem.pledgeClass = freshen(e.target[1].value);
      existing_mem.big = freshen(big_textbox.value);
      existing_mem.picture = e.target[2].files.length > 0 ? "Picture" : null;
      existing_mem.bio = "Bio";

      c_mem = existing_mem;
    }

    // close overlay
    overlay.style.display = "none";
    document.body.classList.remove("disable-scrolling");
    const previousPopup = document.getElementsByClassName("popup");
    if (previousPopup.length > 0) {
      previousPopup[0].remove();
    }

    form.reset();

    // refresh tree view
    gen_tree();
    gen_pc();
  };
}

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

function gen_tree() {
  const members = Member.getMemberList();

  // create tree objects from members array
  // NEEDED PROPS
  // id, fid, name (fid = big id)

  // create object for nodes
  let tree_nodes = [];
  let i = 1;
  members.forEach((mem) => {
    i++;
    let node_obj = {};

    node_obj.id = mem.id;

    if (mem.big != null && mem.big.substring(0, 2) == "M:") {
      node_obj.fid = Member.getMemberByID(mem.big).id;
    }

    // assignment works as node_obj[ defined field name ]

    node_obj.Name = mem.name;

    node_obj["Pledge Class"] = mem.pledgeClass;

    tree_nodes.push(node_obj);
  });

  // Tree Generation --------------------
  var tree = new FamilyTree(document.getElementById("tree"), {
    nodeBinding: {
      field_0: "Name",
      field_1: "Pledge Class",
    },
    nodes: tree_nodes,
  });
}

// --------------- Second Gen - By Pledge Class ---------------------

// responsive layout
window.addEventListener("resize", () => {
  let pcts = window.getComputedStyle(document.getElementById("tree-pc"));

  stage = new Konva.Stage({
    container: "tree-pc",
    width: pcts.width.replace("px", ""),
    height: pcts.height.replace("px", ""),
    draggable: true,
  });

  stage.add(layer);
});

function gen_pc() {
  layer.destroyChildren();

  const family_trees = Tree.getTreeList();

  // make grid lines for each pledge class

  console.log("Making Grid Lines");

  const members = Member.getMemberList();
  console.log("All Members: ", members);

  let end = members[0].pledgeClassNum;
  for (let i = 1; i <= end; i++) {
    let color = i % 2 == 0 ? "blue" : "orange";
    let pc_end_line = new Konva.Line({
      points: [
        100,
        i * pledge_class_row_height,
        2000,
        i * pledge_class_row_height,
      ],
      stroke: color,
      strokeWidth: 4,
    });

    let pledge_class_name = "";
    if (i <= 24) {
      pledge_class_name = Member.alphabet[i - 1];
    } else if (i % 24 == 0) {
      pledge_class_name = Member.alphabet[Math.floor(i / 24) - 2];
      pledge_class_name += " " + Member.alphabet[23];
    } else {
      pledge_class_name = Member.alphabet[Math.floor(i / 24) - 1];
      pledge_class_name +=
        " " + Member.alphabet[i - Math.floor(i / 24) * 24 - 1];
    }

    let pc_name = new Konva.Text({
      x: 0,
      y: i * pledge_class_row_height - 10,
      text: i + " " + pledge_class_name,
      fontSize: 12,
      fontFamily: "Calibri",
      fill: "black",
    });

    layer.add(pc_end_line);
    layer.add(pc_name);
  }

  // TODO: At some point make it so that box/grid view cant go past first/last members on every side, essentailly creating a boundary box

  // reserve tree space / develop trees

  console.log("Developing Trees");
  // space where family trees can begin developing, start after line generation initially
  const start_space = 110;

  // array for next available space in row
  let next_available_space = Array(members[0].pledgeClassNum).fill(start_space);

  // defined boxes for each family tree
  family_trees.forEach((tree) => {
    console.log(tree);

    // get x value by looping over next_available_space to find most compatible space
    // compatible space = first x value that can ecompass all levels of the tree, i.e. the largest value in the levels of the tree in next_available_space

    // get subarray from next_available_space that contains only the values for the family tree's pledge class numbers
    // start at root and end at end
    // get the largest value in the subarray
    // set x to that value

    console.log(next_available_space,Member.getMemberByID(tree.root).pledgeClassNum - 1,
      Member.getMemberByID(tree.end).pledgeClassNum + 1 )
    let family_tree_available_space = next_available_space.slice(
      Member.getMemberByID(tree.root).pledgeClassNum - 1,
      Member.getMemberByID(tree.end).pledgeClassNum
    );
    console.log("Concerned space:",family_tree_available_space, family_tree_available_space.length);

    let start_x = family_tree_available_space[0];

    // loop over family_tree_available_space and find the largest value
    family_tree_available_space.forEach((val) => {
      if (val > start_x) {
        start_x = val;
      }
    });

    // TESTING
    // tree.width is undefined
    // tree.getWidth() is not defined as a function
    console.log(start_x, tree.getWidth(), pledge_class_node_w, start_x + (tree.getWidth() * pledge_class_node_w) + 50)


      // update next_avaialbe_space array
      // loops over next_available_space in regards to the pledsge class numbers and updates the next available space to the width of the tree added
      for (
        let i = Member.getMemberByID(tree.root).pledgeClassNum;
        i <= Member.getMemberByID(tree.end).pledgeClassNum;
        i++
      ) {
        // ERROR HERE - TWO THINGS ARE HAPPENING - 1. The next avialble space is not being updated entirely, just the previous members layer, and its being set to NaN
        next_available_space[i - 1] = start_x + (tree.getWidth() * pledge_class_node_w) + 50;
      }

      // w = 2| 51 | 2
      // 51 so odd can be centered

      console.log(
        "Tree reserved space: x: " +
        start_x +
        " to " +
        start_x + tree.getWidth() * 55 +
        " y: " +
        Member.getMemberByID(tree.root).pledgeClassNum * 25 +
        " to " +
        Member.getMemberByID(tree.end).pledgeClassNum * 25
      );

      let res_bloc = {
        x: start_x,
        y:
          Member.getMemberByID(tree.root).pledgeClassNum *
          pledge_class_row_height,
        width: tree.getWidth() * pledge_class_node_w,
        height:
          (Member.getMemberByID(tree.end).pledgeClassNum + 1) * pledge_class_row_height -
          Member.getMemberByID(tree.root).pledgeClassNum *
          pledge_class_row_height,
        stroke: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };

      let reserved_space = new Konva.Rect(res_bloc);

      layer.add(reserved_space);

      // add members to resrved place
      // go to first member in tree and generate from there
      console.log("Tree reserved block: ", res_bloc);
      drawGen(start_x, [Member.getMemberByID(tree.root)]);
  });
}

// PARAMS
// avail_space = where the available space starts
// generation = an array of members (type = Member) in the generation
// last_line = the line draw from center down 10 pixels, used to draw children towards
function drawGen(avail_space, generation, last_line) {
  // if generation is larger than 1 person, go from first member to left and get the width property on member and use it to reserve portion of avail_space

  // avail_space is where the available space starts
  // generation is an array of members in the generation
  // last_line is the line draw from center down 10 pixels, used to draw children towards
  //      if there is one child, draw straight up, otherwise make L connection
  //      is passed as [x,y]

  // if generation is larger than 1 person, go from first member to left and get the width property on member and use it to reserve portion of avail_space
  // then use the space used in avail_space as next avail_space and the littles as generation
  if (generation.length == 1) {

    console.log("Drawing Generation: ", generation);

    let person = new Konva.Rect({
      x:
        avail_space +
        (generation[0].width * pledge_class_node_w) / 2 -
        pledge_class_node_w / 2,
      y: generation[0].pledgeClassNum * pledge_class_row_height,
      width: pledge_class_node_w,
      height: pledge_class_node_h,
      fill: "blue",
    });

    let name = new Konva.Text({
      x:
        avail_space +
        (generation[0].width * pledge_class_node_w) / 2 -
        pledge_class_node_w / 2 +
        3,
      y: generation[0].pledgeClassNum * pledge_class_row_height + 4,
      text: generation[0].name.split(" ")[0],
      fontSize: 12,
      fontFamily: "Calibri",
      fill: "white",
    });

    if (last_line != undefined) {
      // draw line up to previous line
      let line = new Konva.Line({
        points: [
          avail_space + (generation[0].width * pledge_class_node_w) / 2,
          generation[0].pledgeClassNum * pledge_class_row_height,
          avail_space + (generation[0].width * pledge_class_node_w) / 2,
          last_line[1],
        ],
        stroke: "black",
        strokeWidth: 1,
      });
      layer.add(line);
    }

    console.log(
      "Adding " +
      generation[0].name +
      " to layer at " +
      person.x +
      ", " +
      person.y
    );
    layer.add(person);
    layer.add(name);

    // run again if there are littles
    if (generation[0].littles != null) {
      // draw line 10 pixels below node, centered
      let line = new Konva.Line({
        points: [
          avail_space + (generation[0].width * pledge_class_node_w) / 2,
          generation[0].pledgeClassNum * pledge_class_row_height +
          pledge_class_node_h,
          avail_space + (generation[0].width * pledge_class_node_w) / 2,
          generation[0].pledgeClassNum * pledge_class_row_height +
          pledge_class_node_h +
          10,
        ],
        stroke: "black",
        strokeWidth: 1,
      });
      layer.add(line);
      console.log("Generation 0", generation[0]);
      drawGen(avail_space, generation[0].littles, [
        avail_space + (generation[0].width * pledge_class_node_w) / 2,
        generation[0].pledgeClassNum * pledge_class_row_height +
        pledge_class_node_h +
        10,
      ]);
    }
  } else {
    let next_available_space = avail_space;
    for (let mem of generation) {
      let person = new Konva.Rect({
        x:
          next_available_space +
          (mem.width * pledge_class_node_w) / 2 -
          pledge_class_node_w / 2,
        y: mem.pledgeClassNum * pledge_class_row_height,
        width: pledge_class_node_w,
        height: pledge_class_node_h,
        fill: "orange",
      });

      let name = new Konva.Text({
        x:
          next_available_space +
          (mem.width * pledge_class_node_w) / 2 -
          pledge_class_node_w / 2 +
          1,
        y: mem.pledgeClassNum * pledge_class_row_height + 4,
        text: mem.name.split(" ")[0],
        fontSize: 12,
        fontFamily: "Calibri",
        fill: "green",
      });

      console.log(
        "Adding " + mem + " to layer at " + person.x + ", " + person.y
      );
      layer.add(person);
      layer.add(name);

      if (last_line != undefined) {
        // draw line using L connectopn, using two lines, one up, and one to the side
        let up_line = new Konva.Line({
          points: [
            next_available_space + (mem.width * pledge_class_node_w) / 2,
            mem.pledgeClassNum * pledge_class_row_height,
            next_available_space + (mem.width * pledge_class_node_w) / 2,
            last_line[1],
          ],
          stroke: "black",
          strokeWidth: 1,
        });

        let side_line = new Konva.Line({
          points: [
            next_available_space + (mem.width * pledge_class_node_w) / 2,
            last_line[1],
            last_line[0],
            last_line[1],
          ],
          stroke: "black",
          strokeWidth: 1,
        });

        layer.add(up_line);
        layer.add(side_line);
      }

      // add line below and run again if there are littles
      if (mem.littles != null) {
        // draw a line below the node 10 points below, centered in middle of node
        let line = new Konva.Line({
          points: [
            next_available_space + (mem.width * pledge_class_node_w) / 2,
            mem.pledgeClassNum * pledge_class_row_height + pledge_class_node_h,
            next_available_space + (mem.width * pledge_class_node_w) / 2,
            mem.pledgeClassNum * pledge_class_row_height +
            pledge_class_node_h +
            10,
          ],
          stroke: "black",
          strokeWidth: 1,
        });
        layer.add(line);
        console.log("drawing littles...");
        drawGen(
          next_available_space,
          mem.littles.map((little) => little.id),
          [
            next_available_space + (mem.width * pledge_class_node_w) / 2,
            mem.pledgeClassNum * pledge_class_row_height +
            pledge_class_node_h +
            10,
          ]
        );
      }
      // go to next generation using next available space and current mem.length and then this members littles
      next_available_space += mem.width * pledge_class_node_w;
    }
  }
}
