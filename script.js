const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const symbolsCheck = document.querySelector("#symbols");
const numbersCheck = document.querySelector("#numbers");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|;:"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey
handleSlider();

// set password length to the value of the slider
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow 
}

function getRndInteger(min , max){
    return Math.floor(Math.random() * (max-min) + min); //* this generates an integer within the range min and max 
} 

function generateRandomNumber(){
    return getRndInteger(0,9); // this gives an integer from 0 to 9 (single digit)
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123)); // Now change this random number to character
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91)); // Now change this random number to character
}

function generateSymbol(){
    const randNum = getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent (){ //! navigator.clipboard.writeText will return a promise and then we await for it to get resolved
    try {
        await navigator.clipboard.writeText((passwordDisplay.value));
        copyMsg.innerText = "copied";
    }

    catch{
        copyMsg.innerText = "Copy Failed";
    }
    // to make copy vala span visible
    copyMsg.classList.add("active");
    setTimeout (()=> {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    // Fisher Yates method 
    for(let i = array.length - 1 ; i>0 ;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((ele) => (str += ele));
    return str;
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value; 
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value || passwordLength>0) copyContent(); //* means copy tabhi hoga jab passwordDisplay me value padi hai vrna nahi hoga 
})

function handleCheckboxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount++;
        // else checkCount--;
    })

    //* special condition
    if(passwordLength<checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckboxChange);
})

generateBtn.addEventListener('click',() => {
    // none of the checkbox are selected
    if(checkCount<=0) return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // lets start journey to find new password
    console.log("journey starts");
    // remove old pass first
    password = "";

    // lets put the stuff mentioned by checkboxes 
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);

    // compulsory addition 
    for(let i=0 ; i<funcArr.length ; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory Addition Done");
    // remaining addition 
    for(let i=0; i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining Addition Done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done");
    // show in UI 
    passwordDisplay.value = password;
    console.log("UI Addition Done");
    // calculate strength
    calcStrength();
})