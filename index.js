const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bounds = canvas.getBoundingClientRect();

let rectArray = [];
let picked = undefined;

let now = undefined;
let sec = undefined;

/*
they spin and can be moved
create a zone around each of them
something enter zone point to it
if multiple alternate pointing towards it
leaving zone stop pointing at it

zone for checking
using the logic of click i just need to create additional vertecies to check inside
this is gonna be a mess

using the save and restore setting i just need a we call it pencil to point at each items origin
then work can be made

each need a empty list rdy
populate list of potential targets and get its position
point towards it
leave zone remove form list
list empty idle spin
*/

//gonna need to know where my cursor is so here it is
//dx dy is difference between click and corner of item picked
const cursor = {
    x: undefined,
    y: undefined,
    dx: undefined,
    dy: undefined
};

canvas.addEventListener("click", (e) => {
    if (!picked){
        handleClick(cursor.x,cursor.y);
        return;
    }
    if (picked){
        rectArray.push(picked);
        rectArray[rectArray.length-1].areaCheck();
        picked = undefined;
        return;
    }
    //can use the color selection to early return for invalid action
    /*
    const pixel = ctx.getImageData(x,y,1,1).data;
    console.log(pixel[0],pixel[1],pixel[2],pixel[3])
    if(pixel[0] >= 70 && pixel[0] <= 80){
        console.log("yes")
    }
    else(console.log("no"))
    */
})

canvas.addEventListener("mousemove", (e) =>{
    //update cursor position when it is over the canvas so it is ready for use
    cursor.x = e.clientX - bounds.left;
    cursor.y = e.clientY - bounds.top;
    //translate the picked item
    if(picked){
        picked.x = cursor.x - cursor.dx;
        picked.y = cursor.y - cursor.dy;
    }
})

function handleClick(ux,uy){
    /*
    i know im inside a rectangle when cursor pos is greater and less than the 4 corner of the box
    i just need the diff between click and 1 vert to position the selection nicely so it does not "jump"
    */
    rectArray.forEach((e,i) => {
        v0 = e.x - e.width / 2;
        v1 = e.x + e.width / 2;
        v2 = e.y - e.height / 2;
        v3 = e.y + e.height / 2;
        if((ux >= v0 && ux <= v1) && (uy >= v2 && uy <= v3)){
            picked = e;
            cursor.dx = cursor.x - e.x;
            cursor.dy = cursor.y - e.y;
            rectArray.splice(i,1);
            picked.x = cursor.x - cursor.dx;
            picked.y = cursor.y - cursor.dy;
            picked.render();
        }
    });
}
/*
function class object thing??? epxand polymoprh inerhit this, i can do that right?
everything needs an ID, transform, color. rewrite to a proper BASE class thing
*/
function rectangle(id, x, y, width, height, areaSize) {
        //feels kind of backwards x y only ends up telling where it is
        //while width and height is for the finer details
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.areaSize = areaSize;
    this.render = () => {
        //origin set to middle middle is x y
        saveO(this.x,this.y);
        ctx.fillStyle = "rgb(75 0 75 / 100%)";
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        /* rotations are betraying me
        and what is this save and restore it mkaes a huge difference but why and how
        save() saves the current settings for drawing/stroke transforms and everything
        so i want to save my default state where everything is calculated and made from
        then realign canvas origin to where i want it draw what i need
        then restore() to base point
        */
        ctx.rotate((sec * Math.PI) / 30);
        ctx.strokeStyle = "rgb(0 75 0 / 100%)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width / 2, 0);
        ctx.stroke();
        ctx.restore();
    }
    let ax = (this.width / 2) * areaSize;
    let ay = (this.height / 2) * areaSize;
    this.areaVerts = [
        [-ax / 2.5, ay],
        [ax / 2.5, ay],
        [ax, ay / 2.5],
        [ax, -ay / 2.5],
        [ax / 2.5, -ay],
        [-ax / 2.5, -ay],
        [-ax, -ay / 2.5],
        [-ax, ay / 2.5]
    ]
    this.area = () => {
        saveO(this.x,this.y);
        ctx.strokeStyle = "rgb(0 0 75 / 100%)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.areaVerts[0][0], this.areaVerts[0][1]);
        ctx.lineTo(this.areaVerts[1][0], this.areaVerts[1][1]);
        ctx.lineTo(this.areaVerts[2][0], this.areaVerts[2][1]);
        ctx.lineTo(this.areaVerts[3][0], this.areaVerts[3][1]);
        ctx.lineTo(this.areaVerts[4][0], this.areaVerts[4][1]);
        ctx.lineTo(this.areaVerts[5][0], this.areaVerts[5][1]);
        ctx.lineTo(this.areaVerts[6][0], this.areaVerts[6][1]);
        ctx.lineTo(this.areaVerts[7][0], this.areaVerts[7][1]);
        ctx.lineTo(this.areaVerts[0][0], this.areaVerts[0][1]);
        ctx.stroke();
        ctx.restore();
    }
    this.areaCheck = () => {
        /*
        im inside a rectangle when cursor pos is greater and less than the 4 corner of the box
        i have 8 verts now, check all eight or a combination of each box
        difference is one HUGE check or nested checks or 4 checks with potential
        check everyone that is O*O
        for now only need to check when i handle click
        this gets called on everyone
        area is local to this unit convert to canvas itself
        add this x to find out ofc

        8 check loop through list with 4 spaces between
        i need ofsett of 1 and 5
        */
        let smalloff = undefined
        let bigoff = undefined
        for (let i = 0; i < rectArray.length - 1; i++){
            smalloff = i + 1
            bigoff = i + 5
            if(smalloff)
            //console.log(`${rectArray[i].id} arr y ` + rectArray[i].y,"pure y " + this.y, "this y bot" + (this.y + this.areaVerts[0][1]), "this y top" + (this.y + this.areaVerts[5][1]));
            if((rectArray[i].y <= (this.y + this.areaVerts[i][1]) && rectArray[i].y >= (this.y + this.areaVerts[i+bigoff][1]))){  
                if((rectArray[i].x >= (this.y + this.areaVerts[i][0]) && rectArray[i].x <= (this.x + this.areaVerts[i+smalloff][0]))){
                    console.log("yes")
                }
            }
        }
    }
}

function generateRect(amount){
    for (let i = 0; i < amount; i++) {
        rectArray[i] = new rectangle(
            i,
            i*200,
            i*200,
            100,
            100,
            //(i+1) * (30 * Math.random()),
            //(i+1) * (30 * Math.random()),
            4
        )
    }
}
generateRect(2);

function frame(){
    updateTime();
    ctx.fillStyle = "rgb(255 255 255 / 100%)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    rectArray.forEach((e) => {
        e.render();
        e.area();
    });
    if(picked){
        picked.render();
    }
    window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);

function saveO(x,y){
    ctx.save();
    ctx.translate(x,y);
    //remember to ctx.restore() after drawing
}

function updateTime(){
    now = new Date();
    sec = now.getSeconds();
}
