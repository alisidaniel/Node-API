var events = require('events');
var util = require('util');

var Person = function (name){
    this.name = name;
}

util.inherits(Person, events.EventEmitter)

var Daniel = new Person('Daniel');
var Alisi  = new Person('Goodluck');
var Olamide = new Person('Olamide');

var People = [Daniel, Alisi, Olamide];

People.forEach(function(Person){
    Person.On('speak', function(msg){
        console.log(Person.name + ' said: ' + msg);
    })
});

Daniel.emit('speak', 'hey dudes');