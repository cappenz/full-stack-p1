//all my imports!
import { useState, useEffect } from 'react'
import { motion } from "motion/react" /* some online things for motion */
import './App.css'



// ============================================
// MAIN APP
// ============================================
export default function App() {
  //setting constants that are app wide
  const [value_friction, setValue_friction] = useState(50);
  const [value_hp, setValue_hp] = useState(50);
  const speed = (200 - value_hp) - (100 - value_friction);
  const [random, setRandom] = useState(1); // 1–7 for prop1.png–prop7.png

  //returning these constants
  return (
    <>
      <div className="app-layout">
        
        <Car />
        <PropPosition speed={speed} random={random} />
        <NewImage speed={speed} setRandom={setRandom} />
        <SpeedCounter speed={speed}/>
      </div>
      <Slider
        value_friction={value_friction}
        setValue_friction={setValue_friction}
        value_hp={value_hp}
        setValue_hp={setValue_hp}
      />
    </>
  );
}

// ============================================
// Presenting the Speed
// ============================================

function SpeedCounter({ speed }) {

  return(
    <>
      <div className= "speed-box-container">
        <h1>MPH: {((200-speed) / 2)+5} </h1>
        </div>

    </>
  );
};

// ============================================
// THE POSITION OF THE PROPS (ITEMS)
// ============================================
function PropPosition({speed, random}){
  const PropX = [
    //setting the different x positsions for the props
    { xpos: 40 },
    { xpos: 1187 },
  ];

  //returning the props and everything
    return (
      <>  
      {PropX.map(({ xpos }) => (
      <motion.div
            key={`${xpos}-${speed}`}
              initial={{ y: -200, x: xpos, opacity: 1 }}
              animate={{ y: 800, x: xpos, opacity: 1 }}
              transition={{
                duration: speed/50,
                ease: "easeIn",
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 250,
                height: 200,
                backgroundImage: `url('/images/prop${random}.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
              >
              </motion.div>
          ))}
    </>
  );
};

// ============================================
// CAR
// ============================================
function Car(){
  //from stack overflow
  const [left_offset, setLeftOffset] = useState(0);
  const [top_offset, setTopOffset] = useState(0);

    //making the arrows work
  useEffect(() => {
    const handler = function (event) {
      switch (event.keyCode) {
        case 37:
          //left
          setLeftOffset((prev) => (prev - 10 <= -150 ? -140 : prev - 10));
          break;
        case 39:
          // right (cap at 90)
          setLeftOffset((prev) => (prev + 10 >= 100 ? 90 : prev + 10));
          break;

      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  //the acual car
  return (
    <div className="f1-container">
       <img src="/images/f1_car.png" id="car" alt="image overlay car" className="image-overlay-car" style={{ position: "relative", left: left_offset, top: top_offset }} />
       </div>
  )
}

// ============================================
// GETTING NEW IMAGE FOR PROP
// ============================================
//getting a random prop  and setting it after a break
function NewImage({ speed, setRandom }) {
  useEffect(() => {
    let cancelled = false;
    //set up sleep
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    //generating random number for image
    function generate() {
      // got this from Geeksforgeeks
      const min = 1;
      const max = 7;
      const random = Math.floor(Math.random() * (max - min + 1)) + min;
      setRandom(random);
    }
    //sleep
    async function run() {
      //from a dhi blog 
      await sleep((speed / 50) * 1000);
      if (cancelled) return;
      generate();
      if (!cancelled) run();
    }
    run();

    return () => { cancelled = true; };
  }, [speed, setRandom]);
}


// ============================================
// SLIDERS 
// ============================================
function Slider({ value_friction, value_hp, setValue_friction, setValue_hp }) {
  const sliders = [
    //setting up the sliders
    { id: 'friction', label: 'Friction', value: value_friction, setValue: setValue_friction },
    { id: 'hp', label: 'Engine Horsepower', value: value_hp, setValue: setValue_hp },
  ];

  //returing for the UI
  return (
    <>
      <div className="box-container">
        <div className="box"></div>
        <div>
          <h1>Change the sliders to change the speed </h1>
          <h4> Use the arrows to go left/right </h4>
        </div>

        <div className="range-slider">
          {sliders.map(({ id, label, value, setValue }) => (
            <div key={id}>
              <label htmlFor={`range-slider-${id}`}>{label}<br></br> </label>
              <input
                type="range"
                id={`range-slider-${id}`}
                min="0"
                max="100"
                step="1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="slider"
              />
              <br />
              <br />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
