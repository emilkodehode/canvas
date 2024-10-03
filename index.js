const container = document.getElementById("container");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bounds = canvas.getBoundingClientRect();

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 150, 100);

ctx.fillStyle = "rgb(0 99 0 / 100%)";
ctx.fillRect(10, 130, 150, 100);

ctx.fillStyle = "rgb(0 151 0 / 100%)";
ctx.fillRect(180, 10, 150, 100);

let rectArray = [];

let picked = undefined;

canvas.addEventListener("click", (e) => {
    if (picked) return
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    handleClick(x,y)
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
    if(picked){
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        picked.x = x;
        picked.y = y;
    }
})

function handleClick(ux,uy){
    rectArray.forEach((e,i) => {
        v0 = e.x;
        v1 = e.x + 100;
        v2 = e.y;
        v3 = e.y + 100;
        if((ux >= v0 && ux <= v1) && (uy >= v2 && uy <= v3)){
            picked = e
            rectArray.splice(i,1)
            console.log(picked)
        }
    });
}

function rectangle(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    this.render = () => {
        ctx.fillStyle = "rgb(75 0 75 / 100%)";
        ctx.fillRect(this.x, this.y, 100, 100);
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