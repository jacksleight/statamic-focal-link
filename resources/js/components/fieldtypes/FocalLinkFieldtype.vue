<template>
    <div class="flex flex-col">

        <div class="space-x-1 flex items-center">

            <!-- Link field -->
            <link-fieldtype
                ref="link"
                handle="link"
                value="linkValue"
                class="flex-1"
                :config="meta.link.config"
                :meta="meta.link.meta"
                @input="linkChanged"
                @meta-updated="meta.link.meta = $event"
            />
            <!-- <div
                v-if="toggleVisible"
                class="w-8 ml-1 border border-grey-50 p-1 rounded sfl-height text-center"
                @click="toggle">
                #
            </div> -->

        </div>

        <div class="mt-1 space-x-1 flex items-center" v-if="fieldsVisible">
        
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

            <div
                v-if="!eitherEnabled"
                class="flex-1 p-1 rounded border border-grey-40 flex justify-center items-center sfl-height">

                <span class="text-sm text-grey-60" v-if="!loading">No additional options.</span>
                <loading-graphic v-if="loading" :inline="true" text="Loading…" />

            </div>

        </div>

    </div>
</template>

<script>

const templatePattern = /\{\{\s*([a-z0-9]*)\s*\}\}/i;

export default {

    mixins: [Fieldtype],

    data() {

        return {
            spec: this.meta.spec,
            linkValue: this.meta.initialLink,
            queryValue: this.meta.initialQuery,
            fragmentValue: this.meta.initialFragment,
            queryTemplate: null,
            fragmentTemplate: null,
            loading: false,
            // open: this.meta.initialOpen,
        }

    },

    computed: {

        returnValue() {
            if (!this.linkValue) {
                return null;
            }
            const value = new URL(this.linkValue);
            if (this.queryValue) {
                value.search = `?${this.queryValue}`;
            } else {
                value.search = '';
            }
            if (this.fragmentValue) {
                value.hash = `#${this.fragmentValue}`;
            } else {
                value.hash = '';
            }
            return value.toString();
        },

        queryOptions() {       
            const options = this.prepareOptions(this.spec.queries || {});
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
            const options = this.prepareOptions(this.spec.fragments || {});
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
            return this.spec && this.spec.queries;
        },

        fragmentEnabled() {
            return this.spec && (this.spec.fragments || this.spec.discovery);
        },

        bothEnabled() {
            return this.queryEnabled && this.fragmentEnabled;
        },

        eitherEnabled() {
            return this.queryEnabled || this.fragmentEnabled;
        },

        discoveryPending() {
            return !this.spec || (this.spec.discovery && !this.spec.discovered);
        },

        toggleVisible() {
            return false;
            // return this.linkValue;
        },

        fieldsVisible() {
            return this.linkValue;
            // return this.linkValue && this.open;
        },

    },

    methods: {

        linkChanged(link) {
            this.linkValue = link;
            this.queryValue = null;
            this.fragmentValue = null;
            this.queryTemplate = null;
            this.fragmentTemplate = null;
            this.spec = null;
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
                return this.fetchSpec();
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
            const parsed =
                value.substr(0, match.index) +
                match[1] +
                value.substr(match.index + match[0].length);
            return [ parsed, () => {
                const el = this.$refs[`${type}_template`].$refs.input;
                el.focus();
                el.setSelectionRange(match.index, match.index + match[1].length);
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
            if (this.discoveryPending) {
                this.fetchSpec(true);
            }
        },

        fetchSpec(discover = false) {            
            const { specCache, discoverCache } = window.StatamicFocalLink;
            const cache = discover ? discoverCache : specCache;
            const value = this.linkValue;
            if (value === null) {
                return;
            }
            if (cache[value]) {
                this.spec = cache[value];
                return;
            }
            this.loading = true;
            this.$axios.get(cp_url('focal-link/spec'), {
                params: { value, discover },
            }).then(response => {
                this.spec = response.data;
                cache[value] = this.spec;
            }).catch(e => {
            }).finally(e => {
                this.loading = false;
            })
        },

        prepareOptions(options) {
            return Object.entries(options)
                .map(([ value, label ]) => {
                    if (this.isTemplate(value)) {
                        label = `${label}…`;
                    }
                    return {
                        value: value,
                        label: value,
                        title: label,
                        loading: false,
                     };
                });
        },

        // toggle() {
        //     this.open = !this.open;
        // },

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
.sfl-height {
    height: 38px;
}
</style>