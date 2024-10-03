const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bounds = canvas.getBoundingClientRect();

let rectArray = [];
let picked = undefined;

const now = new Date();
const sec = now.getSeconds();

//gonna need to know where my cursor is so here it is
//dx dy is difference between click and corner of item picked
const cursor = {
    x: undefined,
    y: undefined,
    dx: undefined,
    dy: undefined
}

canvas.addEventListener("click", (e) => {
    if (!picked){
        handleClick(cursor.x,cursor.y)
        return
    }
    if (picked){
        rectArray.push(picked)
        picked = undefined
        return
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
        v0 = e.x;
        v1 = e.x + 100;
        v2 = e.y;
        v3 = e.y + 100;
        if((ux >= v0 && ux <= v1) && (uy >= v2 && uy <= v3)){
            picked = e;
            cursor.dx = cursor.x - v0;
            cursor.dy = cursor.y - v2;
            rectArray.splice(i,1);
            picked.x = cursor.x - cursor.dx;
            picked.y = cursor.y - cursor.dy;
            picked.render()
        }
    });
}

/*
function class object thing??? epxand polymoprh inerhit this, i can do that right?
everything needs an ID, transform, color. rewrite to a proper BASE class thing
*/
function rectangle(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    this.render = () => {
        ctx.fillStyle = "rgb(75 0 75 / 100%)";
        ctx.fillRect(this.x, this.y, 100, 100);
        //rotations are betraying me
        // and what is this save and restore it mkaes a huge difference but why and how
        ctx.save();
        ctx.translate((this.x + 50), (this.y + 50))
        ctx.rotate((sec * Math.PI) / 30);
        ctx.translate((-this.x + 50), (-this.y + 50))
        ctx.strokeStyle = "rgb(0 75 0 / 100%)"
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x + 50, this.y)
        ctx.stroke()
        ctx.restore()
    }
}




function generateRect(amount){
    for (let i = 0; i < amount; i++) {
        rectArray[i] = new rectangle(
            i,
            i*200,
            i*200
        )
    }
}

generateRect(5)

console.log(rectArray)

function frame(){
    ctx.fillStyle = "rgb(255 255 255 / 100%)";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    rectArray.forEach(e => e.render());
    if(picked){
        picked.render()
    }
    window.requestAnimationFrame(frame)
}

window.requestAnimationFrame(frame)