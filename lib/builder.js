const valueBuilderFor = spec => {
  const kind = 'value';
  const type = spec;
  const is = {
    incomplete: true,
    complete: false,
    pristine: true,
  };
  const state = undefined;

  const set = (key, value) => ({
    kind, type,
    is: { pristine: false, incomplete: false, complete: true },
    state: value,
  });

  return { kind, type, is, state, set };
};

const checkCompleteness = state => {
  for (const key of Object.keys(state)) {
    if (state[key].builder.is.incomplete) {
      return false;
    }
  }
  return true;
};

const builderFor = spec => {
  if (typeof spec === 'string') {
    return valueBuilderFor(spec);
  }

  const kind = 'object';
  const is = {
    incomplete: true,
    complete: false,
    pristine: true,
  };

  const set = state => (key, value) => {
    if (key in state) {
      const newState = Object.assign({}, state, {
        [key]: {
          builder: state[key].builder.set(key, value),
        },
      });
      const complete = checkCompleteness(newState);
      const newIs = {
        incomplete: !complete,
        complete,
        pristine: false,
      };
      return { kind, is: newIs, state: newState, set: set(newState) };
    }
    throw new Error(`Key ${key} wasn't found in builder.`);
  };

  const state = {};
  for (const key of Object.keys(spec.deps)) {
    state[key] = {
      builder: builderFor(spec.deps[key]),
    };
  }

  return { kind, is, state, set: set(state) };
};

module.exports = {
  builderFor,
};
