// form.ts
import {mediaAssetSource} from 'sanity-plugin-media';

export const formConfig = {
  file: {
    assetSources: (previousAssetSources: any[]) => previousAssetSources.filter(
      (assetSource) => assetSource !== mediaAssetSource
    ),
  },
  image: {
    assetSources: (previousAssetSources: any[]) => previousAssetSources.filter(
      (assetSource) => assetSource === mediaAssetSource
    ),
  },
};
