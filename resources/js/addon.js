/* @deprecated: Alias the Statamic v4 scales so the same classes can work in v3 as well, drop when v3 is dropped */
import '../css/addon.css';
import '../css/jstw.css';

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
