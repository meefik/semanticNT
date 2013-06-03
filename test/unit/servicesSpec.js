'use strict';

/* jasmine specs for services go here */

describe('openITMO services', function () {
    beforeEach(module('app.services'));

    it('should have topic service', inject(function (Topic) {
        expect(Topic).not.toEqual(null);
    }));

    it('should have post service', inject(function (Post) {
        expect(Post).not.toEqual(null);
    }));
});
