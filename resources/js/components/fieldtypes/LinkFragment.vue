<template>
    <div class="flex flex-col">

        <!-- Link field -->
        <link-fieldtype
            ref="link"
            handle="link"
            :value="linkValue"
            :config="meta.link.config"
            :meta="meta.link.meta"
            @input="linkChanged"
            @meta-updated="meta.link.meta = $event"
        />

        <div v-if="showFragmentField" class="mt-1 flex items-center">
        
            <div class="w-40 mr-2">&nbsp;</div>

            <div class="flex-1">

                <!-- Fragment field -->
                <select-fieldtype
                    ref="fragment"
                    handle="fragment"
                    :value="fragmentValue"
                    :config="fragmentConfig"
                    :meta="meta.fragment.meta"
                    @focus="fragmentFocus"
                    @input="fragmentChanged"
                    @meta-updated="meta.fragment.meta = $event"
                />

            </div>

        </div>

    </div>
</template>

<script>
export default {

    mixins: [Fieldtype],

    data() {

        return {
            linkValue: this.meta.initialLink,
            fragmentValue: this.meta.initialFragment,
            fragmentOptions: {},
            loading: false,
        }

    },

    computed: {

        returnValue() {
            return {
                link: this.linkValue,
                fragment: this.fragmentValue,
            };
        },

        showFragmentField() {
            return this.linkValue && (
                (this.linkValue.substr(0, 7) === 'entry::') ||
                (this.linkValue.substr(0, 7) === 'http://' && this.meta.scanUrl) ||
                (this.linkValue.substr(0, 8) === 'https://' && this.meta.scanUrl)
            );
        },

        fragmentConfig() {            
            return {
                ...this.meta.fragment.config,
                placeholder: this.loading ? 'Looking for fragments…' : '#fragment',
                options: this.fragmentOptions,
            };
        }

    },

    methods: {

        linkChanged(link) {
            this.linkValue = link;
            this.fragmentValue = null;
            this.fragmentOptions = {};
            this.update(this.returnValue);
        },

        fragmentChanged(fragment) {
            this.fragmentValue = fragment;
            this.update(this.returnValue);
        },

        fragmentFocus() {
            this.fetchFragments();
        },

        fetchFragments() {
            const { cache } = window.StatamicLinkFragmentFieldtype;
            const link = this.linkValue;
            if (cache[link]) {
                this.fragmentOptions = cache[link];
                return;
            }
            this.loading = true;
            this.$axios.get(cp_url('fieldtypes/link_fragment/fragments'), {
                params: { link },
            }).then(response => {
                this.fragmentOptions = response.data;
                cache[link] = response.data;
            }).catch(e => {
                this.fragmentOptions = {};
            }).finally(e => {
                this.loading = false;
            })
        },

    }

}
</script>