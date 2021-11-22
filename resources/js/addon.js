import FocalLinkFieldtype from './components/Fieldtypes/FocalLinkFieldtype.vue';

window.StatamicFocalLink = {
    specCache: {},
    discoverCache: {},
};

Statamic.booting(() => {

    Statamic.$components.register('focal_link-fieldtype', FocalLinkFieldtype);

    Statamic.$hooks.on('entry.saved', (resolve, reject) => {
        window.StatamicFocalLink.discoverCache = {};
        resolve();
    });

});
