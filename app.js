//Global Selections and Variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelectorAll('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
let initialColors;

//Event Listeners
sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);

});
colorDivs.forEach((div, index) => {
    div.addEventListener('change', () => {
        updateTextUI(index);
    })
})

//Functions
//Color Generator using Chroma JS
function generateHex() {
    const hexColor = chroma.random();
    return hexColor;
}

function randomColors() {
    //generate initial colors array
    initialColors = [];

    colorDivs.forEach((div, index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        //add generated random color to the initialColors array
        initialColors.push(chroma(randomColor).hex());
        //Add the color to the bg. (the following div will be the .color panel)
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        
          // check contrast using checkTextContrast()
        checkTextContrast(randomColor, hexText);

        //initial Colorize Sliders 
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll('.sliders input');
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });
    //Reset Inputs 
    resetInputs();
}

//change text contrast to look nice with background color
function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if(luminance > 0.5) {
        text.style.color = "black"
    } else {
        text.style.color = "white";
    }
}

function colorizeSliders(color, hue, brightness, saturation) {
    //Scale Saturation
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    //Scale Brightness
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);

      //Update Input Colors
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(74, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`
}

//hsl controls
function hslControls(e) {
    const index = e.target.getAttribute("data-bright") || 
                  e.target.getAttribute("data-sat") ||
                  e.target.getAttribute("data-hue");
    
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor = initialColors[index];

    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value)

        colorDivs[index].style.backgroundColor = color;

        //colorize the sliders/inputs
        colorizeSliders(color, hue, brightness, saturation);

}
function updateTextUI(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();
    //check contrast
    checkTextContrast(color, textHex);
    for (icon of icons) {
        checkTextContrast(color, icon);
    }
}
function resetInputs() {
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider => {
        if(slider.name === 'hue') {
            const hueColor = initialColors[slider.getAttribute('data-hue')];
            const hueValue = chroma(hueColor);
            //now, to just get the first 2 decimals of the value
            slider.value = Math.floor(hueValue * 100) /100;
        }
        if(slider.name === 'sat') {
            const satColor = initialColors[slider.getAttribute('data-sat')];
            const satValue = chroma(satColor);
            //now, to just get the first 2 decimals of thevalue
            slider.value = Math.floor(satValue * 100) /100;
        }
        if(slider.name === 'brightness') {
            const brightColor = initialColors[slider.getAttribute('data-bright')];
            const brightValue = chroma(brightColor);
            //now, to just get the first 2 decimals of the value
            slider.value = Math.floor(brightValue * 100) /100;
        }
    })
}

randomColors();   