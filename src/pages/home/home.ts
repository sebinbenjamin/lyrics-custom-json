import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  title: string;
  artist: string;
  category: string[];
  program: string[];
  lyricsInput: string;

  parserOutput: any[];
  contents: any;
  copyColor: {
    background: string;
  };
  constructor(public navCtrl: NavController) {
    this.contents = {
      lyrics: []
    };
    this.parserOutput = [];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LyricsPage');
    this.title = 'Song title here';
    this.artist = '';
    this.lyricsInput = '';
    this.category = [];
    this.program = [];
    this.copyColor = { background: '' };
    this.contents = {
      lyrics: [{
        type: 'intro',
        words: 'Righteousness, peace, joy in the Holy Ghost [x2]'
      }, {
        type: 'line',
        words: 'That\'s the kingdom of God.'
      }, {
        type: 'line',
        words: 'And that\'s the kingdom of God.'
      },
      {
        type: 'nextVerse',
        words: 'Don\'t you want to be a part of the kingdom [x3]'
      }, {
        type: 'line',
        words: 'Come on everybody'
      },
      {
        type: 'line',
        words: 'Hey common on everybody'
      }
      ]
    };
  }
  generateJSON() {
    //JSON generation only necessary if Lyrics has been added 
    if (this.lyricsInput.length == 0)
      return;

    //Get each line from input and split into array string based on newline
    let lines = this.lyricsInput.split(/\n/);
    this.parserOutput.splice(0, this.parserOutput.length);

    //for each line in input, parse any markers and produce output  
    for (let i = 0; i < lines.length; i++) {
      // Line contains a non whitespace character.
      if (/\S/.test(lines[i])) {
        if (lines[i].toUpperCase().startsWith('[INTRO]') && lines[i + 1] != undefined) {
          this.parserOutput.push(
            {
              type: 'intro',
              words: lines[i + 1].trim()
            }
          );
          if (i < lines.length) i++;
          continue;
        }
        else if (lines[i].toUpperCase().startsWith('[CHORUS]') && lines[i + 1] != undefined) {
          this.parserOutput.push(
            {
              type: 'chorus',
              words: lines[i + 1].trim()
            }
          );
          if (i < lines.length) i++;
          continue;
        }
        else if (lines[i].toUpperCase().startsWith('[RAP]') && lines[i + 1] != undefined) {
          this.parserOutput.push(
            {
              type: 'rap',
              words: lines[i + 1].trim()
            }
          );
          if (i < lines.length) i++;
          continue;
        }
        else if (lines[i].toUpperCase().startsWith('[BRIDGE]') && lines[i + 1] != undefined) {
          this.parserOutput.push(
            {
              type: 'bridge',
              words: lines[i + 1].trim()
            }
          );
          if (i < lines.length) i++;
          continue;
        }
        //if there are no markers in the line, just add it as line
        else {
          this.parserOutput.push({
            type: 'line',
            words: lines[i].trim()
          });
        }
      }

      // if we get a newline, recognize as nextverse if it does NOT start with any markers  
      else if (lines[i] == '' && lines[i + 1] != undefined &&
        !lines[i + 1].toUpperCase().startsWith('[INTRO]') &&
        !lines[i + 1].toUpperCase().startsWith('[CHORUS]') &&
        !lines[i + 1].toUpperCase().startsWith('[RAP]') &&
        !lines[i + 1].toUpperCase().startsWith('[BRIDGE]')) {
        this.parserOutput.push(
          {
            type: 'nextVerse',
            words: lines[i + 1].trim()
          }
        );
        if (i < lines.length) i++;
        continue;
      }
    }

    //convert category array into object
    let categoryObj = {};
    this.category.forEach(cat => {
      categoryObj[cat] = true;
    });
    //convert program array into object
    let programObj = {};
    this.program.forEach(prog => {
      programObj[prog] = true;
    });

    console.log('parserOutput', this.parserOutput);
    this.contents = {
      title: this.title,
      artist: this.artist,
      category: categoryObj,
      program: programObj,
      lyrics: this.parserOutput
    };
  }
  copyJSON() {
    //copies data to clipboard
    var textField = document.createElement('textarea');

    textField.innerText = JSON.stringify(this.contents);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    //changes color of copy button
    this.copyColor.background = 'green';
    setTimeout(() => {
      this.copyColor.background = 'orange';
    }, 1000);
  }
}
