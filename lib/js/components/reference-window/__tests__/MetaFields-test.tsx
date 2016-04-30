jest.unmock('../MetaFields');

import * as React from 'react';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { MetaFields } from '../MetaFields';

const testMeta: CSL.Data = {
    title: 'TEST',
}

const setup = (
    citationType: CSL.CitationType = 'article-journal',
    meta = testMeta
) => {
    const spy = sinon.spy();
    const component = mount(
        <MetaFields citationType={citationType} meta={meta} eventHandler={spy} />
    );
    return {
        component,
        eventHandler: spy,
        title: component.find('strong').text(),
        field: component.find('#title'),
    }
}


describe('<MetaFields />', () => {
    it('should render with the correct title', () => {
        const title1 = setup().title;
        expect(title1).toBe('Journal Article Information');

        const title2 = setup('article-magazine').title;
        expect(title2).toBe('Magazine Article Information');
    });

    it('should dispatch META_FIELD_CHANGE event when fields are changed', () => {
        const { field, component, eventHandler } = setup();
        field.simulate('change');
        expect(eventHandler.callCount).toBe(1);
        expect(eventHandler.firstCall.args[0].type).toBe('META_FIELD_CHANGE');
        expect(eventHandler.firstCall.args[0].detail).toEqual({ field: 'title', value: 'TEST'});
    });
})