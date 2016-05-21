const { builderFor } = require('../lib/builder');

describe('A simple builder', () => {
  const user = {
    deps: {
      email: 'string',
      password: 'string',
    },
  };

  const builder = builderFor(user);

  it('should be incomplete if no dependencies are met', () =>
    builder.is.incomplete.should.be.true
  );

  it('should be pristine if it was not changed', () =>
    builder.is.pristine.should.be.true
  );

  it('should be pristine if it was not changed', () =>
    builder.set('email', 'bob@example.com')
      .is
      .pristine
      .should.be.false
  );

  it('should be complete when all deps are met', () =>
    builder
      .set('email', 'bob@example.com')
      .set('password', 123456789)
      .is
      .incomplete
      .should.be.false
  );
});
