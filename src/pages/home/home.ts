import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  title: string;
  author: string;
  lyricsInput: string;
  parserOutput: any[];
  contents: any;
  constructor(public navCtrl: NavController) {
    this.contents = {
      lyrics: []
    };
    this.parserOutput = [];
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LyricsPage');
    this.title = 'Song title here';
    this.author = 'Sebin Benjamin';
    this.lyricsInput = '';
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
    if (this.lyricsInput.length == 0)
      return;
    let lines = this.lyricsInput.split(/\n/);
    this.parserOutput.splice(0, this.parserOutput.length);

    for (let i = 0; i < lines.length; i++) {
      // Line contains a non whitespace character.
      if (/\S/.test(lines[i])) {
        if (lines[i].toUpperCase().startsWith('INTRO') && lines[i + 1] != undefined) {
          this.parserOutput.push(
            {
              type: 'intro',
              words: lines[i + 1].trim()
            }
          );
          if (i < lines.length) i++;
          continue;
        }
        else {
          this.parserOutput.push({
            type: 'line',
            words: lines[i].trim()
          });
        }
      }
      // if we get a newline, recognize as next para 
      else if (lines[i] == '' && lines[i + 1] != undefined) {
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
    this.contents = { title: this.title, author: this.author, lyrics: [this.parserOutput] };
  }
}
