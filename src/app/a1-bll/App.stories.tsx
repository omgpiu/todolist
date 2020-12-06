import React from 'react';
import App from '../a1-ui/App';
import {DecoraTor, ReduxStoreProviderDecorator} from '../../stories/decorators/ReduxStoreProviderDecorator';

export default {
    title: 'App Stories',
    component: App,
    decorators: [ReduxStoreProviderDecorator, DecoraTor]
};

export const AppBaseExample = (props: any) => {
    return (<App demo={true}/>);
};
