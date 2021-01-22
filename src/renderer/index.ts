import { ContentBlock } from 'draft-js';

import getImageComponent from '../renderer/Image';

const getBlockRenderFunc = config => (block: ContentBlock) => {
  if (block.getType() === 'atomic') {
    const contentState = config.getEditorState().getCurrentContent();
    const entity = contentState.getEntity(block.getEntityAt(0));
    if (entity && entity.type === 'IMAGE') {
      return {
        component: getImageComponent(config),
        editable: false,
      };
    }
  }
  return undefined;
};

export default getBlockRenderFunc;
