// @flow
import {expect} from 'chai';

import {startServer} from '../start-server';

describe('startServer', () => {
    it('should display version', () => {
        expect(startServer()).to.equal('starting server 4.17.4');
    });
});
