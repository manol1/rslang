export default class WordSound {

  constructor(
    // public srcs: Array<string>,
    public audioArr: Array<HTMLAudioElement>,

  ) {}

  // async play() {
  //   for ( const src of this.srcs) {
  //     const audio = new Audio(src);
  //     audio.play();
  //     try {
  //       await new Promise((reject, resolve): void => {
  //         audio.addEventListener('ended', () => {
  //           console.log('is ended', audio.src);
  //           resolve();
  //         });
  //         audio.addEventListener('error', (err) => {
  //           reject(err);
  //         });
  //       });
  //     } catch (error) {
  //       console.log( error);
  //     }
  //   }
  // }

  async play() {
    // const playedAudio = this.srcs.filter( src => {
    //   const audio = new Audio(src);
    //   audio.play();
    //   return !audio.paused;
    // });
    // if (this.audioArr.length === 0 || this.audioArr[0].src !== this.srcs[0]) {
    //   this.audioArr = this.srcs.map(src => {
    //     const audio = new Audio(src);
    //     return audio;
    //   });
    // } else {
    //   this.audioArr.map( audio => audio.pause());
    // }

    // this.audioArr = this.srcs.map(src => {
    //   const audio = new Audio(src);
    //   if (!audio.paused) {
    //     audio.pause();
    //   }
    //   return audio;
    // });
    // console.log(this.audioArr);

    for (const audio of this.audioArr) {
      audio.play();
      try {
        await new Promise((reject, resolve): void => {
          audio.addEventListener('ended', () => {
            console.log('is ended', audio.src);
            resolve();
          });
          audio.addEventListener('error', (err) => {
            reject(err);
          });
        });
      } catch (error) {
        console.log( error);
      }
    }

  }



  // for ( let i = 0; i < this.srcs.length; i += 1 ) {
  //   const audio = new Audio(this.srcs[i]);
  //   if ( !audio.paused) {
  //     console.log( 'is playing');
  //   }
  //   audio.play();
  //   try {
  //     await new Promise((reject, resolve): void => {
  //       audio.addEventListener('ended', () => {
  //         console.log('is ended', audio.src);
  //         resolve();
  //       });
  //       audio.addEventListener('error', (err) => {
  //         reject(err);
  //       });
  //     });
  //   } catch (error) {
  //     console.log( error);
  //   }
  // }



}



