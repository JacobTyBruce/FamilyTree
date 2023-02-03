/*

Program Stats:

  Suicide Attempts: 3
  Pounds of hair lost: 2.34
  Lines of Code Written & Then Deleted: Err

*/

import Tree from '../classes/build/tree.js';
import Member  from '../classes/build/member.js';
import List from '../classes/build/list.js';
import MemberList from '../classes/build/memberList.js';

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

// SECTION - Buttons

// load button - and sub sections
const load_btn = document.querySelector('#load');

load_btn.onclick = () => {

  let input = document.createElement('input');
  input.type = file;

  input.onchange = e => {
    // getting a hold of the file reference
    let file = e.target.files[0];

    let reader = new FileReader();
    
    reader.addEventListener('load', (event) => {
      let r = event.target.result;

      try {
        let data = JSON.parse(r);

        // convert data to member objects
        for (let m in data) {
          new Member(0, data[m].name, data[m].pledgeClass, data[m].big, data[m].id, data[m].littles, data[m].pic, data[m].bio);
        }
      } catch {
        alert("Invalid File");
      }

      //  read file contents
      reader.readAsText(file);
    });
  };

  input.click();

}

// edit button - and sub sections
const edit_btn = document.querySelector('#edit');

let sub = false;
edit_btn.onclick = () => {
  if (sub) {
    document.getElementById("edit-sub").style.display = "none";
    sub = false;
  } else {
    document.getElementById("edit-sub").style.display = "block";
    sub = true;
  }
}

// add button
const add_btn = document.querySelector('#add');
const edit_mem = document.querySelector('#edit-mem');
const delete_btn = document.querySelector('#delete');

add_btn.onclick = () => {
  add_member();
}

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
        }
        results.appendChild(div);
      }
    }
  }

  const close = document.querySelector("#find-member > p");
  close.onclick = () => {
    overlay.style.display = "none";
    document.body.classList.remove("disable-scrolling");
  }
}

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
        }
        results.appendChild(div);
      }
    }
  }
}

// save button
const download_btn = document.querySelector('#download');

download_btn.onclick = () => {
  let a = document.createElement("a");
  a.href = dataStr;
  a.download = "theta-pi-family-trees.json";
  a.click();
}


// TODO = edit add member function below to work with new member class

// Member Creating/Editing ----------------------

function add_member(existing_mem) {

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

    // create new member object
    new Member(1, freshen(e.target[0].value), freshen(e.target[1].value), freshen(big_textbox.value), undefined, undefined, (e.target[2].files.length > 0 ? "Picture" : null), "Bio");

    if (existing_mem != undefined) {
      // update changes
      existing_mem.name = freshen(e.target[0].value);
      existing_mem.pledgeClass = freshen(e.target[1].value);
      existing_mem.big = freshen(big_textbox.value);
      existing_mem.picture = (e.target[2].files.length > 0 ? "Picture" : null);
      existing_mem.bio = "Bio";
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
  const members = Members.getMemberList();
  // perhaps change this to use api to change programmatically 
  // instead of packaging in one function

  // create tree objects from members array
  // NEEDED PROPS
  // id, fid, name (fid = big id)

  // create object for nodes
  let tree_nodes = [];
  for (let mem in members) {
    let current_mem = members[mem];
    let node_obj = {};

    node_obj.id = current_mem.id;

    let big = (current_mem.big.big != null);
    if (big) {node_obj.fid = big.tree_id; }
    
    // assignment works as node_obj[ defined field name ]

    node_obj.Name = current_mem.name;

    node_obj["Pledge Class"] = current_mem.pledgeClass;

    tree_nodes.push(node_obj);
  }

  // Tree Generation --------------------
  var tree = new FamilyTree(document.getElementById('tree'), {
    nodeBinding: {
      field_0: "Name",
      field_1: "Pledge Class"
    },
    nodes: tree_nodes
  });
}

// --------------- Second Gen - By Pledge Class ---------------------


function makeTrees(mems) {

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