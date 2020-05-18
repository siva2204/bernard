var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var seconds1=0;
var seconds=0;
var minutes=0;
var display_second=0;
var display_minutes=0;

canvas.width =800;
canvas.height =600;
var gamepause=false;
var interval;
var interval1;
var interval2;
var colors=["#ff3333","#ff7733","#ffb31a","#b8b894","#ff66ff","#4da6ff","#5cd65c","#009999","#ffff33","#ff4dff"," #c61aff","#ffa366","#4d4d00"];
var mouse = {
 x: undefined,
 y: undefined
}
var screen=false;
var ll=true;
//sound effects
var beep=new Audio();
beep.src="bubble.mp3"

var boom=new Audio();
boom.src="boom.mp3"

var beep1= new Audio();
beep1.src="final.mp3"

var beep2= new Audio();
beep2.src="gameover.mp3"

var myAudio = new Audio('background.mp3');
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

  myAudio.play();
// Event Listeners
addEventListener('mousemove', event => {
   var rect = canvas.getBoundingClientRect();
   mouse.x = event.clientX-rect.left;
   mouse.y = event.clientY-rect.top;
 
})

canvas.addEventListener("click",function() {
  for (var i = 0; i < particles.length; i++) {
       if (distancebwpoints(particles[i].x,particles[i].y,mouse.x,mouse.y)<particles[i].radius) {
           particles.splice(i,1);
           beep.play();

       }
  }
  for (var i = 0; i < rockbubble.length; i++) {
    if (distancebwpoints(rockbubble[i].x,rockbubble[i].y,mouse.x,mouse.y)<135 && mouse.x>rockbubble[i].x && mouse.y>rockbubble[i].y) {
      
      rockbubble[i].click++;
      boom.play();
     

    }
  }
  
});

canvas.addEventListener("click",function () {
  for (var i = 0; i < gaunlet.length; i++) {
      if (mouse.x>gaunlet[i].x && mouse.y>gaunlet[i].y) {
        if(distancebwpoints(gaunlet[i].x,gaunlet[i].y,mouse.x,mouse.y)<75){
          gamepause=true;

          window.setTimeout(function(){
            gamepause=false;
          },400)
          gaunlet.splice(i,1);
          beep1.play();
         
          particles.splice(0,particles.length/2);
          rockbubble.splice(0,rockbubble.length);
         
        } 

      }
      
  }
 

  
})


//random numbers
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//distance b/w two points
function distancebwpoints(x1,y1,x2,y2) {
  var distancex=x2-x1;
  var distancey=y2-y1;
  return Math.sqrt(Math.pow(distancex,2)+Math.pow(distancey,2));

}
function stopwatch1(){
	seconds++;
	if (seconds===60) {
		seconds=0;
		minutes++;
	}
	if(seconds < 10){
        display_seconds = "0" + seconds.toString();
    }
    else{
        display_seconds = seconds;
    }

    if(minutes < 10){
        display_minutes = "0" + minutes.toString();
    }
    else{
        display_minutes = minutes;
    }


	document.getElementById("t").innerHTML= display_minutes+ ":" + display_seconds;

}
//start
var rate=500;
function start() {
  interval=window.setInterval(addbubble,rate);
  interval2=window.setInterval(stopwatch1,1000);


}
//addbubble
function addbubble(){
  if (ll==true) {
     newbubble();
  }
 
  speed+=0.025;
  for (var i = 0; i < particles.length; i++) {
    particles[i].color= colors[Math.floor(Math.random() * colors.length)];
  }
 
}
//pause
function pause() {
  gamepause=!gamepause;
  if (gamepause==true) {
    window.clearInterval(interval);
    window.clearInterval(interval1);
    window.clearInterval(interval2);
    document.getElementById("pause").innerHTML="RESUME";


  }
  else {
   interval=window.setInterval(addbubble,rate);
   interval1=window.setInterval(stopwatch,1000);
   interval2=window.setInterval(stopwatch1,1000);
   document.getElementById("pause").innerHTML="PAUSE";


  }

}
//collision code

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}



function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
// new BUBBLE
function newbubble() {
  
  if (particles.length<20) {
    var radius =getRandomNumber(40,60);
    var x = getRandomNumber(radius,canvas.width-radius);
    var y = getRandomNumber(radius,canvas.height-radius);
    
    var color =colors[Math.floor(Math.random() * colors.length)];

      for (var j = 0; j < particles.length; j++) {
        if (distancebwpoints(x,y,particles[j].x,particles[j].y)< radius*2) {
            x = getRandomNumber(radius,canvas.width-radius);
            y = getRandomNumber(radius,canvas.height-radius);

          j=-1;//restart loop


        }
      }
      particles.push(new Particle(x, y, radius, color));


  }



}




// Objects
var speed=5;
function Particle(x, y, radius, color) {
 this.x = x;
 this.y = y;
 this.radius = radius;
 this.color = color;
 this.velocity = {
 x: (Math.random() - 0.5)*speed, // Random x value from -0.5 to 0.5
 y: (Math.random() - 0.5)*speed // Random y value from -0.5 to 0.5
 }
 this.mass=1;
 this.update=function(particles) {
   this.draw()
   for (var i = 0; i < particles.length; i++) {
     if (this===particles[i]) continue;



     if (distancebwpoints(this.x,this.y,particles[i].x,particles[i].y)< this.radius+particles[i].radius) {
        resolveCollision(this,particles[i]);


     }

   }
   if (this.x-this.radius<=0 || this.x+this.radius>=canvas.width) {
     this.velocity.x=-this.velocity.x;

   }
   if (this.y-this.radius<=0 || this.y+this.radius>=canvas.height) {
     this.velocity.y=-this.velocity.y;

   }

    this.x += this.velocity.x // Move x coordinate
    this.y += this.velocity.y // Move y coordinate

 }
 this.draw=function () {
   c.save();
   c.beginPath();
   c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
   c.fillStyle = this.color;
   c.fill();
   c.closePath();
   c.restore();

 }
}

