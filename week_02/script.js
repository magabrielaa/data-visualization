// JAVASCRIPT TUTORIAL

let num = 100; // assign integer to a variable - GLOBAL SCOPE

/*
block comment
*/

function foo() {    //Create a function
    console.log(num);
    let num1 = 200; // FUNCTIONAL SCOPE. Can only be seen inside the function.
};

// FUNCTIONS

foo(); // Call function

/*console.log(num1); */ // Throws error in the console b/c defined within a function

let anonFun = function() { //Anonymous function, does not have a name
    console.log("hello"); 
}

let num2 = 500;

anonFun();

(function() {
    console.log("Hello there");
})(); // Function runs immediately as the page runs


// Arrow Function
/*(() => console.log(100))() */ //Throws error b/c foo already defined

/*let foo = () => console.log(num); */

foo = () => console.log(num2); // Can reasign without "let" key word. Same as function on 32
foo();

let bar = 100;
bar = 200;


// ARRAYS

let arr = ["foo", "bar", "zar", 123, ["blah", 4, 6]];
console.log(arr[3]);

// Set item in array
arr[1] = "barbar"; //overwrites what's there
console.log(arr[1]);

// Add item to the end of the array
arr.push("par");

console.log(arr);

// Remove an item from an array. First value is index, second value what you want to delete
arr.splice(2,1);

console.log(arr);

// New array
let newArr = ["cow", "turtle", "goat"];


// FOR LOOPS
for (let item of newArr) { //loops through values
    console.log(item);
}

for (let i in newArr) { //loops through the index
    console.log(i + "" + newArr[i]);
}

newArr.forEach((item,i) => console.log(i + " " + item)); //loops through values and index, aka enumerate

// OBJECTS

let obj1 = {    // Key value pairs, aka dictionaries
    name: "Jill", //keys are: name, age, job
    age: 85,
    job: "Cactus Hunter",
};

// Access property
console.log(obj1.name);      // (1)
console.log(obj1["name"]);   // (2) Indexes into the value

// Set value
obj1.job = "Barista";
console.log(obj1.job);

//Loop through all properties
for (let key in obj1) {
    let value = obj1[key];
    console.log(`This pair is ${key}: ${value}`);
}

/*
Old school way of creating strings:
let str = "Hello " + key + " more text here " + foo;
let str = `Hello ${key} more text here ${foo}`;
*/

// Regular for loop
for (let i = 0; i < 10; i++) {
    console.log(i);
}

let fall = [1,2,3] // Typeof returns array as object
console.log(typeof fall)


// If else statement
let val = 80;

if (val > 80) {
    console.log("good")
} else if (val > 50) {
    console.log ("okay")
} else {
    console.log("terrible")
}

let y = (val > 80) ? console.log("good") : console.log("not good"); //Turnary statement if-else only two options, ":" = else, only if else


// Traversing the DOM = Document Object Model, looking for specific id/class
let newVar = document.getElementById("example"); // document is a key word and it refers to the document this is loaded into
// We target the container, now we add t it

newVar.innerHTML += `<h1>HELLO WORLD!</h1> <p> Paragraph text here ${num} </p>` // Gives error because script was declared in the header. Move it to the body so it works.