class Gestures {
  async swipe(from, to) {
    await driver.performActions([
      {
        // a. Create the event
        type: 'pointer',
        id: 'finger1',
        parameters: {
          pointerType: 'touch'
        },
        actions: [
          // b. Move finger into start position
          {
            type: 'pointerMove',
            duration: 0,
            x: from.x,
            y: from.y
          },
          // c. Finger comes down into contact with screen
          {
            type: 'pointerDown',
            button: 0
          },
          // d. Pause for a little bit
          {
            type: 'pause',
            duration: 100
          },
          // e. Finger moves to end position
          //    We move our finger from the center of the element to the
          //    starting position of the element.
          //    Play with the duration to make the swipe go slower / faster
          {
            type: 'pointerMove',
            duration: 1000,
            x: to.x,
            y: to.y
          },
          // f. Finger gets up, off the screen
          {
            type: 'pointerUp',
            button: 0
          }
        ]
      }
    ]);
    // Add a pause, just to make sure the swipe is done
    return await driver.pause(1000);
  };

  async tap(coordinate) {
    return await driver.touchAction({ action: 'tap', x: coordinate.x, y: coordinate.y });
  };
};

export default new Gestures()