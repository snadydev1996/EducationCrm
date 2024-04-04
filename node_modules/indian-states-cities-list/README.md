# Indian-states-cities-list
Repo consist of Indian-state array , state wise cities list
##Table of content
* [Intro](#intro)
* [Setup](#setup)
* [Usage](#usage)


## General info
This Package provide a list of Indian-states and state-wise cities.

## Setup
Simply add this package by using
```
$ npm install Indian-states-cities-list

```
## Usage
```
import Indian_states_cities_list from "indian-states-cities-list";

console.log(Indian_states_cities_list.STATE_WISE_CITIES.AndamanandNicobar);

//output
/*
    [
    { value: 'Nicobar', label: 'Nicobar' },
    {
      value: 'North and Middle Andaman',
      label: 'North and Middle Andaman'
    },
    { value: 'South Andaman', label: 'South Andaman' }
    ]
*/

```

```
import Indian_states_cities_list from "indian-states-cities-list";

console.log(Indian_states_cities_list.STATES_OBJECT);

//output
/*
    [
    {label: "Andaman and Nicobar Islands",value: "Andaman and Nicobar Islands",name: "AndamanandNicobar"},
    {label: "Andhra Pradesh",value: "Andhra Pradesh",name: "AndhraPradesh"},
    ....,
    {label: "West Bengal",value: "West Bengal",name: "WestBengal"}
    ]
*/

```
