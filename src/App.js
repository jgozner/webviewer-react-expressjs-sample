import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';
import axios from 'axios';

const App = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(null);
  const [documentLoaded, setdocumentLoaded] = useState(false);


  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/WebviewerDemoDoc.pdf',
        fullAPI: true
      },
      viewer.current,
    ).then((instance) => {
      setInstance(instance);

      const { documentViewer } = instance.Core;
      documentViewer.addEventListener('documentLoaded', async () => {
        setdocumentLoaded(true);
      });
    });
  }, []);


  const importXFDF = async () => {
    const { documentViewer, annotationManager } = instance.Core;

    const doc = await documentViewer.getDocument();
    const fileName = await doc.getFilename();

    const response = await axios.get(`http://localhost:3005/xfdf?documentId=${fileName}`)

    await annotationManager.importAnnotations(response.data);
  }

  const exportXFDF = async () => {
    const { documentViewer, annotationManager } = instance.Core;

    const doc = await documentViewer.getDocument();
    const fileName = await doc.getFilename();

    annotationManager.exportAnnotations({ links: false, widgets: false })
    .then(async (xfdfString) => {
      await axios.post('http://localhost:3005/xfdf',{
        documentId: fileName,
        xfdf: xfdfString
      })
    });
  }

  const openFirstBookmark = async () => {
    const { documentViewer} = instance.Core;

    const doc = await documentViewer.getDocument();
    const bookmarks = await doc.getBookmarks();
    if(bookmarks.length >= 1){
      documentViewer.displayBookmark(bookmarks[0])
    }
  }

  return (
    <div className="App">
      <div className="header" style={{backgroundColor: "#00a5e4"}}>
        React sample
        {documentLoaded &&  (
          <>
            <button onClick={importXFDF} style={{marginLeft: "15px"}}>Import XFDF</button>
            <button onClick={exportXFDF} style={{marginLeft: "15px"}}>Export XFDF</button>
            <button onClick={openFirstBookmark} style={{marginLeft: "15px"}}>Open Bookmark</button>
          </>
        )}
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
