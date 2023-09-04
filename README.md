# Some OpenHAB with GraphQL examples

Using GraphQL with OpenHAB, some simple examples


Select item from left-hand sidebar


## Items

Fecth all the OpenHAB items. You can play with the query to control what data gets returned.


## Events

Subscribe to all the events - this will be something of a fire-hose!


## Custom

Fetch all data from items in a group, and subscribe to updates.

I use this to provide a UI mimic to show electricity import/export from our house displayed as an SVG.

This won’t work directly for you -- you would need a group called “EmonTX” and various values within it, but is just an example of how you might roll your own mimics.


