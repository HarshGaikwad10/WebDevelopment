

//getting elements from html document

const inputSlider =document.querySelector("[data-lengthSlider]"); //selecting a custom attribute
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberscheck=document.querySelector("#numbers");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector(".indicator");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

let password="";  //Initially password is empty
let passwordLength=10; //default length of password
let checkCount=0; // by-default one checkbox is selected
handleSlider();
//set color to gray
setIndicator("#ccc");

//function which handles slider and changes password length and reflect chenges on app

function handleSlider()
{
     inputSlider.value=passwordLength;
     lengthDisplay.innerText=passwordLength;
     //for styling the input slider
     const min=inputSlider.min;
     const max=inputSlider.max;
     inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
     
}

//function which indicates strength of password and shadow of indicator

function setIndicator(color)
{
    // console.log(indicator.innerHTML);
     indicator.style.backgroundColor=color;
    //shadow
}

//function to generate random integers in password

function getRandomIntgers(max,min)
{
   
    return Math.floor(Math.random()*[max-min])+min; 
   //math.random gives any random value between 0 to 1 
   //math.random()*[max-min] gives value between 0 to max-min 
   //math.floor gives only integer value means removes the floating point digits i.e number after decimal point
   // Math.floor(Math.random()*[max-min])+min; extra min is added to give integer from min to max

}

//function which gives random number between 0 t0 9

function getRandomNumber()
{
    return getRandomIntgers(0,9);
}

//function which gives random lowercase characters between a to z

function generateLowercase()
{
  return String.fromCharCode(getRandomIntgers(97,123)); 
  //ascii value of a=97 and ascii value of z=123
  //string.fromcharcode converts integers to characters
}

//function which gives random uppercase characters between A to Z

function generateUppercase()
{
  return String.fromCharCode(getRandomIntgers(65,91)); 
  //ascii value of A=65 and ascii value of Z=91
  //string.fromcharcode converts integers to characters
}

// random symbols string
const symbols='~`!@#$%^&*()_-+={[}]:;"<,>.?/';

//function which returns a random symbol from string of symbols

function generateSymbol()
{
     const randomNum =getRandomIntgers(0,symbols.length); //gets a random number betwwen 0 to length of string
     return symbols.charAt[randomNum]; //returns a character symbol at the index of random number
}

//function which calculates strength of password on basis of which checkboxes are checked
function calcStrength()
{
    let hasNumber=false;
    let hasLower=false;
    let hasUpper=false;
    let hasSymbol=false;

    if(lowercasecheck.checked)
    {
        hasLower=true;
    }
    if(uppercasecheck.checked)
    {
        hasUpper=true;
    }
    if(numberscheck.checked)
    {
        hasNumber=true;
    }
    if(symbolscheck.checked)
    {
        hasSymbol=true;
    }

      //set color green to indicate strong password
      // set color yellow to indicate medium strength of password
      //set color red to indicate weak password
      

      if((hasLower&&hasUpper) && (hasSymbol||hasNumber) && passwordLength>=8)
      {
         setIndicator("#0f0");
      }
      else if((hasLower||hasUpper) && (hasNumber||hasSymbol) && passwordLength>=6)
      {
          setIndicator("#ff0");
      }
      else{
          setIndicator("#f00");
      }

}

//await navigator.clipboard.writeText(passwordDisplay.value) 
//It is a statement that uses clipbaorad API interface to write the generated password to clipboard.
//here writeText() method of clipboard API interface is used to write the text on clipboard
//clipboard.writeText() returns a promise and if the promise is successfully resolved then text gets successfully copied on clipboard.
//await keyword makes sure that the execution of program is stopped untill promise is resolved . This ensures that the password is successfully copied to clipboard.    

async function copyContent()
{   try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    }
    catch(e){
       copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active"); //adds active css class inside copyMsg element

    setTimeout(()=>{
    copyMsg.classList.remove("active"); //removes active css class inside copyMsg element
    },2000);
}
//if slider is moved then event is fired and  password length gets the value of slider and length is updated
inputSlider.addEventListener('input',(e)=>{
         passwordLength=e.target.value; // .target returns the object to which event is dispatched i.e inputslider
         handleSlider();
})
//if copybutton is clicked then event is fired 
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) //if input element is non-empty i.e if input element contains some value then call copycontent
    {
        copyContent();
    }
})

//if checkbox is checked or unchecked then event is fired for all checkboxes to count no of checked checkboxes

allCheckBox.forEach((checkbox)=>{
        checkbox.addEventListener('change',handleCheckBoxChange);
})

function handleCheckBoxChange()
{  //update the checkbox count on tick or untick of checkbox
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
           if(checkbox.checked)
           {
            checkCount++;
           } 
    })

 //special condition

 //if password length is less than number of checkboxes checked then password length is changed to number of checkboxes checked 
   
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

}

//shuffle password function 

function shufflePassword(array)
{
  //fisher Yates Method
      for(let i=array.length-1;i>0;i--)
      {    //j is used to find random index 
           const j=Math.floor(Math.random()*(i+1));
           //swapping of i and j 
           const temp=array[i];
           array[i]=array[j];
           array[j]=temp;
      }
 //after shuffling the new password is added into str and it is returned by this function
      let str="";
      array.forEach((ele)=>(str+=ele));
      return str;
}


                                 //main function

//function which generates the password whenever generate password is clicked

generateBtn.addEventListener('click',()=>{
    //if no checkboxes are selected then simply return and dont generate password
    if(checkCount<=0)
    {
        return;
    }

    //special condition
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }

// code to generate new password 

    //remove old password each time new password is to be created
     password="";

     //add stuff mentioned by checkboxes in password

     let functionArray=[];

     if(uppercasecheck.checked){
        functionArray.push(generateUppercase);
     }
     if(lowercasecheck.checked)
     {
        functionArray.push(generateLowercase);
     }
     if(numberscheck.checked)
     {
        functionArray.push(getRandomNumber);
     }
     if(symbolscheck.checked)
     {
        functionArray.push(generateSymbol);
     }

     //compulsory addition
     // means if 4 checkboxes are checked then then compulsory password must have one uppercase,one lowercase,one number and one symbol
     for(let i=0;i<functionArray.length;i++)
     {
          password+=functionArray[i]();
     }
     
     //remaining addition 
     
     //means after compulsory addtion now randomly add anything in password
        
     for(let i=0;i<passwordLength-functionArray.length;i++)
     {
          let randomindex=getRandomIntgers(0,functionArray.length);
          password+= functionArray[randomindex]();
     }
     //shuffle the password so that it does not become predictible
     password=shufflePassword(Array.from(password));
    //show password in UI
     passwordDisplay.value=password;
    //calculate the strength of password
    calcStrength();
});