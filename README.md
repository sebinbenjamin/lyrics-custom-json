# lyrics-custom-json
Simple UI to make convert lyrics into custom JSON format   

### Guidelines for the format
* 4 markers are presently available. They are
  * [Intro]
  * [Pre-Chorus]
  * [Chorus]
  * [Rap]
  * [Bridge] 
  
* Line after any of the above markers should contain the text/lyrics, and no space/newline is required. 

* They must be enclosed in square brackets.
No spaces/newline must be put unnecessarily.

* New verses can be started by putting an extra newline after the previous verse line.

#### Install issues
Do `npm install rxjs@6 rxjs-compat@6 --save` to fix  `Error: Uncaught (in promise): TypeError: Object(...) is not a function` error