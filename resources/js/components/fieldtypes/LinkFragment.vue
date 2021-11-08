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

        <div class="mt-1 space-x-1 flex items-center">
        
            <div class="w-40 mr-1 flex-shrink-0 text-right">
                <!-- <loading-graphic v-if="loading" :text="false" class="mt-1" /> -->
            </div>

            <div
                v-if="queryEnabled()"
                class="sfl-input flex-1 flex items-center">

                <div class="sfl-prefix text-grey-60">?</div>

                <!-- Query field -->
                <select-fieldtype
                    v-if="!queryTemplate"
                    ref="query"
                    handle="query"
                    class="flex-1"
                    :value="queryValue"
                    :config="queryConfig"
                    @focus="inputFocus"
                    @input="queryChanged"
                />
                <text-input
                    v-if="queryTemplate"
                    ref="query_template"
                    handle="query_template"
                    class="flex-1"
                    v-model="queryTemplate"
                    append="⏎"
                    @keydown.enter="queryTemplateCommit"
                    @blur="queryTemplateCommit"
                />

            </div>

            <div
                v-if="fragmentEnabled()"
                class="sfl-input flex-1 flex items-center">

                <div class="sfl-prefix text-grey-60">#</div>

                <!-- Fragment field -->
                <select-fieldtype
                    v-if="!fragmentTemplate"
                    ref="fragment"
                    handle="fragment"
                    class="flex-1"
                    :value="fragmentValue"
                    :config="fragmentConfig"
                    @focus="inputFocus"
                    @input="fragmentChanged"
                />
                <text-input
                    v-if="fragmentTemplate"
                    ref="fragment_template"
                    handle="fragment_template"
                    class="flex-1"
                    v-model="fragmentTemplate"
                    append="⏎"
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
            linkSpec: this.meta.linkSpec,
            linkValue: this.meta.initialLink,
            queryValue: this.meta.initialQuery,
            fragmentValue: this.meta.initialFragment,
            queryTemplate: null,
            fragmentTemplate: null,
            loading: false,
        }

    },

    computed: {

        returnValue() {
            if (!this.linkValue) {
                return null;
            }
            if (this.queryValue) {
                value.search = `?${this.queryValue}`;
            }
            if (this.fragmentValue) {
                value.hash = `#${this.fragmentValue}`;
            }
            console.log(value);
            return value.toString();
        },

        queryConfig() {       
            return {
                taggable: true,
                placeholder: this.loading ? '◉ loading…' : 'query',
                options: this.queryEnabled() ? this.formatOptions(this.linkSpec.queries) : {},
            };
        },

        fragmentConfig() {            
            return {
                taggable: true,
                placeholder: this.loading ? '◉ loading…' : 'fragment',
                options: this.fragmentEnabled() ? this.formatOptions(this.linkSpec.fragments) : {},
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
            this.linkChangedDebounced();
        },
    
        linkChangedDebounced: _.debounce(function () {
            if (this.linkValue) {
                const url = new URL(this.linkValue);
                if (url.search.length) {
                    this.queryValue = url.search.substr(1);
                }
                if (url.hash.length) {
                    this.fragmentValue = url.hash.substr(1);
                }
            }
            this.$nextTick(() => {
                return this.fetchLinkSpec();
            });
        }, 300),

        queryChanged(query) {
            const prepared = this.prepareTemplate('query', query);
            if (prepared) {
                const [ preparedValue, onNextTick ] = prepared;
                this.queryTemplate = preparedValue;
                this.$nextTick(onNextTick);
            } else {
                this.queryValue = query;
                this.update(this.returnValue);
            }
        },

        fragmentChanged(fragment) {
            const prepared = this.prepareTemplate('fragment', fragment);
            if (prepared) {
                const [ preparedValue, onNextTick ] = prepared;
                this.fragmentTemplate = preparedValue;
                this.$nextTick(onNextTick);
            } else {
                this.fragmentValue = fragment;
                this.update(this.returnValue);
            }
        },

        isTemplate(template) {
            const placeholder = '?';
            return (template ? template.indexOf(placeholder) : -1) !== -1;
        },

        prepareTemplate(type, template) {
            const placeholder = '?';
            const index = template ? template.indexOf(placeholder) : -1;
            if (index === -1) {
                return;
            }
            const value = template.substr(0, index) + template.substr(index + placeholder.length);
            return [ value, () => {
                const el = this.$refs[`${type}_template`].$refs.input;
                el.focus();
                el.setSelectionRange(index, index);
            } ];
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

        inputFocus() {
            if (this.linkSpecPending()) {
                this.fetchLinkSpec(true);
            }
        },

        fetchLinkSpec(discover = false) {            
            const { specCache, discoverCache } = window.StatamicLinkFragmentFieldtype;
            const cache = discover ? discoverCache : specCache;
            const value = this.linkValue;
            if (value === null) {
                return;
            }
            if (cache[value]) {
                this.linkSpec = cache[value];
                return;
            }
            this.loading = true;
            this.$axios.get(cp_url('fieldtypes/focal_link/spec'), {
                params: { value, discover },
            }).then(response => {
                this.linkSpec = response.data;
                cache[value] = this.linkSpec;
            }).catch(e => {
                this.linkSpec = null;
            }).finally(e => {
                this.loading = false;
            })
        },

        queryEnabled() {
            return this.linkSpec && this.linkSpec.queries !== false;
        },

        fragmentEnabled() {
            return this.linkSpec && this.linkSpec.fragments !== false;
        },

        linkSpecPending() {
            return !this.linkSpec || (this.linkSpec.discover !== false && this.linkSpec.discovered === false);
        },

        formatOptions(options) {
            return Object.fromEntries(Object.entries(options)
                .map(([ value, label ]) => {
                    label = label !== value ? `${value} — ${label}` : label;
                    if (this.isTemplate(value)) {
                        label = `${label}…`;
                    }
                    label = label.length > 80
                        ? `${label.substr(0, 80)}…`
                        : label;
                    return [ value, label ];
                }));
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