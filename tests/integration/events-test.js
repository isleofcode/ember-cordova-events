/* global Event */
import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import td from 'testdouble';
import subscribe from 'ember-cordova-events/utils/subscribe';

const {
  A,
  Object: EmberObject,
  inject
} = Ember;

// from https://cordova.apache.org/docs/en/4.0.0/cordova_events_events.md.html
const CORDOVA_EVENTS = new A([
  'deviceready',
  'pause',
  'resume',
  'resign',
  'active',
  'backbutton',
  'menubutton',
  'searchbutton',
  'startcallbutton',
  'endcallbutton',
  'volumedownbutton',
  'volumeupbutton',
  'batterycritical',
  'batterylow',
  'batterystatus',
  'online',
  'offline'
]);

moduleFor('service:ember-cordova/events', 'Integration | Service | ember-cordova/events', {
  integration: true,

  beforeEach: function() {
    let properties = {};

    CORDOVA_EVENTS.forEach((name) => {
      properties[name] = function() {};
    });

    this.pluginDouble = td.object(properties);
    this.eventsService = this.subject();
  },

  afterEach: function() {
    td.reset();
  }
});

test('events listeners are triggered', function(assert) {
  assert.expect(0);

  CORDOVA_EVENTS.forEach((name) => {
    let matchers = td.matchers.argThat((event) => { return event.type === name; });
    let eventCallback = this.pluginDouble[name];
    let properties = {
      container: this.container,
      cordovaEvents: inject.service('ember-cordova/events')
    };

    properties[`on${name}`] = subscribe(`cordovaEvents.${name}`, eventCallback);
    EmberObject.extend(properties).create();

    window.document.dispatchEvent(new Event(name));

    td.verify(eventCallback(matchers));
  });
});
