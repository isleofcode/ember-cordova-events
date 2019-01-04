import Ember from 'ember';

const {
  A,
  Evented,
  RSVP: {
    defer,
    resolve
  },
  Service,
  assert,
  isPresent,
  isBlank,
  on,
  run
} = Ember;

// from https://cordova.apache.org/docs/en/4.0.0/cordova_events_events.md.html
const CORDOVA_EVENTS = A([
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

export default Service.extend(Evented, {
  _listeners: undefined,
  _ready: undefined,
  _readyHasTriggered: false,

  init() {
    this._super();

    this._ready = defer();
    this._setupListeners();
  },

  willDestroy() {
    this._rejectPendingReadyPromise();
    this._teardownListeners();

    this._super();
  },

  ready() {
    return this._readyHasTriggered ? resolve() : this._ready.promise;
  },

  on(name, target, method) {
    if (name === 'deviceready' && this._readyHasTriggered) {
      run.join(target, method);
    }

    return this._super(name, target, method);
  },

  _setupReadyPromise: on('deviceready', function() {
    this._readyHasTriggered = true;
    this._ready.resolve();
    this._ready = null;
  }),

  _setupListeners() {
    let listeners = [];

    assert('listeners have already been set up', isBlank(this._listeners));

    CORDOVA_EVENTS.forEach((name) => {
      const listener = {
        name,
        method: (e) => { this.trigger(name, e); }
      };

      listeners.push(listener);
      document.addEventListener(listener.name, listener.method, true);
    });

    this._listeners = listeners;
  },

  _rejectPendingReadyPromise() {
    if (isPresent(this._ready)) {
      this._ready.reject();
      this._ready = null;
    }
  },

  _teardownListeners() {
    this._listeners.forEach((listener) => {
      let { name, method } = listener;
      document.removeEventListener(name, method, true);
    });
  }
});
