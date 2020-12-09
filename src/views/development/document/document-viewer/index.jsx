import { useMemo } from 'react';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import PropTypes from 'prop-types';
import { ViewerContainer } from './elements';

const DocumentViewer = ({ uri }) => {
  // For some reason, viewer stucks on blanks screen on rerender
  // This fixes it until uri changes, which is okay since it changes the document correctly.
  // @ernestognw Note: Nomames que chingon esta este hack xD
  return useMemo(
    () => (
      <ViewerContainer>
        <DocViewer
          pluginRenderers={DocViewerRenderers}
          style={{ minHeight: 600 }}
          config={{
            header: {
              disableHeader: true,
            },
          }}
          documents={[
            {
              uri,
            },
          ]}
        />
      </ViewerContainer>
    ),
    [uri]
  );
};

DocumentViewer.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default DocumentViewer;
