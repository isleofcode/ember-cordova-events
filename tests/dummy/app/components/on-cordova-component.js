import Component from "@ember/component";
import { inject as service } from "@ember/service";

export default Component.extend({
  cordovaEvents: service("ember-cordova/events"),
  bubbles: true,

  actions: {
    yell() {
      //eslint-disable-next-line
      console.log(this.name);
    },
  },
});
