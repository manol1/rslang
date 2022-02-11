export default class WordSound {
  constructor(
    public srcs: Array<string>,

  ) {}

  async play() {
    for ( const src of this.srcs) {
      const audio = new Audio(src);
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
}



