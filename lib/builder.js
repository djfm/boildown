const valueBuilderFor = spec => {
  const kind = 'value';
  const type = spec;
  const is = {
    incomplete: true,
    pristine: true,
  };
  const state = undefined;

  const set = (key, value) => ({
    kind, type,
    is: { pristine: false, incomplete: false },
    state: value,
  });

  return { kind, type, is, state, set };
};

const builderFor = spec => {
  if (typeof spec === 'string') {
    return valueBuilderFor(spec);
  }

  const state = {};
  for (const key of Object.keys(spec.deps)) {
    state[key] = {
      builder: builderFor(spec.deps[key]),
    };
  }

  const kind = 'object';
  const is = {
    incomplete: true,
    pristine: true,
  };

  const set = (key, value) => {
    if (key in state) {
      const newState = Object.assign({}, state, {
        [key]: {
          builder: state[key].builder.set(key, value),
        },
      });
      const newIs = {
        incomplete: true,
        pristine: false,
      };
      return { kind, is: newIs, state: newState, set };
    }
    throw new Error(`Key ${key} wasn't found in builder.`);
  };

  return { kind, is, state, set };
};

module.exports = {
  builderFor,
};
