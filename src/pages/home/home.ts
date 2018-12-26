import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  title: string;
  songData = {
    title: 'Righteousness, Peace, Joy',
    author: '',
    lyrics: [{
      type: 'intro',
      words: 'Righteousness, peace, joy in the Holy Ghost [x2]'
    }, {
      type: 'line',
      words: 'That\'s the kingdom of God.'
    },
    {
      type: 'nextVerse',
      words: 'Don\'t you want to be a part of the kingdom [x3]'
    }, {
      type: 'line',
      words: 'Come on everybody'
    }
    ]
  };
  constructor(public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LyricsPage');
    this.title = 'Song title here';
  }
}
