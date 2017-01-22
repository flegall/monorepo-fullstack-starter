/**
 * @providesModule server.start
 * @flow
 */
import _ from 'lodash';

export function startServer() {
    return `starting server ${_.VERSION}`;
}
