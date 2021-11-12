import FocalLinkFieldtype from './components/Fieldtypes/FocalLinkFieldtype.vue';

window.StatamicFocalLink = {
    specCache: {},
    discoverCache: {},
};

Statamic.booting(() => {

    Statamic.$components.register('focal_link-fieldtype', FocalLinkFieldtype);

});
