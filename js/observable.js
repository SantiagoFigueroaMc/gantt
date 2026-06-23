const ARRAY_MUTATIONS = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse", "fill"];

export class Observable {
  #value;
  #listeners = [];

  constructor(initialValue) {
    this.#value = initialValue;
    if (Array.isArray(initialValue)) {
      this.#wrapArrayMethods();
    }
  }

  get value() {
    return this.#value;
  }

  set value(newVal) {
    const oldVal = this.#value;
    this.#value = newVal;
    if (Array.isArray(newVal)) {
      this.#wrapArrayMethods();
    }
    this.#notify(newVal, oldVal);
  }

  addListener(fn) {
    this.#listeners.push(fn);
  }

  #notify(newVal, oldVal) {
    for (const fn of this.#listeners) {
      fn(newVal, oldVal);
    }
  }

  // Delega métodos de array y notifica tras cada mutación
  #wrapArrayMethods() {
    for (const method of ARRAY_MUTATIONS) {
      this[method] = (...args) => {
        const oldVal = [...this.#value];
        const result = this.#value[method](...args);
        this.#notify(this.#value, oldVal);
        return result;
      };
    }
  }
}