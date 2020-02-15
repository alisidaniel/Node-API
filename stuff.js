var counter = function(arr){
    return 'There are '+ arr.length + ' element in this array';
}

var adder = function(a,b){
    return `This sum of two numbers is ${a+b}`;
}

var pi = 3.142;

module.exports = {
    counter:counter,
    adder:adder,
    pi:pi
}