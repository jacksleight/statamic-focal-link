import LinkFragment from './components/Fieldtypes/LinkFragment.vue';

window.StatamicLinkFragmentFieldtype = {
    specCache: {},
    discoverCache: {},
};

Statamic.booting(() => {

    Statamic.$components.register('link_fragment-fieldtype', LinkFragment);

});
