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
                    placeholder="#fragment"
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
                this.linkValue.substr(0, 7) === 'entry::' ||
                this.linkValue.substr(0, 7) === 'http://' ||
                this.linkValue.substr(0, 8) === 'https://'
            );
        },

        fragmentConfig() {            
            return {
                ...this.meta.fragment.config,
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
            this.$axios.get(cp_url('fieldtypes/link_fragment/fragments'), {
                params: { link: this.linkValue },
            }).then(response => {
                this.fragmentOptions = response.data;
            }).catch(e => {
                
            })
        },

    }

}
</script>