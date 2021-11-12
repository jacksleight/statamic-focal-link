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
        
            <div class="w-40 mr-1 flex-shrink-0 text-right"></div>

            <div
                v-if="queryEnabled"
                class="sfl-input flex-1 flex items-center">

                <div class="sfl-prefix text-grey-60">?</div>

                <!-- Query field -->

                <v-select
                    v-if="!queryTemplate"
                    ref="query"
                    class="flex-1"
                    placeholder="query"
                    :value="queryValue"
                    :reduce="option => option.value"
                    :create-option="value => ({ value, label: value, title: null })"
                    :clearable="true"
                    :options="queryOptions"
                    :searchable="true"
                    :taggable="true"
                    :close-on-select="true"
                    @input="queryChanged"
                    @open="selectOpen">
                    <template #option="option">
                        <div :class="!bothEnabled ? 'flex flex-wrap justify-between' : 'flex flex-col'" v-if="!option.loading">
                            <span>{{ option.label }}</span>
                            <strong>{{ option.title }}</strong>
                        </div>
                        <div v-if="option.loading">
                            <loading-graphic v-if="loading" :inline="true" text="Searching…" />
                        </div>
                    </template>
                    <template #no-options>
                        <div class="text-sm text-grey-70 text-left py-1 px-2" v-text="__('No options to choose from.')" />
                    </template>
                </v-select>
                <text-input
                    v-if="queryTemplate"
                    ref="query_template"
                    class="flex-1"
                    v-model="queryTemplate"
                    append="⏎"
                    @keydown.enter="queryTemplateCommit"
                    @blur="queryTemplateCommit"
                />

            </div>

            <div
                v-if="fragmentEnabled"
                class="sfl-input flex-1 flex items-center">

                <div class="sfl-prefix text-grey-60">#</div>

                <!-- Fragment field -->
                <v-select
                    v-if="!fragmentTemplate"
                    ref="fragment"
                    class="flex-1"
                    placeholder="fragment"
                    :value="fragmentValue"
                    :reduce="option => option.value"
                    :create-option="value => ({ value, label: value, title: null })"
                    :clearable="true"
                    :options="fragmentOptions"
                    :searchable="true"
                    :taggable="true"
                    :close-on-select="true"
                    @input="fragmentChanged"
                    @open="selectOpen">
                    <template #option="option">
                        <div :class="!bothEnabled ? 'flex flex-wrap justify-between' : 'flex flex-col'" v-if="!option.loading">
                            <span>{{ option.label }}</span>
                            <strong>{{ option.title }}</strong>
                        </div>
                        <div v-if="option.loading">
                            <loading-graphic v-if="loading" :inline="true" text="Searching…" />
                        </div>
                    </template>
                    <template #no-options>
                        <div class="text-sm text-grey-70 text-left py-1 px-2" v-text="__('No options to choose from.')" />
                    </template>
                </v-select>
                <text-input
                    v-if="fragmentTemplate"
                    ref="fragment_template"
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

const templatePattern = /\{\{[a-z0-9 ]*\}\}/i;

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

    watch: {

        queryValue() {
            this.update(this.returnValue);
        },
        
        fragmentValue() {
            this.update(this.returnValue);
        },

    },

    computed: {

        returnValue() {
            if (!this.linkValue) {
                return null;
            }
            const value = new URL(this.linkValue);
            if (this.queryValue) {
                value.search = `?${this.queryValue}`;
            }
            if (this.fragmentValue) {
                value.hash = `#${this.fragmentValue}`;
            }
            return value.toString();
        },

        queryOptions() {       
            if (!this.queryEnabled) {
                return {};
            }
            const options = this.prepareOptions(this.linkSpec.queries);
            if (this.loading) {
                options.push({
                    value: '__loading__',
                    label: null,
                    title: null,
                    template: true,
                    loading: true,
                });
            }
            return options;
        },

        fragmentOptions() {            
            if (!this.fragmentEnabled) {
                return {};
            }
            const options = this.prepareOptions(this.linkSpec.fragments);
            if (this.loading) {
                options.push({
                    value: '__loading__',
                    label: null,
                    title: null,
                    template: true,
                    loading: true,
                });
            }
            return options;
        },

        queryEnabled() {
            return this.linkSpec && typeof this.linkSpec.queries === 'object';
        },

        fragmentEnabled() {
            return this.linkSpec && typeof this.linkSpec.fragments === 'object';
        },

        bothEnabled() {
            return this.queryEnabled && this.fragmentEnabled;
        },

        linkSpecPending() {
            return !this.linkSpec || (typeof this.linkSpec.discovery === 'object' && !this.linkSpec.discovered);
        },

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
            if (query === '__loading__') {
                return;
            }
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
            if (fragment === '__loading__') {
                return;
            }
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

        isTemplate(value) {
            return templatePattern.exec(value) !== null
        },

        prepareTemplate(type, value) {
            const match = templatePattern.exec(value);
            if (match === null) {
                return;
            }
            return [ value, () => {
                const el = this.$refs[`${type}_template`].$refs.input;
                el.focus();
                el.setSelectionRange(match.index, match.index + match[0].length);
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

        selectOpen() {
            if (this.linkSpecPending) {
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

        prepareOptions(options) {
            return Object.entries(options)
                .filter(([ value, label ]) => label)
                .map(([ value, label ]) => {
                    if (this.isTemplate(value)) {
                        label = `${label}…`;
                    }
                    label = label.length > 80
                        ? `${label.substr(0, 80)}…`
                        : label;
                    return { 
                        value: value,
                        label: value,
                        title: label,
                        loading: false,
                     };
                });
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