//rockbubble

var rockbubble=[];
var speed2=8;
var asteriod=new Image();
asteriod.src="asteroid.png";
function Rockbubble(x,y){
  this.x=x;
  this.y=y;
  this.vx=(Math.random() - 0.5)*speed2;
  this.vy=(Math.random() - 0.5)*speed2;
  this.click=0;
  this.draw=function(){
    c.drawImage(asteriod,0,0,577,481,this.x,this.y,120,100);
  }
  this.update=function () {
   if (this.click<5) {
     this.draw();
    this.x+=this.vx;
    this.y+=this.vy;
    if (this.x<0 || this.x+120>canvas.width) {
       this.vx=-this.vx;
    }
    if (this.y<0 || this.y+100>canvas.height) {
      this.vy=-this.vy;
    }
   }


  }

}
//init rock bubble
var time=20;
function initrb() {
  if (seconds==time) {
    var sx=getRandomNumber(120,canvas.width-120);
    var sy=getRandomNumber(100,canvas.height-100);

    rockbubble.push(new Rockbubble(sx,sy));
    if (ll==true) {
       time+=8;
    }
    else{
      time+=10;
    }
   
    if (time==60) {
      time=0;
    }


  }
  
}

//gaunlet
var imgp=new Image();
imgp.src="snap.png"
var gaunlet=[];
function Gaunlet(x,y) {
   this.x=x;
   this.y=y;
   this.click=0;
   this.draw=function () {
   //if (this.click<1) {
      c.drawImage(imgp,0,0,512,512,this.x,this.y,75,75);
   // }
     
   }
}
//init gaunlet
var time2=30;
function initgaunlet() {
  if (seconds==time2) {
    var gx=getRandomNumber(75,canvas.width-75);
    var gy=getRandomNumber(75,canvas.height-75);

   gaunlet.push(new Gaunlet(gx,gy));
    time2+=20;
    if (time2>60) {
      time2=30;
    }
 
  }
}
//liquid luck
 var interval5;
 var numclick=0;
function liquidluck() {
  if (numclick<2) {
     numclick++;
     ll=false;
    interval5= window.setInterval(function() {
      if (ll==false) {
         newbubble();
      }

     
       
     },1500);
    window.setTimeout(function(){
        window.clearInterval(interval5);
        ll=true;

      },5000);

  

  }
 
 
}

// Implementation
let particles=[];
var num=6;//max-20
function init() {
 for (let i = 0; i <num; i++) {
 var radius =getRandomNumber(40,60);
 var x = getRandomNumber(radius,canvas.width-radius);
 var y = getRandomNumber(radius,canvas.height-radius);

 var color = colors[Math.floor(Math.random() * colors.length)];
 if (i !==0) {
   for (var j = 0; j < particles.length; j++) {
     if (distancebwpoints(x,y,particles[j].x,particles[j].y)< radius*2) {
         x = getRandomNumber(radius,canvas.width-radius);
         y = getRandomNumber(radius,canvas.height-radius);

       j=-1;//restart loop


     }
   }

 }
 particles.push(new Particle(x, y, radius, color));
 }
}
//localstorage
var recordtimes1=[];

recordtimes1=JSON.parse(localStorage.getItem("times0"));
 if (recordtimes1!=null) {
   recordtimes1.sort();
   
     document.getElementById("hs").innerHTML=recordtimes1[recordtimes1.length-1];

 }




//danger ZONE
function dangerzone() {
  if (particles.length==20) {
    
    document.getElementById("canvas").style.border="5px solid red";



  }
  else {
    document.getElementById("canvas").style.border="5px solid #0073e6 ";
    //window.clearInterval(interval1);
    seconds1=-1;

  }

}
//dangerzone time
function dangerzonetime() {
  if (particles.length==20) {
    dangerzonetime=function() {}

    interval1=window.setInterval(stopwatch,1000);



  }

}
//stopwatch
function stopwatch(){
  seconds1++;

  document.getElementById("dt").innerHTML=seconds1;
}
//game over
var img = new Image();   // Create new img element
img.src = 'gameover1.jpg';
function gameover() {
  if (seconds1==10) {
  window.clearInterval(interval1);
  window.clearInterval(interval2);
  document.getElementById("try").style.visibility="visible";
  gamepause=true;
  if (recordtimes1==null) {
          recordtimes1=[];  
        recordtimes1[recordtimes1.length]=document.getElementById('t').innerHTML;
        localStorage.setItem("times0",JSON.stringify(recordtimes1));
    }
  else{
          recordtimes1[recordtimes1.length]=document.getElementById('t').innerHTML;
          localStorage.setItem("times0",JSON.stringify(recordtimes1));
    }
      recordtimes1.sort();

      document.getElementById("hs").innerHTML=recordtimes1[recordtimes1.length-1];


  c.drawImage(img,0,0,800,600);
  beep2.play();
}

}

// Animation Loop
function animate() {
 requestAnimationFrame(animate);// Create an animation loop
 if (!gamepause) {
   c.fillStyle ="#f6f6ee";
   c.fillRect(0, 0,canvas.width,canvas.height);
   c.fill;
   initrb();
   initgaunlet();
  gaunlet.forEach(gaunlet => {
   gaunlet.draw();
   })
   
  rockbubble.forEach(rockbubble => {
   rockbubble.update();
   })
   particles.forEach(particle => {
   particle.update(particles);
   })

  
  
  
   dangerzone();
   dangerzonetime();
   gameover();
  



 }


}
init();
animate();
