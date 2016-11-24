import Ember from 'ember';

const {
  assert,
  isBlank,
  isPresent,
  on
} = Ember;

export default function subscribe(path, method) {
  let _listener = null;
  let [service, event, err] = path.split('.');
  let isValidPath = isPresent(service) && isPresent(event) && isBlank(err);

  assert(
    `'subscribe()' expects a path with exactly one leaf, was given ${path}`,
    isValidPath
  );

  let computedFn = function() {
    if (isBlank(this.get(service)) || isPresent(_listener)) {
      return;
    }

    // ensure teardown
    let _super = this.get('willDestroy');
    this.set('willDestroy', function() {
      this.get(service).off(event, _listener);
      _listener = null;
      computedFn = null;
      _super.call(this);
    });

    // proxy the event
    _listener = (e) => {
      method.call(this, e);
    };

    // subscribe to the event
    this.get(service).on(event, _listener);
  };

  return on.call(this, 'init', computedFn);
}
