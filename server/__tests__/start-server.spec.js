// @flow
import {expect} from 'chai';

import {startServer} from 'server.start';

describe('startServer', () => {
    it('should display version', () => {
        expect(startServer()).to.equal('starting server 4.17.4');
    });
});
