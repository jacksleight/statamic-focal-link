import LinkFragment from './components/Fieldtypes/LinkFragment.vue';

Statamic.booting(() => {

    Statamic.$components.register('link_fragment-fieldtype', LinkFragment);

});
