import {defineConfig, type PluginOptions} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schemaTypes'
import {formConfig} from './form';
import {structureTool} from 'sanity/structure'


export default defineConfig({
  name: 'default',
  title: 'Nanyuan',

  projectId: 'utvt9caf',
  dataset: 'test',

    plugins: [structureTool(), visionTool()],

    schema: {
      types: schemaTypes,
    },

  form: formConfig,

  studio: {
    components: {
    },
  },
});
