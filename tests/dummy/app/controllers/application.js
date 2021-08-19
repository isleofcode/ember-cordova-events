import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
	cordovaEvents: service('ember-cordova/events'),

	currentEvent: 'backbutton',

	actions: {
		emitEvent() {
			this.cordovaEvents.trigger(this.currentEvent, {});
		}
	}
})