import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class DataServiceProvider {

  constructor(private db: AngularFirestore) {
    console.log('Hello DataServiceProvider Provider');
  }
  updateSong(songData): Promise<any> {
    const songsCollection = this.db.collection('songs');
    return songsCollection.add(songData);
  }
  updateProgramsCategories(catProg: string, name: string, songData): Promise<any> {
    const songsCollection = this.db.collection(catProg);
    return songsCollection.doc(name).update(songData);
  }
}
