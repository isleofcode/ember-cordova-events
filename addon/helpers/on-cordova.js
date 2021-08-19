import Helper from "@ember/component/helper";
import { inject as service } from "@ember/service";

export function callbackWrapper(event, callback, bubbles) {
  if (event.bubbles !== false) {
    let shouldBubble = callback(event);

    if (shouldBubble === false || bubbles === false) {
      event.bubbles = false;
    }

    return shouldBubble;
  }
}

export default Helper.extend({
  cordovaEvents: service('ember-cordova/events'),

  doFn(event) {
    return callbackWrapper(event, this.fn, this.bubbles);
  },

  compute([event, fn], { bubbles = true }) {
    this.fn = fn;
    this.event = event;
    this.bubbles = bubbles;
    //this.doFn = (event) => callbackWrapper(event, this.fn, this.bubbles);
    this.cordovaEvents.on(event, this, "doFn");
  },

  willDestroy() {
    if (this.fn && this.event) {
      this.cordovaEvents.off(this.event, this, "doFn");
    }
    this._super.willDestroy();
  },
});
