import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class DataServiceProvider {

  constructor(private db: AngularFirestore) {
    console.log('Hello DataServiceProvider Provider');
  }
  updateSong(songData): Promise<any> {
    let songsCollection = this.db.collection('song');
    return songsCollection.add(songData);
  }
  updateProgramsCategories(catProg: string, name: string, songData): Promise<any> {
    let programCategory = this.db.collection(catProg);
    return programCategory.doc(name).update(songData);
  }
}
