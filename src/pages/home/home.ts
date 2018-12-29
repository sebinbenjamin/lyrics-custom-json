import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DataServiceProvider } from '../../providers/data-service/data-service';

import * as firebase from 'firebase/app';

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
  updateSongsColor: {
    background: string;
  };
  updateProgColor: {
    background: string;
  };
  songID: string;
  constructor(public navCtrl: NavController, private dataServiceProvider: DataServiceProvider, public alertCtrl: AlertController) {
    this.contents = {
      lyrics: []
    };
    this.parserOutput = [];
    this.songID = '';
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LyricsPage');
    this.title = '';
    this.artist = '';
    this.songID = '';
    this.lyricsInput = '';
    this.category = [];
    this.program = [];
    this.updateSongsColor = { background: '' };
    this.updateProgColor = { background: '' };
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
        else if (lines[i].toUpperCase().startsWith('[PRE-CHORUS]') && lines[i + 1] != undefined) {
          this.parserOutput.push(
            {
              type: 'pre-chorus',
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
        !lines[i + 1].toUpperCase().startsWith('[PRE-CHORUS]') &&
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

    // console.log('parserOutput', this.parserOutput);
    this.contents = {
      title: this.title,
      artist: this.artist,
      category: categoryObj,
      program: programObj,
      lyrics: this.parserOutput
    };
  }
  // copyJSON() {
  //   //copies data to clipboard
  //   var textField = document.createElement('textarea');

  //   textField.innerText = JSON.stringify(this.contents);
  //   document.body.appendChild(textField);
  //   textField.select();
  //   document.execCommand('copy');
  //   textField.remove();

  //   //changes color of copy button
  //   this.copyColor.background = 'green';
  //   setTimeout(() => {
  //     this.copyColor.background = 'orange';
  //   }, 1000);
  // }
  updateSongs() {
    this.generateJSON();
    console.log('updateSongs()');
    this.updateSongsColor.background = 'orange';
    this.dataServiceProvider.updateSong(this.contents)
      .then(sucess => {
        console.log('Sucess Adding Data', sucess);
        let alert = this.alertCtrl.create({
          title: 'Sucess',
          message: 'Songs collection update sucess.' + 'Song ID: ' + sucess.id,
          buttons: ['Ok']
        });
        alert.present();
        this.songID = sucess.id;
        this.updateSongsColor.background = 'green';
      })
      .catch(error => {
        this.updateSongsColor.background = 'red';
        console.log('Error Adding Data', error)
        this.songID = '';
      });;
  }
  updateProgramsCategories() {
    console.log('updateProgramsCategories()');

    let programsPromiseArray = [];
    let categoriesPromiseArray = [];

    this.category.forEach(cat => {
      programsPromiseArray.push(this.dataServiceProvider.updateProgramsCategories('category', cat,
        {
          'songs': firebase.firestore.FieldValue.arrayUnion({ 'songID': this.songID, 'title': this.title })
        }))
    });

    this.program.forEach(prog => {
      categoriesPromiseArray.push(this.dataServiceProvider.updateProgramsCategories('program', prog,
        {
          'songs': firebase.firestore.FieldValue.arrayUnion({ 'songID': this.songID, 'title': this.title })
        }))
    });

    let allPromisesArray = [];
    allPromisesArray.push(Promise.all(programsPromiseArray));
    allPromisesArray.push(Promise.all(categoriesPromiseArray));

    this.updateProgColor.background = 'orange';
    Promise.all(allPromisesArray)
      .then(sucess => {
        console.log('Sucess Adding Programs', sucess);
        let alert = this.alertCtrl.create({
          title: 'Sucess',
          message: 'Programs collection update sucess.',
          buttons: ['Ok']
        });
        alert.present();
        this.updateProgColor.background = 'green';
      })
      .catch(error => {
        this.updateProgColor.background = 'red';
        console.log('Error adding programs data !!', error)
      });;
  }
}
