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

            <div class="sfl-input flex-1 mr-1 flex items-center">

                <div class="sfl-prefix text-grey-60">?</div>

                <!-- Query field -->
                <select-fieldtype
                    v-if="!queryTemplate"
                    ref="query"
                    handle="query"
                    class="flex-1"
                    :value="queryValue"
                    :config="queryConfig"
                    :meta="meta.query.meta"
                    @focus="queryFocus"
                    @input="queryChanged"
                    @meta-updated="meta.query.meta = $event"
                />
                <text-input
                    v-if="queryTemplate"
                    ref="query_template"
                    handle="query_template"
                    class="flex-1"
                    v-model="queryTemplate"
                    @keydown.enter="queryTemplateCommit"
                    @blur="queryTemplateCommit"
                />

            </div>

            <div class="sfl-input flex-1 flex items-center">

                <div class="sfl-prefix text-grey-60">#</div>

                <!-- Fragment field -->
                <select-fieldtype
                    v-if="!fragmentTemplate"
                    ref="fragment"
                    handle="fragment"
                    class="flex-1"
                    :value="fragmentValue"
                    :config="fragmentConfig"
                    :meta="meta.fragment.meta"
                    @focus="fragmentFocus"
                    @input="fragmentChanged"
                    @meta-updated="meta.fragment.meta = $event"
                />
                <text-input
                    v-if="fragmentTemplate"
                    ref="fragment_template"
                    handle="fragment_template"
                    class="flex-1"
                    v-model="fragmentTemplate"
                    @keydown.enter="fragmentTemplateCommit"
                    @blur="fragmentTemplateCommit"
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
            queryValue: this.meta.initialQuery,
            fragmentValue: this.meta.initialFragment,
            queryTemplate: null,
            fragmentTemplate: null,
            linkSpec: null,
            loading: false,
        }

    },

    computed: {

        returnValue() {
            let value = this.linkValue;
            if (this.queryValue !== null) {
                value += `?${this.queryValue}`;
            }
            if (this.fragmentValue !== null) {
                value += `#${this.fragmentValue}`;
            }
            return value;
        },

        showQueryField() {
            return true;
            return this.linkValue && (
                (this.linkValue.substr(0, 7) === 'entry::') ||
                (this.linkValue.substr(0, 7) === 'http://' && this.meta.scanUrls) ||
                (this.linkValue.substr(0, 8) === 'https://' && this.meta.scanUrls)
            );
        },

        showFragmentField() {
            return true;
            return this.linkValue && (
                (this.linkValue.substr(0, 7) === 'entry::') ||
                (this.linkValue.substr(0, 7) === 'http://' && this.meta.scanUrls) ||
                (this.linkValue.substr(0, 8) === 'https://' && this.meta.scanUrls)
            );
        },

        queryConfig() {       
            return {
                ...this.meta.fragment.config,
                placeholder: this.loading ? 'Loading' : 'query',
                options: this.linkSpec ? {
                    ...this.linkSpec.queries.templates,
                    ...this.linkSpec.queries.options,
                } : {},
            };
        },

        fragmentConfig() {            
            return {
                ...this.meta.fragment.config,
                placeholder: this.loading ? 'Loading' : 'fragment',
                options: this.linkSpec ? {
                    ...this.linkSpec.fragments.templates,
                    ...this.linkSpec.fragments.options,
                } : {},
            };
        }

    },

    methods: {

        linkChanged(link) {
            this.linkValue = link;
            this.queryValue = null;
            this.fragmentValue = null;
            this.queryTemplate = null;
            this.fragmentTemplate = null;
            this.linkSpec = null;
            this.update(this.returnValue);
            this.fetchSpec();
        },

        queryChanged(query) {
            if (this.linkSpec && this.linkSpec.queries.templates[query]) {
                this.queryTemplate = query;
                this.$nextTick(() => {
                    this.$refs.query_template.$refs.input.focus();
                });
            } else {
                this.queryValue = query;
                this.update(this.returnValue);
            }
        },

        fragmentChanged(fragment) {
            if (this.linkSpec && this.linkSpec.fragments.templates[fragment]) {
                this.fragmentTemplate = fragment;
                this.$nextTick(() => {
                    this.$refs.fragment_template.$refs.input.focus();
                });
            } else {
                this.fragmentValue = fragment;
                this.update(this.returnValue);
            }
        },

        queryTemplateCommit() {
            if (!this.queryTemplate) {
                return;
            }
            this.queryValue = this.queryTemplate;
            this.queryTemplate = null;
            this.update(this.returnValue);
        },

        fragmentTemplateCommit() {
            if (!this.fragmentTemplate) {
                return;
            }
            this.fragmentValue = this.fragmentTemplate;
            this.fragmentTemplate = null;
            this.update(this.returnValue);
        },

        queryFocus() {
            if (!this.linkSpec) {
                this.fetchSpec();
            }
        },

        fragmentFocus() {
            if (!this.linkSpec) {
                this.fetchSpec();
            }
        },

        fetchSpec() {
            const { cache } = window.StatamicLinkFragmentFieldtype;
            const link = this.linkValue;
            if (link === null) {
                return;
            }
            if (cache[link]) {
                this.linkSpec = cache[link];
                return;
            }
            this.loading = true;
            this.$axios.get(cp_url('fieldtypes/link_fragment/spec'), {
                params: { link },
            }).then(response => {
                this.linkSpec = response.data;
                cache[link] = this.linkSpec;
            }).catch(e => {
                this.linkSpec = null;
            }).finally(e => {
                this.loading = false;
            })
        },

    }

}
</script>

<style>
.sfl-input {
    position: relative;
}
.sfl-input .sfl-prefix {
    position: absolute;
    top: 0;
    left: 0;
    padding: 8px 0 8px 8px;
    border: 1px solid transparent;
}
.sfl-input .vs__selected-options,
.sfl-input .input-text {
    padding-left: 20px !important;
}
</style>