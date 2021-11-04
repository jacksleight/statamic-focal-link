import LinkFragment from './components/Fieldtypes/LinkFragment.vue';

window.StatamicLinkFragmentFieldtype = {
    cache: {},
};

Statamic.booting(() => {

    Statamic.$components.register('link_fragment-fieldtype', LinkFragment);

});
